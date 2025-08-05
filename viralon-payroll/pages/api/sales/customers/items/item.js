import dbConnect from "../../../../../utils/dbConnect";
import Items from "../../../../../models/sales/Items";

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  if (method === "GET") {
    const items = await Items.find().sort({ _id: -1 }); // newest first
    return res.status(200).json(items);
  }

  if (method === "POST") {
    const newItem = new Items(req.body);
    const savedItem = await newItem.save();
    return res.status(201).json(savedItem);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${method} Not Allowed`);
}
