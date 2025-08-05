import dbConnect from "../../../utils/dbConnect";
import Invoice from "../../../models/sales/Invoice";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();

  const {
    invoiceId,
    refundAmount,
    refundMethod,
    refundNote,
    originalPayment,
    paymentIndex // 👈 Ensure this is sent from frontend
  } = req.body;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // ✅ Mark original payment as refunded
    if (
      typeof paymentIndex === "number" &&
      invoice.payments[paymentIndex] &&
      !invoice.payments[paymentIndex].refunded
    ) {
      invoice.payments[paymentIndex].refunded = true;
    }

    // ✅ Add a negative payment as a new refund entry
    invoice.payments.push({
      amount: -Math.abs(refundAmount), // Negative to indicate refund
      method: refundMethod,
      note:
        refundNote ||
        `Refund for payment on ${new Date(originalPayment.date).toLocaleDateString()}`,
      date: new Date(),
      type: "refund",
      refunded: true, // optional if you want to mark refund entries too
    });

    // ✅ Update balance due
    invoice.balanceDue += refundAmount;

    await invoice.save();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Refund Error:", err);
    res.status(500).json({ message: "Refund failed" });
  }
}
