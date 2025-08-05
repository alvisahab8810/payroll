// import dbConnect from "../../../utils/dbconnect";
// import Query from "../../../models/Query";
// import Contacts from "../../../models/Contacts"; // ✅ import contact model


// export default async function handler(req, res) {
//   await dbConnect();

//   try {
//     const queries = await Query.find();
//     const contacts = await Contacts.find();

//     const result = {};

//     queries.forEach((q) => {
//       result[q._id] = q.customFields || {};
//     });

//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching custom fields" });
//   }
// }

import dbConnect from "../../../utils/dbConnect";
import Query from "../../../models/Query";
import Contact from "../../../models/Contact";

export default async function handler(req, res) {
  await dbConnect();

  // Disable caching on the response
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  try {
    const queries = await Query.find({}, "_id customFields");
    const contacts = await Contact.find({}, "_id customFields");

    const result = {};

    // Merge Query custom fields
    queries.forEach((q) => {
      result[q._id] = q.customFields || {};
    });

    // Merge Contact custom fields
    contacts.forEach((c) => {
      result[c._id] = c.customFields || {};
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error fetching custom fields:", error);
    res.status(500).json({ message: "Failed to fetch custom fields" });
  }
}
