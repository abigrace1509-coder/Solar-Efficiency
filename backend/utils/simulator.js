import EnergyData from '../models/EnergyData.js';
import Load from '../models/Load.js';
import LoadLog from '../models/LoadLog.js';

let ioInstance = null;
let batterySoc = 65;

const PRIORITY_ORDER = ['low', 'medium'];

const getSolarByHour = (hour) => {
  if (hour < 6 || hour > 18) return 0;

  const peak = 4500;
  const distanceFromNoon = Math.abs(12 - hour);
  const base = Math.max(0, peak - distanceFromNoon * 550);
  const fluctuation = Math.floor(Math.random() * 350);
  return Math.max(0, base + fluctuation - 150);
};

const applyLoadShedding = async (loads, availablePower) => {
  let runningDemand = loads.filter((load) => load.isOn).reduce((sum, load) => sum + load.powerRating, 0);
  const logs = [];

  for (const priority of PRIORITY_ORDER) {
    const candidates = loads.filter((load) => load.priority === priority && load.isOn && !load.manualOverride);

    for (const load of candidates) {
      if (runningDemand <= availablePower) break;
      load.isOn = false;
      runningDemand -= load.powerRating;
      logs.push({
        loadName: load.name,
        action: 'OFF',
        reason: 'Automatic load shedding due to power deficit',
        source: 'automatic'
      });
      await load.save();
    }
  }

  if (logs.length) {
    await LoadLog.insertMany(logs);
  }

  return runningDemand;
};

export const setSocketServer = (io) => {
  ioInstance = io;
};

export const runSimulationTick = async () => {
  const hour = new Date().getHours();
  const solarPower = getSolarByHour(hour);
  const loads = await Load.find();

  const totalDemand = loads.filter((load) => load.isOn).reduce((sum, load) => sum + load.powerRating, 0);
  const batterySupportPower = batterySoc > 10 ? Math.min(2000, Math.floor((batterySoc / 100) * 3000)) : 0;
  const availablePower = solarPower + batterySupportPower;

  let adjustedDemand = totalDemand;
  if (adjustedDemand > availablePower) {
    adjustedDemand = await applyLoadShedding(loads, availablePower);
  }

  const surplus = solarPower - adjustedDemand;
  if (surplus > 0) {
    batterySoc = Math.min(100, batterySoc + surplus / 6000 * 100);
  } else {
    batterySoc = Math.max(0, batterySoc + surplus / 5000 * 100);
  }

  const finalBatteryPower = batterySoc > 10 ? Math.min(2000, Math.floor((batterySoc / 100) * 3000)) : 0;
  const gridUsage = Math.max(0, adjustedDemand - (solarPower + finalBatteryPower));

  const payload = {
    solarPower,
    batterySoc: Number(batterySoc.toFixed(2)),
    batteryPower: finalBatteryPower,
    totalDemand: adjustedDemand,
    gridUsage
  };

  await EnergyData.create(payload);

  if (ioInstance) {
    const currentLoads = await Load.find();
    ioInstance.emit('energy:update', { ...payload, loads: currentLoads });
  }

  return payload;
};

export const getCurrentBatterySoc = () => Number(batterySoc.toFixed(2));
