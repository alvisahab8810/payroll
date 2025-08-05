import dbConnect from "../../../../utils/dbConnect";
import Quotation from "../../../../models/sales/Quotation";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Only DELETE allowed" });
  }

  await dbConnect();

  const { id } = req.query;

  try {
    const deleted = await Quotation.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Quotation not found" });
    }

    res.status(200).json({ success: true, message: "Quotation deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
