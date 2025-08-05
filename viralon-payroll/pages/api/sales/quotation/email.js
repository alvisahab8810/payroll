// import nodemailer from "nodemailer";

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   const {
//     to,
//     cc = "",
//     bcc = "",
//     subject = "Quotation from Viralon",
//     htmlBody = "<p>Please find the quotation attached.</p>",
//     pdfBase64,
//     filename = "Quotation.pdf",
//   } = req.body;

//   if (!to || !pdfBase64) {
//     return res
//       .status(400)
//       .json({ success: false, error: "Missing 'to' or 'pdfBase64'" });
//   }

//   // Load credentials
//   const user = "info@viralon.in";
//   const pass = process.env.EMAIL_PASS;

//   if (!pass) {
//     return res
//       .status(500)
//       .json({ success: false, error: "Missing EMAIL_PASS environment variable" });
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.hostinger.com",
//       port: 587,
//       secure: false, // Use TLS with STARTTLS (recommended)
//       auth: { user, pass },
//     });

//     const mailOptions = {
//       from: `"Viralon Sales" <${user}>`,
//       to,
//       cc,
//       bcc,
//       subject,
//       html: htmlBody,
//       attachments: [
//         {
//           filename,
//           // content: Buffer.from(pdfBase64, "base64"),
//           content: Buffer.from(
//   pdfBase64.replace(/^data:application\/pdf;base64,/, ""),
//   "base64"
// )

//           contentType: "application/pdf",
//         },
//       ],
//     };

//     await transporter.sendMail(mailOptions);

//     return res.status(200).json({ success: true });
//   } catch (err) {
//     console.error("Email Send Error:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// }


// import nodemailer from "nodemailer";

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   const {
//     to,
//     cc = "",
//     bcc = "",
//     subject = "Quotation from Viralon",
//     htmlBody = "<p>Please find the quotation attached.</p>",
//     pdfBase64,
//     filename = "Quotation.pdf",
//   } = req.body;

//   if (!to || !pdfBase64) {
//     return res.status(400).json({ success: false, error: "Missing 'to' or 'pdfBase64'" });
//   }

//   const user = "info@viralon.in";
//   const pass = process.env.EMAIL_PASS;

//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.hostinger.com",
//       port: 587,
//       secure: false,
//       auth: { user, pass },
//       tls: { rejectUnauthorized: false },
//     });

//     await transporter.sendMail({
//       from: `"Viralon Sales" <${user}>`,
//       to,
//       cc,
//       bcc,
//       subject,
//       html: htmlBody,
//       attachments: [
//         {
//           filename,
//           content: Buffer.from(pdfBase64, "base64"),
//           contentType: "application/pdf",
//         },
//       ],
//     });

//     return res.status(200).json({ success: true });
//   } catch (err) {
//     console.error("Email Send Error:", err);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// }





// import nodemailer from "nodemailer";
// import dbConnect from "../../../../utils/dbconnect";
// import Quotation from "../../../../models/sales/Quotation";
// import puppeteer from "puppeteer";

// const pdfCache = new Map();

// export default async function handler(req, res) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { to, subject, htmlBody, pdfId, previewHTML } = req.body;

//   if (!to || !pdfId) {
//     return res.status(400).json({ success: false, error: "Missing fields" });
//   }

//   await dbConnect();

//   let pdfBuffer = pdfCache.get(pdfId);

//   // 🛠 If PDF not cached, regenerate from previewHTML
//   if (!pdfBuffer && previewHTML) {
//     try {
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();
//       await page.setContent(previewHTML);
//       pdfBuffer = await page.pdf({ format: "A4" });
//       await browser.close();
//     } catch (err) {
//       console.error("PDF generation error:", err);
//       return res.status(500).json({ success: false, error: "Failed to generate PDF." });
//     }
//   }

//   if (!pdfBuffer) {
//     return res.status(404).json({ success: false, error: "PDF not available." });
//   }

//   // Send email with attachment
//   const transporter = nodemailer.createTransport({
//     host: "smtp.hostinger.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: "info@viralon.in",
//       pass: process.env.EMAIL_PASS,
//     },
//     tls: { rejectUnauthorized: false },
//   });

//   await transporter.sendMail({
//     from: `"Viralon Sales" <info@viralon.in>`,
//     to,
//     subject,
//     html: htmlBody,
//     attachments: [
//       {
//         filename: `Quotation.pdf`,
//         content: pdfBuffer,
//         contentType: "application/pdf",
//       },
//     ],
//   });

//   res.status(200).json({ success: true });
// }





import nodemailer from "nodemailer";
import dbConnect from "../../../../utils/dbConnect";
import Quotation from "../../../../models/sales/Quotation";
import puppeteer from "puppeteer";

const pdfCache = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { to, cc, bcc, subject, htmlBody, pdfId, previewHTML } = req.body;

  if (!to || !pdfId) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  await dbConnect();

  let pdfBuffer = pdfCache.get(pdfId);

  if (!pdfBuffer && previewHTML) {
    try {
      // const browser = await puppeteer.launch();

      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
      });


      const page = await browser.newPage();
      await page.setContent(previewHTML);
      pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();
    } catch (err) {
      console.error("PDF generation error:", err);
      return res.status(500).json({ success: false, error: "Failed to generate PDF." });
    }
  }

  if (!pdfBuffer) {
    return res.status(404).json({ success: false, error: "PDF not available." });
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 587,
    secure: false,
    auth: {
      user: "info@viralon.in",
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail({
    from: `"Viralon Sales" <info@viralon.in>`,
    to,
    cc: cc || undefined,
    bcc: bcc || undefined,
    subject,
    html: htmlBody,
    attachments: [
      {
        filename: `Quotation.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  res.status(200).json({ success: true });
}
