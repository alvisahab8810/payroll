import dbConnect from "../../../../utils/dbConnect";
import Invoice from "../../../../models/sales/Invoice";

import puppeteer from "puppeteer";

// In-memory PDF store (for dev only)
const pdfStore = global.pdfStore || new Map(  );
global.pdfStore = pdfStore;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed." });
  }

  await dbConnect();

  try {
    const {
      customerId,
      invoiceNumber,
      referenceNumber,
      invoiceDate,
      dueDate,
      subject,
      items,
      subtotal,
      discount,
      gst,
      adjustment,
      total,
      customerNotes,
      terms,
      attachedFiles,
      customerEmail,
      sacCode,
      previewHTML,
    } = req.body;

    console.log("Received invoice creation request with data:");
    console.log("customerId:", customerId);
    console.log("invoiceNumber:", invoiceNumber);
    console.log("invoiceDate:", invoiceDate, "| typeof:", typeof invoiceDate);
    console.log("items:", items);
    console.log("total:", total);

    // Parse numeric fields safely
    const parsedTotal = parseFloat(total);
    const parsedSubtotal = parseFloat(subtotal);
    const parsedDiscount = parseFloat(discount);
    const parsedGst = parseFloat(gst);
    const parsedAdjustment = parseFloat(adjustment);

    // Clean and validate items
    const parsedItems = Array.isArray(items)
      ? items.map((i) => ({
          item: i.item?.trim(),
          quantity: Number(i.quantity),
          rate: Number(i.rate),
          amount: Number(i.amount),
        }))
      : [];

    const isInvalidInvoiceDate = !invoiceDate || typeof invoiceDate !== "string" || invoiceDate.trim() === "";
    const hasInvalidItems = parsedItems.length === 0 || parsedItems.some(
      (i) => !i.item || i.quantity <= 0 || i.rate < 0 || i.amount < 0
    );

    if (
      !customerId ||
      !invoiceNumber ||
      isInvalidInvoiceDate ||
      hasInvalidItems ||
      isNaN(parsedTotal) ||
      parsedTotal <= 0
    ) {
      console.log("❌ Validation failed. Payload:", req.body);
      return res.status(400).json({
        success: false,
        error: "Missing or invalid required invoice fields.",
      });
    }

    const newInvoice = new Invoice({
      customerId,
      invoiceNumber,
      referenceNumber,
      invoiceDate: new Date(invoiceDate),
      dueDate: dueDate ? new Date(dueDate) : null,
      subject,
      items: parsedItems,
      subtotal: parsedSubtotal,
      discount: parsedDiscount,
      gst: parsedGst,
      adjustment: parsedAdjustment,
      total: parsedTotal,
      customerNotes,
      terms,
      attachedFiles,
      customerEmail,
       sacCode, // 👈 Store here
       previewHTML, // 👈 Save the HTML
    });

    await newInvoice.save();

    // Generate PDF
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(previewHTML, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "10px", right: "10px" },
    });

    await browser.close();

    const invoiceId = newInvoice._id.toString();
    pdfStore.set(invoiceId, pdfBuffer);

    res.status(201).json({
      success: true,
      invoice: newInvoice,
      pdfId: invoiceId,
    });
  } catch (error) {
    console.error("Invoice Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
