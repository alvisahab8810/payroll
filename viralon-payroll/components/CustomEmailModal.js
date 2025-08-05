import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";


const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
export default function CustomEmailModal({ open, onOpenChange, emailData }) {
  const [to, setTo] = useState(emailData.customerEmail);
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState(`Quotation - ${emailData.quotation.quoteNumber}`);
  const [htmlBody, setHtmlBody] = useState(
    "Dear Customer,<br><br>Please find attached your quotation.<br><br>Regards,<br>Viralon Sales"
  );
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sales/quotation/send-custom-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          cc,
          bcc,
          subject,
          htmlBody,
          pdfBase64: emailData.pdfBase64,
          filename: emailData.filename,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("Email sent successfully!");
        onOpenChange(false);
      } else {
        alert("Failed to send email: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error sending email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-3xl w-full max-h-[80vh] overflow-auto -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg focus:outline-none">
          <Dialog.Title className="text-lg font-semibold mb-4">Send Custom Email</Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CC</label>
              <input
                type="text"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">BCC</label>
              <input
                type="text"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <ReactQuill value={htmlBody} onChange={setHtmlBody} />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Dialog.Close
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
              disabled={loading}
            >
              Cancel
            </Dialog.Close>
            <button
              onClick={handleSend}
              disabled={loading}
              className={`px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50`}
            >
              {loading ? "Sending..." : "Send Email"}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
