import dbConnect from "../../../../utils/dbConnect";
// import Invoice from "../../../../models/sales/invoice";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Only DELETE requests are allowed." });
  }

  await dbConnect();

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, error: "Invoice ID is required." });
  }

  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ success: false, error: "Invoice not found." });
    }

    return res.status(200).json({ success: true, message: "Invoice deleted successfully." });
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    return res.status(500).json({ success: false, error: "Server error while deleting invoice." });
  }
}
