import React from "react";
import { useAuth } from "../context/AuthContext";
import { Clock } from "lucide-react";

const PendingPage = () => {
  const { user, logout } = useAuth();
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="pending-icon"><Clock size={56} /></div>
        <h2 className="pending-title">Awaiting Approval</h2>
        <p className="pending-sub">
          Hi <strong>{user?.name}</strong>! Your account has been registered successfully.
        </p>
        <p className="pending-sub">
          The Business Analyst needs to approve your account before you can access tasks.
          Please contact your BA and ask them to approve your account from the <strong>Team Management</strong> panel.
        </p>
        <div className="pending-info">
          <div>📧 Registered email: <strong>{user?.email}</strong></div>
          <div>⏳ Status: <strong>Pending Approval</strong></div>
        </div>
        <button className="btn btn-secondary btn-full" onClick={logout} style={{marginTop:24}}>
          Logout
        </button>
      </div>
    </div>
  );
};
export default PendingPage;
