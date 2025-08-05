

// import dbConnect from "../../../utils/dbconnect";
// import Invoice from "../../../models/sales/invoice";
// // If you already have a Bill / Expense model, import it here in the same way, e.g.:
// // import Bill from "../../../models/purchase/bill";

// /**
//  * Build a YYYY‑MM key, e.g. "2025‑04"
//  */
// function monthKey(date) {
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
// }

// /**
//  * Convert a filter string (currentFY | lastFY | last12Months) ➜ { start, end }
//  *
//  * Financial Year = 01 Apr – 31 Mar (India)
//  */
// function getDateRange(filter) {
//   const today = new Date();
//   const thisFYStartYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;

//   let start, end;
//   switch (filter) {
//     case "lastFY": {
//       start = new Date(thisFYStartYear - 1, 3, 1, 0, 0, 0, 0);          // 1 Apr of previous FY
//       end   = new Date(thisFYStartYear, 2, 31, 23, 59, 59, 999);        // 31 Mar of previous FY
//       break;
//     }
//     case "last12Months": {
//       end   = new Date(today.getFullYear(), today.getMonth(), 31, 23, 59, 59, 999);
//       start = new Date(end);
//       start.setMonth(start.getMonth() - 11);                            // include current month
//       start.setDate(1);
//       break;
//     }
//     case "currentFY":
//     default: {
//       start = new Date(thisFYStartYear, 3, 1, 0, 0, 0, 0);              // 1 Apr current FY
//       end   = new Date(thisFYStartYear + 1, 2, 31, 23, 59, 59, 999);    // 31 Mar current FY
//       break;
//     }
//   }
//   return { start, end };
// }

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ success: false, message: "Method Not Allowed" });
//   }

//   try {
//     await dbConnect();

//     /* --------------------------------------------------------------
//      * 0️⃣  Determine date range based on query
//      * ------------------------------------------------------------*/
//     const { range = "currentFY" } = req.query; // accepted: currentFY | lastFY | last12Months
//     const { start: periodStart, end: periodEnd } = getDateRange(range);
//     const today = new Date();

//     /* --------------------------------------------------------------
//      * 1️⃣  RECEIVABLES (Unpaid Invoices)
//      * ------------------------------------------------------------*/
//     const unpaidInvoices = await Invoice.find(
//       { balanceDue: { $gt: 0 } },
//       "balanceDue dueDate"
//     );

//     // let recTotal = 0,
//     //   recCurrent = 0,
//     //   recOverdue = 0;

//     let recTotal = 0,
//   recCurrent = 0,
//   recOverdue = 0,
//   recReceived = 0;
// const allInvoices = await Invoice.find({}, "amountPaid");
// allInvoices.forEach((inv) => {
//   recReceived += inv.amountPaid;
// });

//     unpaidInvoices.forEach((inv) => {
//       recTotal += inv.balanceDue;
//       if (inv.dueDate && inv.dueDate < today) {
//         recOverdue += inv.balanceDue;
//       } else {
//         recCurrent += inv.balanceDue;
//       }
//     });

//     /* --------------------------------------------------------------
//      * 2️⃣  PAYABLES (Unpaid Bills) – placeholders until Bill model added
//      * ------------------------------------------------------------*/
//     let payTotal = 0,
//       payCurrent = 0,
//       payOverdue = 0;
//     // TODO: Replace with real Bill aggregation once Bill model is created.

//     /* --------------------------------------------------------------
//      * 3️⃣  CASH FLOW – Payments in selected period
//      * ------------------------------------------------------------*/
//     // Incoming  : payments on invoices
//     // Outgoing  : payments on bills (once implemented)

//     const invoicesInPeriod = await Invoice.find(
//       { "payments.date": { $gte: periodStart, $lte: periodEnd } },
//       "payments"
//     );

//     const incomingPayments = invoicesInPeriod
//       .flatMap((inv) => inv.payments)
//       .filter((p) => p.date >= periodStart && p.date <= periodEnd);

