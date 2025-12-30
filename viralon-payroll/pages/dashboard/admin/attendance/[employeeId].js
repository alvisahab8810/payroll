// // pages/dashboard/admin/attendance/[employeeId].js
// import { useEffect, useState } from "react";
// import Head from "next/head";
// import { useRouter } from "next/router";
// import Leftbar from "@/components/Leftbar";
// import LeftbarMobile from "@/components/LeftbarMobile";
// import Dashnav from "@/components/Dashnav";
// import Link from "next/link";

// export default function EmployeeAttendancePage() {
//   const router = useRouter();
//   const { employeeId } = router.query;

//   const [selectedMonth, setSelectedMonth] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [report, setReport] = useState(null);

//   // Set default month (browser local)
//   useEffect(() => {
//     const now = new Date();
//     const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
//     const localMonth = local.getMonth() + 1;
//     const localYear = local.getFullYear();
//     const formatted = `${localYear}-${String(localMonth).padStart(2, "0")}`;
//     setSelectedMonth(formatted);
//   }, []);

//   // Fetch monthly report
//   useEffect(() => {
//     if (!employeeId || !selectedMonth) return;

//     const fetchReport = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `/api/employee/monthly?employeeId=${employeeId}&month=${selectedMonth}`
//         );
//         const data = await res.json();
//         if (!data.success) {
//           setReport(null);
//           setLoading(false);
//           return;
//         }

//         // Compute summary & normalize status
//         const [yearStr, monthStr] = selectedMonth.split("-");
//         const year = parseInt(yearStr);
//         const monthIndex = parseInt(monthStr) - 1;
//         const totalDays = new Date(year, monthIndex + 1, 0).getDate();

//         const getLocalDateString = (date = new Date()) => {
//           const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
//           return local.toISOString().split("T")[0];
//         };

//         const allDates = Array.from({ length: totalDays }, (_, i) => {
//           const d = new Date(year, monthIndex, i + 1);
//           return getLocalDateString(d);
//         });

//         const apiRecords = (data.records || []).filter((r) =>
//           r.date.startsWith(selectedMonth)
//         );

//         const existing = new Map();
//         apiRecords.forEach((r) => existing.set(r.date, r));

//         const now = new Date();
//         const today = getLocalDateString(now);

//         const normalizeRecord = (r) => {
//           const rec = { ...r };
//           const hasCheckIn = r.checkIn && r.checkIn !== "-" && r.checkIn !== null;
//           const hasCheckOut = r.checkOut && r.checkOut !== "-" && r.checkOut !== null;

//           if (hasCheckIn && !hasCheckOut) {
//             rec.computedStatus = r.date === today ? "On Duty" : "Missing Checkout";
//           } else if (!hasCheckIn) {
//             rec.computedStatus = r.status || "Not Clocked In";
//           } else {
//             rec.computedStatus = r.status || "On Time";
//           }

//           return rec;
//         };

//         const leaveRecords = allDates
//           .filter((d) => !existing.has(d))
//           .filter((d) => d < today)
//           .map((d) => ({
//             date: d,
//             checkIn: "-",
//             checkOut: "-",
//             status: "Leave",
//             computedStatus: "Leave",
//           }));

//         const normalized = apiRecords.map(normalizeRecord);
//         const merged = [...normalized, ...leaveRecords].sort(
//           (a, b) => new Date(a.date) - new Date(b.date)
//         );

//         const summary = {
//           totalDays,
//           onTime: merged.filter((r) => r.computedStatus === "On Time").length,
//           late: merged.filter((r) => r.computedStatus === "Late").length,
//           missingCheckout: merged.filter((r) => r.computedStatus === "Missing Checkout").length,
//           notClockedIn: merged.filter((r) =>
//             ["Not Clocked In", "Not ClockedIn"].includes(r.computedStatus)
//           ).length,
//           leave: merged.filter((r) => r.computedStatus === "Leave").length,
//         };

//         setReport({ employee: data.employee, records: merged, summary });
//       } catch (err) {
//         console.error("❌ Monthly report fetch error:", err);
//         setReport(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReport();
//   }, [employeeId, selectedMonth]);

//   const exportCSV = () => {
//     if (!report) return;
//     const header = "Date,Check In,Check Out,Status\n";
//     const rows = report.records.map(
//       (r) => `${r.date},${r.checkIn || "-"},${r.checkOut || "-"},${r.computedStatus || r.status}`
//     );
//     const csv = header + rows.join("\n");
//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${report.employee?.name || "employee"}_${selectedMonth}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const statusClass = (s) => (s ? s.toLowerCase().replace(/\s+/g, "-") : "");

