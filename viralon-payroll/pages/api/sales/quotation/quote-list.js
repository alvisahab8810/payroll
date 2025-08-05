// import dbConnect from "../../../../utils/dbconnect";
// import Quotation from "../../../../models/sales/Quotation";
// import Customer from "../../../../models/sales/Customer";  // <-- import Customer model here

// export default async function handler(req, res) {
//   if (req.method !== "GET") return res.status(405).send({ message: "Only GET allowed" });

//   await dbConnect();

//   try {
//     const quotations = await Quotation.find()
//       .populate("customerId")  // populate customer details
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, data: quotations });
//   } catch (error) {
//     console.error("Failed to fetch quotes:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// }



import dbConnect from "../../../../utils/dbConnect";
import Quotation from "../../../../models/sales/Quotation";
import Customer from "../../../../models/sales/Customer"; // ✅ import Customer model

export default async function handler(req, res) {
  await dbConnect();

  try {
    const quotations = await Quotation.find()
      .populate("customerId") // ✅ populate customer info
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: quotations });
  } catch (error) {
    console.error("Error fetching quotations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
