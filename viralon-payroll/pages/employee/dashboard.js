// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import Head from "next/head";
// import EmployeeAttendanceSummary from "../../components/EmployeeAttendanceSummary";
// import { FaClock, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
// import { toast } from "react-toastify";
// import Link from "next/link";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import MySalarySlips from "../../components/SalarySlip";
// import { getSocket } from "@/utils/socket";
// import { io } from "socket.io-client";
// export default function EmployeeDashboard() {
//   const [employee, setEmployee] = useState(null);
//   const [attendance, setAttendance] = useState(null);
//   const [punchElapsed, setPunchElapsed] = useState(""); // live timer for active punch
//   const [elapsed, setElapsed] = useState("");
//   const [activeTab, setActiveTab] = useState("home");
//   const router = useRouter();
//   const [showAccount, setShowAccount] = useState(false);

//   const [holidays, setHolidays] = useState([]);
//   const [loadingHolidays, setLoadingHolidays] = useState(true);
//   const [error, setError] = useState("");

//   // for leave----------------------

//   const [leaveBalance, setLeaveBalance] = useState({ emergency: 0, sick: 0 });
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [showLeaveForm, setShowLeaveForm] = useState(false);
//   const [leaveType, setLeaveType] = useState("");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [reason, setReason] = useState("");
//   const [lunchWarning, setLunchWarning] = useState(false);

// useEffect(() => {
//   if (!employee || !employee._id) return;

//   const socket = io({ path: "/api/socket" });

//   socket.on("connect", () => {
//     socket.emit("employee:identify", {
//       employeeId: employee._id,
//       name: `${employee.firstName} ${employee.lastName}`,
//     });
//   });

//   // Track clicks
//   let clickCount = 0;
//   const handleClick = () => {
//     clickCount++;
//   };
//   document.addEventListener("click", handleClick);

//   // Send heartbeat with extra data every 10s
//   const interval = setInterval(() => {
//     socket.emit("employee:heartbeat", {
//       employeeId: employee._id,
//       browser: navigator.userAgent,
//       url: window.location.href,
//       clicks: clickCount,
//     });
//   }, 10000);

//   return () => {
//     clearInterval(interval);
//     document.removeEventListener("click", handleClick);
//     socket.disconnect();
//   };
// }, [employee]);

//   // get leave status---------------

//   // derive active punch
//   const isActive =
//     attendance?.activePunch ||
//     (attendance?.punches?.length &&
//       !attendance.punches[attendance.punches.length - 1].out);

//   // worked so far (live add time if active)
//   const workedMinutesSoFar = (() => {
//     if (!attendance) return 0;
//     let total = attendance.totalWorkedMinutes || 0;
//     if (isActive) {
//       const last = attendance.punches[attendance.punches.length - 1];
//       const now = Date.now();
//       total += Math.floor((now - new Date(last.in)) / 60000);
//     }
//     return total;
//   })();

//   const workedDisplay = (() => {
//     const h = Math.floor(workedMinutesSoFar / 60);
//     const m = workedMinutesSoFar % 60;
//     return `${h}h ${m}m`;
//   })();

//   let timerRef = null;

//   const startElapsedTimer = (startTime) => {
//     clearInterval(timerRef);
//     const start = new Date(startTime);
//     timerRef = setInterval(() => {
//       const now = new Date();
//       const diff = Math.floor((now - start) / 1000); // in seconds
//       const h = Math.floor(diff / 3600);
//       const m = Math.floor((diff % 3600) / 60);
//       const s = diff % 60;
//       setPunchElapsed(`${h}h ${m}m ${s}s`);
//     }, 1000);
//   };

//   useEffect(() => {
//     const punches = attendance?.punches || [];
//     const last = punches[punches.length - 1];
//     if (last && last.in && !last.out) {
//       startElapsedTimer(last.in); // Resume timer on page load
//     } else {
//       clearInterval(timerRef);
//       setPunchElapsed("");
//     }
//   }, [attendance]);

//   const generatePDF = async (slipId) => {
//     const res = await fetch("/api/payroll/salary-slip/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ slipId }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       window.open(data.pdfUrl, "_blank"); // Open PDF in new tab
//     } else {
//       alert(data.message);
//     }
//   };

//   useEffect(() => {
//     const fetchMe = async () => {
//       const res = await fetch("/api/payroll/me");
//       const data = await res.json();
//       if (!data.success) {
//         router.push("/employee/login");
//       } else {
//         setEmployee(data.employee);
//         fetchTodayAttendance();
//       }
//     };
//     fetchMe();
//   }, []);

//   const fetchTodayAttendance = async () => {
//     try {
//       const res = await fetch("/api/payroll/attendance/today");
//       const data = await res.json();

//       if (data.success) {
//         setAttendance(data.attendance);

//         // ✅ Check if lunch break exceeded and show warning
//         if (data.attendance?.lunchBreakExceeded) {
//           setLunchWarning(true); // Make sure you have useState for lunchWarning
//         } else {
//           setLunchWarning(false);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching today's attendance:", error);
//     }
//   };

//   useEffect(() => {
//     if (!attendance) return;
//     const punches = attendance.punches || [];
//     const last = punches[punches.length - 1];
//     if (!last || last.out) return; // no open punch
//     const start = new Date(last.in);

//     const interval = setInterval(() => {
//       const diff = Math.floor((Date.now() - start.getTime()) / 1000);
//       const h = Math.floor(diff / 3600);
//       const m = Math.floor((diff % 3600) / 60);
//       const s = diff % 60;
//       setPunchElapsed(`${h}h ${m}m ${s}s`);
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [attendance]);

//   const handleLogin = async () => {
//     if (!navigator.geolocation) {
//       toast.error("Your browser does not support location.");
//       return;
//     }
//     navigator.geolocation.getCurrentPosition(
//       async ({ coords }) => {
//         const res = await fetch("/api/payroll/attendance/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             latitude: coords.latitude,
//             longitude: coords.longitude,
//           }),
//         });
//         const data = await res.json();
//         if (data.success) {
//           setAttendance(data.attendance); // <-- full doc
//           const p = data.attendance.punches;
//           const last = p[p.length - 1];
//           if (last?.in && !last.out) startElapsedTimer(last.in); // instant timer
//           toast.success("Checked in!");
//         } else {
//           toast.error(data.message || "Check-in failed.");
//         }
//       },
//       () => toast.error("Please allow location access to log in.")
//     );
//   };

//   const handleLogout = async (endOfDay = false) => {
//     const res = await fetch("/api/payroll/attendance/logout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ endOfDay }),
//     });
//     const data = await res.json();
//     if (data.success) {
//       setAttendance(data.attendance); // full doc after checkout
//       clearTimer();
//       setPunchElapsed("");
//       if (data.attendance.lunchBreakExceeded) {
//         toast.warn(
//           "Lunch break limit exceeded. Payable hours may be impacted."
//         );
//       } else {
//         toast.success("Checked out.");
//       }
//     } else {
//       toast.error(data.message || "Check-out failed.");
//     }
//   };

//   const getInitials = () => {
//     if (!employee) return "";
//     return `${employee.firstName[0] || ""}${employee.lastName[0] || ""}`.toUpperCase();
//   };

//   // 1️⃣ Move fetchLeaveData OUTSIDE useEffect so it's globally callable
//   const fetchLeaveData = async () => {
//     try {
//       const res = await fetch(
//         `/api/payroll/leave/get?employeeId=${employee._id}`
//       );
//       const data = await res.json();
//       if (data.success) {
//         setLeaveRequests(data.data);

//         // Calculate balances
//         const used = { personal: 0, sick: 0 };
//         data.data.forEach((req) => {
//           if (req.status === "Approved") {
//             const days =
//               (new Date(req.to) - new Date(req.from)) / (1000 * 60 * 60 * 24) +
//               1;
//             if (req.type === "Personal") used.personal += days;
//             if (req.type === "Sick") used.sick += days;
//           }
//         });

