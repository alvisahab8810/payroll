// // /pages/api/sales/invoice/recurring.js
// import RecurringInvoice from "@/models/sales/recurringInvoice"; // You must define this schema


// import dbConnect from "../../../../utils/dbConnect";
// // import Invoice from "../../../../models/sales/Invoice";

// import { getSession } from "next-auth/react"; // Optional if you want auth

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   await dbConnect();

//   try {
//     const data = req.body;

//     // You may validate fields here as needed

//     const invoice = new RecurringInvoice(data);
//     await invoice.save();

//     res.status(200).json({ success: true, invoice });
//   } catch (err) {
//     console.error("Recurring invoice error:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// }




// // /pages/api/sales/invoice/recurring.js

// import RecurringInvoice from "@/models/sales/recurringInvoice";
// import dbConnect from "../../../../utils/dbConnect";
// import { getSession } from "next-auth/react"; // Optional

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   await dbConnect();

//   try {
//     const data = req.body;

//     // ✅ Validate that previewHTML exists
//     if (!data.previewHTML || data.previewHTML.trim() === "") {
//       return res.status(400).json({
//         success: false,
//         error: "Missing previewHTML content for PDF rendering",
//       });
//     }

//     // ✅ Save recurring invoice
//     const invoice = new RecurringInvoice({
//       ...data,
//       previewHTML: data.previewHTML, // explicitly store it
//     });

//     await invoice.save();

//     res.status(200).json({ success: true, invoice });
//   } catch (err) {
//     console.error("Recurring invoice error:", err);
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// }






// /pages/api/sales/invoice/recurring.js

import RecurringInvoice from "@/models/sales/recurringInvoice";
import dbConnect from "../../../../utils/dbConnect";
import { createInvoiceAndPDF } from "@/utils/invoiceGenerator";
import { sendInvoiceEmail } from "@/utils/emailSender";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await dbConnect();

  try {
    const data = req.body;

    if (!data.previewHTML || data.previewHTML.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Missing previewHTML content for PDF rendering",
      });
    }

    // ✅ 1. Save recurring invoice to DB
    const savedInvoice = new RecurringInvoice({
      ...data,
      previewHTML: data.previewHTML,
    });

    await savedInvoice.save();

    // ✅ 2. Immediately generate and send first invoice
    const newInvoiceNumber = `INV-${Math.floor(Math.random() * 100000)}`;

    const invoiceToSend = {
      customerId: data.customerId,
      invoiceNumber: newInvoiceNumber,
      invoiceDate: new Date(), // send with today's date
      dueDate: data.dueDate,
      referenceNumber: data.referenceNumber,
      subject: data.subject,
      items: data.items,
      subtotal: data.subtotal,
      discount: data.discount,
      gst: data.gst,
      adjustment: data.adjustment,
      total: data.total,
      customerNotes: data.customerNotes,
      terms: data.terms,
      customerEmail: data.customerEmail,
      sacCode: data.sacCode,
      previewHTML: data.previewHTML,
    };

    const { pdfBuffer, invoiceRecord } = await createInvoiceAndPDF(invoiceToSend);

    if (data.customerEmail && data.customerEmail.includes("@")) {
      await sendInvoiceEmail({
        to: data.customerEmail,
        subject: `Recurring Invoice #${newInvoiceNumber}`,
        htmlBody: `<p>Please find attached your recurring invoice.</p>`,
        pdfBuffer,
      });

      console.log("📧 Sent recurring invoice immediately to:", data.customerEmail);
    } else {
      console.warn("⚠️ Invalid or missing email. Invoice not sent.");
    }

    return res.status(200).json({ success: true, invoice: savedInvoice });
  } catch (err) {
    console.error("Recurring invoice error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
