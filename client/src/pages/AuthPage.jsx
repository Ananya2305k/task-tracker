import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AuthPage = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", secretKey: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (mode === "register" && !form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Min 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        const data = await login(form.email, form.password);
        toast.success(`Welcome back, ${data.user.name}! 👋`);
      } else {
        const data = await register(form);
        if (data.user.role === "pending") {
          toast.success("Registered! Waiting for BA approval. 🕐");
        } else {
          toast.success(`Welcome, ${data.user.name}! You're the Business Analyst. 🎉`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon-lg">✅</span>
          <h1 className="auth-brand-title">TaskFlow</h1>
          <p className="auth-brand-sub">Office Task Management System</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Login</button>
          <button className={`auth-tab ${mode === "register" ? "active" : ""}`} onClick={() => setMode("register")}>Register</button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="Your full name" className={`form-input ${errors.name ? "input-error" : ""}`} />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@company.com" className={`form-input ${errors.email ? "input-error" : ""}`} />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="••••••••" className={`form-input ${errors.password ? "input-error" : ""}`} />
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">
                BA Secret Key <span className="form-hint">(leave blank if you're an Employee)</span>
              </label>
              <input type="password" name="secretKey" value={form.secretKey} onChange={handleChange}
                placeholder="Only Business Analyst has this key" className="form-input" />
              <p className="form-hint-block">💡 If you're an employee, leave this blank. Your account will be approved by the BA.</p>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login →" : "Create Account"}
          </button>
        </form>

        {mode === "register" && (
          <div className="auth-info-box">
            <strong>How it works:</strong>
            <ul>
              <li>🏢 First registered user becomes <strong>Business Analyst</strong></li>
              <li>👤 Others register as employees → BA approves them</li>
              <li>🔑 Or use the BA Secret Key to register as BA directly</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default AuthPage;
