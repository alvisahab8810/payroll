import dbConnect from '../../../utils/dbConnect';

import Customer from "../../../models/sales/Customer";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, businessName } = req.body;

    const newClient = await Customer.create({

      name,
      email,
      phone,
      businessName,
    });

    res.status(201).json({ clientId: newClient._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating client' });
  }
}
