import React, { useEffect, useState } from "react";
import { getPendingUsers, approveUser, rejectUser, getAllUsers } from "../utils/api";
import { UserCheck, UserX, Users } from "lucide-react";
import toast from "react-hot-toast";

const TeamPanel = ({ onClose }) => {
  const [pending, setPending] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tab, setTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [p, a] = await Promise.all([getPendingUsers(), getAllUsers()]);
      setPending(p.data.data);
      setAllUsers(a.data.data);
    } catch { toast.error("Failed to load users"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id, name) => {
    await approveUser(id);
    toast.success(`✅ ${name} approved as Employee!`);
    load();
  };

  const handleReject = async (id, name) => {
    if (window.confirm(`Remove ${name}'s account?`)) {
      await rejectUser(id);
      toast.success(`${name} removed`);
      load();
    }
  };

  return (
    <div className="team-panel">
      <div className="team-tabs">
        <button className={`auth-tab ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>
          Pending Approvals {pending.length > 0 && <span className="notif-dot">{pending.length}</span>}
        </button>
        <button className={`auth-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
          <Users size={14} /> All Employees
        </button>
      </div>

      {loading ? <p style={{padding:20,color:"var(--text-muted)"}}>Loading...</p> : (
        <>
          {tab === "pending" && (
            <div className="user-list">
              {pending.length === 0 ? (
                <div className="query-empty"><UserCheck size={36} opacity={0.3} /><p>No pending approvals 🎉</p></div>
              ) : pending.map(u => (
                <div key={u._id} className="user-row">
                  <div className="user-info">
                    <div className="user-avatar">{u.name[0].toUpperCase()}</div>
                    <div>
                      <div className="user-name">{u.name}</div>
                      <div className="user-email">{u.email}</div>
                      <div className="user-joined">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => handleApprove(u._id, u.name)}>
                      <UserCheck size={14} /> Approve
                    </button>
                    <button className="btn btn-danger-outline btn-sm" onClick={() => handleReject(u._id, u.name)}>
                      <UserX size={14} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "all" && (
            <div className="user-list">
              {allUsers.length === 0 ? (
                <div className="query-empty"><p>No employees yet</p></div>
              ) : allUsers.map(u => (
                <div key={u._id} className="user-row">
                  <div className="user-info">
                    <div className="user-avatar">{u.name[0].toUpperCase()}</div>
                    <div>
                      <div className="user-name">{u.name}</div>
                      <div className="user-email">{u.email}</div>
                    </div>
                  </div>
                  <span className={`badge ${u.isApproved ? "badge-completed" : "badge-todo"}`}>
                    {u.isApproved ? "Active" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default TeamPanel;
