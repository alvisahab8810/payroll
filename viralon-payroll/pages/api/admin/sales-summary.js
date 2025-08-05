// // pages/api/admin/sales-summary.js
// import { getToken } from "next-auth/jwt";
// import mongoose from "mongoose";
// import dbConnect from "@/utils/dbConnect";
// import Query from "@/models/Query";
// import Contact from "@/models/Contact";

// const secret = process.env.NEXTAUTH_SECRET;

// export default async function handler(req, res) {
//   const token = await getToken({ req, secret });
//   if (!token || token.role !== "admin") {
//     return res.status(403).json({ message: "Forbidden" });
//   }

//   const idStr = req.query.salesperson;
//   if (!idStr) return res.status(400).json({ message: "salesperson param required" });

//   const salespersonId = new mongoose.Types.ObjectId(idStr);
//   await dbConnect();

//   const pipeline = [
//     { $match: { salespersonId } },
//     /* $addFields + $convert as in your working route … */,
//     /* $group stage identical */
//   ];

//   const agg = await Query.aggregate([
//     ...pipeline,
//     { $unionWith: { coll: "contacts", pipeline } },
//     { $group: { _id: null, total: { $sum: "$total" }, closed: { $sum: "$closed" }, won: { $sum: "$won" }, lost: { $sum: "$lost" }, hot: { $sum: "$hot" }, warm: { $sum: "$warm" }, cold: { $sum: "$cold" } } },
//   ]);

//   return res.status(200).json(agg[0] || {});
// }

// pages/api/admin/sales-summary.js
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "../../../utils/dbConnect.js"; // relative path
import Query from "../../../models/Query.js";
import Contact from "../../../models/Contact.js";
import User from "../../../models/User.js";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  /* ── 1. Auth (NextAuth admin OR legacy cookie) ───────────────── */
  const token = await getToken({ req, secret });
  const legacy = (req.headers.cookie || "").includes("admin_auth=true");
  if (!(token?.role === "admin" || legacy)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  /* ── 2. Validate salesperson id param ────────────────────────── */
  const idStr = req.query.salesperson;
  if (!idStr) {
    return res.status(400).json({ message: "salesperson param required" });
  }
  const salespersonId = new mongoose.Types.ObjectId(idStr);

  await dbConnect();

  /* ── 3. Shared pipeline (identical to your working one) ──────── */
  const pipeline = [
    { $match: { salespersonId } },
    {
      $addFields: {
        status: {
          $convert: {
            input: { $getField: { field: "Status", input: "$customFields" } },
            to: "string",
          },
        },
        final: {
          $convert: {
            input: {
              $getField: { field: "Final status", input: "$customFields" },
            },
            to: "string",
          },
        },
        leadLvl: {
          $convert: {
            input: {
              $getField: { field: "Lead Level", input: "$customFields" },
            },
            to: "string",
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        closed: { $sum: { $cond: [{ $eq: ["$final", "Closed"] }, 1, 0] } },
        won: { $sum: { $cond: [{ $eq: ["$status", "Won"] }, 1, 0] } },
        lost: { $sum: { $cond: [{ $eq: ["$status", "Lost"] }, 1, 0] } },
        hot: { $sum: { $cond: [{ $eq: ["$leadLvl", "Hot"] }, 1, 0] } },
        warm: { $sum: { $cond: [{ $eq: ["$leadLvl", "Warm"] }, 1, 0] } },
        cold: { $sum: { $cond: [{ $eq: ["$leadLvl", "Cold"] }, 1, 0] } },
      },
    },
  ];

  /* ── 4. Aggregate Query + Contact then merge totals ─────────── */
  const agg = await Query.aggregate([
    ...pipeline,
    {
      $unionWith: {
        coll: "contacts",
        pipeline,
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$total" },
        closed: { $sum: "$closed" },
        won: { $sum: "$won" },
        lost: { $sum: "$lost" },
        hot: { $sum: "$hot" },
        warm: { $sum: "$warm" },
        cold: { $sum: "$cold" },
      },
    },
  ]);

  const stats = agg[0] || {
    total: 0,
    closed: 0,
    won: 0,
    lost: 0,
    hot: 0,
    warm: 0,
    cold: 0,
  };

  /* ── 5. Attach salesperson name for the UI ───────────────────── */
  const user = await User.findById(salespersonId).select("name");
  stats.name = user ? user.name : "Unknown";

  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json(stats);
}
