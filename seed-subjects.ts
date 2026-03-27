import mongoose from 'mongoose';
import { Subject } from './server/models/Subject.ts';
import { connectDB } from './server/db.ts';

const run = async () => {
  await connectDB();
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
  console.log('Done seeding subjects');
  process.exit(0);
};
run();
