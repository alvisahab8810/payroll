// import React, { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function Setting({ setTerms, setCustomerNotes }) {
//   const [tempTerms, setTempTerms] = useState("");
//   const [tempCustomerNotes, setTempCustomerNotes] = useState("");

//   const handleSaveTerms = async (e) => {
//     e.preventDefault();

//     const res = await fetch("/api/settings", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         terms: tempTerms,
//         customerNotes: tempCustomerNotes,
//       }),
//     });

//     if (res.ok) {
//       if (typeof setTerms === "function") setTerms(tempTerms);
//       if (typeof setCustomerNotes === "function") setCustomerNotes(tempCustomerNotes);

//       toast.success("Invoice settings saved successfully!");

//       setTempTerms("");
//       setTempCustomerNotes("");

//       const offcanvasEl = document.getElementById("invoiceSettings");
//       const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
//       bsOffcanvas.hide();
//     } else {
//       toast.error("Something went wrong while saving.");
//     }
//   };

//   return (
//     <div className="offcanvas offcanvas-end" tabIndex="-1" id="invoiceSettings">
//       <div className="offcanvas-header">
//         <h5 className="offcanvas-title">Invoice Settings</h5>
//         <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
//       </div>
//       <div className="offcanvas-body">
//         <form onSubmit={handleSaveTerms}>
//           <div className="mb-3">
//             <label className="form-label">Terms & Conditions</label>
//             <textarea
//               className="form-control"
//               rows="6"
//               value={tempTerms}
//               onChange={(e) => setTempTerms(e.target.value)}
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Customer Notes</label>
//             <textarea
//               className="form-control"
//               rows="6"
//               value={tempCustomerNotes}
//               onChange={(e) => setTempCustomerNotes(e.target.value)}
//             />
//           </div>

//           <button type="submit" className="btn btn-primary">
//             Save Settings
//           </button>
//         </form>
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//     </div>
//   );
// }

import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Setting({ setTerms, setCustomerNotes }) {
  const [tempTerms, setTempTerms] = useState("");
  const [tempCustomerNotes, setTempCustomerNotes] = useState("");

  const handleSaveTerms = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        terms: tempTerms,
        customerNotes: tempCustomerNotes,
      }),
    });

    if (res.ok) {
      if (typeof setTerms === "function") setTerms(tempTerms);
      if (typeof setCustomerNotes === "function")
        setCustomerNotes(tempCustomerNotes);

      toast.success("Invoice settings saved successfully!");

      setTempTerms("");
      setTempCustomerNotes("");

      const offcanvasEl = document.getElementById("invoiceSettings");
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      bsOffcanvas.hide();
    } else {
      toast.error(" Something went wrong while saving.");
    }
  };

  return (
    <div className="offcanvas offcanvas-end" tabIndex="-1" id="invoiceSettings">
      <div className="offcanvas-header border-bottom">
        <h5 className="offcanvas-title">
          <i className="bi bi-gear-fill me-2"></i>Invoice Settings
        </h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
        ></button>
      </div>

      <div className="offcanvas-body bg-light">
        <form onSubmit={handleSaveTerms} className="p-2">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <strong>Terms & Conditions</strong>
            </div>
            <div className="card-body">
              <textarea
                className="form-control"
                rows="6"
                placeholder="Enter invoice terms and conditions..."
                value={tempTerms}
                onChange={(e) => setTempTerms(e.target.value)}
              />
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-secondary text-white">
              <strong>Customer Notes</strong>
            </div>
            <div className="card-body">
              <textarea
                className="form-control"
                rows="6"
                placeholder="Enter customer notes for the invoice..."
                value={tempCustomerNotes}
                onChange={(e) => setTempCustomerNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-success btn-lg">
              <i className="bi bi-save me-2"></i>Save Settings
            </button>
          </div>
        </form>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
}
