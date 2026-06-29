import React, { useState } from "react";
import { Send, MessageCircle, X } from "lucide-react";
import { format } from "date-fns";
import { useTaskContext } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";

const QueryPanel = ({ task, onClose }) => {
  const { postQuery } = useTaskContext();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    await postQuery(task._id, message.trim());
    setMessage("");
    setSending(false);
  };

  const queries = task.queries || [];

  return (
    <div className="query-panel">
      <div className="query-panel-header">
        <div className="query-title">
          <MessageCircle size={18} />
          <span>Queries for: <strong>{task.title}</strong></span>
        </div>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
      </div>

      <div className="query-messages">
        {queries.length === 0 ? (
          <div className="query-empty">
            <MessageCircle size={36} opacity={0.3} />
            <p>No queries yet. Ask something!</p>
          </div>
        ) : (
          queries.map((q, i) => {
            const isMe = q.author === user._id || q.authorName === user.name;
            return (
              <div key={i} className={`query-bubble ${isMe ? "query-me" : "query-other"}`}>
                <div className="query-meta">
                  <span className={`query-role-badge ${q.authorRole === "ba" ? "role-ba" : "role-emp"}`}>
                    {q.authorRole === "ba" ? "👔 BA" : "👤 Employee"}
                  </span>
                  <span className="query-author">{q.authorName}</span>
                  <span className="query-time">
                    {format(new Date(q.createdAt), "MMM dd, h:mm a")}
                  </span>
                </div>
                <p className="query-message">{q.message}</p>
              </div>
            );
          })
        )}
      </div>

      <form className="query-input-row" onSubmit={handleSend}>
        <input
          type="text"
          className="query-input"
          placeholder="Type your query or reply..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={1000}
          autoFocus
        />
        <button type="submit" className="btn btn-primary btn-icon-send" disabled={!message.trim() || sending}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
export default QueryPanel;
