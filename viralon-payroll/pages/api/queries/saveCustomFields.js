// import dbConnect from "../../../utils/dbconnect";
// import Query from "../../../models/Query";
// import Contact from "../../../models/Contact";

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method === "POST") {
//     const data = req.body;

//     try {
//       const updatePromises = Object.entries(data).map(async ([docId, fields]) => {
//         // First try updating a Query
//         let updated = await Query.findByIdAndUpdate(docId, { customFields: fields });

//         if (updated) {
//           console.log(`✅ Saved to Query: ${docId}`);
//           return updated;
//         }

//         // If not found in Query, try updating a Contact
//         updated = await Contact.findByIdAndUpdate(docId, { customFields: fields });

//         if (updated) {
//           console.log(`✅ Saved to Contact: ${docId}`);
//           return updated;
//         }

//         // Neither found
//         console.log(`❌ Document not found in Query or Contact: ${docId}`);
//         return null;
//       });

//       await Promise.all(updatePromises);

//       res.status(200).json({ message: "Custom fields saved successfully" });
//     } catch (error) {
//       console.error("❌ Save failed:", error);
//       res.status(500).json({ message: "Failed to save custom fields" });
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }

// pages/api/queries/saveCustomFields.js








// import { getToken } from "next-auth/jwt";

// import dbConnect from "../../../utils/dbConnect";
// import Query from "../../../models/Query";
// import Contact from "../../../models/Contact";

// const secret = process.env.NEXTAUTH_SECRET;

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   /* ── 0. Authenticate ───────────────────────────── */
//   const token = await getToken({ req, secret });
//   const userId = token?.id || token?.sub;
//   if (!userId) {
//     return res.status(401).json({ message: "Not authenticated" });
//   }

//   await dbConnect();
//   const data = req.body; // { docId: { Status: "...", ... }, … }

//   try {
//     const results = await Promise.all(
//       Object.entries(data).map(async ([docId, fields]) => {
//         const update = {
//           $set: {
//             customFields: fields,
//             salespersonId: userId, // tie record to this salesperson
//           },
//         };

//         // 1. Try Query collection
//         let doc = await Query.findByIdAndUpdate(docId, update, { new: true });
//         if (doc) return { docId, type: "Query" };

//         // 2. Try Contact collection
//         doc = await Contact.findByIdAndUpdate(docId, update, { new: true });
//         if (doc) return { docId, type: "Contact" };

//         return { docId, type: null }; // not found
//       })
//     );

//     const notFound = results.filter((r) => !r.type).length;
//     if (notFound) {
//       console.warn(`⚠️  ${notFound} document(s) not found`);
//     }

//     return res.status(200).json({ message: "Custom fields saved", results });
//   } catch (err) {
//     console.error("❌ Save failed:", err);
//     return res.status(500).json({ message: "Failed to save custom fields" });
//   }
// }














import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "../../../utils/dbConnect";
import Query from "../../../models/Query";
import Contact from "../../../models/Contact";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  /* ── 0. Auth ───────────────────────────────────────── */
  const token  = await getToken({ req, secret });
  const legacy = (req.headers.cookie || "").includes("admin_auth=true");

  if (!token && !legacy)
    return res.status(401).json({ message: "Not authenticated" });

  const isAdmin       = token?.role === "admin" || legacy;
  const salespersonId = token?.role === "salesperson" ? token.id || token.sub : null;

  await dbConnect();
  const payload = req.body;   // { docId: { field: value, ... }, ... }

  try {
    const results = await Promise.all(
      Object.entries(payload).map(async ([docId, fields]) => {
        /* ── build update ───────────────────────────── */
        const update = { $set: { customFields: fields } };

        /* if admin assigned a rep, store it */
    if (fields["Contacted by"]) {
  const maybeId = fields["Contacted by"];
  if (mongoose.Types.ObjectId.isValid(maybeId)) {
    update.$set.salespersonId = new mongoose.Types.ObjectId(maybeId);
  }
}


        /* ── SALES PERSON can only touch own docs ──── */
        const baseFilter = isAdmin
          ? { _id: docId }
          : { _id: docId, salespersonId };

        /* try Query first */
        let doc = await Query.findOneAndUpdate(baseFilter, update, { new: true });
        if (!doc) {
          /* then Contact */
          doc = await Contact.findOneAndUpdate(baseFilter, update, { new: true });
        }

        return !!doc; // true if something was updated
      })
    );

    const updated = results.filter(Boolean).length;
    return res.status(200).json({ message: `Updated ${updated} document(s)` });
  } catch (err) {
    console.error("Save failed:", err);
    return res.status(500).json({ message: "Failed to save custom fields" });
  }
}
