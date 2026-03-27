import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcryptjs';
import { User } from './models/User.ts';
import { Subject } from './models/Subject.ts';
import { Topic } from './models/Topic.ts';
import { Article } from './models/Article.ts';

let mongoServer: MongoMemoryServer;

const seedData = async () => {
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Seeding sample data...');

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const admin = await User.create({ name: 'Admin User', email: 'admin@school.edu', password, role: 'Admin' });
    await User.findOneAndUpdate({ email: 'eaasante333@gmail.com' }, { role: 'Admin' });
    const teacher = await User.create({ name: 'Severus Snape', email: 'snape@school.edu', password, role: 'Teacher' });
    const student = await User.create({ name: 'Harry Potter', email: 'harry@school.edu', password, role: 'Student' });
  }

  // Ensure subjects exist
  const subjectsToSeed = [
    { name: 'Mathematics', description: 'Numbers, quantities, and shapes' },
    { name: 'Integrated Science', description: 'Covering Science, ICT, and Environmental Studies' },
    { name: 'English Language', description: 'English language and literature' },
    { name: 'Social Studies', description: 'Including Economics, Geography, History, and Government' },
    { name: 'Ghanaian Language and Culture', description: 'Local languages and cultural studies' },
    { name: 'Design and Technology', description: 'Design and technical skills' },
    { name: 'Information and Communication Technology (ICT)', description: 'Computing and technology' },
    { name: 'French', description: 'French language studies' },
    { name: 'Religious and Moral Education (RME)', description: 'Religious and moral studies' },
    { name: 'Physical Education and Health (PEH)', description: 'Physical education and health studies' }
  ];

  for (const sub of subjectsToSeed) {
    await Subject.findOneAndUpdate({ name: sub.name }, sub, { upsert: true, setDefaultsOnInsert: true });
  }

  if (userCount === 0) {
    const math = await Subject.findOne({ name: 'Mathematics' });
    const science = await Subject.findOne({ name: 'Integrated Science' });
    const teacher = await User.findOne({ email: 'snape@school.edu' });

    if (math && science && teacher) {
      const algebra = await Topic.create({ name: 'Algebra', subject: math._id, description: 'Symbols and the rules for manipulating those symbols' });
      const biology = await Topic.create({ name: 'Biology', subject: science._id, description: 'Study of living organisms' });

      await Article.create({
        title: 'Introduction to Quadratic Equations',
        subject: math._id,
        topic: algebra._id,
        gradeLevel: '8',
        content: '<p>A quadratic equation is an equation of the second degree, meaning it contains at least one term that is squared.</p>',
        tags: ['math', 'algebra', 'equations'],
        author: teacher._id,
        status: 'Approved',
        views: 15,
      });

      await Article.create({
        title: 'The Cell Structure',
        subject: science._id,
        topic: biology._id,
        gradeLevel: '7',
        content: '<p>Cells are the basic building blocks of all living things. The human body is composed of trillions of cells.</p>',
        tags: ['science', 'biology', 'cells'],
        author: teacher._id,
        status: 'Pending',
        views: 0,
      });
    }
    console.log('Sample data seeded successfully.');
  }
};

export const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('No MONGODB_URI found, starting in-memory MongoDB...');
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
    }

    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
    
    await seedData();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

