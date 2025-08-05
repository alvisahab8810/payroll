// File: /pages/api/dashboard/client-onboarding-summary.js



import dbConnect from "../../../utils/dbConnect";
import Customer from "../../../models/sales/Customer"
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const now = new Date();
    const months = Array.from({ length: 6 }, (_, i) => subMonths(now, i)).reverse();

    const summary = await Promise.all(
      months.map(async (monthDate) => {
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);

        const count = await Customer.countDocuments({
          createdAt: { $gte: start, $lte: end },
        });

        return {
          month: format(monthDate, "yyyy-MM"),
          count,
        };
      })
    );

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    console.error("Client onboarding summary error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
