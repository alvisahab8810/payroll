// // pages/dashboard/employees/[id].js
// import React, { useEffect, useState } from "react";
// import Head from "next/head";
// import { useRouter } from "next/router";
// import Link from "next/link";
// import Dashnav from "@/components/Dashnav";
// import Leftbar from "@/components/Leftbar";
// import LeftbarMobile from "@/components/LeftbarMobile";

// // Charts
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   Legend,
// } from "recharts";

// export default function EmployeeProfile() {
//   const router = useRouter();
//   const { id } = router.query;

//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Static placeholder metrics & data (replace with real API fields later)
//   const summaryCards = [
//     { title: "Deductions", value: "$500", note: "+12% from last month" },
//     { title: "Leaves taken", value: "2", note: "+1 from last month" },
//     { title: "Task Completed", value: "48", note: "+8 from last month" },
//     { title: "Task pending", value: "12", note: "0 from last month" },
//     { title: "Task overdue", value: "2", note: "0 from last month" },
//   ];

//   // Sample project list (static placeholder)
//   const projectRows = [
//     {
//       project: "New Work Les DO",
//       projectNo: "232323",
//       date: "12/12/2023",
//       progress: 33,
//       amount: "$45,454,888",
//       serviceType: "Navy",
//       status: "Completed",
//     },
//     {
//       project: "You can Change the text and all",
//       projectNo: "232323",
//       date: "12/12/2023",
//       progress: 55,
//       amount: "$45,454,888",
//       serviceType: "Navy",
//       status: "Completed",
//     },
//     {
//       project: "Landing Page Design",
//       projectNo: "232323",
//       date: "12/12/2023",
//       progress: 12,
//       amount: "$45,454,888",
//       serviceType: "Navy",
//       status: "In - progress",
//     },
//   ];

//   // Sample charts data (placeholder)
//   const incomeData = [
//     { month: "Jan", income: 60, profit: 30 },
//     { month: "Feb", income: 55, profit: 35 },
//     { month: "Mar", income: 70, profit: 40 },
//     { month: "Apr", income: 80, profit: 45 },
//     { month: "May", income: 77, profit: 50 },
//     { month: "Jun", income: 65, profit: 42 },
//     { month: "Jul", income: 85, profit: 60 },
//     { month: "Aug", income: 78, profit: 52 },
//     { month: "Sep", income: 70, profit: 45 },
//     { month: "Oct", income: 72, profit: 48 },
//     { month: "Nov", income: 68, profit: 46 },
//     { month: "Dec", income: 60, profit: 30 },
//   ];

//   const awardsData = [
//     { name: "FY2022 Q1", value: 4101 },
//     { name: "FY2022 Q2", value: 423 },
//     { name: "FY2022 Q3", value: 405 },
//     { name: "FY2022 Q4", value: 90 },
//   ];
//   const COLORS = ["#8a6df4", "#f86aa7", "#f7b84b", "#4aa1f3"];

//   useEffect(() => {
//     if (!id) return;
//     setLoading(true);
//     setError(null);

//     const fetchEmployee = async () => {
//       try {
//         const token =
//           typeof window !== "undefined" &&
//           (localStorage.getItem("adminToken") ||
//             localStorage.getItem("employeeToken"));

//         const res = await fetch(`/api/employee/all`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });

//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(`API error: ${res.status} ${text}`);
//         }

//         const data = await res.json();
//         // Expect server returns employee object (data.employee)
//         setEmployee(data.employee || data);
//       } catch (err) {
//         console.error("Error fetching employee:", err);
//         setError(err.message || "Failed to fetch employee");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployee();
//   }, [id]);

//   // Helpers for display
//   const fullname = (emp) => {
//     if (!emp) return "";
//     const first = emp.personal?.firstName || "";
//     const last = emp.personal?.lastName || "";
//     const combined = `${first} ${last}`.trim();
//     return combined || "Unnamed";
//   };

