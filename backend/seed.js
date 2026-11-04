const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Expo = require('./models/Expo');
const Booth = require('./models/Booth');
const ExhibitorProfile = require('./models/ExhibitorProfile');
const Session = require('./models/Session');
const Registration = require('./models/Registration');
const Message = require('./models/Message');
const Feedback = require('./models/Feedback');
const generateQRCode = require('./utils/generateQR');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/eventsphere';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding.');

    // Clear old collections
    console.log('Cleaning old data...');
    await Promise.all([
      User.deleteMany({}),
      Expo.deleteMany({}),
      Booth.deleteMany({}),
      ExhibitorProfile.deleteMany({}),
      Session.deleteMany({}),
      Registration.deleteMany({}),
      Message.deleteMany({}),
      Feedback.deleteMany({}),
    ]);

    console.log('Creating demo users...');
    // Create Users (raw password, hashed automatically by UserSchema.pre('save'))
    const admin = await User.create({
      name: 'Sarah Jenkins (Admin)',
      email: 'admin@eventsphere.com',
      password: 'Admin123!',
      role: 'admin',
    });

    const exhibitorUser = await User.create({
      name: 'David Vance (Exhibitor)',
      email: 'exhibitor@techcorp.com',
      password: 'Exhibitor123!',
      role: 'exhibitor',
    });

    const attendee = await User.create({
      name: 'Alex Rivera (Attendee)',
      email: 'attendee@eventsphere.com',
      password: 'Attendee123!',
      role: 'attendee',
    });

    console.log('Creating demo expos...');
    // Expo 1: Global Tech & AI Expo
    const expo1 = await Expo.create({
      title: 'Global Tech & AI Summit 2026',
      description:
        'The premier international event bringing together over 10,000 technology innovators, researchers, and venture capitalists to explore the frontiers of artificial intelligence, humanoid robotics, and quantum computing systems.',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // in 10 days
      endDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
      location: 'Silicon Convention Center, Hall 4, San Francisco, CA',
      theme: 'Artificial Intelligence & Robotics',
      status: 'published',
      organizer: admin._id,
      boothRows: 4,
      boothColumns: 6,
      tags: ['AI', 'Robotics', 'Quantum', 'Cloud'],
    });

    // Expo 2: CleanEnergy & Smart Mobility
    const expo2 = await Expo.create({
      title: 'Global CleanEnergy & Smart Mobility Expo 2026',
      description:
        'Showcasing next-generation electric mobility, solid-state battery breakthroughs, hydrogen transit solutions, and smart municipal grid infrastructure.',
      date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
      location: 'Metropolis Expo Pavilion, Austin, TX',
      theme: 'Clean Energy & Autonomous Vehicles',
      status: 'published',
      organizer: admin._id,
      boothRows: 3,
      boothColumns: 6,
      tags: ['EV', 'CleanTech', 'Solar', 'Batteries'],
    });

    console.log('Creating exhibitor profiles...');
    // Exhibitor Profile
    const exhibitorProfile = await ExhibitorProfile.create({
      user: exhibitorUser._id,
      expo: expo1._id,
      company: 'TechCorp Autonomous Systems',
      description:
        'Leading developer of high-precision autonomous LiDAR perception units, robotic vision platforms, and real-time edge AI inference clusters.',
      products: ['LiDAR-X9 Vision Sensor', 'NeuralEdge Compute Node', 'ApexRobotics Arm V2'],
      services: ['Autonomous Navigation Consulting', 'Edge AI Calibration'],
      website: 'https://techcorp-autonomous.example.com',
      contactEmail: 'contact@techcorp.com',
      contactPhone: '+1 (415) 555-0199',
      applicationStatus: 'approved',
    });

    console.log('Generating floor plan booths...');
    // Generate booths for Expo 1 (4 rows x 6 columns)
    const boothsExpo1 = [];
    for (let r = 1; r <= 4; r++) {
      for (let c = 1; c <= 6; c++) {
        const number = `${String.fromCharCode(64 + r)}-${c}`;
        let status = 'available';
        let exhibitor = null;
        let profile = null;
        let price = 500;

        // Make booth A-1 occupied by our exhibitor
        if (r === 1 && c === 1) {
          status = 'occupied';
          exhibitor = exhibitorUser._id;
          profile = exhibitorProfile._id;
          price = 1200;
        } else if (r === 1 && c === 2) {
          status = 'reserved';
          price = 800;
        }

        boothsExpo1.push({
          expo: expo1._id,
          number,
          row: r,
          column: c,
          size: r === 1 ? 'large' : 'medium',
          status,
          exhibitor,
          exhibitorProfile: profile,
          price,
          notes: r === 1 ? 'Premium Hall Frontage' : 'Standard Exhibition Space',
        });
      }
    }
    await Booth.insertMany(boothsExpo1);

    // Generate booths for Expo 2 (3 rows x 6 columns)
    const boothsExpo2 = [];
    for (let r = 1; r <= 3; r++) {
      for (let c = 1; c <= 6; c++) {
        boothsExpo2.push({
          expo: expo2._id,
          number: `${String.fromCharCode(64 + r)}-${c}`,
          row: r,
          column: c,
          size: 'medium',
          status: 'available',
          price: 650,
          notes: 'Standard Island Unit',
        });
      }
    }
    await Booth.insertMany(boothsExpo2);

    console.log('Creating keynote sessions...');
    // Create Sessions for Expo 1
    const session1 = await Session.create({
      expo: expo1._id,
      title: 'Keynote: The Sovereign Frontier of Agentic AI',
      speaker: 'Dr. Evelyn Martinez',
      speakerBio: 'Director of Machine Intelligence, Quantum AI Labs',
      topic: 'Artificial Intelligence',
      description:
        'An in-depth exploration into self-directing multimodal agentic reasoning, safety containment protocols, and distributed cognitive computing architectures.',
      location: 'Grand Auditorium, Stage Alpha',
      startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 9 * 3600 * 1000), // Day 1 9:00 AM
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 10.5 * 3600 * 1000), // Day 1 10:30 AM
      capacity: 350,
      attendees: [{ user: attendee._id, registeredAt: new Date() }],
    });

    const session2 = await Session.create({
      expo: expo1._id,
      title: 'Panel: Scaling Humanoid Robotics in Industrial Logistics',
      speaker: 'Marcus Vance & Panelists',
      speakerBio: 'VP of Robotics, Apex Robotics',
      topic: 'Robotics',
      description:
        'Industry veterans discuss real-world warehousing deployment challenges, battery power density limits, and tactile grip manipulation breakthroughs.',
      location: 'Pavilion Hall B, Stage Beta',
      startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 11 * 3600 * 1000),
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 12.5 * 3600 * 1000),
      capacity: 200,
      attendees: [{ user: attendee._id, registeredAt: new Date() }],
    });

    console.log('Creating attendee registrations...');
    // Create Registration for Attendee
    await Registration.create({
      user: attendee._id,
      expo: expo1._id,
      sessions: [session1._id, session2._id],
      qrCode: generateQRCode(),
      status: 'confirmed',
      paymentStatus: 'free',
    });

    console.log('Creating messages & feedback...');
    // Create sample message exchange
    await Message.create({
      sender: attendee._id,
      receiver: exhibitorUser._id,
      expo: expo1._id,
      content:
        'Hi David, I saw your LiDAR-X9 vision sensor on the expo showcase. Will you have a live demo running at booth A-1?',
      read: true,
      createdAt: new Date(Date.now() - 3600 * 1000),
    });

    await Message.create({
      sender: exhibitorUser._id,
      receiver: attendee._id,
      expo: expo1._id,
      content:
        'Hello Alex! Absolutely, we will have a real-time point-cloud LiDAR test rig running at Booth A-1 throughout the day. Drop by anytime!',
      read: false,
      createdAt: new Date(Date.now() - 1800 * 1000),
    });

    // Create Feedback
    await Feedback.create({
      user: attendee._id,
      expo: expo1._id,
      rating: 5,
      message:
        'Incredible event lineup and smooth registration system! Looking forward to the AI keynotes.',
      category: 'general',
    });

    console.log('\n======================================================');
    console.log('✅ EVENTSPHERE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Default Demo Accounts:');
    console.log('1. Admin/Organizer:');
    console.log('   Email:    admin@eventsphere.com');
    console.log('   Password: Admin123!');
    console.log('\n2. Exhibitor:');
    console.log('   Email:    exhibitor@techcorp.com');
    console.log('   Password: Exhibitor123!');
    console.log('\n3. Attendee:');
    console.log('   Email:    attendee@eventsphere.com');
    console.log('   Password: Attendee123!');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();

