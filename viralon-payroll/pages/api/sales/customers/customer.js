
import dbConnect from "../../../../utils/dbConnect";
import Customer from "../../../../models/sales/Customer";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const customer = new Customer(req.body);
      await customer.save();
      res.status(201).json({ success: true, customer });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  // ✅ Add GET method to return selected fields
  else if (req.method === "GET") {
    try {
      const customers = await Customer.find(
        {},
        {
          customerType: 1,
          salutation: 1,
          firstName: 1,
          lastName: 1,
          companyName: 1,
          email: 1,
          mobile: 1,
          billingAddress: 1,
          pan: 1, // ✅ add this
          gst: 1, // ✅ add this

          documents: 1, // ✅ optionally add this if needed later
        }
      );

      res.status(200).json({ success: true, data: customers });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