//         // Assuming total 10 days each
//         setLeaveBalance({
//           personal: Math.max(10 - used.personal, 0), // Example: 10 days
//           sick: Math.max(10 - used.sick, 0),
//         });
//       }
//     } catch (err) {
//       console.error("Leave data fetch failed", err);
//     }
//   };

//   // 2️⃣ Call it inside useEffect when page loads
//   useEffect(() => {
//     if (employee?._id) fetchLeaveData();
//   }, [employee]);

//   // 3️⃣ Call it again after applying leave
//   const handleSubmitLeave = async () => {
//     const res = await fetch("/api/payroll/leave/apply", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         type: leaveType,
//         from,
//         to,
//         reason,
//         employeeId: employee._id,
//       }),
//     });

//     const data = await res.json();

//     if (data.success) {
//       setShowLeaveForm(false);
//       fetchLeaveData(); // ✅ update table and balance

//       toast.success("Leave request submitted successfully!");
//     } else {
//       toast.error(`❌ ${data.message || "Failed to apply leave."}`);
//     }
//   };

//   const fetchHolidays = async () => {
//     try {
//       setLoadingHolidays(true);
//       const res = await fetch("/api/payroll/holidays/upcoming");
//       const data = await res.json();

//       if (data.success) {
//         setHolidays(data.data);
//       } else {
//         setError("Failed to load holidays.");
//       }
//     } catch (err) {
//       console.error("Error fetching holidays:", err);
//       setError("Something went wrong while fetching holidays.");
//     } finally {
//       setLoadingHolidays(false);
//     }
//   };

//   useEffect(() => {
//     fetchHolidays();
//   }, []);

//   if (!employee) return <div>Loading...</div>;

//   return (
//     <div className="emp-dashboard">
//       <Head>
//         {/* <link rel="stylesheet" href="/asets/css/bootstrap.min.css" /> */}
//         <link rel="stylesheet" href="/asets/css/admin.css" />
//         <title>Employee Dashboard</title>
//       </Head>

//       <div
//         className="d-flex"
//         style={{ minHeight: "100vh", background: "#f9f9fb" }}
//       >

//         {/* Sidebar */}
//         <div className="bg-dark text-white p-3" style={{ width: 260 }}>
//           <div className="text-center mb-4">
//             <div
//               className="bg-white rounded-circle overflow-hidden d-flex align-items-center justify-content-center mx-auto mb-2"
//               style={{
//                 width: 80,
//                 height: 80,
//                 color: "black", // should be in quotes
//                 fontWeight: "bold", // should be in quotes
//                 fontSize: "30px", // "30px" as string or 30 as number
//               }}
//             >
//               {employee?.profileImage ? (
//                 <img
//                   src={employee.profileImage}
//                   alt="profile"
//                   className="img-fluid"
//                 />
//               ) : (
//                 getInitials()
//               )}
//             </div>

//             <h6 className="mb-1">
//               {employee.firstName} {employee.lastName}
//             </h6>

//             {/* View Profile Button */}
//             <button
//               className={`profile-btn  ${activeTab === "profile" ? "profile-btn" : "profile-btn"}`}
//               onClick={() => setActiveTab("profile")}
//             >
//               <i className="fas fa-user me-2" style={{ color: "#fff" }}></i>{" "}
//               View My Profile
//             </button>

//             <div className="text-muted small">
//               {(() => {
//                 const punches = attendance?.punches || [];
//                 const last = punches[punches.length - 1];
//                 if (!attendance || punches.length === 0 || (last && last.out)) {
//                   // No active punch
//                   return (
//                     <button
//                       className="text-white check-in-btn"
//                       onClick={handleLogin}
//                     >
//                       {punches.length === 0 ? "Check-in" : "Check-in Again"}
//                     </button>
//                   );
//                 } else {
//                   // Active punch
//                   return (
//                     <div
//                       className="badge text-white check-in-btn"
//                       title="Click to check out"
//                       style={{ cursor: "pointer" }}
//                       onClick={() => handleLogout(false)} // not end-of-day by default
//                     >
//                       ⏱ {punchElapsed || "0h 0m 0s"}
//                     </div>
//                   );
//                 }
//               })()}
//             </div>
//           </div>

//           {/* Tab Nav */}
//           <ul className="nav flex-column">
//             <li className="nav-item">
//               <Link
//                 className={`nav-link text-white d-flex align-items-center gap-1 ${activeTab === "attendance" ? "active fw-bold" : ""}`}
//                 href="/employee/dashboard"
//                 onClick={(e) => {
//                   e.preventDefault(); // prevent default navigation
//                   window.location.href = "/employee/dashboard"; // refresh the page
//                 }}
//               >
//                 🏠 Home
//               </Link>
//             </li>

//             <li className="nav-item">
//               <a
//                 className={`nav-link text-white ${activeTab === "attendance" ? "active fw-bold" : ""}`}
//                 onClick={() => setActiveTab("attendance")}
//                 href="#"
//               >
//                 📆 Leave & Attendance
//               </a>
//             </li>

//             <li className="nav-item">
//               <a
//                 className={`nav-link text-white ${activeTab === "leave" ? "active fw-bold" : ""}`}
//                 onClick={() => setActiveTab("leave")}
//                 href="#"
//               >
//                 📝 Leave Summary
//               </a>
//             </li>

//             <li className="nav-item">
//               <a
//                 className={`nav-link text-white ${activeTab === "salary" ? "active fw-bold" : ""}`}
//                 onClick={() => setActiveTab("salary")}
//                 href="#"
//               >
//                 🧾 Salary Slips
//               </a>
//             </li>
//             <li className="nav-item">
//               <a
//                 className={`nav-link text-white ${activeTab === "documents" ? "active fw-bold" : ""}`}
//                 onClick={() => setActiveTab("documents")}
//                 href="#"
//               >
//                 🗂️ Documents
//               </a>
//             </li>
//           </ul>

//           {/* <button className="btn btn-outline-light w-100 mt-4">Log Out</button> */}
//         </div>

//         {/* Content Area */}
//         <div className="flex-grow-1 p-4">
//           {activeTab === "profile" && (
//             <div className="profile-area">
//               <h4 className="fw-bold mb-3">My Profile</h4>
//               <div className="row">
//                 {/* LEFT PANEL — Profile Summary */}
//                 <div className="col-md-4 mb-3">
//                   <div className="card p-4" style={{ borderRadius: 12 }}>
//                     <div className="text-center">
//                       <div
//                         className="rounded-circle bg-light mx-auto mb-3 shadow-sm"
//                         style={{ width: 80, height: 80, overflow: "hidden" }}
//                       >
//                         {employee.profileImage ? (
//                           <img
//                             src={employee.profileImage}
//                             className="img-fluid "
//                             alt="Profile"
//                           />
//                         ) : (
//                           <div className="h-100 d-flex align-items-center justify-content-center fs-2 text-primary fw-bold">
//                             {employee.firstName?.charAt(0)}
//                             {employee.lastName?.charAt(0)}
//                           </div>
//                         )}
//                       </div>
//                       {/* <h5 className="mb-1">{employee.firstName} {employee.lastName}</h5> */}
//                       {/* <span className="badge bg-primary mb-2">Full Stack Developer, VN1008</span> */}
//                       <div>
//                         <h5 className="mb-1">
//                           {employee.firstName} {employee.lastName}{" "}
//                           <span className="text-muted">
//                             ({employee.employeeId})
//                           </span>
//                         </h5>
//                         <div className="badge bg-primary text-white">
//                           {employee.designation}
//                         </div>
//                       </div>

