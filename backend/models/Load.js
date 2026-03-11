import mongoose from 'mongoose';

const loadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    priority: { type: String, enum: ['high', 'medium', 'low'], required: true },
    powerRating: { type: Number, required: true, min: 1 },
    isOn: { type: Boolean, default: true },
    manualOverride: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model('Load', loadSchema);
