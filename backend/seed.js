const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
    console.log('MongoDB connected for comprehensive seeding.');

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

    console.log('Creating users...');
    // 1. Organizers & Admins
    const admin = await User.create({
      name: 'Sarah Jenkins (Chief Organizer)',
      email: 'admin@eventsphere.com',
      password: 'Admin123!',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    });

    const admin2 = await User.create({
      name: 'Robert Sterling (Expo Operations)',
      email: 'robert@eventsphere.com',
      password: 'Admin123!',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    });

    // 2. Exhibitor Users
    const exhUsers = await Promise.all([
      User.create({
        name: 'David Vance (TechCorp)',
        email: 'exhibitor@techcorp.com',
        password: 'Exhibitor123!',
        role: 'exhibitor',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      }),
      User.create({
        name: 'Dr. Elena Rostova (BioGenix)',
        email: 'elena@biogenix.com',
        password: 'Exhibitor123!',
        role: 'exhibitor',
        avatar: 'https://images.unsplash.com/photo-1594824813576-95b6c23b2c6e?w=150',
      }),
      User.create({
        name: 'Marcus Chen (VoltDynamics)',
        email: 'marcus@voltdynamics.com',
        password: 'Exhibitor123!',
        role: 'exhibitor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      }),
      User.create({
        name: 'Dr. Alistair Finch (QuantumLeap)',
        email: 'finch@quantumleap.com',
        password: 'Exhibitor123!',
        role: 'exhibitor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      }),
      User.create({
        name: 'Camilla Hayes (Apex Robotics)',
        email: 'camilla@apexrobotics.com',
        password: 'Exhibitor123!',
        role: 'exhibitor',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      }),
      User.create({
        name: 'Vikram Patel (CyberShield)',
        email: 'vikram@cybershield.com',
        password: 'Exhibitor123!',
        role: 'exhibitor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      }),
    ]);

    // 3. Attendees
    const attendees = await Promise.all([
      User.create({
        name: 'Alex Rivera (Attendee)',
        email: 'attendee@eventsphere.com',
        password: 'Attendee123!',
        role: 'attendee',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      }),
      User.create({
        name: 'Sophia Martinez (Tech Lead)',
        email: 'sophia@innovatech.io',
        password: 'Attendee123!',
        role: 'attendee',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      }),
      User.create({
        name: 'Ethan Gallagher (Biotech Analyst)',
        email: 'ethan@bioinvest.com',
        password: 'Attendee123!',
        role: 'attendee',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      }),
      User.create({
        name: 'Olivia Zhang (CleanTech Specialist)',
        email: 'olivia@ecoverse.org',
        password: 'Attendee123!',
        role: 'attendee',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      }),
    ]);

    console.log('Creating 6 multi-industry expos...');
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    // Expo 1: Tech & AI Summit
    const expo1 = await Expo.create({
      title: 'Global Tech & AI Summit 2026',
      description:
        'The premier international event convening 15,000+ engineers, enterprise leaders, and venture capitalists to explore agentic AI systems, quantum neural networks, humanoid robotics, and sovereign edge computing infrastructure.',
      date: new Date(now + 10 * day),
      endDate: new Date(now + 13 * day),
      location: 'Silicon Valley Convention Center, Hall 4, San Francisco, CA',
      theme: 'Artificial Intelligence & Robotics',
      status: 'published',
      bannerImage:
        'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      organizer: admin._id,
      boothRows: 4,
      boothColumns: 6,
      tags: ['AI', 'Robotics', 'Quantum', 'Cloud', 'Edge Computing'],
    });

    // Expo 2: BioHealth & Medical Expo
    const expo2 = await Expo.create({
      title: 'BioHealth & Medical Innovation Expo 2026',
      description:
        'Uniting pharmaceutical leaders, medical researchers, and genomic scientists to unveil breakthrough mRNA oncology therapeutics, robotic micro-surgery tools, and AI-accelerated clinical diagnostics.',
      date: new Date(now + 20 * day),
      endDate: new Date(now + 23 * day),
      location: 'Boston World Trade Center, Halls A & B, Boston, MA',
      theme: 'Healthcare & Biotechnology',
      status: 'published',
      bannerImage:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
      organizer: admin._id,
      boothRows: 4,
      boothColumns: 6,
      tags: ['Biotech', 'Genomics', 'MedTech', 'Oncology', 'HealthAI'],
    });

    // Expo 3: CleanEnergy Expo
    const expo3 = await Expo.create({
      title: 'CleanEnergy & Smart Mobility World 2026',
      description:
        'Showcasing next-generation solid-state battery manufacturing, hydrogen heavy transit solutions, megawatt charging corridors, and autonomous zero-emission vehicle fleets.',
      date: new Date(now + 35 * day),
      endDate: new Date(now + 38 * day),
      location: 'Metropolis Expo Pavilion, Austin, TX',
      theme: 'Clean Energy & Autonomous Vehicles',
      status: 'published',
      bannerImage:
        'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1200&auto=format&fit=crop&q=80',
      organizer: admin2._id,
      boothRows: 4,
      boothColumns: 6,
      tags: ['CleanTech', 'EV', 'Solar', 'Hydrogen', 'Battery'],
    });

    // Expo 4: Cybersecurity & Cloud Expo
    const expo4 = await Expo.create({
      title: 'CyberShield Global Security & Cloud Summit 2026',
      description:
        'The definitive enterprise gathering for zero-trust cloud architectures, quantum-resistant cryptography, defensive AI algorithms, and threat intelligence operations.',
      date: new Date(now + 50 * day),
      endDate: new Date(now + 52 * day),
      location: 'McCormick Place Convention Center, Chicago, IL',
      theme: 'Cybersecurity & Cloud Systems',
      status: 'published',
      bannerImage:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
      organizer: admin._id,
      boothRows: 3,
      boothColumns: 6,
      tags: ['Cybersecurity', 'ZeroTrust', 'Cloud', 'Cryptography'],
    });

    // Expo 5: NextGen Gaming & XR Expo
    const expo5 = await Expo.create({
      title: 'NextGen Gaming & XR Interactive Expo 2026',
      description:
        'The biggest consumer & industry trade show for spatial computing, generative game engines, photorealistic virtual production, and high-performance esports hardware.',
      date: new Date(now + 65 * day),
      endDate: new Date(now + 68 * day),
      location: 'Los Angeles Convention Center, South Hall, Los Angeles, CA',
      theme: 'Gaming & Virtual Reality',
      status: 'published',
      bannerImage:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      organizer: admin2._id,
      boothRows: 3,
      boothColumns: 6,
      tags: ['Gaming', 'XR', 'VirtualReality', 'Esports', 'UnrealEngine'],
    });

    // Expo 6: Global FinTech Forum (Ongoing)
    const expo6 = await Expo.create({
      title: 'Global FinTech & Digital Banking Forum 2026',
      description:
        'Examining the future of programmable central bank digital currencies, instantaneous cross-border settlements, algorithmic trading clusters, and embedded finance.',
      date: new Date(now - 1 * day),
      endDate: new Date(now + 2 * day),
      location: 'Javits Center, North Wing, New York, NY',
      theme: 'FinTech & Digital Banking',
      status: 'ongoing',
      bannerImage:
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
      organizer: admin._id,
      boothRows: 3,
      boothColumns: 6,
      tags: ['FinTech', 'Banking', 'Blockchain', 'Payments', 'DeFi'],
    });

    console.log('Creating exhibitor profiles...');
    // Create rich company profiles
    const profTech = await ExhibitorProfile.create({
      user: exhUsers[0]._id,
      expo: expo1._id,
      company: 'TechCorp Autonomous Systems',
      description:
        'World leader in high-resolution solid-state LiDAR sensors, automotive edge inference nodes, and automated fleet calibration rigs.',
      products: ['LiDAR-X9 Vision Sensor', 'NeuralEdge Compute Node', 'SensorFusion OS 4.0'],
      services: ['Autonomous Navigation Consulting', 'Edge AI Calibration', 'Fleet Analytics'],
      website: 'https://techcorp-autonomous.example.com',
      contactEmail: 'contact@techcorp.com',
      contactPhone: '+1 (415) 555-0199',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      applicationStatus: 'approved',
    });

    const profBio = await ExhibitorProfile.create({
      user: exhUsers[1]._id,
      expo: expo2._id,
      company: 'BioGenix Precision Therapeutics',
      description:
        'Pioneering targeted lipid nanoparticle mRNA therapies, high-throughput automated genomic sequencing, and automated organoid drug screening.',
      products: ['NanoTarget LNP Core', 'GeneSeq Rapid Analyzer', 'CellMatrix BioChips'],
      services: ['Contract Molecular Screening', 'Clinical Trial Formulation'],
      website: 'https://biogenix-rx.example.com',
      contactEmail: 'partner@biogenix.com',
      contactPhone: '+1 (617) 555-4321',
      logo: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=150',
      applicationStatus: 'approved',
    });

    const profVolt = await ExhibitorProfile.create({
      user: exhUsers[2]._id,
      expo: expo3._id,
      company: 'VoltDynamics Power Systems',
      description:
        'Architects of silicon-anode solid-state battery cells and 800kW megawatt ultra-chargers for heavy electric transport and regional aviation.',
      products: ['SolidVolt 500 Cell', 'MegaCharge 800kW Dispenser', 'FleetGrid EMS'],
      services: ['Depot Electrification Turnkey', 'Grid Balancing Integration'],
      website: 'https://voltdynamics-power.example.com',
      contactEmail: 'info@voltdynamics.com',
      contactPhone: '+1 (512) 555-8800',
      logo: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=150',
      applicationStatus: 'approved',
    });

    const profQuantum = await ExhibitorProfile.create({
      user: exhUsers[3]._id,
      expo: expo1._id,
      company: 'QuantumLeap Computing',
      description:
        'Delivering fault-tolerant cryogenic quantum processing units (QPUs) with 1,024 physical qubits and quantum cloud compilation compilers.',
      products: ['Leap-1024 QPU Chip', 'CryoControl Rack V3', 'Q-Compiler SDK'],
      services: ['Quantum Algorithm Optimization', 'Quantum Hybrid Cloud Services'],
      website: 'https://quantumleap-labs.example.com',
      contactEmail: 'support@quantumleap.com',
      contactPhone: '+1 (408) 555-7733',
      logo: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=150',
      applicationStatus: 'approved',
    });

    const profApex = await ExhibitorProfile.create({
      user: exhUsers[4]._id,
      expo: expo1._id,
      company: 'Apex Robotics International',
      description:
        'Building next-generation bipedal humanoid warehouse assistants and dexterous five-finger robotic manipulation hands.',
      products: ['ApexHumanoid Model 2', 'TactileHand 5D', 'Synapse Fleet Controller'],
      services: ['Industrial Automation Design', 'Humanoid Safety Certification'],
      website: 'https://apexrobotics.example.com',
      contactEmail: 'sales@apexrobotics.com',
      contactPhone: '+1 (650) 555-1212',
      logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150',
      applicationStatus: 'approved',
    });

    const profCyber = await ExhibitorProfile.create({
      user: exhUsers[5]._id,
      expo: expo4._id,
      company: 'CyberShield Global Systems',
      description:
        'Next-gen AI autonomous SOC operations, post-quantum cryptography libraries, and real-time active cyber deception engines.',
      products: ['CyberShield Sentinel AI', 'PostQuantum Encryption Suite', 'ThreatDeception Grid'],
      services: ['Red Team Assessment', 'Incident Containment Response'],
      website: 'https://cybershield-security.example.com',
      contactEmail: 'defense@cybershield.com',
      contactPhone: '+1 (312) 555-9090',
      logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=150',
      applicationStatus: 'approved',
    });

    console.log('Generating floor plans & booths for all expos...');
    const generateExpoBooths = async (targetExpo, rows, cols, occupiedMap = {}) => {
      const booths = [];
      for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
          const number = `${String.fromCharCode(64 + r)}-${c}`;
          let status = 'available';
          let exhibitor = null;
          let profile = null;
          let size = r === 1 ? 'large' : r === 2 ? 'medium' : 'small';
          let price = size === 'large' ? 1500 : size === 'medium' ? 950 : 600;
          let notes =
            c === 1 || c === cols
              ? 'Corner Booth — High Foot Traffic'
              : r === 1
              ? 'Front Entrance Island'
              : 'Standard Hall Unit';

          if (occupiedMap[number]) {
            status = occupiedMap[number].status || 'occupied';
            exhibitor = occupiedMap[number].user || null;
            profile = occupiedMap[number].profile || null;
          }

          booths.push({
            expo: targetExpo._id,
            number,
            row: r,
            column: c,
            size,
            status,
            exhibitor,
            exhibitorProfile: profile,
            price,
            notes,
          });
        }
      }
      await Booth.insertMany(booths);
    };

    // Expo 1 Booths (4x6 = 24 booths)
    await generateExpoBooths(expo1, 4, 6, {
      'A-1': { status: 'occupied', user: exhUsers[0]._id, profile: profTech._id },
      'A-2': { status: 'occupied', user: exhUsers[3]._id, profile: profQuantum._id },
      'A-3': { status: 'occupied', user: exhUsers[4]._id, profile: profApex._id },
      'A-4': { status: 'reserved', user: null, profile: null },
      'B-1': { status: 'occupied', user: exhUsers[5]._id, profile: profCyber._id },
      'B-2': { status: 'reserved', user: null, profile: null },
    });

    // Expo 2 Booths (BioHealth)
    await generateExpoBooths(expo2, 4, 6, {
      'A-1': { status: 'occupied', user: exhUsers[1]._id, profile: profBio._id },
      'A-2': { status: 'reserved', user: null, profile: null },
      'B-3': { status: 'occupied', user: exhUsers[0]._id, profile: profTech._id },
    });

    // Expo 3 Booths (CleanEnergy)
    await generateExpoBooths(expo3, 4, 6, {
      'A-1': { status: 'occupied', user: exhUsers[2]._id, profile: profVolt._id },
      'B-1': { status: 'reserved', user: null, profile: null },
    });

    // Expo 4, 5, 6 Booths
    await generateExpoBooths(expo4, 3, 6, {
      'A-1': { status: 'occupied', user: exhUsers[5]._id, profile: profCyber._id },
    });
    await generateExpoBooths(expo5, 3, 6);
    await generateExpoBooths(expo6, 3, 6);

    console.log('Creating diverse sessions and keynotes...');
    // Sessions for Expo 1 (Tech & AI)
    const session1 = await Session.create({
      expo: expo1._id,
      title: 'Keynote: The Sovereign Frontier of Agentic AI & Large Multimodal Models',
      speaker: 'Dr. Evelyn Martinez',
      speakerBio: 'Director of Machine Intelligence, Quantum AI Labs; Former MIT AI Fellow',
      topic: 'Artificial Intelligence',
      description:
        'An in-depth exploration into self-directing multimodal agentic reasoning, safety containment protocols, and distributed cognitive computing architectures.',
      location: 'Grand Auditorium, Stage Alpha',
      startTime: new Date(now + 10 * day + 9 * 3600 * 1000), // Day 1 9:00 AM
      endTime: new Date(now + 10 * day + 10.5 * 3600 * 1000), // Day 1 10:30 AM
      capacity: 400,
      attendees: [
        { user: attendees[0]._id, registeredAt: new Date() },
        { user: attendees[1]._id, registeredAt: new Date() },
      ],
    });

    const session2 = await Session.create({
      expo: expo1._id,
      title: 'Panel: Scaling Humanoid Robotics in Industrial Supply Chains',
      speaker: 'Camilla Hayes & Panelists',
      speakerBio: 'VP of Robotics, Apex Robotics International',
      topic: 'Robotics',
      description:
        'Industry pioneers debate factory floor deployment realities, power density thresholds, and dexterous tactile grip breakthroughs for logistics.',
      location: 'Pavilion Hall B, Stage Beta',
      startTime: new Date(now + 10 * day + 11 * 3600 * 1000),
      endTime: new Date(now + 10 * day + 12.5 * 3600 * 1000),
      capacity: 250,
      attendees: [
        { user: attendees[0]._id, registeredAt: new Date() },
        { user: attendees[2]._id, registeredAt: new Date() },
      ],
    });

    const session3 = await Session.create({
      expo: expo1._id,
      title: 'Technical Workshop: Quantum Circuit Optimization with Cryogenic QPUs',
      speaker: 'Dr. Alistair Finch',
      speakerBio: 'Chief Quantum Scientist, QuantumLeap Computing',
      topic: 'Quantum Computing',
      description:
        'Hands-on session demonstrating error mitigation algorithms, variational quantum eigensolvers (VQE), and hybrid classical-quantum cloud pipelines.',
      location: 'Lab Room 204, Tech Wing',
      startTime: new Date(now + 11 * day + 14 * 3600 * 1000),
      endTime: new Date(now + 11 * day + 16 * 3600 * 1000),
      capacity: 80,
      attendees: [{ user: attendees[1]._id, registeredAt: new Date() }],
    });

    // Sessions for Expo 2 (BioHealth)
    await Session.create({
      expo: expo2._id,
      title: 'Keynote: mRNA 2.0 & Programmable Oncology Nanomedicine',
      speaker: 'Dr. Elena Rostova',
      speakerBio: 'Chief Scientific Officer, BioGenix Therapeutics',
      topic: 'Genomics & Oncology',
      description:
        'Breakthrough clinical trial results in personalised neoantigen vaccines and next-generation lipid nanoparticle delivery vehicles.',
      location: 'Grand Ballroom 1, Boston WTC',
      startTime: new Date(now + 20 * day + 10 * 3600 * 1000),
      endTime: new Date(now + 20 * day + 11.5 * 3600 * 1000),
      capacity: 300,
      attendees: [{ user: attendees[2]._id, registeredAt: new Date() }],
    });

    // Sessions for Expo 3 (CleanEnergy)
    await Session.create({
      expo: expo3._id,
      title: 'Keynote: The 800kW Megawatt Charging Standard & Solid-State Transition',
      speaker: 'Marcus Chen',
      speakerBio: 'Chief Technology Officer, VoltDynamics Power Systems',
      topic: 'Clean Tech & EV',
      description:
        'Overcoming thermal degradation in ultra-high rate EV charging and transitioning gigafactories to silicon-metal solid state chemistries.',
      location: 'Innovation Stage, Austin Pavilion',
      startTime: new Date(now + 35 * day + 9 * 3600 * 1000),
      endTime: new Date(now + 35 * day + 10.5 * 3600 * 1000),
      capacity: 350,
      attendees: [{ user: attendees[3]._id, registeredAt: new Date() }],
    });

    console.log('Creating attendee passes and QR registrations...');
    // Attendee 0 (Alex Rivera) registrations
    await Registration.create({
      user: attendees[0]._id,
      expo: expo1._id,
      sessions: [session1._id, session2._id],
      qrCode: generateQRCode(),
      status: 'confirmed',
      paymentStatus: 'free',
      registeredAt: new Date(now - 2 * day),
    });

    await Registration.create({
      user: attendees[0]._id,
      expo: expo2._id,
      sessions: [],
      qrCode: generateQRCode(),
      status: 'confirmed',
      paymentStatus: 'free',
      registeredAt: new Date(now - 1 * day),
    });

    // Attendee 1 (Sophia Martinez)
    await Registration.create({
      user: attendees[1]._id,
      expo: expo1._id,
      sessions: [session1._id, session3._id],
      qrCode: generateQRCode(),
      status: 'confirmed',
      paymentStatus: 'free',
      registeredAt: new Date(now - 3 * day),
    });

    // Attendee 2 (Ethan Gallagher)
    await Registration.create({
      user: attendees[2]._id,
      expo: expo2._id,
      sessions: [],
      qrCode: generateQRCode(),
      status: 'confirmed',
      paymentStatus: 'free',
      registeredAt: new Date(now - 4 * day),
    });

    // Attendee 3 (Olivia Zhang)
    await Registration.create({
      user: attendees[3]._id,
      expo: expo3._id,
      sessions: [],
      qrCode: generateQRCode(),
      status: 'confirmed',
      paymentStatus: 'free',
      registeredAt: new Date(now - 1 * day),
    });

    console.log('Creating cross-role messages & inquiries...');
    // 1. Attendee to Exhibitor (TechCorp)
    await Message.create({
      sender: attendees[0]._id,
      receiver: exhUsers[0]._id,
      expo: expo1._id,
      content:
        'Hi David! I saw your LiDAR-X9 sensor listed on the floor plan for Booth A-1. Will you have a live point-cloud demonstration running during the opening keynote break?',
      read: true,
      createdAt: new Date(now - 3600 * 1000 * 4),
    });

    await Message.create({
      sender: exhUsers[0]._id,
      receiver: attendees[0]._id,
      expo: expo1._id,
      content:
        'Hello Alex! Absolutely. We will have a live automotive LiDAR rig operating at Booth A-1 throughout all 3 days. Feel free to come test our SDK and sensor fusion viewer!',
      read: false,
      createdAt: new Date(now - 3600 * 1000 * 2),
    });

    // 2. Exhibitor to Neighboring Exhibitor (TechCorp to QuantumLeap - Booth A-1 to A-2)
    await Message.create({
      sender: exhUsers[0]._id,
      receiver: exhUsers[3]._id,
      expo: expo1._id,
      content:
        'Hey Alistair! We are right next to you at Booth A-1. We should discuss demonstrating our LiDAR edge compute pipeline interfacing with your quantum simulation cloud at the summit!',
      read: true,
      createdAt: new Date(now - 3600 * 1000 * 24),
    });

    await Message.create({
      sender: exhUsers[3]._id,
      receiver: exhUsers[0]._id,
      expo: expo1._id,
      content:
        'Great idea David! I will bring our SDK lead over to Booth A-1 on setup morning. See you on the floor!',
      read: true,
      createdAt: new Date(now - 3600 * 1000 * 12),
    });

    // 3. Exhibitor to Admin
    await Message.create({
      sender: exhUsers[2]._id,
      receiver: admin._id,
      expo: expo3._id,
      content:
        'Hi Sarah, can you confirm if Booth A-1 at the Austin Pavilion has 3-phase 480V power drop ready for our high-power charging station demo unit?',
      read: true,
      createdAt: new Date(now - 3600 * 1000 * 8),
    });

    console.log('Creating reviews and feedback...');
    await Feedback.create({
      user: attendees[0]._id,
      expo: expo1._id,
      rating: 5,
      message:
        'Exceptional organization! The interactive floor plan makes navigating booth locations effortless, and the AI speaker lineup is truly world-class.',
      category: 'general',
      createdAt: new Date(now - 2 * day),
    });

    await Feedback.create({
      user: attendees[1]._id,
      expo: expo1._id,
      rating: 5,
      message:
        'The hands-on quantum lab session and attendee QR pass system saved so much time at the entrance. Highly recommended!',
      category: 'session',
      createdAt: new Date(now - 1 * day),
    });

    await Feedback.create({
      user: attendees[2]._id,
      expo: expo2._id,
      rating: 4,
      message:
        'Great biotech showcase with very knowledgeable exhibitors. Looking forward to expanded workshop seating next year.',
      category: 'booth',
      createdAt: new Date(now - 12 * 3600 * 1000),
    });

    console.log('\n======================================================');
    console.log('🌟 EVENTSPHERE COMPREHENSIVE SEEDING COMPLETE!');
    console.log('======================================================');
    console.log('Populated:');
    console.log('- 6 Global Multi-Industry Expos with HD Banners');
    console.log('- 6 Enterprise Exhibitor Companies with full profiles');
    console.log('- 130+ Floor Plan Booths across all conventions');
    console.log('- Keynotes, Panel Discussions & Workshops with capacity');
    console.log('- Attendee passes with unique digital QR codes');
    console.log('- Cross-role real-time message threads');
    console.log('- Verified Attendee star reviews & ratings');
    console.log('======================================================');
    console.log('Ready-to-use Accounts:');
    console.log('1. Admin / Organizer:   admin@eventsphere.com    / Admin123!');
    console.log('2. Exhibitor:           exhibitor@techcorp.com   / Exhibitor123!');
    console.log('3. Attendee:            attendee@eventsphere.com / Attendee123!');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
