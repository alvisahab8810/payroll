// File: /pages/api/dashboard/quotation-summary.js

import dbConnect from "../../../utils/dbConnect";
import Quotation from "../../../models/sales/Quotation";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const currentMonth = new Date();
    const monthlyCounts = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(currentMonth, i));
      const monthEnd = endOfMonth(subMonths(currentMonth, i));

      const count = await Quotation.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });

      monthlyCounts.push({
        month: format(monthStart, "MMM yyyy"), // "Jun 2025"
        count: count,
      });
    }

    res.status(200).json({ success: true, data: monthlyCounts });
  } catch (error) {
    console.error("Quotation summary error:", error);
    res.status(500).json({ success: false, message: "Failed to get quotation summary" });
  }
}
