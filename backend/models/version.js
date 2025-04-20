import mongoose from 'mongoose';

const versionSchema = new mongoose.Schema({
  code: { type: String, required: true },
  version: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Version || mongoose.model('Version', versionSchema);
