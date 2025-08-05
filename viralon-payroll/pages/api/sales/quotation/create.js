



// import dbConnect from "../../../../utils/dbconnect";
// import Quotation from "../../../../models/sales/Quotation";
// import nodemailer from "nodemailer";
// import puppeteer from "puppeteer";
// import fs from "fs";
// import path from "path";

// export default async function handler(req, res) {
//   if (req.method !== "POST")
//     return res.status(405).send({ message: "Only POST allowed" });

//   await dbConnect();

//   try {
//     const {
//       customerId,
//       quoteNumber,
//       referenceNumber,
//       quoteDate,
//       expiryDate,
//       subject,
//       items,
//       subtotal,
//       discount,
//       gst,
//       adjustment,
//       total,
//       customerNotes,
//       terms,
//       attachedFiles,
//       customerEmail, // 🔁 Make sure you pass this from frontend
//       previewHTML,   // 🔁 Send the HTML content of the quote preview
//     } = req.body;

//     const newQuotation = new Quotation({
//       customerId,
//       quoteNumber,
//       referenceNumber,
//       quoteDate,
//       expiryDate,
//       subject,
//       items,
//       subtotal,
//       discount,
//       gst,
//       adjustment,
//       total,
//       customerNotes,
//       terms,
//       attachedFiles,
//     });

//     await newQuotation.save();

//     // Step 1: Generate PDF from HTML
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.setContent(previewHTML);
//     const pdfBuffer = await page.pdf({ format: "A4" });

//     await browser.close();

//     // Step 2: Setup transporter
//     const transporter = nodemailer.createTransport({
//       host: "smtp.hostinger.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: "info@viralon.in",
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     // Step 3: Send Email
//     await transporter.sendMail({
//       from: `"Viralon Sales" <info@viralon.in>`,
//       to: customerEmail,
//       subject: `Quotation - ${quoteNumber} is awaiting your approval`,
//       text: `Please find attached the quotation.`,
//       attachments: [
//         {
//           filename: `Quotation-${quoteNumber}.pdf`,
//           content: pdfBuffer,
//         },
//       ],
//     });

//     res.status(201).json({ success: true, quotation: newQuotation });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// }





// import dbConnect from "../../../../utils/dbconnect";
// import Quotation from "../../../../models/sales/Quotation";
// import puppeteer from "puppeteer";

// export default async function handler(req, res) {
//   if (req.method !== "POST")
//     return res.status(405).send({ message: "Only POST allowed" });

//   await dbConnect();

//   try {
//     const {
//       customerId,
//       quoteNumber,
//       referenceNumber,
//       quoteDate,
//       expiryDate,
//       subject,
//       items,
//       subtotal,
//       discount,
//       gst,
//       adjustment,
//       total,
//       customerNotes,
//       terms,
//       attachedFiles,
//       customerEmail,
//       previewHTML,
//     } = req.body;

//     const newQuotation = new Quotation({
//       customerId,
//       quoteNumber,
//       referenceNumber,
//       quoteDate,
//       expiryDate,
//       subject,
//       items,
//       subtotal,
//       discount,
//       gst,
//       adjustment,
//       total,
//       customerNotes,
//       terms,
//       attachedFiles,
//     });

//     await newQuotation.save();

//     // Generate PDF buffer
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.setContent(previewHTML);
//     const pdfBuffer = await page.pdf({ format: "A4" });

//     await browser.close();

//     // Convert buffer to base64 string to send back
//     const pdfBase64 = pdfBuffer.toString("base64");

//     res.status(201).json({ success: true, quotation: newQuotation, pdfBase64 });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// }











import dbConnect from "../../../../utils/dbConnect";
import Quotation from "../../../../models/sales/Quotation";
import puppeteer from "puppeteer";

// Simple in-memory store (only for testing/dev)
const pdfStore = global.pdfStore || new Map();
global.pdfStore = pdfStore;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send({ message: "Only POST allowed" });

  await dbConnect();

  try {
    const {
      customerId,
      quoteNumber,
      referenceNumber,
      quoteDate,
      expiryDate,
      subject,
      items,
      subtotal,
      discount,
      gst,
      adjustment,
      total,
      customerNotes,
      terms,
      attachedFiles,
      customerEmail,
      previewHTML,
    } = req.body;

    const newQuotation = new Quotation({
      customerId,
      quoteNumber,
      referenceNumber,
      quoteDate,
      expiryDate,
      subject,
      items,
      subtotal,
      discount,
      gst,
      adjustment,
      total,
      customerNotes,
      terms,
      attachedFiles,
    });

    await newQuotation.save();

    // Generate PDF
    // const browser = await puppeteer.launch();
    const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

    const page = await browser.newPage();
    await page.setContent(previewHTML);
    const pdfBuffer = await page.pdf({ format: "A4" });
    await browser.close();

    const quotationId = newQuotation._id.toString();
    pdfStore.set(quotationId, pdfBuffer); // Store PDF temporarily

    res.status(201).json({
      success: true,
      quotation: newQuotation,
      pdfId: quotationId,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
