const mongoose = require('mongoose');
const dns = require('dns');

// 1. Configure reliable public DNS servers for dns.resolve*
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if custom servers cannot be set
}

// 2. Patch dns.lookup globally so Node/Mongoose/Nodemailer never fail with
//    getaddrinfo ENOTFOUND when the local router IPv6 DNS (fe80::1) times out.
const STATIC_HOSTS = {
  'ac-0d9vmqe-shard-00-00.gei3saw.mongodb.net': '159.41.170.80',
  'ac-0d9vmqe-shard-00-01.gei3saw.mongodb.net': '159.41.170.90',
  'ac-0d9vmqe-shard-00-02.gei3saw.mongodb.net': '159.41.170.100',
};

const dnsCache = new Map(Object.entries(STATIC_HOSTS));
const origLookup = dns.lookup.bind(dns);

dns.lookup = function customDnsLookup(hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  } else if (typeof options === 'number') {
    options = { family: options };
  } else {
    options = options || {};
  }

  const respondWithIp = (ip) => {
    if (options.all) {
      return process.nextTick(() => callback(null, [{ address: ip, family: 4 }]));
    }
    return process.nextTick(() => callback(null, ip, 4));
  };

  if (
    !hostname ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    return origLookup(hostname, options, callback);
  }

  if (dnsCache.has(hostname)) {
    return respondWithIp(dnsCache.get(hostname));
  }

  dns.resolve4(hostname, (err, addresses) => {
    if (!err && Array.isArray(addresses) && addresses.length > 0) {
      const ip = addresses[0];
      dnsCache.set(hostname, ip);
      return respondWithIp(ip);
    }

    origLookup(hostname, options, (lookupErr, address, family) => {
      if (!lookupErr && address) {
        return callback(null, address, family);
      }
      if (STATIC_HOSTS[hostname]) {
        return respondWithIp(STATIC_HOSTS[hostname]);
      }
      return callback(lookupErr || err);
    });
  });
};

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * Automatically retries on transient network hiccups instead of crashing.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}. Retrying in 3s...`);
    setTimeout(connectDB, 3000);
  }
};

module.exports = connectDB;
