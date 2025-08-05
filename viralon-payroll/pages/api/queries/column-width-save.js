import dbConnect from '../../../utils/dbConnect';
import ColumnWidth from '../../../models/columnWidthSchema';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { userId, widths } = req.body;

      if (!userId || !widths) {
        return res.status(400).json({ message: 'Missing userId or widths' });
      }

      // Update or create column widths for this userId
      const updated = await ColumnWidth.findOneAndUpdate(
        { userId },
        { widths },
        { upsert: true, new: true }
      );

      return res.status(200).json({ message: 'Column widths saved', data: updated });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