//                       <ul className="personal-info-list list-unstyled text-start small mt-3">
//                         <li>
//                           <strong>Email:</strong> {employee.email}
//                         </li>
//                         <li>
//                           <strong>Gender:</strong> {employee.gender}
//                         </li>
//                         <li>
//                           <strong>Department:</strong>{" "}
//                           {employee.department || "IT"}
//                         </li>
//                         <li>
//                           <strong>DOJ:</strong>{" "}
//                           {new Date(
//                             employee.joiningDate || "2024-07-10"
//                           ).toLocaleDateString()}
//                         </li>
//                         <li>
//                           <strong>Location:</strong>{" "}
//                           {employee.location || "Head Office"}
//                         </li>
//                       </ul>
//                       <hr />
//                       <p className="fw-bold text-start mb-1">
//                         Statutory Details
//                       </p>
//                       <p className="text-start small mb-0">
//                         <strong>PAN:</strong>{" "}
//                         {employee.panNumber || "ECBPA3559M"}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* RIGHT SIDE — Personal + Payment */}
//                 <div className="col-md-8 d-flex flex-column gap-3">
//                   {/* PERSONAL INFORMATION */}
//                   <div className="card p-3" style={{ borderRadius: 12 }}>
//                     <h4 className="text-danger mb-4 border-bottom pb-2">
//                       Personal Information
//                     </h4>
//                     <div className="row mb-2">
//                       <div className="col-md-4">
//                         <strong>Date of Birth:</strong>{" "}
//                         {new Date(
//                           employee.dob || "1999-10-15"
//                         ).toLocaleDateString()}
//                       </div>
//                       <div className="col-md-4">
//                         <strong>Mobile Number:</strong> {employee.mobile || "—"}
//                       </div>
//                       <div className="col-md-4">
//                         <strong>Contact Mail:</strong> {employee.email}
//                       </div>
//                     </div>
//                     <div className="row mb-2">
//                       <div className="col-md-4">
//                         <strong>Father's Name:</strong>{" "}
//                         {employee.fatherName || "—"}
//                       </div>
//                       <div className="col-md-8">
//                         <strong>Address:</strong>{" "}
//                         {employee.address ||
//                           "lucknow gomtinagar, lucknow gomtinagar"}
//                       </div>
//                     </div>
//                   </div>

//                   {/* PAYMENT INFORMATION */}
//                   <div className="card p-3 mb-3" style={{ borderRadius: 12 }}>
//                     <h4 className="mb-4 border-bottom pb-2">
//                       <span className="text-primary me-2">
//                         Payment Information
//                       </span>
//                     </h4>
//                     <div className="row align-items-center">
//                       {/* Left gradient card */}
//                       <div className="col-md-5">
//                         <div
//                           style={{
//                             background:
//                               "linear-gradient(to right, #36d1dc, #5b86e5)",
//                             borderRadius: "10px",
//                             color: "#fff",
//                             padding: "20px",
//                             boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//                           }}
//                         >
//                           <p className="mb-2 fw-semibold text-white">
//                             Payment Mode
//                           </p>
//                           <h6 className="fw-bold mb-3 text-white">
//                             Manual Bank Transfer
//                           </h6>
//                           <p className="mb-0 fw-semibold text-white">
//                             Account Number
//                           </p>
//                           <div className="d-flex align-items-center">
//                             <span className="fw-medium fs-7">
//                               {showAccount
//                                 ? employee.accountNumber
//                                 : `XXXX${employee.accountNumber?.slice(-4)}`}
//                             </span>

//                             <small
//                               className=" text-white show-acc-btn"
//                               onClick={() => setShowAccount(!showAccount)}
//                             >
//                               {showAccount ? "Hide" : "Show A/C No"}
//                             </small>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Right-side payment details */}
//                       <div className="col-md-7 mt-4 mt-md-0">
//                         <div className="row mb-2">
//                           <div className="col-md-6">
//                             <strong>Account Holder Name:</strong>{" "}
//                             {employee.firstName} {employee.lastName}
//                           </div>
//                           <div className="col-md-6">
//                             <strong>Bank Name:</strong>{" "}
//                             {employee.bankName || "kotak mahindra bank"}
//                           </div>
//                         </div>
//                         <div className="row mb-2">
//                           <div className="col-md-6">
//                             <strong>IFSC:</strong>{" "}
//                             {employee.ifscCode || "KKBK0000811"}
//                           </div>
//                           <div className="col-md-6">
//                             <strong>Account Type:</strong>{" "}
//                             {employee.accountType || "Savings"}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "home" && (
//             <div>

//               <h4 className="fw-bold">Welcome {employee.firstName}!</h4>
//               <div className="card p-4 mt-3">
//                 <MySalarySlips />
//               </div>

//               {lunchWarning && (
//                 <div
//                   className="alert alert-warning d-flex align-items-center mt-3"
//                   role="alert"
//                   style={{ borderRadius: "8px" }}
//                 >
//                   <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                   Lunch break exceeded 50 mins. Payable hours will be adjusted.
//                 </div>
//               )}

//               <div className="col-md-4 mt-3">
//                 <div className="card shadow border-0 rounded-4 p-4">
//                   {/* Header */}
//                   <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h5 className="fw-bold  mb-0">
//                       Upcoming Holidays ({new Date().getFullYear()})
//                     </h5>
//                     <span className="badge bg-light text-primary fw-semibold">
//                       {holidays.length}
//                     </span>
//                   </div>

//                   {/* Content */}
//                   {loadingHolidays ? (
//                     <div className="text-center py-4">
//                       <div
//                         className="spinner-border text-primary"
//                         role="status"
//                       ></div>
//                       <p className="mt-2 text-muted small">
//                         Loading holidays...
//                       </p>
//                     </div>
//                   ) : error ? (
//                     <p className="text-danger text-center">{error}</p>
//                   ) : holidays.length === 0 ? (
//                     <div className="text-center py-4">
//                       <img
//                         src="/no-holidays.png"
//                         alt="No Holidays"
//                         style={{ width: "90px", opacity: 0.8 }}
//                       />
//                       <p className="mt-2 text-muted">No holidays available</p>
//                     </div>
//                   ) : (
//                     <ul className="list-group list-group-flush">
//                       {holidays.slice(0, 5).map((holiday, idx) => {
//                         const isToday =
//                           new Date(holiday.date).toDateString() ===
//                           new Date().toDateString();
//                         return (
//                           <li
//                             key={idx}
//                             className="list-group-item border-0 d-flex justify-content-between align-items-center px-0 py-3"
//                             style={{
//                               backgroundColor: isToday
//                                 ? "#f1f8ff"
//                                 : "transparent",
//                               borderRadius: "8px",
//                             }}
//                           >
//                             <div>
//                               <h6 className="mb-0 fw-semibold text-dark">
//                                 {holiday.name}
//                               </h6>
//                               {holiday.description && (
//                                 <small className="text-muted">
//                                   {holiday.description}
//                                 </small>
//                               )}
//                             </div>
//                             <span
//                               className={`badge ${
//                                 isToday
//                                   ? "bg-primary text-white"
//                                   : "bg-light text-dark border"
//                               } px-3 py-2`}
//                             >
//                               {new Date(holiday.date).toLocaleDateString(
//                                 "en-IN",
//                                 {
//                                   day: "numeric",
//                                   month: "short",
//                                 }
//                               )}
//                             </span>
//                           </li>
//                         );
//                       })}
//                     </ul>
//                   )}

