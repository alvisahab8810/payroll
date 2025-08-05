// // pages/api/sales/customers/customer.js

// import Customer from "@/models/Customer";
// import dbConnect from "@/utils/dbConnect";

// export default async function handler(req, res) {
//   await dbConnect();

//   if (req.method === "GET") {
//     try {
//       const customers = await Customer.find({}, {
//           customerType: 1,
//         salutation: 1,
//         firstName: 1,
//         lastName: 1,
//         companyName: 1,
//         email: 1,
//         mobile: 1,
//       });

//       res.status(200).json({ success: true, data: customers });
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//       res.status(500).json({ success: false, message: "Error fetching customers" });
//     }
//   } else {
//     res.status(405).json({ success: false, message: "Method Not Allowed" });
//   }
// }
