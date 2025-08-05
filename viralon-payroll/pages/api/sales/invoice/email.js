

import nodemailer from "nodemailer";
import dbConnect from "../../../../utils/dbConnect";
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
        filename: `Invoice.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });

  res.status(200).json({ success: true });
}
