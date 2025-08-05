import dbConnect from "../../../../utils/dbConnect";
import Customer from "../../../../models/sales/Customer";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "DELETE") {
    const { id } = req.query;

    try {
      const deletedCustomer = await Customer.findByIdAndDelete(id);
      if (!deletedCustomer) {
        return res.status(404).json({ success: false, error: "Customer not found." });
      }

      return res.status(200).json({ success: true, message: "Customer deleted." });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed." });
  }
}
