import dbConnect from "../../../../utils/dbConnect";
import Contact from "../../../../models/Contact";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, message: "No ID provided" });
      }

      await Contact.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "Contact deleted" });
    } catch (error) {
      console.error("Error deleting contact:", error);
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
