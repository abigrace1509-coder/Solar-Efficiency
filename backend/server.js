import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import energyRoutes from './routes/energyRoutes.js';
import loadRoutes from './routes/loadRoutes.js';
import Load from './models/Load.js';
import { runSimulationTick, setSocketServer } from './utils/simulator.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000'
  }
});

setSocketServer(io);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ message: 'Smart Grid Home backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/load', loadRoutes);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

const ensureDefaultLoads = async () => {
  const count = await Load.countDocuments();
  if (count > 0) return;

  await Load.insertMany([
    { name: 'Living Room Lights', priority: 'high', powerRating: 120, isOn: true },
    { name: 'Bedroom Fans', priority: 'high', powerRating: 150, isOn: true },
    { name: 'TV', priority: 'medium', powerRating: 200, isOn: true },
    { name: 'Computer', priority: 'medium', powerRating: 250, isOn: true },
    { name: 'Air Conditioner', priority: 'low', powerRating: 1600, isOn: true },
    { name: 'Heater', priority: 'low', powerRating: 1800, isOn: true }
  ]);
};

const start = async () => {
  try {
    await connectDB();
    await ensureDefaultLoads();

    const tickMs = Number(process.env.SIMULATION_TICK_MS || 5000);
    setInterval(async () => {
      try {
        await runSimulationTick();
      } catch (error) {
        console.error('Simulation tick error:', error.message);
      }
    }, tickMs);

    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

start();
