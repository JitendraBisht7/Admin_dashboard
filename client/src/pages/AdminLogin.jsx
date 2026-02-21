import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    const trimmedId = adminId.trim();
    const trimmedPassword = password.trim();

    if (!trimmedId || !trimmedPassword) {
      setError("Please enter both Admin ID and password");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/admin/login", {
        adminId: trimmedId,
        password: trimmedPassword
      });

      if (res.data && res.data.success) {
        localStorage.setItem("isAdmin", "true");
        // Add a small delay for better UX feel
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        setError(res.data?.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);

      let msg = "An unexpected error occurred. Please try again.";

      if (!err.response) {
        msg = "Cannot connect to server. Please check if the backend is running on port 5001.";
      } else if (err.response.status === 401) {
        msg = err.response.data?.message || "Invalid Admin ID or Password";
      } else if (err.response.data?.message) {
        msg = err.response.data.message;
      }

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        {error && <div className="form-error">{error}</div>}
        <label>
          Admin ID
          <input
            name="adminId"
            autoComplete="username"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            disabled={loading}
            placeholder="Enter Admin ID"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            placeholder="Enter Password"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
