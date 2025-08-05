// /api/payments/receive.js

import dbConnect from "../../../utils/dbConnect";
import Invoice from "../../../models/sales/Invoice";

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

//   const { invoiceId, amount, method, note } = req.body;

//   try {
//     await dbConnect();

//     const invoice = await Invoice.findById(invoiceId);
//     if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

//     // Add payment record
//     invoice.payments.push({ amount, method, note });

//     // Update paid and due amounts
//     invoice.amountPaid += amount;
//     invoice.balanceDue = invoice.total - invoice.amountPaid;

//     // Set payment status
//     if (invoice.amountPaid >= invoice.total) {
//       invoice.paymentStatus = 'Paid';
//     } else if (invoice.amountPaid > 0) {
//       invoice.paymentStatus = 'Partially Paid';
//     }

//     await invoice.save();

//     res.status(200).json({ message: 'Payment recorded', invoice });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// }


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { invoiceId, amount, method, note } = req.body;

  try {
    await dbConnect();

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Add new payment
    invoice.payments.push({
      amount,
      method,
      note,
      date: new Date(),
    });

    // Update amounts
    invoice.amountPaid += amount;
    invoice.balanceDue = invoice.total - invoice.amountPaid;

    // Update payment status
    if (invoice.amountPaid >= invoice.total) {
      invoice.paymentStatus = "Paid";
      invoice.balanceDue = 0;
    } else if (invoice.amountPaid > 0) {
      invoice.paymentStatus = "Partially Paid";
    } else {
      invoice.paymentStatus = "Unpaid";
    }

    await invoice.save();

    res.status(200).json({ message: "Payment recorded successfully" });
  } catch (error) {
    console.error("Payment record error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
