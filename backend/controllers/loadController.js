import Load from '../models/Load.js';
import LoadLog from '../models/LoadLog.js';

export const controlLoad = async (req, res) => {
  try {
    const { loadId, isOn, manualOverride = true } = req.body;

    const load = await Load.findById(loadId);
    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    load.isOn = Boolean(isOn);
    load.manualOverride = Boolean(manualOverride);
    await load.save();

    await LoadLog.create({
      loadName: load.name,
      action: load.isOn ? 'ON' : 'OFF',
      reason: manualOverride ? 'Manual override from dashboard' : 'Remote control update',
      source: 'manual'
    });

    return res.json(load);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to control load', error: error.message });
  }
};

export const getLoadHistory = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 100);
    const logs = await LoadLog.find().sort({ createdAt: -1 }).limit(limit);
    return res.json(logs);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch load history', error: error.message });
  }
};

export const getLoads = async (_req, res) => {
  const loads = await Load.find().sort({ priority: 1 });
  return res.json(loads);
};
