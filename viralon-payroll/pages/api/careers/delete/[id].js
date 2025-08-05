import dbConnect from '../../../../utils/dbConnect';
import Application from '../../../../models/Application';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { id } = req.query;

  try {
    await Application.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: 'Application deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
