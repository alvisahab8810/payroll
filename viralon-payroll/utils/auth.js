import jwt from "jsonwebtoken";
import Employee from "@/models/payroll/Employee";
import dbConnect from "@/utils/dbConnect";

export async function getEmployeeFromToken(req) {
  await dbConnect();

  const token = req.cookies?.employee_auth;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
    const employee = await Employee.findById(decoded.id).lean();
    return employee || null;
  } catch (err) {
    console.error("Invalid employee token:", err);
    return null;
  }
}
 