//                   {/* Footer Link */}
//                   {holidays.length > 5 && (
//                     <div className="text-center mt-3">
//                       <a
//                         href="/dashboard/admin/holidays"
//                         className="text-primary fw-semibold text-decoration-none"
//                       >
//                         View All Holidays →
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "attendance" && (
//             <div>
//               <h4 className="fw-bold mb-3">Leave & Attendance</h4>

//               <div className="card shadow-sm p-4 border-0 rounded-3">
//                 <h5 className="mb-3 fw-semibold text-primary">
//                   Today’s Status
//                 </h5>

//                 {attendance?.loginTime ? (
//                   <>
//                     <div className="d-flex align-items-center mb-3">
//                       <div className="icon-circle bg-success text-white me-3">
//                         <FaSignInAlt />
//                       </div>
//                       <div>
//                         <small className="text-muted">Login Time</small>
//                         <div className="fw-semibold">
//                           {new Date(attendance.loginTime).toLocaleTimeString()}
//                         </div>
//                       </div>
//                     </div>

//                     {attendance.logoutTime ? (
//                       <div className="d-flex align-items-center mb-3">
//                         <div className="icon-circle bg-danger text-white me-3">
//                           <FaSignOutAlt />
//                         </div>
//                         <div>
//                           <small className="text-muted">Logout Time</small>
//                           <div className="fw-semibold">
//                             {new Date(
//                               attendance.logoutTime
//                             ).toLocaleTimeString()}
//                           </div>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="d-flex align-items-center mb-3">
//                         <div className="icon-circle bg-warning text-white me-3">
//                           <FaClock />
//                         </div>
//                         <div>
//                           <small className="text-muted">Time Elapsed</small>
//                           <div className="fw-semibold">{elapsed}</div>
//                         </div>
//                       </div>
//                     )}
//                   </>
//                 ) : (

//                   <div className="text-muted">

//                   </div>
//                 )}
//               </div>

//               <style jsx>{`
//                 .icon-circle {
//                   width: 42px;
//                   height: 42px;
//                   display: flex;
//                   align-items: center;
//                   justify-content: center;
//                   border-radius: 50%;
//                   font-size: 1.1rem;
//                 }
//               `}</style>

//               <EmployeeAttendanceSummary employeeId={employee._id} />
//             </div>
//           )}

//           {activeTab === "leave" && (
//             <div>
//               {/* Top Title + Apply Button */}
//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <h4 className="fw-bold">Leave Summary</h4>
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => setShowLeaveForm(true)}
//                 >
//                   <i className="bi bi-plus-circle me-2"></i> Apply Leave
//                 </button>
//               </div>

//               {/* Balance Section */}
//               <div className="card p-4 mb-4 border-0 shadow-sm rounded-3">
//                 <div className="d-flex justify-content-between align-items-center flex-wrap">
//                   <div className="d-flex gap-4 flex-wrap balance-section">
//                     <div className="bg-white border rounded-3 px-4 py-3 text-center shadow-sm">
//                       <div className="text-primary fs-3 mb-2">
//                         <i className="bi bi-person-fill"></i>
//                       </div>
//                       <div className="fw-semibold text-dark">Personal Leave</div>
//                       <div className="text-muted small">
//                         {leaveBalance.personal || 0} Days
//                       </div>
//                     </div>
//                     <div className="bg-white border rounded-3 px-4 py-3 text-center shadow-sm">
//                       <div className="text-primary fs-3 mb-2">
//                         <i className="bi bi-hospital-fill"></i>
//                       </div>
//                       <div className="fw-semibold text-dark">Sick Leave</div>
//                       <div className="text-muted small">
//                         {leaveBalance.sick || 0} Days
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-muted small mt-3 mt-md-0">
//                     Available Balance as of{" "}
//                     <strong>{new Date().toLocaleDateString()}</strong>
//                   </div>
//                 </div>
//               </div>

//               {/* Apply Leave Modal */}

//               {showLeaveForm && (
//                 <div
//                   className={`offcanvas offcanvas-end show`}
//                   style={{
//                     visibility: "visible",
//                     width: "400px",
//                     background: "#fff",
//                     boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
//                     transition: "transform 0.3s ease-in-out",
//                     position: "fixed",
//                     top: 0,
//                     bottom: 0,
//                     right: 0,
//                     zIndex: 1050,
//                   }}
//                   tabIndex="-1"
//                   role="dialog"
//                 >
//                   {/* Header */}
//                   <div className="offcanvas-header d-flex justify-content-between align-items-center p-3 border-bottom">
//                     <h5 className="offcanvas-title">Apply for Leave</h5>
//                     <button
//                       type="button"
//                       className="btn-close"
//                       onClick={() => setShowLeaveForm(false)}
//                     ></button>
//                   </div>

//                   {/* Body */}
//                   <div className="offcanvas-body p-3">
//                     <div className="mb-3">
//                       <label className="form-label">Leave Type</label>
//                       <select
//                         className="form-select"
//                         value={leaveType}
//                         onChange={(e) => setLeaveType(e.target.value)}
//                       >
//                         <option value="">Select</option>
//                         <option value="Personal">Personal</option>
//                         <option value="Sick">Sick</option>
//                       </select>
//                     </div>

//                     <div className="mb-3 d-flex gap-2">
//                       <div className="flex-fill">
//                         <label className="form-label">From</label>
//                         <input
//                           type="date"
//                           className="form-control"
//                           value={from}
//                           onChange={(e) => setFrom(e.target.value)}
//                         />
//                       </div>
//                       <div className="flex-fill">
//                         <label className="form-label">To</label>
//                         <input
//                           type="date"
//                           className="form-control"
//                           value={to}
//                           onChange={(e) => setTo(e.target.value)}
//                         />
//                       </div>
//                     </div>

//                     <div className="mb-3">
//                       <label className="form-label">Reason</label>
//                       <textarea
//                         className="form-control"
//                         rows="3"
//                         value={reason}
//                         onChange={(e) => setReason(e.target.value)}
//                       ></textarea>
//                     </div>
//                   </div>

//                   {/* Footer */}
//                   <div className="p-3 border-top d-flex justify-content-end gap-2">
//                     <button
//                       className="btn btn-secondary"
//                       onClick={() => setShowLeaveForm(false)}
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       className="btn btn-primary"
//                       onClick={handleSubmitLeave}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Leave Requests Table */}
//               <div className="card p-4 shadow-sm border-0 rounded-3">
//                 <h5 className="fw-semibold mb-3">Leave Requests</h5>
//                 {leaveRequests.length === 0 ? (
//                   <div className="text-center py-5">
//                     <img
//                       src="/no-leaves.png"
//                       alt="No Leaves"
//                       style={{ width: 120 }}
//                     />
//                     <p className="mt-3 text-muted">No Leave Requests Found</p>
//                   </div>
//                 ) : (
//                   <div className="table-responsive">
//                     <table className="table table-bordered table-hover align-middle">
//                       <thead className="table-light">
//                         <tr>
//                           <th>Type</th>
//                           <th>From</th>
//                           <th>To</th>
//                           <th>Reason</th>
//                           <th>Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {leaveRequests.map((leave, idx) => (
//                           <tr key={idx}>
//                             <td>
//                               <span className="badge bg-info text-dark">
//                                 {leave.type}
//                               </span>
//                             </td>
//                             <td>{new Date(leave.from).toLocaleDateString()}</td>
//                             <td>{new Date(leave.to).toLocaleDateString()}</td>
//                             <td>{leave.reason}</td>
//                             <td>
//                               <span
//                                 className={`badge ${
//                                   leave.status === "Approved"
//                                     ? "bg-success"
//                                     : leave.status === "Rejected"
//                                       ? "bg-danger"
//                                       : "bg-warning text-dark"
//                                 }`}
//                               >
//                                 {leave.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>

//               {/* Apply Leave Modal */}
//             </div>
//           )}

//           {activeTab === "salary" && <MySalarySlips />}

