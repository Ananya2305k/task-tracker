import React, { useState } from "react";
import { Pencil, Trash2, Calendar, Tag, ChevronDown, MessageCircle, Image } from "lucide-react";
import { format, isPast, isToday } from "date-fns";
import Badge from "./Badge";
import { useTaskContext } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";

const TaskCard = ({ task, onEdit, onQueryOpen }) => {
  const { changeStatus, removeTask } = useTaskContext();
  const { isBA } = useAuth();
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.title}"?`)) removeTask(task._id);
  };

  const handleStatusChange = (s) => { changeStatus(task._id, s); setShowStatusMenu(false); };

  const isOverdue = task.dueDate && task.status !== "completed" && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate)) && task.status !== "completed";

  return (
    <div className={`task-card priority-${task.priority} ${task.status === "completed" ? "task-completed" : ""}`}>
      <div className={`priority-stripe priority-stripe-${task.priority}`} />

      {/* Header */}
      <div className="task-card-header">
        <div className="task-badges">
          <Badge type="status" value={task.status} />
          <Badge type="priority" value={task.priority} />
        </div>
        <div className="task-actions">
          {/* Status dropdown — BA can do all; employee can only move to in-progress */}
          <div className="status-dropdown-wrapper">
            <button className="btn-icon btn-icon-secondary" onClick={() => setShowStatusMenu(p => !p)} title="Change status">
              <ChevronDown size={15} />
            </button>
            {showStatusMenu && (
              <div className="status-dropdown">
                {["todo", "in-progress", "completed"].map(s => {
                  const disabledForEmp = !isBA && s === "completed";
                  const disabledUnComplete = !isBA && task.status === "completed";
                  return (
                    <button key={s}
                      className={`status-option ${task.status === s ? "active" : ""} ${(disabledForEmp || disabledUnComplete) ? "status-disabled" : ""}`}
                      onClick={() => { if (!disabledForEmp && !disabledUnComplete) handleStatusChange(s); }}
                      title={disabledForEmp ? "Only BA can mark as completed" : ""}>
                      {s === "todo" ? "To Do" : s === "in-progress" ? "In Progress" : "✅ Completed"}
                      {disabledForEmp && " 🔒"}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Query button — always visible */}
          <button className="btn-icon btn-icon-query" onClick={() => onQueryOpen(task)} title="Open queries">
            <MessageCircle size={15} />
            {task.queries?.length > 0 && <span className="query-count">{task.queries.length}</span>}
          </button>

          {/* Edit & Delete — BA only */}
          {isBA && (
            <>
              <button className="btn-icon btn-icon-primary" onClick={() => onEdit(task)} title="Edit task"><Pencil size={15} /></button>
              <button className="btn-icon btn-icon-danger" onClick={handleDelete} title="Delete task"><Trash2 size={15} /></button>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className={`task-title ${task.status === "completed" ? "task-title-done" : ""}`}>{task.title}</h3>

      {/* Assigned to */}
      {task.assignedToName && (
        <div className="task-assigned">👤 Assigned to: <strong>{task.assignedToName}</strong></div>
      )}

      {/* Description */}
      {task.description && <p className="task-description">{task.description}</p>}

      {/* Bug Screenshot */}
      {task.imageUrl && (
        <div className="task-image-section">
          <button className="img-toggle-btn" onClick={() => setShowImage(p => !p)}>
            <Image size={13} /> {showImage ? "Hide" : "View"} Screenshot
          </button>
          {showImage && (
            <a href={task.imageUrl} target="_blank" rel="noreferrer">
              <img src={task.imageUrl} alt="Bug screenshot" className="task-bug-img"
                onError={e => { e.target.style.display = "none"; }} />
            </a>
          )}
        </div>
      )}

      {/* Meta */}
      <div className="task-meta">
        {task.dueDate && (
          <span className={`task-due ${isOverdue ? "overdue" : isDueToday ? "due-today" : ""}`}>
            <Calendar size={13} />
            {isOverdue && "⚠️ Overdue · "}
            {isDueToday && "📅 Due Today · "}
            {format(new Date(task.dueDate), "MMM dd, yyyy")}
          </span>
        )}
        {task.category && task.category !== "General" && <span className="task-category">📁 {task.category}</span>}
      </div>

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="task-tags">
          <Tag size={12} />
          {task.tags.map((t, i) => <span key={i} className="task-tag">{t}</span>)}
        </div>
      )}

      {/* Created by */}
      <div className="task-footer">
        <span className="task-created-by">Created by {task.createdByName}</span>
      </div>
    </div>
  );
};
export default TaskCard;
