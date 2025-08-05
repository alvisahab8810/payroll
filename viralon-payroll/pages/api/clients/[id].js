import dbConnect from '../../../utils/dbConnect';
import Customer from "../../../models/sales/Customer"; // ✅ Use Customer, not Client

export default async function handler(req, res) {
  await dbConnect();

  try {
    const customer = await Customer.findById(req.query.id); // ✅ Use Customer here
    if (!customer) return res.status(404).json({ message: 'Not Found' });

    res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}
