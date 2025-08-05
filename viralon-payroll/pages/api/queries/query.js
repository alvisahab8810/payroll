




import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "../../../utils/dbConnect";
import Query from "../../../models/Query";
import nodemailer from "nodemailer";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  await dbConnect();

  /* ───────────────────────── POST: save query + email ───────────────────── */
  if (req.method === "POST") {
    const { name, email, phone, businessName, formType } = req.body;
    try {
      const newQuery = await Query.create({
        name,
        email,
        phone,
        businessName,
        formType: formType || "Query Form",
      });

      /*  send thank‑you email  */
      const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: { user: "info@viralon.in", pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: '"Viralon" <info@viralon.in>',
        to: email,
        subject: "Thank you for your query!",
        html: `<p>Hi ${name},</p><p>Thanks for reaching out. We’ll contact you soon.</p><p>Regards,<br/>Team Viralon</p>`,
      });

      return res
        .status(201)
        .json({ success: true, message: "Query saved and email sent!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  /* ───────────────────────── GET: list queries ──────────────────────────── */
  if (req.method === "GET") {
    try {
      const token  = await getToken({ req, secret });
      const legacy = (req.headers.cookie || "").includes("admin_auth=true");

      if (!token && !legacy) {
        return res.status(401).json({ message: "Unauthorised" });
      }

      const filter = { formType: { $regex: /query/i } };

      /* salesperson → restrict to own leads */
      if (token?.role === "salesperson") {
        filter.salespersonId = new mongoose.Types.ObjectId(token.id || token.sub);
      }

      /* admin (token.role === "admin"  OR legacy cookie) → no extra filter */
      const queries = await Query.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: queries });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Failed to fetch" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