//           {activeTab === "investments" && (
//             <h4>Investments Section Coming Soon...</h4>
//           )}
//           {activeTab === "documents" && (
//             <h4>Documents Section Coming Soon...</h4>
//           )}
//         </div>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import EmployeeAttendanceSummary from "../../components/EmployeeAttendanceSummary";
import { FaClock, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MySalarySlips from "../../components/SalarySlip";
import { getSocket } from "@/utils/socket";
import { io } from "socket.io-client";
import { evaluateLeavePolicy } from "@/utils/leavePolicy"; // adjust path

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [punchElapsed, setPunchElapsed] = useState(""); // live timer for active punch
  const [elapsed, setElapsed] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const router = useRouter();
  const [showAccount, setShowAccount] = useState(false);

  const [holidays, setHolidays] = useState([]);
  const [loadingHolidays, setLoadingHolidays] = useState(true);
  const [error, setError] = useState("");

  // for leave----------------------

  const [leaveBalance, setLeaveBalance] = useState({ emergency: 0, sick: 0 });
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [lunchWarning, setLunchWarning] = useState(false);

  const [isEmergency, setIsEmergency] = useState(false);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [policyCheck, setPolicyCheck] = useState(null); // result from eval
  const [justification, setJustification] = useState(""); // separate from reason? or reuse reason
  const [medicalCertFile, setMedicalCertFile] = useState(null);


    const [today, setToday] = useState("");

  const handleFromChange = (e) => {
    const selectedDate = e.target.value;
    setFrom(selectedDate);
    setTo(selectedDate); // Auto-fill the 'to' date
  };

  useEffect(() => {
    if (!employee || !employee._id) return;

    const socket = io({ path: "/api/socket" });

    socket.on("connect", () => {
      socket.emit("employee:identify", {
        employeeId: employee._id,
        name: `${employee.firstName} ${employee.lastName}`,
      });
    });

    // Track clicks
    let clickCount = 0;
    const handleClick = () => {
      clickCount++;
    };
    document.addEventListener("click", handleClick);

    // Send heartbeat with extra data every 10s
    const interval = setInterval(() => {
      socket.emit("employee:heartbeat", {
        employeeId: employee._id,
        browser: navigator.userAgent,
        url: window.location.href,
        clicks: clickCount,
      });
    }, 10000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("click", handleClick);
      socket.disconnect();
    };
  }, [employee]);

  useEffect(() => {
    if (!leaveType || !from || !to) {
      setPolicyCheck(null);
      return;
    }
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // count half days used (from your existing leaveRequests)
    const halfDaysUsedThisMonth = leaveRequests.filter(
      (lr) =>
        lr.policyMeta?.halfDay === true &&
        new Date(lr.from).getMonth() === fromDate.getMonth() &&
        lr.status === "Approved"
    ).length;

    // Holidays already in state
    const policyMeta = evaluateLeavePolicy({
      type: leaveType,
      fromDate,
      toDate,
      requestedOn: new Date(),
      halfDaysUsedThisMonth,
      holidays,
      halfDayRequested: isHalfDay,
      emergencyRequested: isEmergency,
    });

    setPolicyCheck(policyMeta);
  }, [leaveType, from, to, isHalfDay, isEmergency, leaveRequests, holidays]);

  // get leave status---------------

  // derive active punch
  const isActive =
    attendance?.activePunch ||
    (attendance?.punches?.length &&
      !attendance.punches[attendance.punches.length - 1].out);

  // worked so far (live add time if active)
  const workedMinutesSoFar = (() => {
    if (!attendance) return 0;
    let total = attendance.totalWorkedMinutes || 0;
    if (isActive) {
      const last = attendance.punches[attendance.punches.length - 1];
      const now = Date.now();
      total += Math.floor((now - new Date(last.in)) / 60000);
    }
    return total;
  })();

  const workedDisplay = (() => {
    const h = Math.floor(workedMinutesSoFar / 60);
    const m = workedMinutesSoFar % 60;
    return `${h}h ${m}m`;
  })();

  let timerRef = null;

  const startElapsedTimer = (startTime) => {
    clearInterval(timerRef);
    const start = new Date(startTime);
    timerRef = setInterval(() => {
      const now = new Date();
      const diff = Math.floor((now - start) / 1000); // in seconds
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setPunchElapsed(`${h}h ${m}m ${s}s`);
    }, 1000);
  };

  useEffect(() => {
    const punches = attendance?.punches || [];
    const last = punches[punches.length - 1];
    if (last && last.in && !last.out) {
      startElapsedTimer(last.in); // Resume timer on page load
    } else {
      clearInterval(timerRef);
      setPunchElapsed("");
    }
  }, [attendance]);

  const generatePDF = async (slipId) => {
    const res = await fetch("/api/payroll/salary-slip/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slipId }),
    });
    const data = await res.json();
    if (data.success) {
      window.open(data.pdfUrl, "_blank"); // Open PDF in new tab
    } else {
      alert(data.message);
    }
  };

  useEffect(() => {
    const fetchMe = async () => {
      const res = await fetch("/api/payroll/me");
      const data = await res.json();
      if (!data.success) {
        router.push("/employee/login");
      } else {
        setEmployee(data.employee);
        fetchTodayAttendance();
      }
    };
    fetchMe();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await fetch("/api/payroll/attendance/today");
      const data = await res.json();

      if (data.success) {
        setAttendance(data.attendance);

        // ✅ Check if lunch break exceeded and show warning
        if (data.attendance?.lunchBreakExceeded) {
          setLunchWarning(true); // Make sure you have useState for lunchWarning
        } else {
          setLunchWarning(false);
        }
      }
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
    }
  };

  useEffect(() => {
    if (!attendance) return;
    const punches = attendance.punches || [];
    const last = punches[punches.length - 1];
    if (!last || last.out) return; // no open punch
    const start = new Date(last.in);

    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - start.getTime()) / 1000);
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setPunchElapsed(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [attendance]);

  const handleLogin = async () => {
    if (!navigator.geolocation) {
      toast.error("Your browser does not support location.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const res = await fetch("/api/payroll/attendance/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setAttendance(data.attendance); // <-- full doc
          const p = data.attendance.punches;
          const last = p[p.length - 1];
          if (last?.in && !last.out) startElapsedTimer(last.in); // instant timer
          toast.success("Checked in!");
        } else {
          toast.error(data.message || "Check-in failed.");
        }
      },
      () => toast.error("Please allow location access to log in.")
    );
  };

  const handleLogout = async (endOfDay = false) => {
    const res = await fetch("/api/payroll/attendance/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endOfDay }),
    });
    const data = await res.json();
    if (data.success) {
      setAttendance(data.attendance); // full doc after checkout
      clearTimer();
      setPunchElapsed("");
      if (data.attendance.lunchBreakExceeded) {
        toast.warn(
          "Lunch break limit exceeded. Payable hours may be impacted."
        );
      } else {
        toast.success("Checked out.");
      }
    } else {
      toast.error(data.message || "Check-out failed.");
    }
  };

  const getInitials = () => {
    if (!employee) return "";
    return `${employee.firstName[0] || ""}${
      employee.lastName[0] || ""
    }`.toUpperCase();
  };

  // 1️⃣ Move fetchLeaveData OUTSIDE useEffect so it's globally callable
  const fetchLeaveData = async () => {
    try {
      const res = await fetch(
        `/api/payroll/leave/get?employeeId=${employee._id}`
      );
      const data = await res.json();
      if (data.success) {
        setLeaveRequests(data.data);

        // Calculate balances
        // const used = { personal: 0, sick: 0 };
        // data.data.forEach((req) => {
        //   if (req.status === "Approved") {
        //     const days =
        //       (new Date(req.to) - new Date(req.from)) / (1000 * 60 * 60 * 24) +
        //       1;
        //     if (req.type === "Personal") used.personal += days;
        //     if (req.type === "Sick") used.sick += days;
        //   }
        // });

        // In fetchLeaveData after you load data.data
        const used = { personal: 0, sick: 0 };
        data.data.forEach((req) => {
          if (req.status === "Approved") {
            const days = (new Date(req.to) - new Date(req.from)) / 86400000 + 1;

            if (req.type === "Personal") {
              if (req.policyMeta?.halfDay) used.personal += 0.5;
              else used.personal += days;
            }

            if (req.type === "Sick") {
              used.sick += days;
            }
          }
        });

        const PERSONAL_CAP = 18;
        const SICK_CAP = 10;
        setLeaveBalance({
          personal: Math.max(PERSONAL_CAP - used.personal, 0),
          sick: Math.max(SICK_CAP - used.sick, 0),
        });

        // Assuming total 10 days each
        setLeaveBalance({
          personal: Math.max(10 - used.personal, 0), // Example: 10 days
          sick: Math.max(10 - used.sick, 0),
        });
      }
    } catch (err) {
      console.error("Leave data fetch failed", err);
    }
  };

  // 2️⃣ Call it inside useEffect when page loads
  useEffect(() => {
    if (employee?._id) fetchLeaveData();
  }, [employee]);

  // 3️⃣ Call it again after applying leave
  const handleSubmitLeave = async () => {
    if (!leaveType || !from || !to || !reason) {
      toast.error("All fields are required.");
      return;
    }

    // ✅ If sick leave > 3 days, require medical certificate
    if (policyCheck?.medicalCertRequired && !medicalCertFile) {
      toast.error(
        "Medical certificate is required for sick leave over 3 days."
      );
      return;
    }

    // TODO: Upload the file before sending request (Step 2)
    const medicalCertUrl = medicalCertFile
      ? await uploadMedicalCert(medicalCertFile)
      : "";

    const res = await fetch("/api/payroll/leave/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: leaveType,
        from,
        to,
        reason,
        employeeId: employee._id,
        halfDay: isHalfDay,
        emergency: isEmergency,
        justificationText: justification,
        medicalCertUrl, // Store uploaded file URL
      }),
    });

    const data = await res.json();
    if (data.success) {
      toast.success("Leave request submitted.");
      setShowLeaveForm(false);
      fetchLeaveData();
    } else {
      toast.error(data.message || "Leave apply failed.");
    }
  };

  const fetchHolidays = async () => {
    try {
      setLoadingHolidays(true);
      const res = await fetch("/api/payroll/holidays/upcoming");
      const data = await res.json();

      if (data.success) {
        setHolidays(data.data);
      } else {
        setError("Failed to load holidays.");
      }
    } catch (err) {
      console.error("Error fetching holidays:", err);
      setError("Something went wrong while fetching holidays.");
    } finally {
      setLoadingHolidays(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  async function uploadMedicalCert(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload/medical-cert", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!data.success) throw new Error("Upload failed");
    return data.url; // return uploaded file URL
  }


   useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      const formattedDate = now.toLocaleDateString("en-US", options);
      setToday(formattedDate);
    }, 1000 * 60); // updates every minute

    // Initial run
    const now = new Date();
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    setToday(now.toLocaleDateString("en-US", options));

    return () => clearInterval(interval);
  }, []);

  if (!employee) return <div>Loading...</div>;

  return (
    <div className="emp-dashboard">
      <Head>
        {/* <link rel="stylesheet" href="/asets/css/bootstrap.min.css" /> */}
        <link rel="stylesheet" href="/asets/css/admin.css" />
        <title>Employee Dashboard</title>
      </Head>

      <div
        className="d-flex"
        style={{ minHeight: "100vh", background: "#f9f9fb" }}
      >
        {/* Sidebar */}
        <div className="bg-dark-light text-white p-3" style={{ width: 260 }}>
          <div className="text-center mb-4">
            <div
              className="bg-white rounded-circle overflow-hidden d-flex align-items-center justify-content-center mx-auto mb-2"
              style={{
                width: 80,
                height: 80,
                color: "black", // should be in quotes
                fontWeight: "bold", // should be in quotes
                fontSize: "30px", // "30px" as string or 30 as number
              }}
            >
              {employee?.profileImage ? (
                <img
                  src={employee.profileImage}
                  alt="profile"
                  className="img-fluid"
                />
              ) : (
                getInitials()
              )}
            </div>

            <h6 className="mb-1">
              {employee.firstName} {employee.lastName}
            </h6>

           

            {/* <div className="text-muted small">
              {(() => {
                const punches = attendance?.punches || [];
                const last = punches[punches.length - 1];
                if (!attendance || punches.length === 0 || (last && last.out)) {
                  // No active punch
                  return (
                    <button
                      className="text-white check-in-btn"
                      onClick={handleLogin}
                    >
                      {punches.length === 0 ? "Check-in" : "Check-in Again"}
                    </button>
                  );
                } else {
                  // Active punch
                  return (
                    <div
                      className="badge text-white check-in-btn"
                      title="Click to check out"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleLogout(false)} // not end-of-day by default
                    >
                      ⏱ {punchElapsed || "0h 0m 0s"}
                    </div>
                  );
                }
              })()}
            </div> */}



            <div className="text-muted small">
  {(() => {
    const punches = attendance?.punches || [];
    const last = punches[punches.length - 1];
    
    if (!attendance || punches.length === 0 || (last && last.out)) {
      // No active punch
      return (
        <button
          className="text-white check-in-btn"
          onClick={handleLogin}
        >
          {punches.length === 0 ? "Check-in" : "Check-in Again"}
        </button>
      );
    } else {
      // Active punch
      return (
        <div
          className="check-out-button "
          onClick={() => handleLogout(false)}
        >
          <span className="elapsed-time">⏱ {punchElapsed || "0h 0m 0s"}</span>
          <div className="hover-overlay">Click to Check-out</div>
        </div>
      );
    }
  })()}
</div>

          </div>

          {/* Tab Nav */}
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link
                className={`nav-link text-white d-flex align-items-center gap-1 ${
                  activeTab === "attendance" ? "active fw-bold" : ""
                }`}
                href="/employee/dashboard"
                onClick={(e) => {
                  e.preventDefault(); // prevent default navigation
                  window.location.href = "/employee/dashboard"; // refresh the page
                }}
              >
                🏠 Home
              </Link>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link text-white ${
                  activeTab === "attendance" ? "active fw-bold" : ""
                }`}
                onClick={() => setActiveTab("attendance")}
                href="#"
              >
                📆 Leave & Attendance
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link text-white ${
                  activeTab === "leave" ? "active fw-bold" : ""
                }`}
                onClick={() => setActiveTab("leave")}
                href="#"
              >
                📝 Leave Summary
              </a>
            </li>

            <li className="nav-item">
              <a
                className={`nav-link text-white ${
                  activeTab === "salary" ? "active fw-bold" : ""
                }`}
                onClick={() => setActiveTab("salary")}
                href="#"
              >
                🧾 Salary Slips
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link text-white ${
                  activeTab === "documents" ? "active fw-bold" : ""
                }`}
                onClick={() => setActiveTab("documents")}
                href="#"
              >
                🗂️ Documents
              </a>
            </li>
          </ul>

          {/* <button className="btn btn-outline-light w-100 mt-4">Log Out</button> */}
        </div>

        {/* Content Area */}
        <div className="flex-grow-1 p-4">
          {activeTab === "profile" && (
            <div className="profile-area">
              <h4 className="fw-bold mb-3">My Profile</h4>
              <div className="row">
                {/* LEFT PANEL — Profile Summary */}
                <div className="col-md-4 mb-3">
                  <div className="card p-4" style={{ borderRadius: 12 }}>
                    <div className="text-center">
                      <div
                        className="rounded-circle bg-light mx-auto mb-3 shadow-sm"
                        style={{ width: 80, height: 80, overflow: "hidden" }}
                      >
                        {employee.profileImage ? (
                          <img
                            src={employee.profileImage}
                            className="img-fluid "
                            alt="Profile"
                          />
                        ) : (
                          <div className="h-100 d-flex align-items-center justify-content-center fs-2 text-primary fw-bold">
                            {employee.firstName?.charAt(0)}
                            {employee.lastName?.charAt(0)}
                          </div>
                        )}
                      </div>
                      {/* <h5 className="mb-1">{employee.firstName} {employee.lastName}</h5> */}
                      {/* <span className="badge bg-primary mb-2">Full Stack Developer, VN1008</span> */}
                      <div>
                        <h5 className="mb-1">
                          {employee.firstName} {employee.lastName}{" "}
                          <span className="text-muted">
                            ({employee.employeeId})
                          </span>
                        </h5>
                        <div className="badge bg-primary text-white">
                          {employee.designation}
                        </div>
                      </div>

                      <ul className="personal-info-list list-unstyled text-start small mt-3">
                        <li>
                          <strong>Email:</strong> {employee.email}
                        </li>
                        <li>
                          <strong>Gender:</strong> {employee.gender}
                        </li>
                        <li>
                          <strong>Department:</strong>{" "}
                          {employee.department || "IT"}
                        </li>
                        <li>
                          <strong>DOJ:</strong>{" "}
                          {new Date(
                            employee.joiningDate || "2024-07-10"
                          ).toLocaleDateString()}
                        </li>
                        <li>
                          <strong>Location:</strong>{" "}
                          {employee.location || "Head Office"}
                        </li>
                      </ul>
                      <hr />
                      <p className="fw-bold text-start mb-1">
                        Statutory Details
                      </p>
                      <p className="text-start small mb-0">
                        <strong>PAN:</strong>{" "}
                        {employee.panNumber || "ECBPA3559M"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE — Personal + Payment */}
                <div className="col-md-8 d-flex flex-column gap-3">
                  {/* PERSONAL INFORMATION */}
                  <div className="card p-3" style={{ borderRadius: 12 }}>
                    <h4 className="text-danger mb-4 border-bottom pb-2">
                      Personal Information
                    </h4>
                    <div className="row mb-2">
                      <div className="col-md-4">
                        <strong>Date of Birth:</strong>{" "}
                        {new Date(
                          employee.dob || "1999-10-15"
                        ).toLocaleDateString()}
                      </div>
                      <div className="col-md-4">
                        <strong>Mobile Number:</strong> {employee.mobile || "—"}
                      </div>
                      <div className="col-md-4">
                        <strong>Contact Mail:</strong> {employee.email}
                      </div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-4">
                        <strong>Father's Name:</strong>{" "}
                        {employee.fatherName || "—"}
                      </div>
                      <div className="col-md-8">
                        <strong>Address:</strong>{" "}
                        {employee.address ||
                          "lucknow gomtinagar, lucknow gomtinagar"}
                      </div>
                    </div>
                  </div>

                  {/* PAYMENT INFORMATION */}
                  <div className="card p-3 mb-3" style={{ borderRadius: 12 }}>
                    <h4 className="mb-4 border-bottom pb-2">
                      <span className="text-primary me-2">
                        Payment Information
                      </span>
                    </h4>
                    <div className="row align-items-center">
                      {/* Left gradient card */}
                      <div className="col-md-5">
                        <div
                          style={{
                            background:
                              "linear-gradient(to right, #36d1dc, #5b86e5)",
                            borderRadius: "10px",
                            color: "#fff",
                            padding: "20px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <p className="mb-2 fw-semibold text-white">
                            Payment Mode
                          </p>
                          <h6 className="fw-bold mb-3 text-white">
                            Manual Bank Transfer
                          </h6>
                          <p className="mb-0 fw-semibold text-white">
                            Account Number
                          </p>
                          <div className="d-flex align-items-center">
                            <span className="fw-medium fs-7">
                              {showAccount
                                ? employee.accountNumber
                                : `XXXX${employee.accountNumber?.slice(-4)}`}
                            </span>

                            <small
                              className=" text-white show-acc-btn"
                              onClick={() => setShowAccount(!showAccount)}
                            >
                              {showAccount ? "Hide" : "Show A/C No"}
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Right-side payment details */}
                      <div className="col-md-7 mt-4 mt-md-0">
                        <div className="row mb-2">
                          <div className="col-md-6">
                            <strong>Account Holder Name:</strong>{" "}
                            {employee.firstName} {employee.lastName}
                          </div>
                          <div className="col-md-6">
                            <strong>Bank Name:</strong>{" "}
                            {employee.bankName || "kotak mahindra bank"}
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-6">
                            <strong>IFSC:</strong>{" "}
                            {employee.ifscCode || "KKBK0000811"}
                          </div>
                          <div className="col-md-6">
                            <strong>Account Type:</strong>{" "}
                            {employee.accountType || "Savings"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "home" && (
            <div>
               <div className="display-profiles">
                 <div className="emp-name-bx">
                   <h3 className="fw-bold text-white mb-0">Welcome back, {employee.firstName}!</h3>
                   <span className="text-white">{today}</span>
                 </div>
                 <div className="emp-profile-bx">
                     <button
                      className={`profile-btn  ${
                        activeTab === "profile" ? "profile-btn" : "profile-btn"
                      }`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <i className="fas fa-user me-2" style={{ color: "#fff" }}></i>{" "}
                      View Profile
                    </button>
                 </div>
               </div>
              <div className="card p-4 mt-3">
                <MySalarySlips />
              </div>

              {lunchWarning && (
                <div
                  className="alert alert-warning d-flex align-items-center mt-3"
                  role="alert"
                  style={{ borderRadius: "8px" }}
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Lunch break exceeded 50 mins. Payable hours will be adjusted.
                </div>
              )}

              <div className="col-md-4 mt-3">
                <div className="card shadow border-0 rounded-4 p-4">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold  mb-0 text-dark">
                      Upcoming Holidays ({new Date().getFullYear()})
                    </h5>
                    <span className="badge bg-light text-primary fw-semibold">
                      {holidays.length}
                    </span>
                  </div>

                  {/* Content */}
                  {loadingHolidays ? (
                    <div className="text-center py-4">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>
                      <p className="mt-2 text-muted small">
                        Loading holidays...
                      </p>
                    </div>
                  ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                  ) : holidays.length === 0 ? (
                    <div className="text-center py-4">
                      <img
                        src="/no-holidays.png"
                        alt="No Holidays"
                        style={{ width: "90px", opacity: 0.8 }}
                      />
                      <p className="mt-2 text-muted">No holidays available</p>
                    </div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {holidays.slice(0, 5).map((holiday, idx) => {
                        const isToday =
                          new Date(holiday.date).toDateString() ===
                          new Date().toDateString();
                        return (
                          <li
                            key={idx}
                            className="list-group-item border-0 d-flex justify-content-between align-items-center px-0 py-3"
                            style={{
                              backgroundColor: isToday
                                ? "#f1f8ff"
                                : "transparent",
                              borderRadius: "8px",
                            }}
                          >
                            <div>
                              <h6 className="mb-0 fw-semibold text-dark">
                                {holiday.name}
                              </h6>
                              {holiday.description && (
                                <small className="text-muted">
                                  {holiday.description}
                                </small>
                              )}
                            </div>
                            <span
                              className={`badge ${
                                isToday
                                  ? "bg-primary text-white"
                                  : "bg-light text-dark border"
                              } px-3 py-2`}
                            >
                              {new Date(holiday.date).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                }
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {/* Footer Link */}
                  {holidays.length > 5 && (
                    <div className="text-center mt-3">
                      <a
                        href="/dashboard/admin/holidays"
                        className="text-primary fw-semibold text-decoration-none"
                      >
                        View All Holidays →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div>
              <h4 className="fw-bold mb-3 text-dark">Leave & Attendance</h4>

              <div className="card shadow-sm p-4 border-0 rounded-3">
                <h5 className="mb-3 fw-semibold text-primary">
                  Today’s Status
                </h5>

                {attendance?.loginTime ? (
                  <>
                    <div className="d-flex align-items-center mb-3">
                      <div className="icon-circle bg-success text-white me-3">
                        <FaSignInAlt />
                      </div>
                      <div>
                        <small className="text-muted">Login Time</small>
                        <div className="fw-semibold text-dark">
                          {new Date(attendance.loginTime).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    {attendance.logoutTime ? (
                      <div className="d-flex align-items-center mb-3">
                        <div className="icon-circle bg-danger text-white me-3">
                          <FaSignOutAlt />
                        </div>
                        <div>
                          <small className="text-muted">Logout Time</small>
                          <div className="fw-semibold">
                            {new Date(
                              attendance.logoutTime
                            ).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center mb-3">
                        <div className="icon-circle bg-warning text-white me-3">
                          <FaClock />
                        </div>
                        <div>
                          <small className="text-muted">Time Elapsed</small>
                          <div className="fw-semibold">{elapsed}</div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-muted"></div>
                )}
              </div>

              <style jsx>{`
                .icon-circle {
                  width: 42px;
                  height: 42px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 50%;
                  font-size: 1.1rem;
                }
              `}</style>

              <EmployeeAttendanceSummary employeeId={employee._id} />
            </div>
          )}

          {activeTab === "leave" && (
            <div>
              {/* Top Title + Apply Button */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold text-dark">Leave Summary</h4>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowLeaveForm(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i> Apply Leave
                </button>
              </div>

              {/* Balance Section */}
              {/* <div className="card p-4 mb-4 border-0 shadow-sm rounded-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="d-flex gap-4 flex-wrap balance-section">
                    <div className="bg-white border rounded-3 px-4 py-3 text-center shadow-sm">
                      <div className="text-primary fs-3 mb-2">
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <div className="fw-semibold text-dark">Personal Leave</div>
                      <div className="text-muted small">
                        {leaveBalance.personal || 0} Days
                      </div>
                    </div>
                    <div className="bg-white border rounded-3 px-4 py-3 text-center shadow-sm">
                      <div className="text-primary fs-3 mb-2">
                        <i className="bi bi-hospital-fill"></i>
                      </div>
                      <div className="fw-semibold text-dark">Sick Leave</div>
                      <div className="text-muted small">
                        {leaveBalance.sick || 0} Days
                      </div>
                    </div>
                  </div>
                  <div className="text-muted small mt-3 mt-md-0">
                    Available Balance as of{" "}
                    <strong>{new Date().toLocaleDateString()}</strong>
                  </div>
                </div>
              </div> */}

              {/* Apply Leave Modal */}

              {/* Balance Section */}
              <div className="card p-4 mb-4 border-0 shadow-sm rounded-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="d-flex gap-4 flex-wrap balance-section">
                    <div className="bg-white border rounded-3 px-4 py-3 text-center shadow-sm">
                      <div className="text-primary fs-3 mb-2">
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <div className="fw-semibold text-dark">
                        Personal Leave
                      </div>
                      <div className="text-muted small">
                        {leaveBalance.personal?.toFixed(1) || 0} Days
                      </div>
                      <small className="text-muted d-block">
                        Annual quota: 18
                      </small>
                    </div>
                    <div className="bg-white border rounded-3 px-4 py-3 text-center shadow-sm">
                      <div className="text-primary fs-3 mb-2">
                        <i className="bi bi-hospital-fill"></i>
                      </div>
                      <div className="fw-semibold text-dark">Sick Leave</div>
                      <div className="text-muted small">
                        {leaveBalance.sick?.toFixed(1) || 0} Days
                      </div>
                      <small className="text-muted d-block">
                        Annual quota: 10
                      </small>
                    </div>
                  </div>
                  <div className="text-muted small mt-3 mt-md-0">
                    Balance as of{" "}
                    <strong>{new Date().toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              {/* Offcanvas Apply Form with Policy */}
              {showLeaveForm && (
                <div
                  className="offcanvas offcanvas-end show"
                  style={{
                    visibility: "visible",
                    width: "400px",
                    background: "#fff",
                    boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease-in-out",
                    position: "fixed",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    zIndex: 1050,
                  }}
                  tabIndex="-1"
                  role="dialog"
                >
                  <div className="offcanvas-header p-3 border-bottom">
                    <h5 className="offcanvas-title text-dark">Apply Leave</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowLeaveForm(false)}
                    ></button>
                  </div>

                  <div className="offcanvas-body p-3">
                    <div className="mb-3">
                      <label className="form-label text-dark">Leave Type</label>
                      <select
                        className="form-select"
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="Personal">Personal</option>
                        <option value="Sick">Sick</option>
                      </select>
                    </div>

                    {/* <div className="mb-3 d-flex gap-2">
                      <div className="flex-fill">
                        <label className="form-label text-dark">From</label>
                        <input
                          type="date"
                          className="form-control"
                          value={from}
                          onChange={(e) => setFrom(e.target.value)}
                        />
                      </div>
                      <div className="flex-fill">
                        <label className="form-label">To</label>
                        <input
                          type="date"
                          className="form-control"
                          value={to}
                          onChange={(e) => setTo(e.target.value)}
                        />
                      </div>
                    </div> */}



                    <div className="mb-3 d-flex gap-2">
      <div className="flex-fill">
        <label className="form-label text-dark">From</label>
        <input
          type="date"
          className="form-control custom-date-input"
          value={from}
          onChange={handleFromChange}
        />
      </div>
      <div className="flex-fill">
        <label className="form-label text-dark">To</label>
        <input
          type="date"
          className="form-control custom-date-input"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      {/* <style jsx>{`
        .custom-date-input {
          position: relative;
          background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="%23666" class="bi bi-calendar" viewBox="0 0 16 16"%3E%3Cpath d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v1H0V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM0 14V5h16v9a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z"%3E%3C/path%3E%3C/svg%3E');
          background-repeat: no-repeat;
          background-position: right 10px center;
          background-size: 16px 16px;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }
      `}</style> */}
    </div>

                    {/* Half-day + Emergency */}
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        id="halfDayChk"
                        className="form-check-input"
                        disabled={from !== to}
                        checked={isHalfDay}
                        onChange={(e) => setIsHalfDay(e.target.checked)}
                      />
                      <label htmlFor="halfDayChk" className="form-check-label text-dark">
                        Request Half-Day
                      </label>
                    </div>

                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        id="emergencyChk"
                        className="form-check-input"
                        checked={isEmergency}
                        onChange={(e) => setIsEmergency(e.target.checked)}
                      />
                      <label
                        htmlFor="emergencyChk"
                        className="form-check-label text-dark"
                      >
                        Emergency Leave
                      </label>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Reason</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>

                    {policyCheck?.justificationRequired && (
                      <div className="mb-3">
                        <label className="form-label text-dark">
                          Justification (required)
                        </label>
                        <textarea
                          className="form-control"
                          rows="2"
                          value={justification}
                          onChange={(e) => setJustification(e.target.value)}
                        />
                      </div>
                    )}

                    {policyCheck?.medicalCertRequired && (
                      <div className="mb-3">
                        <label className="form-label text-dark">
                          Medical Certificate
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*,application/pdf"
                          onChange={(e) =>
                            setMedicalCertFile(e.target.files[0] || null)
                          }
                        />
                      </div>
                    )}

                    {/* Policy Warning List */}
                    {policyCheck && (
                      <div
                        className="alert alert-warning small mt-3"
                        role="alert"
                      >
                        <strong>Policy Check:</strong>
                        <ul className="mb-0 ps-3">
                          {policyCheck.policyWarnings.length ? (
                            policyCheck.policyWarnings.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))
                          ) : (
                            <li>No issues.</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="p-3 border-top d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowLeaveForm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmitLeave}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {/* Leave Requests Table */}
              <div className="card p-4 shadow-sm border-0 rounded-3">
                <h5 className="fw-semibold mb-3 text-dark">Leave Requests</h5>
                {leaveRequests.length === 0 ? (
                  <div className="text-center py-5">
                    <img
                      src="/no-leaves.png"
                      alt="No Leaves"
                      style={{ width: 120 }}
                    />
                    <p className="mt-3 text-muted">No Leave Requests Found</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Type</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Reason</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaveRequests.map((leave, idx) => (
                          <tr key={idx}>
                            <td>
                              <span className="badge bg-info text-dark">
                                {leave.type}
                              </span>
                            </td>
                            <td>{new Date(leave.from).toLocaleDateString()}</td>
                            <td>{new Date(leave.to).toLocaleDateString()}</td>
                            <td>{leave.reason}</td>
                            <td>
                              <span
                                className={`badge ${
                                  leave.status === "Approved"
                                    ? "bg-success"
                                    : leave.status === "Rejected"
                                    ? "bg-danger"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {leave.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Apply Leave Modal */}
            </div>
          )}

          {activeTab === "salary" && <MySalarySlips />}

          {activeTab === "investments" && (
            <h4>Investments Section Coming Soon...</h4>
          )}
          {activeTab === "documents" && (
            <h4 className="text-dark">Documents Section Coming Soon...</h4>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
