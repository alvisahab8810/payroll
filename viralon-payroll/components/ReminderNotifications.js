// import { useEffect, useState } from "react";

// // ⏰ Reminder generation logic
// const generateReminders = (leadsArray) => {
//   const now = new Date();
//   const reminders = [];

//   if (!Array.isArray(leadsArray)) return reminders;

//   leadsArray.forEach((lead) => {
//     const { _id, name = "Unnamed", customFields = {} } = lead;
//     const firstContactDate = new Date(customFields["First contact date"]);
//     const proposalDate = new Date(customFields["Proposal date"]);
//     const contactedBy = customFields["Contacted by"];
//     const status = customFields["Status"];

//     // Missed first contact
//     if (
//       firstContactDate &&
//       !isNaN(firstContactDate) &&
//       firstContactDate < now &&
//       !contactedBy
//     ) {
//       reminders.push({
//         id: `${_id}-contact`,
//         leadId: _id,
//         message: `⏳ First contact was due on ${firstContactDate.toLocaleDateString()} for "${name}".`,
//       });
//     }

//     // Proposal follow-up
//     if (
//       proposalDate &&
//       !isNaN(proposalDate) &&
//       proposalDate < now &&
//       !status
//     ) {
//       reminders.push({
//         id: `${_id}-proposal`,
//         leadId: _id,
//         message: `📄 Proposal was due on ${proposalDate.toLocaleDateString()} for "${name}", but no status updated.`,
//       });
//     }
//   });

//   return reminders;
// };

// export default function ReminderNotifications() {
//   const [leads, setLeads] = useState([]);
//   const [dismissed, setDismissed] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch from both endpoints and merge
// useEffect(() => {
//   const fetchLeads = async () => {
//     console.log("🚀 Fetching leads..."); // <== NEW TOP-LEVEL LOG

//     try {
//       const [contactRes, queryRes] = await Promise.all([
//         fetch("/api/queries/contact"),
//         fetch("/api/queries/query"),
//       ]);

//       console.log("📡 contactRes:", contactRes);
//       console.log("📡 queryRes:", queryRes);

//       const contactJson = await contactRes.json();
//       const queryJson = await queryRes.json();

//       console.log("📦 contactJson:", contactJson);
//       console.log("📦 queryJson:", queryJson);

//       const contactData = contactJson.data || contactJson;
//       const queryData = queryJson.data || queryJson;

//       const allLeads = [...(contactData || []), ...(queryData || [])];
//       console.log("✅ allLeads:", allLeads);

//       setLeads(allLeads);
//     } catch (error) {
//       console.error("❌ Error fetching leads (top-level catch):", error);
//       setLeads([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchLeads();
// }, []);

//   // Load dismissed reminders from localStorage
//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("dismissedReminders") || "[]");
//     setDismissed(stored);
//   }, []);

//   const allReminders = generateReminders(leads);
//   const visibleReminders = allReminders.filter((r) => !dismissed.includes(r.id));

//   const dismiss = (id) => {
//     const updated = [...dismissed, id];
//     setDismissed(updated);
//     localStorage.setItem("dismissedReminders", JSON.stringify(updated));
//   };

//   if (loading || visibleReminders.length === 0) return null;

//   return (
//     <div className="reminder-box p-3 mb-4 bg-warning-subtle border rounded">
//       <h5 className="mb-3">🔔 Reminders</h5>
//       <ul className="list-unstyled mb-0">
//         {visibleReminders.map((r) => (
//           <li key={r.id} className="d-flex justify-content-between align-items-start mb-2">
//             <span>{r.message}</span>
//             <button
//               onClick={() => dismiss(r.id)}
//               className="btn btn-sm btn-outline-secondary ms-3"
//             >
//               Mark as Done
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Bell, CheckCircle } from "lucide-react"; // For icons (ensure lucide-react is installed)

const generateReminders = (leadsArray) => {
  const now = new Date();
  const reminders = [];

  if (!Array.isArray(leadsArray)) return reminders;

  leadsArray.forEach((lead) => {
    const { _id, name = "Unnamed", customFields = {} } = lead;
    const firstContactDate = new Date(customFields["First contact date"]);
    const proposalDate = new Date(customFields["Proposal date"]);
    const contactedBy = customFields["Contacted by"];
    const status = customFields["Status"];

    if (
      firstContactDate &&
      !isNaN(firstContactDate) &&
      firstContactDate < now &&
      !contactedBy
    ) {
      reminders.push({
        id: `${_id}-contact`,
        leadId: _id,
        message: `⏳ First contact was due on ${firstContactDate.toLocaleDateString()} for "${name}".`,
      });
    }

    if (proposalDate && !isNaN(proposalDate) && proposalDate < now && !status) {
      reminders.push({
        id: `${_id}-proposal`,
        leadId: _id,
        message: `📄 Proposal was due on ${proposalDate.toLocaleDateString()} for "${name}", but no status updated.`,
      });
    }
  });

  return reminders;
};

export default function ReminderNotifications() {
  const [leads, setLeads] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const [contactRes, queryRes] = await Promise.all([
          fetch("/api/queries/contact"),
          fetch("/api/queries/query"),
        ]);
        const [contactJson, queryJson] = await Promise.all([
          contactRes.json(),
          queryRes.json(),
        ]);

        const contactData = contactJson.data || [];
        const queryData = queryJson.data || [];

        const allLeads = [...contactData, ...queryData];
        setLeads(allLeads);
      } catch (err) {
        console.error("❌ Error fetching leads:", err);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  useEffect(() => {
    const stored = JSON.parse(
      localStorage.getItem("dismissedReminders") || "[]"
    );
    setDismissed(stored);
  }, []);

  const allReminders = generateReminders(leads);
  const visibleReminders = allReminders.filter(
    (r) => !dismissed.includes(r.id)
  );

  const dismiss = (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem("dismissedReminders", JSON.stringify(updated));
  };

  if (loading || visibleReminders.length === 0) return null;

  return (
    <div className="nortification-container bg-white max-w-3xl mx-auto bg-yellow-50 border border-yellow-200 rounded-xl shadow-md p-4 mt-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4 text-yellow-700 font-semibold text-lg  text-dark fw-bold ">
        {/* <Bell size={20} className="text-yellow-600" /> */}
        <a href="#" className=" dropdown" data-toggle="dropdown" role="button">
          <i className="zmdi zmdi-notifications"></i>
          <div className="notify">
            <span className="heartbit"></span>
            <span className="point"></span>
          </div>
        </a>
        Reminder Notifications
      </div>

      <ul className="space-y-3">
        {visibleReminders.map((r) => (
          <li
            key={r.id}
            className="flex justify-between items-center bg-white border border-yellow-100 rounded-md  shadow-sm hover:shadow-md transition"
          >
            <span className="text-sm text-gray-700">{r.message}</span>
            <button
              onClick={() => dismiss(r.id)}
              className="text-sm text-green-600 hover:text-green-800 font-medium inline-flex items-center gap-1"
            >
              <CheckCircle size={16} />
              Mark as Done
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