//     let incomingTotal = 0;
//     const incomingByMonth = {};
//     incomingPayments.forEach((p) => {
//       incomingTotal += p.amount;
//       const k = monthKey(p.date);
//       incomingByMonth[k] = (incomingByMonth[k] || 0) + p.amount;
//     });

//     // --- Outgoing placeholder (replace once Bill model ready) ---
//     let outgoingTotal = 0;
//     const outgoingByMonth = {};

//     /* --------------------------------------------------------------
//      * 4️⃣  INCOME vs EXPENSE (Invoice totals vs Bill totals)
//      * ------------------------------------------------------------*/
//     const invoicesTotals = await Invoice.find(
//       { invoiceDate: { $gte: periodStart, $lte: periodEnd } },
//       "total invoiceDate"
//     );

//     let incomeTotal = 0;
//     const incomeByMonth = {};
//     invoicesTotals.forEach((inv) => {
//       incomeTotal += inv.total;
//       const k = monthKey(inv.invoiceDate || periodStart);
//       incomeByMonth[k] = (incomeByMonth[k] || 0) + inv.total;
//     });

//     // Expense placeholder (replace with Bill totals)
//     let expenseTotal = 0;
//     const expenseByMonth = {};

//     /* -----------------------u-----------------------------------
//      * 5️⃣  Build month list between periodStart & periodEnd (inclusive)
//      * ------------------------------------------------------------*/
//     const months = [];
//     const mStart = new Date(periodStart.getFullYear(), periodStart.getMonth(), 1);
//     const mEnd   = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1);
//     for (let d = new Date(mStart); d <= mEnd; d.setMonth(d.getMonth() + 1)) {
//       months.push(monthKey(d));
//     }

//     const cashFlowMonthly = months.map((m) => ({
//       month: m,
//       incoming: incomingByMonth[m] || 0,
//       outgoing: outgoingByMonth[m] || 0,
//     }));

//     const ieMonthly = months.map((m) => ({
//       month: m,
//       income: incomeByMonth[m] || 0,
//       expense: expenseByMonth[m] || 0,
//     }));

//     /* --------------------------------------------------------------
//      * 6️⃣  Compose response
//      * ------------------------------------------------------------*/
//     return res.status(200).json({
//       success: true,
//       data: {
//         range,
//         period: { start: periodStart, end: periodEnd },
//         receivables: { total: recTotal, current: recCurrent, overdue: recOverdue },
        
//         payables: { total: payTotal, current: payCurrent, overdue: payOverdue },
//         cashFlow: {
//           opening: 0, // adjust if you track opening balance
//           incoming: incomingTotal,
//           outgoing: outgoingTotal,
//           closing: 0 + incomingTotal - outgoingTotal,
//           monthly: cashFlowMonthly,
//         },
//         incomeExpense: {
//           totalIncome: incomeTotal,
//           totalExpense: expenseTotal,
//           monthly: ieMonthly,
//         },
//       },
//     });
//   } catch (err) {
//     console.error("/api/dashboard/summary error", err);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// }





import dbConnect from "../../../utils/dbConnect";
import Invoice from "../../../models/sales/Invoice";
// import Bill from "../../../models/purchase/bill"; // Uncomment when ready

