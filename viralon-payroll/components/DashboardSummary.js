

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const RANGE_OPTIONS = [
  { label: "This Fiscal Year", value: "currentFY" },
  { label: "Previous Fiscal Year", value: "lastFY" },
  { label: "Last 12 Months", value: "last12Months" },
];

export default function DashboardSummary() {

const [invoiceData, setInvoiceData] = useState([]);

  useEffect(() => {
  const fetchInvoiceSummary = async () => {
    const res = await fetch("/api/dashboard/invoice-summary");
    const data = await res.json();
    if (data.success) {
      setInvoiceData(data.data);
    }
  };

  fetchInvoiceSummary();
}, []);

  const [quotationData, setQuotationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/quotation-summary");
        const result = await res.json();
        if (result.success) {
          setQuotationData(result.data);
        }
      } catch (error) {
        console.error("Error fetching quotation summary:", error);
      }
    };

    fetchData();
  }, []);

  const [clientData, setClientData] = useState([]);

  useEffect(() => {
    fetch("/api/dashboard/client-onboarding-summary")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setClientData(json.data);
        }
      });
  }, []);

  const [leadData, setLeadData] = useState([]);

  useEffect(() => {
    fetch("/api/dashboard/leads-summary")
      .then((res) => res.json())
      .then((json) => json.success && setLeadData(json.data))
      .catch((err) => console.error("Lead chart fetch error", err));
  }, []);

  const [range, setRange] = useState("currentFY");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    setSummary(null);
    fetch(`/api/dashboard/summary?range=${range}`)
      .then((res) => res.json())
      .then((json) => json.success && setSummary(json.data))
      .catch((err) => console.error("Dashboard fetch error", err));
  }, [range]);

  if (!summary) return <div>Loading dashboard…</div>;

  // ✅ These depend on `summary`, so define them only after the check
  const pieData = [
    { name: "Income", value: summary.incomeExpense.totalIncome },
    { name: "Expense", value: summary.incomeExpense.totalExpense },
  ];
  const COLORS = ["#4ade80", "#f87171"];

  const cashData = summary.cashFlow.monthly.map((m) => ({
    month: m.month,
    Incoming: m.incoming,
    Outgoing: m.outgoing,
  }));

  const ieData = summary.incomeExpense.monthly.map((m) => ({
    month: m.month,
    Income: m.income,
    Expense: m.expense,
  }));

  const formatMonthTick = (tick) => {
    const [y, m] = tick.split("-");
    return new Date(y, Number(m) - 1).toLocaleString("default", {
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <div className=" case-flow-main">
  {/* ====== Metrics Cards ====== */}
  <div className="row g-3">
    {invoiceData.length > 0 && (
      <div className="col-md-6 col-lg-4">
        <div className="card p-3 shadow-sm h-100">
          <h6 className="mb-3">Invoices Generated (Monthly)</h6>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={invoiceData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="invoices" fill="#ff6f61" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}

    {quotationData.length > 0 && (
      <div className="col-md-6 col-lg-4">
        <div className="card p-3 shadow-sm h-100">
          <h6 className="mb-3">Quotations Created (Monthly)</h6>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quotationData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}

    {clientData.length > 0 && (
      <div className="col-md-6 col-lg-4">
        <div className="card p-3 shadow-sm h-100">
          <h6 className="mb-3">Client Onboarding (Monthly)</h6>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientData}>
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    )}
  </div>

  {/* ====== Receivables & Pie Chart ====== */}
  <div className="row g-3 mt-2">
    <div className="col-md-6">
      <div className="card shadow-sm h-100">
        <h6 className="total-reveivables p-3">Total Receivables</h6>
        <div className="p-3">
          <p>Unpaid Invoices: ₹{summary.receivables.total.toLocaleString()}</p>
          <p>Current: ₹{summary.receivables.current.toLocaleString()}</p>
          <p className="text-danger">Overdue: ₹{summary.receivables.overdue.toLocaleString()}</p>
        </div>
      </div>
    </div>

    <div className="col-md-6">
      <div className="card p-3 shadow-sm h-100">
        <h6 className="mb-3">Income vs Expense (Pie Chart)</h6>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ₹${Number(value).toLocaleString()}`}
              isAnimationActive={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-muted small mt-2">
          <strong>Total:</strong> ₹
          {pieData.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
        </div>
      </div>
    </div>
  </div>

  {/* ====== Leads ====== */}
  <div className="card p-3 mt-4 shadow-sm">
    <h6 className="mb-2">Leads Over Last 6 Months</h6>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={leadData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Leads" fill="#38bdf8" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* ====== Cash Flow ====== */}
  <div className="card p-3 shadow-sm">
    <div className="d-flex justify-content-between align-items-center mb-2">
      <h6 className="mb-0">Cash Flow</h6>
      <select
        className="form-select form-select-sm w-auto"
        value={range}
        onChange={(e) => setRange(e.target.value)}
      >
        {RANGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
    <p>
      Opening: ₹{summary.cashFlow.opening.toLocaleString()} &nbsp;|&nbsp;
      Incoming: ₹{summary.cashFlow.incoming.toLocaleString()} &nbsp;|&nbsp;
      Outgoing: ₹{summary.cashFlow.outgoing.toLocaleString()} &nbsp;|&nbsp;
      Closing: ₹{summary.cashFlow.closing.toLocaleString()}
    </p>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={cashData}>
        <XAxis dataKey="month" tickFormatter={formatMonthTick} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Incoming" fill="#4ade80" />
        <Bar dataKey="Outgoing" fill="#f87171" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* ====== Income vs Expense Chart ====== */}
  <div className="card p-3  shadow-sm">
    <h6 className="mb-2">Income vs Expense</h6>
    <p>
      Total Income: ₹{summary.incomeExpense.totalIncome.toLocaleString()} &nbsp;|&nbsp;
      Total Expenses: ₹{summary.incomeExpense.totalExpense.toLocaleString()}
    </p>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={ieData}>
        <XAxis dataKey="month" tickFormatter={formatMonthTick} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Income" fill="#60a5fa" />
        <Bar dataKey="Expense" fill="#facc15" />
      </BarChart>
    </ResponsiveContainer>
  </div>



  
</div>

  );
}
