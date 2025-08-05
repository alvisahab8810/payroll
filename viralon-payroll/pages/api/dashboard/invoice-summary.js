import dbConnect from "../../../utils/dbConnect";
import Invoice from "../../../models/sales/Invoice";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const currentMonth = new Date();
    const monthlyCounts = [];

    for (let i = 5; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(currentMonth, i));
      const monthEnd = endOfMonth(subMonths(currentMonth, i));

      const count = await Invoice.countDocuments({
        createdAt: { $gte: monthStart, $lte: monthEnd },
      });

      monthlyCounts.push({
        month: format(monthStart, "yyyy-MM"),
        invoices: count,
      });
    }

    res.status(200).json({ success: true, data: monthlyCounts });
  } catch (error) {
    console.error("Invoice summary error:", error);
    res.status(500).json({ success: false, message: "Failed to get invoice summary" });
  }
}
