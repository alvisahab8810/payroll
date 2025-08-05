import dbConnect from "../../../../utils/dbConnect";
import Counter from "../../../../models/sales/Counter";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: "invoice" }, // 🔁 Change "quote" → "invoice"
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      const padded = String(counter.value).padStart(6, "0");
      const invoiceNumber = `INV-${padded}`; // 🔁 Change QT → INV

      res.status(200).json({ success: true, invoiceNumber });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
