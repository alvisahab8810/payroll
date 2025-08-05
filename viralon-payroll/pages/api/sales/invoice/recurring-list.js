// /pages/api/sales/invoice/recurring-list.js

import dbConnect from "@/utils/dbConnect";
import RecurringInvoice from "@/models/sales/recurringInvoice";
import Customer from "@/models/sales/customer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    await dbConnect();

    const invoices = await RecurringInvoice.find()
      .populate("customerId", "firstName lastName") // ✅ Correct field names
      .sort({ invoiceDate: -1 });

    const formatted = invoices.map((inv) => {
      const nextDate = calculateNextInvoiceDate(inv.invoiceDate, inv.recurringType, inv.repeatEvery);

      // ✅ Combine firstName + lastName
      const fullName = inv.customerId
        ? `${inv.customerId.firstName || ""} ${inv.customerId.lastName || ""}`.trim()
        : "N/A";

      return {
        _id: inv._id,
        customerName: fullName,
        frequency: inv.recurringType,
        lastInvoiceDate: formatDate(inv.invoiceDate),
        nextInvoiceDate: formatDate(nextDate),
        status: "Active",
        amount: inv.total,
      };
    });

    res.status(200).json({ success: true, data: formatted });
  } catch (err) {
    console.error("Error fetching recurring invoices:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

function formatDate(date) {
  if (!date) return "—";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB"); // Format: DD/MM/YYYY
}

function calculateNextInvoiceDate(startDate, type, repeatEvery) {
  const date = new Date(startDate);
  switch (type) {
    case "daily":
      date.setDate(date.getDate() + repeatEvery);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7 * repeatEvery);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + repeatEvery);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + repeatEvery);
      break;
  }
  return date;
}
