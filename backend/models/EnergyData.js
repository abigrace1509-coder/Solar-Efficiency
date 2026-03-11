import mongoose from 'mongoose';

const energyDataSchema = new mongoose.Schema(
  {
    solarPower: { type: Number, required: true },
    batterySoc: { type: Number, required: true, min: 0, max: 100 },
    batteryPower: { type: Number, required: true },
    totalDemand: { type: Number, required: true },
    gridUsage: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('EnergyData', energyDataSchema);
