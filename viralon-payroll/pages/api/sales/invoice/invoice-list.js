import dbConnect from "../../../../utils/dbConnect";
import Invoice from "../../../../models/sales/Invoice";
import Customer from "../../../../models/sales/Customer"; // 👈 THIS IS REQUIRED

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed." });
  }

  await dbConnect();

  try {
    const invoices = await Invoice.find({})
      .populate("customerId") // Will now work correctly
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: invoices });
  } catch (error) {
    console.error("Fetch Invoice List Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch invoices." });
  }
}
