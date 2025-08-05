import dbConnect from '../../../utils/dbConnect';
import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  appliedPosition: String,
  name: String,
  email: String,
  mobile: String,
  portfolioLink: String,
  resumePath: String,
}, { timestamps: true });
      
const Application = mongoose.models.Application || mongoose.model('Application', ApplicationSchema);

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const applications = await Application.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, data: applications });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
