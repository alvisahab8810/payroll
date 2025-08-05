

import dbConnect from "../../../../../utils/dbConnect";
import Items from "../../../../../models/sales/Items";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const deletedItem = await Items.findByIdAndDelete(id);

      if (!deletedItem) {
        return res.status(404).json({ success: false, message: "Item not found" });
      }

      res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error deleting item", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