//   const title = (emp) => emp.professional?.designation || "Title not available";
//   const email = (emp) => emp.personal?.email || "email not available";
//   const employeeId = (emp) => emp.professional?.employeeId || "-";
//   const avatar = (emp) => emp.personal?.avatar || null;
//   const statusText = (emp) => emp.professional?.status || "N/A";

//   return (
//     <div className="employee-overview-page">
//       <Head>
//         <title>Employee Overview</title>
//         <link rel="stylesheet" href="/asets/css/bootstrap.min.css" />
//         <link rel="stylesheet" href="/asets/css/main.css" />
//         <link rel="stylesheet" href="/asets/css/admin.css" />
//       </Head>

//       <div className="main-nav">
//         <Leftbar />
//         <LeftbarMobile />
//         <Dashnav />

//         <section className="content home p-4">
//           <div className="card p-3 shadow-sm">
//             <div className="d-flex justify-content-between align-items-start">
//               <div className="d-flex gap-3 align-items-center">
//                 {/* Avatar */}
//                 <div className="avatar-wrap">
//                   {loading ? (
//                     <div className="avatar-skeleton" />
//                   ) : avatar(employee) ? (
//                     <img src={avatar(employee)} alt={fullname(employee)} />
//                   ) : (
//                     <div className="avatar-placeholder">
//                       {fullname(employee).charAt(0)}
//                     </div>
//                   )}
//                 </div>

//                 {/* Name + meta */}
//                 <div>
//                   <h2 className="mb-1">{loading ? "Loading..." : fullname(employee)}</h2>

//                   <div className="d-flex gap-4 flex-wrap meta-row">
//                     <div>
//                       <div className="meta-label">Title</div>
//                       <div className="meta-value">{loading ? "-" : title(employee)}</div>
//                     </div>
//                     <div>
//                       <div className="meta-label">Email</div>
//                       <div className="meta-value">{loading ? "-" : email(employee)}</div>
//                     </div>
//                     <div>
//                       <div className="meta-label">Employee ID</div>
//                       <div className="meta-value">{loading ? "-" : employeeId(employee)}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="d-flex gap-2">
//                 <Link href="/dashboard/teams" className="btn btn-outline-secondary">
//                   Back
//                 </Link>
//                 <button className="btn btn-primary">Add Employee</button>
//               </div>
//             </div>
//           </div>

//           {/* Stat cards */}
//           <div className="mt-4 stats-row d-flex gap-3 flex-wrap">
//             {summaryCards.map((c, i) => (
//               <div key={i} className="stat-card p-3 shadow-sm">
//                 <div className="stat-title">{c.title}</div>
//                 <div className="stat-value">{c.value}</div>
//                 <div className="stat-note">{c.note}</div>
//               </div>
//             ))}
//           </div>

//           {/* Tabs */}
//           <div className="mt-4 card p-3">
//             <ul className="nav nav-tabs">
//               <li className="nav-item">
//                 <button className="nav-link">Activity</button>
//               </li>
//               <li className="nav-item">
//                 <button className="nav-link">Tasks</button>
//               </li>
//               <li className="nav-item">
//                 <button className="nav-link active">Report</button>
//               </li>
//             </ul>

//             <div className="tab-body mt-3">
//               <div className="row gx-3">
//                 {/* Left: Project summary & Income chart */}
//                 <div className="col-lg-8">
//                   <h5 className="mb-3">Project Summary</h5>

//                   {/* small filter tabs */}
//                   <div className="mb-2 d-flex gap-2">
//                     <button className="btn btn-sm btn-outline-light active">Ongoing</button>
//                     <button className="btn btn-sm btn-outline-light">Negotiation</button>
//                     <button className="btn btn-sm btn-outline-light">Completed</button>
//                   </div>

