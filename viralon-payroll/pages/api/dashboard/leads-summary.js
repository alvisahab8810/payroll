

import dbConnect from "../../../utils/dbConnect";
import Query from "../../../models/Query";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const now = new Date();

    // Get data for last 6 months
    const months = Array.from({ length: 6 }).map((_, i) => {
      const date = subMonths(now, i);
      return {
        label: format(date, "MMM yy"),
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    }).reverse();

    const data = [];

    for (const m of months) {
      const count = await Query.countDocuments({
        createdAt: { $gte: m.start, $lte: m.end },
        formType: { $regex: /query/i }, // Only real leads
      });

      data.push({ month: m.label, Leads: count });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lead summary failed" });
  }
}
