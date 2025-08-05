import dbConnect from '../../../utils/dbConnect';
import Settings from '../../../models/settings';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const settings = await Settings.findOne();
    return res.status(200).json(settings);
  }

  if (req.method === "POST") {
    const { terms, customerNotes } = req.body;

    if (!terms || !customerNotes) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      let settings = await Settings.findOne();

      if (settings) {
        settings.terms = terms;
        settings.customerNotes = customerNotes;
        await settings.save();
        return res.status(200).json(settings);
      } else {
        settings = await Settings.create({ terms, customerNotes });
        return res.status(201).json(settings);
      }
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
