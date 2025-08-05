// pages/api/salesperson/[id]/profile.js
import dbConnect from "../../../../utils/dbConnect";
import User from "../../../../models/User";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    // fetch profile (no password!)
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  }

  if (req.method === "PUT") {
    // simple auth check ‑ you can replace with real middleware
    const isSelf = req.headers["x-user-id"] === id;   // TEMPORARY
    if (!isSelf) return res.status(401).json({ message: "Not allowed" });

    const { name, phone, about, avatarUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, phone, about, avatarUrl },
      { new: true, runValidators: true }
    ).select("-password");
    return res.json(user);
  }

  res.status(405).end(); // Method Not Allowed
}