//   return (
//     <div>
//       <Head>
//         <link rel="stylesheet" href="/asets/css/bootstrap.min.css" />
//         <link rel="stylesheet" href="/asets/css/main.css" />
//         <link rel="stylesheet" href="/asets/css/admin.css" />
//         <link
//           rel="stylesheet"
//           href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
//         />
//       </Head>

//       <div className="dashboard-container add-employee-area">
//         <div className="main-nav">
//           <Leftbar />
//           <LeftbarMobile />
//           <Dashnav />

//           <section className="content home">
//             <div className="breadcrum-bx">
//               <ul className="breadcrumb bg-white">
//                 <li className="breadcrumb-item">
//                   <Link href="/dashboard/dashboard">
//                     <img src="/icons/home.svg" alt="home" /> Attendance Summary
//                   </Link>
//                 </li>
//               </ul>
//             </div>

//           <div className="block-header add-emp-area">

//             {report?.employee && (
//               <div className="employee-info-header">
//                 {report.employee.avatar && (
//                   <img src={report.employee.avatar} alt="avatar" className="avatar" />
//                 )}
//                 <div>
//                   <h3 className="mb-0">{report.employee.name}</h3>
//                   <p className="designation mb-0">
//                     {report.employee.designation} • {report.employee.type}
//                   </p>
//                 </div>
//               </div>
//             )}

//             <div className="controls">
//               <input
//                 type="month"
//                 value={selectedMonth}
//                 onChange={(e) => setSelectedMonth(e.target.value)}
//               />
//               <button className="export-btn" onClick={exportCSV}>
//                 ⬇ Export CSV
//               </button>
//             </div>

//             {loading ? (
//               <p>Loading...</p>
//             ) : report ? (
//               <>
//                 <div className="summary-cards">
//                   <div className="card total">
//                     <h5>Total Days</h5>
//                     <p>{report.summary.totalDays}</p>
//                   </div>
//                   <div className="card on-time">
//                     <h5>On Time</h5>
//                     <p>{report.summary.onTime}</p>
//                   </div>
//                   <div className="card late">
//                     <h5>Late</h5>
//                     <p>{report.summary.late}</p>
//                   </div>
//                   <div className="card missing">
//                     <h5>Missing Checkout</h5>
//                     <p>{report.summary.missingCheckout}</p>
//                   </div>
//                   <div className="card leave">
//                     <h5>Leave</h5>
//                     <p>{report.summary.leave}</p>
//                   </div>
//                 </div>

//                 <table className="styled-table">
//                   <thead>
//                     <tr>
//                       <th>Date</th>
//                       <th>Check In</th>
//                       <th>Check Out</th>
//                       <th>Status</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {report.records.map((r, idx) => (
//                       <tr key={idx}>
//                         <td>{r.date}</td>
//                         <td>{r.checkIn || "-"}</td>
//                         <td>{r.checkOut || "-"}</td>
//                         <td className={`status ${statusClass(r.computedStatus)}`}>
//                           {r.computedStatus}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </>
//             ) : (
//               <p>No report found.</p>
//             )}

//             <style jsx>{`
//               .employee-info-header {
//                 display: flex;
//                 align-items: center;
//                 gap: 12px;
//                 margin-bottom: 20px;
//               }
//               .avatar {
//                 width: 48px;
//                 height: 48px;
//                 border-radius: 50%;
//                 object-fit: cover;
//               }
//               .designation {
//                 font-size: 0.9rem;
//                 color: #666;
//               }
//               .controls {
//                 display: flex;
//                 justify-content: space-between;
//                 gap: 10px;
//                 margin-bottom: 20px;
//               }
//               .export-btn {
//                 background: #3fc28a;
//                 color: #fff;
//                 border: none;
//                 padding: 6px 12px;
//                 border-radius: 6px;
//                 cursor: pointer;
//               }
//               .summary-cards {
//                 display: grid;
//                 grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
//                 gap: 16px;
//                 margin-bottom: 20px;
//               }
//               .summary-cards .card {
//                 padding: 16px;
//                 border-radius: 10px;
//                 color: #fff;
//                 text-align: center;
//                 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//               }
//               .card.total { background: #5a3fd8; }
//               .card.on-time { background: #3fc28a; }
//               .card.late { background: #f45b69; }
//               .card.missing { background: #ffc107; color: #000; }
//               .card.leave { background: #17a2b8; }