// Build a YYYY-MM key (e.g., "2025-04")
function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// Convert filter string ➜ { start, end } (FY: 1 Apr – 31 Mar)
function getDateRange(filter) {
  const today = new Date();
  const thisFYStartYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;

  let start, end;
  switch (filter) {
    case "lastFY":
      start = new Date(thisFYStartYear - 1, 3, 1);
      end = new Date(thisFYStartYear, 2, 31, 23, 59, 59, 999);
      break;

    case "last12Months":
      end = new Date(today.getFullYear(), today.getMonth(), 31, 23, 59, 59, 999);
      start = new Date(end);
      start.setMonth(start.getMonth() - 11);
      start.setDate(1);
      break;

    case "currentFY":
    default:
      start = new Date(thisFYStartYear, 3, 1);
      end = new Date(thisFYStartYear + 1, 2, 31, 23, 59, 59, 999);
      break;
  }

  return { start, end };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { range = "currentFY" } = req.query;
    const { start: periodStart, end: periodEnd } = getDateRange(range);
    const today = new Date();

    /* 1️⃣ RECEIVABLES */
    const unpaidInvoices = await Invoice.find(
      { balanceDue: { $gt: 0 } },
      "balanceDue dueDate"
    );

    let recTotal = 0,
      recCurrent = 0,
      recOverdue = 0,
      recReceived = 0;

    const allInvoices = await Invoice.find({}, "amountPaid");
    allInvoices.forEach((inv) => {
      recReceived += inv.amountPaid;
    });

    unpaidInvoices.forEach((inv) => {
      recTotal += inv.balanceDue;
      if (inv.dueDate && inv.dueDate < today) {
        recOverdue += inv.balanceDue;
      } else {
        recCurrent += inv.balanceDue;
      }
    });

    /* 2️⃣ PAYABLES – Placeholder */
    let payTotal = 0,
      payCurrent = 0,
      payOverdue = 0;

    // TODO: Replace with Bill model logic when available

    /* 3️⃣ CASH FLOW */
    const invoicesInPeriod = await Invoice.find(
      { "payments.date": { $gte: periodStart, $lte: periodEnd } },
      "payments"
    );

    const incomingPayments = invoicesInPeriod
      .flatMap((inv) => inv.payments)
      .filter((p) => p.date >= periodStart && p.date <= periodEnd);

    let incomingTotal = 0;
    const incomingByMonth = {};
    incomingPayments.forEach((p) => {
      incomingTotal += p.amount;
      const k = monthKey(p.date);
      incomingByMonth[k] = (incomingByMonth[k] || 0) + p.amount;
    });

    // Outgoing placeholder
    let outgoingTotal = 0;
    const outgoingByMonth = {};

    /* 4️⃣ INCOME vs EXPENSE */
    const invoicesTotals = await Invoice.find(
      { invoiceDate: { $gte: periodStart, $lte: periodEnd } },
      "total invoiceDate"
    );

    let incomeTotal = 0;
    const incomeByMonth = {};
    invoicesTotals.forEach((inv) => {
      incomeTotal += inv.total;
      const k = monthKey(inv.invoiceDate || periodStart);
      incomeByMonth[k] = (incomeByMonth[k] || 0) + inv.total;
    });

    let expenseTotal = 0;
    const expenseByMonth = {};

    /* 5️⃣ MONTH LIST */
    const months = [];
    const mStart = new Date(periodStart.getFullYear(), periodStart.getMonth(), 1);
    const mEnd = new Date(periodEnd.getFullYear(), periodEnd.getMonth(), 1);
    for (let d = new Date(mStart); d <= mEnd; d.setMonth(d.getMonth() + 1)) {
      months.push(monthKey(d));
    }

    const cashFlowMonthly = months.map((m) => ({
      month: m,
      incoming: incomingByMonth[m] || 0,
      outgoing: outgoingByMonth[m] || 0,
    }));

    const ieMonthly = months.map((m) => ({
      month: m,
      income: incomeByMonth[m] || 0,
      expense: expenseByMonth[m] || 0,
    }));

    /* 6️⃣ RESPONSE */
    return res.status(200).json({
      success: true,
      data: {
        range,
        period: { start: periodStart, end: periodEnd },
        receivables: {
          total: recTotal,
          current: recCurrent,
          overdue: recOverdue,
          received: recReceived,
        },
        payables: {
          total: payTotal,
          current: payCurrent,
          overdue: payOverdue,
        },
        cashFlow: {
          opening: 0,
          incoming: incomingTotal,
          outgoing: outgoingTotal,
          closing: 0 + incomingTotal - outgoingTotal,
          monthly: cashFlowMonthly,
        },
        incomeExpense: {
          totalIncome: incomeTotal,
          totalExpense: expenseTotal,
          monthly: ieMonthly,
        },
      },
    });
  } catch (err) {
    console.error("/api/dashboard/summary error", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}
