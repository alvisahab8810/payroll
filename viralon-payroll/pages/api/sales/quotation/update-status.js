import dbConnect from "../../../../utils/dbConnect";
import Quotation from "../../../../models/sales/Quotation";

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method !== "POST") {
//     return res.status(405).json({ success: false, message: "Method not allowed" });
//   }

//   const { quoteId, status } = req.body;

//   // Basic validation
//   if (!quoteId || !status) {
//     return res.status(400).json({ success: false, error: "Missing quoteId or status" });
//   }

//   const allowedStatuses = ["Sent", "Approved", "Rejected", "Pending"];
//   if (!allowedStatuses.includes(status)) {
//     return res.status(400).json({ success: false, error: "Invalid status value" });
//   }

//   try {
//     const updatedQuote = await Quotation.findByIdAndUpdate(
//       quoteId,
//       { status },
//       { new: true }
//     );

//     if (!updatedQuote) {
//       return res.status(404).json({ success: false, error: "Quote not found" });
//     }

//     return res.status(200).json({ success: true, quote: updatedQuote });
//   } catch (error) {
//     console.error("Error updating quote status:", error);
//     return res.status(500).json({ success: false, error: "Server error" });
//   }
// }
export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  console.log("Request body received:", req.body);

  const { quoteId, status } = req.body;

  if (!quoteId || !status) {
    return res.status(400).json({ success: false, error: "Missing quoteId or status" });
  }

  const allowedStatuses = ["Sent", "Approved", "Rejected", "Pending"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status value" });
  }

  try {
    const updatedQuote = await Quotation.findByIdAndUpdate(
      quoteId,
      { status },
      { new: true }
    );

    if (!updatedQuote) {
      return res.status(404).json({ success: false, error: "Quote not found" });
    }

    console.log("Quote successfully updated:", updatedQuote);
    return res.status(200).json({ success: true, quote: updatedQuote });
  } catch (error) {
    console.error("Error updating quote status:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