//               .styled-table {
//                 width: 100%;
//                 border-collapse: collapse;
//               }
//               .styled-table th,
//               .styled-table td {
//                 padding: 12px;
//                 border-bottom: 1px solid #ddd;
//                 text-align: center;
//               }
//               .styled-table tbody tr:hover {
//                 background: #f9f9f9;
//               }
//               .status.on-time { color: #3fc28a; font-weight: bold; }
//               .status.late { color: #f45b69; font-weight: bold; }
//               .status.missing-checkout { color: #ffc107; font-weight: bold; }
//               .status.not-clocked-in { color: #6c757d; font-weight: bold; }
//               .status.leave { color: #17a2b8; font-weight: bold; }
//               .status.on-duty { color: #0d6efd; font-weight: 600; }
//             `}</style>

//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }












// pages/dashboard/admin/attendance/[employeeId].js
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Leftbar from "@/components/Leftbar";
import LeftbarMobile from "@/components/LeftbarMobile";
import Dashnav from "@/components/Dashnav";
import Link from "next/link";

export default function EmployeeAttendancePage() {
  const router = useRouter();
  const { employeeId } = router.query;

  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // Set default month (browser local)
  useEffect(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    const localMonth = local.getMonth() + 1;
    const localYear = local.getFullYear();
    const formatted = `${localYear}-${String(localMonth).padStart(2, "0")}`;
    setSelectedMonth(formatted);
  }, []);

  // Fetch monthly report
  useEffect(() => {
    if (!employeeId || !selectedMonth) return;

    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/employee/monthly?employeeId=${employeeId}&month=${selectedMonth}`
        );
        const data = await res.json();
        if (!data.success) {
          setReport(null);
          setLoading(false);
          return;
        }

        const [yearStr, monthStr] = selectedMonth.split("-");
        const year = parseInt(yearStr);
        const monthIndex = parseInt(monthStr) - 1;
        const totalDays = new Date(year, monthIndex + 1, 0).getDate();

        const getLocalDateString = (date = new Date()) => {
          const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
          return local.toISOString().split("T")[0];
        };

        const allDates = Array.from({ length: totalDays }, (_, i) => {
          const d = new Date(year, monthIndex, i + 1);
          return getLocalDateString(d);
        });

        const apiRecords = (data.records || []).filter((r) =>
          r.date.startsWith(selectedMonth)
        );

        const existing = new Map();
        apiRecords.forEach((r) => existing.set(r.date, r));

        const today = getLocalDateString(new Date());

        const normalizeRecord = (r) => {
          const rec = { ...r };
          const hasCheckIn = r.checkIn && r.checkIn !== "-" && r.checkIn !== null;
          const hasCheckOut = r.checkOut && r.checkOut !== "-" && r.checkOut !== null;

          if (hasCheckIn && !hasCheckOut) {
            rec.computedStatus = r.date === today ? "On Duty" : "Missing Checkout";
          } else if (!hasCheckIn) {
            rec.computedStatus = r.status || "Not Clocked In";
          } else {
            rec.computedStatus = r.status || "On Time";
          }

          return rec;
        };

        const leaveRecords = allDates
          .filter((d) => !existing.has(d))
          .filter((d) => d < today)
          .map((d) => ({
            date: d,
            checkIn: "-",
            checkOut: "-",
            status: "Leave",
            computedStatus: "Leave",
          }));

        const normalized = apiRecords.map(normalizeRecord);
        const merged = [...normalized, ...leaveRecords].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const summary = {
          totalDays,
          onTime: merged.filter((r) => r.computedStatus === "On Time").length,
          late: merged.filter((r) => r.computedStatus === "Late").length,
          missingCheckout: merged.filter((r) => r.computedStatus === "Missing Checkout").length,
          notClockedIn: merged.filter((r) =>
            ["Not Clocked In", "Not ClockedIn"].includes(r.computedStatus)
          ).length,
          leave: merged.filter((r) => r.computedStatus === "Leave").length,
        };

        setReport({ employee: data.employee, records: merged, summary });
      } catch (err) {
        console.error("❌ Monthly report fetch error:", err);
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [employeeId, selectedMonth]);

  const exportCSV = () => {
    if (!report) return;
    const header = "Date,Check In,Check Out,Status\n";
    const rows = report.records.map(
      (r) => `${r.date},${r.checkIn || "-"},${r.checkOut || "-"},${r.computedStatus || r.status}`
    );
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.employee?.name || "employee"}_${selectedMonth}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const statusClass = (s) => (s ? s.toLowerCase().replace(/\s+/g, "-") : "");

  // Pagination calculations
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = report?.records.slice(indexOfFirst, indexOfLast) || [];
  const totalPages = report ? Math.ceil(report.records.length / recordsPerPage) : 1;

  return (
    <div>
      <Head>
        <link rel="stylesheet" href="/asets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/asets/css/main.css" />
        <link rel="stylesheet" href="/asets/css/admin.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        />
      </Head>

      <div className="dashboard-container add-employee-area">
        <div className="main-nav">
          <Leftbar />
          <LeftbarMobile />
          <Dashnav />

          <section className="content home">
            <div className="breadcrum-bx">
              <ul className="breadcrumb bg-white">
                <li className="breadcrumb-item">
                  <Link href="/dashboard/dashboard">
                    <img src="/icons/home.svg" alt="home" /> Attendance Summary
                  </Link>
                </li>
              </ul>
            </div>

              <div className="block-header add-emp-area">

            {report?.employee && (
              <div className="employee-info-header">
                {report.employee.avatar && (
                  <img src={report.employee.avatar} alt="avatar" className="avatar" />
                )}
                <div>
                  <h3 className="mb-0">{report.employee.name}</h3>
                  <p className="designation mb-0">
                    {report.employee.designation} • {report.employee.type}
                  </p>
                </div>
              </div>
            )}

            <div className="controls">
              <input
                className="pl-2 pr-2  rounded-3"
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPage(1); // reset page when month changes
                }}
              />
              <button className="export-btn" onClick={exportCSV}>
                ⬇ Export CSV
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : report ? (
              <>
                <div className="summary-cards">
                  <div className="card total">
                    <h5>Total Days</h5>
                    <p>{report.summary.totalDays}</p>
                  </div>
                  <div className="card on-time">
                    <h5>On Time</h5>
                    <p>{report.summary.onTime}</p>
                  </div>
                  <div className="card late">
                    <h5>Late</h5>
                    <p>{report.summary.late}</p>
                  </div>
                  <div className="card missing">
                    <h5>Missing Checkout</h5>
                    <p>{report.summary.missingCheckout}</p>
                  </div>
                  <div className="card leave">
                    <h5>Leave</h5>
                    <p>{report.summary.leave}</p>
                  </div>
                </div>

                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((r, idx) => (
                      <tr key={idx}>
                        <td>{r.date}</td>
                        <td>{r.checkIn || "-"}</td>
                        <td>{r.checkOut || "-"}</td>
                        <td className={`status ${statusClass(r.computedStatus)}`}>
                          {r.computedStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="pagination">
                  <span>
                    Showing {indexOfFirst + 1} to{" "}
                    {Math.min(indexOfLast, report.records.length)} of{" "}
                    {report.records.length} records
                  </span>
                  <div className="pages">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={currentPage === i + 1 ? "active" : ""}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p>No report found.</p>
            )}

            <style jsx>{`
              .employee-info-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
              }
              .avatar {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                object-fit: cover;
              }
              .designation {
                font-size: 0.9rem;
                color: #666;
              }
              .controls {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                margin-bottom: 20px;
              }
              .export-btn {
                background: #3fc28a;
                color: #fff;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
              }
              .summary-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 16px;
                margin-bottom: 20px;
              }
              .summary-cards .card {
                padding: 16px;
                border-radius: 10px;
                color: #fff;
                text-align: center;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .card.total { background: #5a3fd8; }
              .card.on-time { background: #3fc28a; }
              .card.late { background: #f45b69; }
              .card.missing { background: #ffc107; color: #000; }
              .card.leave { background: #17a2b8; }

              .styled-table {
                width: 100%;
                border-collapse: collapse;
              }
              .styled-table th,
              .styled-table td {
                padding: 12px;
                border-bottom: 1px solid #ddd;
                text-align: center;
              }
              .styled-table tbody tr:hover {
                background: #f9f9f9;
              }
              .status.on-time { color: #3fc28a; font-weight: bold; }
              .status.late { color: #f45b69; font-weight: bold; }
              .status.missing-checkout { color: #ffc107; font-weight: bold; }
              .status.not-clocked-in { color: #6c757d; font-weight: bold; }
              .status.leave { color: #17a2b8; font-weight: bold; }
              .status.on-duty { color: #0d6efd; font-weight: 600; }

              /* Pagination */
              .pagination {
                margin-top: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .pages button {
                margin: 0 3px;
                padding: 5px 10px;
                border: 1px solid #5a3fd8;
                background: none;
                color: #000000ff;
                border-radius: 4px;
                cursor: pointer;
              }
              .pages .active {
                background: #5a3fd8;
                color: #fff;
              }
            `}</style>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}






