import EnergyData from '../models/EnergyData.js';
import Load from '../models/Load.js';
import { runSimulationTick } from '../utils/simulator.js';

export const getLiveEnergy = async (_req, res) => {
  try {
    let latest = await EnergyData.findOne().sort({ createdAt: -1 });

    if (!latest) {
      latest = await runSimulationTick();
    }

    const loads = await Load.find().sort({ priority: 1 });
    return res.json({ energy: latest, loads });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch live energy data', error: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 50);
    const rows = await EnergyData.find().sort({ createdAt: -1 }).limit(limit);
    return res.json(rows.reverse());
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
};
