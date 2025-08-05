// /pages/api/sales/invoice/send-updated.js

import dbConnect from "@/utils/dbConnect";
import { sendInvoiceEmail } from "@/utils/emailSender";
import { createInvoiceAndPDF } from "@/utils/invoiceGenerator";
import Invoice from "@/models/sales/Invoice";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  const { invoiceId, previewHTML } = req.body;

  if (!invoiceId || !previewHTML) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    console.log("📤 Sending updated invoice for ID:", invoiceId, "to", invoice.customerEmail);

    const { pdfBuffer } = await createInvoiceAndPDF(
      { ...invoice.toObject(), previewHTML },
      { saveToDB: false } // 🛑 don't save again
    );

    await sendInvoiceEmail({
      to: invoice.customerEmail,
      subject: `Updated Invoice #${invoice.invoiceNumber}`,
      htmlBody: `<p>Please find your updated invoice attached.</p>`,
      pdfBuffer,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error sending updated invoice:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
