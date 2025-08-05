// Inside /api/queries/query.js
import dbConnect from '../../../../utils/dbConnect';

import Query from "../../../../models/Query";

dbConnect();

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      await Query.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
  }

  // existing GET and POST code...
}
