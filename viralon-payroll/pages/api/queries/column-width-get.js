import dbConnect from '../../../utils/dbConnect';
import ColumnWidth from '../../../models/columnWidthSchema';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ message: 'Missing userId' });
      }

      const columnWidths = await ColumnWidth.findOne({ userId });

      if (!columnWidths) {
        return res.status(404).json({ message: 'No column widths found for this user' });
      }

      return res.status(200).json({ widths: columnWidths.widths });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
