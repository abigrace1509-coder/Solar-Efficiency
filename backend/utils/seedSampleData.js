import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Load from '../models/Load.js';

dotenv.config();

const run = async () => {
  await connectDB();

  await User.deleteMany({});
  await Load.deleteMany({});

  const password = await bcrypt.hash('admin123', 10);

  await User.create({
    name: 'Admin User',
    email: 'admin@smartgrid.com',
    password,
    role: 'admin'
  });

  await Load.insertMany([
    { name: 'Living Room Lights', priority: 'high', powerRating: 120, isOn: true },
    { name: 'Bedroom Fans', priority: 'high', powerRating: 150, isOn: true },
    { name: 'TV', priority: 'medium', powerRating: 200, isOn: true },
    { name: 'Computer', priority: 'medium', powerRating: 250, isOn: true },
    { name: 'Air Conditioner', priority: 'low', powerRating: 1600, isOn: true },
    { name: 'Heater', priority: 'low', powerRating: 1800, isOn: true }
  ]);

  console.log('Seed complete: admin@smartgrid.com / admin123');
  process.exit(0);
};

run().catch((error) => {
  console.error('Seed failed', error);
  process.exit(1);
});
