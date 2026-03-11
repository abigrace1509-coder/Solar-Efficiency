import mongoose from 'mongoose';

const loadLogSchema = new mongoose.Schema(
  {
    loadName: { type: String, required: true },
    action: { type: String, enum: ['ON', 'OFF'], required: true },
    reason: { type: String, required: true },
    source: { type: String, enum: ['automatic', 'manual'], required: true }
  },
  { timestamps: true }
);

export default mongoose.model('LoadLog', loadLogSchema);
