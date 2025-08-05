


// import dbConnect from "../../../utils/dbconnect";
// import Contact from "../../../models/Contact";
// import nodemailer from "nodemailer";

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method === "POST") {
//     const { name, email, phone, businessName } = req.body;

//     try {
//       const newContact = new Contact({
//         name,
//         email,
//         phone,
//         businessName,
//         formType: "Contact", // use consistent naming
//       });

//       await newContact.save();

//       const transporter = nodemailer.createTransport({
//         host: "smtp.hostinger.com",
//         port: 465,
//         secure: true,
//         auth: {
//           user: "info@viralon.in",
//           pass: process.env.EMAIL_PASS,
//         },
//       });

//       const mailOptions = {
//         from: '"Viralon" <info@viralon.in>',
//         to: email,
//         subject: "Thanks for contacting Viralon!",
//         html: `
//           <p>Hi ${name},</p>
//           <p>Thanks for reaching out. We’ll get back to you soon.</p>
//           <p>Regards,<br/>Team Viralon</p>
//         `,
//       };

//       await transporter.sendMail(mailOptions);

//       return res.status(201).json({ success: true, message: "Contact saved and email sent!" });
//     } catch (error) {
//       console.error("Error saving contact:", error);
//       return res.status(500).json({ success: false, message: "Server error" });
//     }
//   }

//   // ✅ Add GET handler to fetch all contacts
//   if (req.method === "GET") {
//     try {
//       const contacts = await Contact.find().sort({ createdAt: -1 });
//       return res.status(200).json({ success: true, data: contacts });
//     } catch (error) {
//       console.error("Error fetching contacts:", error);
//       return res.status(500).json({ success: false, message: "Failed to fetch contacts" });
//     }
//   }

//   res.status(405).json({ message: "Method Not Allowed" });
// }




import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "../../../utils/dbConnect";
import Contact from "../../../models/Contact";
import nodemailer from "nodemailer";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  await dbConnect();

  /* ───────────────────────── POST: save contact + email ─────────────────── */
  if (req.method === "POST") {
    const { name, email, phone, businessName } = req.body;
    try {
      await Contact.create({
        name,
        email,
        phone,
        businessName,
        formType: "Contact",
      });

      const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 465,
        secure: true,
        auth: { user: "info@viralon.in", pass: process.env.EMAIL_PASS },
      });

      await transporter.sendMail({
        from: '"Viralon" <info@viralon.in>',
        to: email,
        subject: "Thanks for contacting Viralon!",
        html: `<p>Hi ${name},</p><p>Thanks for reaching out. We’ll get back to you soon.</p><p>Regards,<br/>Team Viralon</p>`,
      });

      return res
        .status(201)
        .json({ success: true, message: "Contact saved and email sent!" });
    } catch (err) {
      console.error("Error saving contact:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }

  /* ───────────────────────── GET: list contacts ─────────────────────────── */
  if (req.method === "GET") {
    try {
      const token  = await getToken({ req, secret });
      const legacy = (req.headers.cookie || "").includes("admin_auth=true");

      if (!token && !legacy) {
        return res.status(401).json({ message: "Unauthorised" });
      }

      const filter = {};
      if (token?.role === "salesperson") {
        filter.salespersonId = new mongoose.Types.ObjectId(token.id || token.sub);
      }

      const contacts = await Contact.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: contacts });
    } catch (err) {
      console.error("Error fetching contacts:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch contacts" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
