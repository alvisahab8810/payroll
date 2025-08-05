import dbConnect from "../../../../utils/dbConnect";
import Invoice from "../../../../models/sales/Invoice";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { id } = req.query;
  if (!id) return res.status(400).json({ success: false, message: "Missing id" });

  await dbConnect();
  const invoice = await Invoice.findById(id);
  if (!invoice) return res.status(404).json({ success: false, message: "Not found" });

  res.json({ success: true, previewHTML: invoice.previewHTML || "" });
}
