// pages/employee/login.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function EmployeeLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (router.query.email) {
      setEmail(decodeURIComponent(router.query.email));
    }
  }, [router.query.email]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/payroll/employee-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (data.success) {
      router.push("/employee/dashboard");
    } else {
      setError(data.message || "Login failed.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Employee Login</h2>
      <form onSubmit={handleLogin} className="mt-3">
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!!router.query.email} // read-only if from invite
          />
        </div>
        {error && <div className="text-danger mb-2">{error}</div>}
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
}