//                   <div className="table-responsive mb-4">
//                     <table className="table table-borderless align-middle">
//                       <thead>
//                         <tr>
//                           <th>Project</th>
//                           <th>Project NO</th>
//                           <th>Date</th>
//                           <th>Progress</th>
//                           <th>Amount</th>
//                           <th>Service Type</th>
//                           <th>Status</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {projectRows.map((r, idx) => (
//                           <tr key={idx}>
//                             <td>{r.project}</td>
//                             <td>{r.projectNo}</td>
//                             <td>{r.date}</td>
//                             <td style={{ width: 200 }}>
//                               <div className="progress" style={{ height: 8 }}>
//                                 <div
//                                   className="progress-bar"
//                                   style={{ width: `${r.progress}%` }}
//                                 />
//                               </div>
//                               <small className="text-muted ms-2">{r.progress}%</small>
//                             </td>
//                             <td>{r.amount}</td>
//                             <td>{r.serviceType}</td>
//                             <td>
//                               <span className={`badge bg-${r.status === "Completed" ? "success" : r.status === "Rejected" ? "danger" : "warning"}`}>
//                                 {r.status}
//                               </span>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>

//                   <h5 className="mb-3">Income & Expense</h5>
//                   <div style={{ height: 260 }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={incomeData}>
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <Tooltip />
//                         <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
//                         <Line type="monotone" dataKey="profit" stroke="#f7b84b" strokeWidth={2} />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Right: Awards donut + Overall summary */}
//                 <div className="col-lg-4">
//                   <div className="card p-3 mb-3">
//                     <div className="d-flex justify-content-between align-items-center mb-3">
//                       <h6 className="mb-0">Awards</h6>
//                       <select className="form-select form-select-sm" style={{ width: 120 }}>
//                         <option>Monthly</option>
//                         <option>Yearly</option>
//                       </select>
//                     </div>
//                     <div style={{ width: "100%", height: 200 }}>
//                       <ResponsiveContainer width="100%" height={200}>
//                         <PieChart>
//                           <Pie data={awardsData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} paddingAngle={2}>
//                             {awardsData.map((entry, index) => (
//                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                             ))}
//                           </Pie>
//                           <Legend verticalAlign="bottom" layout="vertical" />
//                         </PieChart>
//                       </ResponsiveContainer>
//                     </div>
//                     <div className="mt-2">
//                       {awardsData.map((a, i) => (
//                         <div key={i} className="d-flex justify-content-between">
//                           <div><span style={{ display: "inline-block", width: 12, height: 12, background: COLORS[i], marginRight: 6 }} /> {a.name}</div>
//                           <div>{a.value}</div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="card p-3">
//                     <h6>Over all Summary</h6>
//                     <ul className="list-unstyled mt-3 mb-0">
//                       <li className="summary-line"><span>Project</span><span className="badge bg-light text-dark">10</span></li>
//                       <li className="summary-line"><span>Task</span><span className="badge bg-light text-dark">10</span></li>
//                       <li className="summary-line"><span>Client</span><span className="badge bg-light text-dark">10</span></li>
//                       <li className="summary-line"><span>Revenue</span><span className="badge bg-light text-dark">10</span></li>
//                       <li className="summary-line"><span>Income</span><span className="badge bg-light text-dark">10</span></li>
//                       <li className="summary-line"><span>Expense</span><span className="badge bg-light text-dark">10</span></li>
//                       <li className="summary-line"><span>Leads</span><span className="badge bg-light text-dark">10</span></li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* small footer spacing */}
//           <div style={{ height: 40 }} />
//         </section>
//       </div>

//       {/* Scoped CSS */}
//       <style jsx>{`
//         .employee-overview-page :global(.card) {
//           border-radius: 8px;
//         }
//         .avatar-wrap img {
//           width: 96px;
//           height: 96px;
//           object-fit: cover;
//           border-radius: 50%;
//           border: 4px solid #fff;
//           box-shadow: 0 6px 18px rgba(0,0,0,0.08);
//         }
//         .avatar-placeholder {
//           width: 96px;
//           height: 96px;
//           border-radius: 50%;
//           background: #f3f4f6;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 28px;
//           font-weight: 700;
//           color: #111;
//         }
//         .avatar-skeleton {
//           width: 96px;
//           height: 96px;
//           border-radius: 50%;
//           background: linear-gradient(90deg, #efefef, #f6f6f6);
//         }
//         .meta-row .meta-label {
//           font-size: 12px;
//           color: #6b7280;
//         }
//         .meta-row .meta-value {
//           font-weight: 600;
//         }
//         .stats-row .stat-card {
//           min-width: 180px;
//           background: #fff;
//           border-radius: 8px;
//         }
//         .stat-title {
//           font-size: 13px;
//           color: #6b7280;
//         }
//         .stat-value {
//           font-size: 20px;
//           font-weight: 700;
//           margin-top: 6px;
//         }
//         .stat-note {
//           font-size: 12px;
//           color: #10b981;
//         }
//         .tab-body { margin-top: 10px; }
//         .summary-line {
//           display:flex;
//           justify-content:space-between;
//           align-items:center;
//           padding:10px 0;
//           border-bottom:1px solid #f3f4f6;
//         }

