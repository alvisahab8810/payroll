// pages/api/reports/sales-summary.js
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "@/utils/dbConnect";
import Query from "@/models/Query";
import Contact from "@/models/Contact";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  /* ─ 1. Auth ─────────────────────────────────────── */
  const token = await getToken({ req, secret });
  const userIdStr = token?.id || token?.sub;
  if (!userIdStr || token.role !== "salesperson") {
    return res.status(401).json({ message: "Not authorised" });
  }
  const userId = new mongoose.Types.ObjectId(userIdStr); // ← cast

  await dbConnect();

  /* ─ 2. Shared pipeline ──────────────────────────── */
  const pipeline = [
    { $match: { salespersonId: userId } },
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
  ];

  const groupStage = {
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
  };

  /* ─ 3. Aggregate Query + Contact ────────────────── */
  const agg = await Query.aggregate([
    ...pipeline,
    groupStage,
    {
      $unionWith: {
        coll: "contacts",
        pipeline: [...pipeline, groupStage],
      },
    },
    {
      // merge the two results
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

  /* ─ 4. Disable cache so browser always gets fresh numbers ─ */
  res.setHeader("Cache-Control", "no-store");

  return res.status(200).json(stats);
}