//         /* progress bar small customization */
//         .progress { background: #f1f5f9; border-radius: 8px; }
//         .progress-bar { background: #10b981; }

//         /* small responsive adjustments */
//         @media (max-width: 991px) {
//           .meta-row { gap: 12px; }
//         }
//       `}</style>
//     </div>
//   );
// }

// pages/dashboard/employees/[id].js
import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Dashnav from "@/components/Dashnav";
import Leftbar from "@/components/Leftbar";
import LeftbarMobile from "@/components/LeftbarMobile";

// Charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function EmployeeProfile() {
  const router = useRouter();
  const { id } = router.query;

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("report"); // 👈 default tab

  // Static placeholders
  // const summaryCards = [
  //   { title: "Deductions", value: "$500", note: "+12% from last month" },
  //   { title: "Leaves taken", value: "2", note: "+1 from last month" },
  //   { title: "Task Completed", value: "48", note: "+8 from last month" },
  //   { title: "Task pending", value: "12", note: "0 from last month" },
  //   { title: "Task overdue", value: "2", note: "0 from last month" },
  // ];

  // 🔹 Define summary cards with icons
  const summaryCards = [
    {
      title: "Deductions",
      value: "$500",
      note: "+12% from last month",
      icon: "/icons/deduction.png",
    },
    {
      title: "Leaves taken",
      value: "2",
      note: "+1 from last month",
      icon: "/icons/leaves-taken.png",
    },
    {
      title: "Task Completed",
      value: "48",
      note: "+8 from last month",
      icon: "/icons/task-completed.png",
    },
    {
      title: "Task pending",
      value: "12",
      note: "0 from last month",
      icon: "/icons/task-pending.png",
    },
    {
      title: "Task overdue",
      value: "2",
      note: "0 from last month",
      icon: "/icons/task-pending.png",
    },
  ];

  const projectRows = [
    {
      project: "New Work Les DO",
      projectNo: "232323",
      date: "12/12/2023",
      progress: 33,
      amount: "$45,454,888",
      serviceType: "Navy",
      status: "Completed",
    },
    {
      project: "Landing Page Design",
      projectNo: "343434",
      date: "01/02/2024",
      progress: 55,
      amount: "$12,000",
      serviceType: "Web",
      status: "In - progress",
    },
  ];

  const incomeData = [
    { month: "Jan", income: 60, profit: 30 },
    { month: "Feb", income: 55, profit: 35 },
    { month: "Mar", income: 70, profit: 40 },
    { month: "Apr", income: 80, profit: 45 },
  ];

  const awardsData = [
    { name: "FY2022 Q1", value: 4101 },
    { name: "FY2022 Q2", value: 423 },
    { name: "FY2022 Q3", value: 405 },
    { name: "FY2022 Q4", value: 90 },
  ];
  const COLORS = ["#8a6df4", "#f86aa7", "#f7b84b", "#4aa1f3"];

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    const fetchEmployee = async () => {
      try {
        const token =
          typeof window !== "undefined" &&
          (localStorage.getItem("adminToken") ||
            localStorage.getItem("employeeToken"));

        const res = await fetch(`/api/employee/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error: ${res.status} ${text}`);
        }

        const data = await res.json();
        setEmployee(data.employee);
      } catch (err) {
        console.error("Error fetching employee:", err);
        setError(err.message || "Failed to fetch employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  // Helpers
  const fullname = (emp) =>
    emp
      ? `${emp.personal?.firstName || ""} ${
          emp.personal?.lastName || ""
        }`.trim()
      : "";

  const title = (emp) => emp?.professional?.designation || "N/A";
  const email = (emp) => emp?.personal?.email || "N/A";
  const employeeId = (emp) =>
    emp?.professional?.employeeId || emp?.employeeId || "-";
  const avatar = (emp) => emp?.personal?.avatar || null;
  const statusText = (emp) => emp?.professional?.status || "N/A";

  return (
    <div className="employee-overview-page">
      <Head>
        <title>Employee Overview</title>
        <link rel="stylesheet" href="/asets/css/bootstrap.min.css" />
        {/* <link rel="stylesheet" href="/asets/css/main.css" /> */}
        <link rel="stylesheet" href="/asets/css/admin.css" />
      </Head>

      <div className="main-nav">
        <Leftbar />
        <LeftbarMobile />
        <Dashnav />

        <section className="content home p-4">
          {loading && <div>Loading...</div>}
          {error && <div className="text-danger">{error}</div>}

          {!loading && employee && (
            <>
              <div className="card p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="d-flex gap-3 align-items-center">
                    <div className="avatar-wrap">
                      {avatar(employee) ? (
                        <img src={avatar(employee)} alt={fullname(employee)} />
                      ) : (
                        <div className="avatar-placeholder">
                          {fullname(employee).charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="mb-1 mt-0">{fullname(employee)}</h4>

                      <div className="d-flex gap-4 flex-wrap meta-row mt-4">
                        <div>
                          <div className="meta-value">Title</div>
                          <div className="meta-label">{title(employee)}</div>
                        </div>
                        <div>
                          <div className="meta-value">Email</div>
                          <div className="meta-label">{email(employee)}</div>
                        </div>
                        <div>
                          <div className="meta-value">Employee ID</div>
                          <div className="meta-label">
                            {employeeId(employee)}
                          </div>
                        </div>
                        <div>
                          <div className="meta-value">Status</div>
                          <div className="meta-label">
                            {statusText(employee)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="d-flex gap-2">
                    <Link href="/dashboard/teams" className="btn btn-outline-secondary">
                      Back
                    </Link>
                    <button className="btn btn-primary">Add Employee</button>
                  </div> */}
                </div>
              </div>

              {/* Stats */}
              {/* Stats */}
              <div className="mt-4 stats-row d-flex gap-3 flex-wrap">
                {summaryCards.map((c, i) => (
                  <div key={i} className="stat-card p-3 shadow-sm">
                    <div className="stat-title">{c.title}</div>
                    <div className="stat-value d-flex align-items-center gap-2 justify-content-between">
                      {c.value}
                      <img src={c.icon} width="30" alt={c.title} />
                    </div>
                    <div className="stat-note">{c.note}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="mt-4 card p-3">
                <ul className="nav nav-tabs tabs-overview">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "activity" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("activity")}
                    >
                      Activity
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "tasks" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("tasks")}
                    >
                      Tasks
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "report" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("report")}
                    >
                      Report
                    </button>
                  </li>
                </ul>

                <div className="tab-body mt-3">
                  {/* Activity Tab */}
                  {activeTab === "activity" && (
                    <div>
                      <h5>Recent Activity</h5>
                      <p className="text-muted">
                        Employee logs, attendance, etc. will appear here.
                      </p>
                    </div>
                  )}

                  {/* Tasks Tab */}
                  {activeTab === "tasks" && (
                    <div>
                      <h5>Tasks</h5>
                      <ul>
                        <li>Finish Dashboard UI</li>
                        <li>Submit Monthly Report</li>
                        <li>Attend Team Meeting</li>
                      </ul>
                    </div>
                  )}

                  {/* Report Tab */}
                  {activeTab === "report" && (
                    <div className="row gx-3">
                      {/* Project Summary + Chart */}
                      <div className="col-lg-8">
                        <h5 className="mb-3">Project Summary</h5>
                        <div className="table-responsive mb-4">
                          <table className="table table-borderless align-middle">
                            <thead>
                              <tr>
                                <th>Project</th>
                                <th>Project NO</th>
                                <th>Date</th>
                                <th>Progress</th>
                                <th>Amount</th>
                                <th>Service Type</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {projectRows.map((r, idx) => (
                                <tr key={idx}>
                                  <td>{r.project}</td>
                                  <td>{r.projectNo}</td>
                                  <td>{r.date}</td>
                                  <td style={{ width: 200 }}>
                                    <div
                                      className="progress"
                                      style={{ height: 8 }}
                                    >
                                      <div
                                        className="progress-bar"
                                        style={{ width: `${r.progress}%` }}
                                      />
                                    </div>
                                    <small className="text-muted ms-2">
                                      {r.progress}%
                                    </small>
                                  </td>
                                  <td>{r.amount}</td>
                                  <td>{r.serviceType}</td>
                                  <td>
                                    <span
                                      className={`badge bg-${
                                        r.status === "Completed"
                                          ? "success"
                                          : r.status === "Rejected"
                                          ? "danger"
                                          : "warning"
                                      }`}
                                    >
                                      {r.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <h5 className="mb-3">Income & Expense</h5>
                        <div style={{ height: 260 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={incomeData}>
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#22c55e"
                                strokeWidth={2}
                              />
                              <Line
                                type="monotone"
                                dataKey="profit"
                                stroke="#f7b84b"
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Right: Awards + Summary */}
                      <div className="col-lg-4">
                        <div className="card p-3 mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="mb-0">Awards</h6>
                            <select
                              className="form-select form-select-sm"
                              style={{ width: 120 }}
                            >
                              <option>Monthly</option>
                              <option>Yearly</option>
                            </select>
                          </div>
                          <div style={{ width: "100%", height: 200 }}>
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={awardsData}
                                  dataKey="value"
                                  nameKey="name"
                                  innerRadius={50}
                                  outerRadius={70}
                                  paddingAngle={2}
                                >
                                  {awardsData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={COLORS[index % COLORS.length]}
                                    />
                                  ))}
                                </Pie>
                                <Legend
                                  verticalAlign="bottom"
                                  layout="vertical"
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="card p-3">
                          <h6>Over all Summary</h6>
                          <ul className="list-unstyled mt-3 mb-0">
                            <li className="summary-line">
                              <span>Project</span>
                              <span className="badge bg-light text-dark">
                                10
                              </span>
                            </li>
                            <li className="summary-line">
                              <span>Task</span>
                              <span className="badge bg-light text-dark">
                                10
                              </span>
                            </li>
                            <li className="summary-line">
                              <span>Client</span>
                              <span className="badge bg-light text-dark">
                                10
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Scoped CSS */}
      <style jsx>{`
        .employee-overview-page :global(.card) {
          border-radius: 8px;
        }
        .avatar-wrap img {
          width: 96px;
          height: 96px;
          object-fit: cover;
          border-radius: 50%;
          border: 4px solid #fff;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        }
        .avatar-placeholder {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: 700;
          color: #111;
        }
        .meta-row .meta-label {
          font-size: 12px;
          color: #6b7280;
        }
        .meta-row .meta-value {
          font-weight: 600;
        }
        .stats-row .stat-card {
          min-width: 180px;
          background: #fff;
          border-radius: 8px;
        }
        .stat-title {
          font-size: 13px;
          color: #6b7280;
        }
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          margin-top: 6px;
        }
        .stat-note {
          font-size: 12px;
          color: #10b981;
        }
        .summary-line {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .tabs-overview .nav-link {
          color: #6b7280 !important;
        }

        .tabs-overview .active {
          color: #624ce5 !important;
          border: none;
          border-bottom: 2px solid #624ce5;
          border-radius: unset;
        }

        .tabs-overview {
          border-bottom: 1px solid #ddd;
          padding-bottom: 0;
        }
      `}</style>
    </div>
  );
}
