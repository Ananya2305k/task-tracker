import React, { useState, useEffect } from "react";
import { Plus, Users, LogOut, Bell } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import StatsBar from "../components/StatsBar";
import FilterBar from "../components/FilterBar";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import QueryPanel from "../components/QueryPanel";
import TeamPanel from "./TeamPanel";
import { getPendingUsers } from "../utils/api";

const Home = ({ toggleTheme, theme }) => {
  const { tasks, loading, filters, loadTasks, addTask, editTask, loadCategories } = useTaskContext();
  const { user, isBA, logout } = useAuth();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [queryTask, setQueryTask] = useState(null);
  const [showTeam, setShowTeam] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadTasks();
    loadCategories();
    if (isBA) {
      getPendingUsers().then(res => setPendingCount(res.data.data.length)).catch(() => {});
    }
  }, []); // eslint-disable-line

  const handleAddSubmit = async (data) => {
    const result = await addTask(data);
    if (result?.success) setShowAddModal(false);
    return result;
  };

  const handleEditSubmit = async (data) => {
    const result = await editTask(editingTask._id, data);
    if (result?.success) setEditingTask(null);
    return result;
  };

  const hasActiveFilters = filters.status !== "all" || filters.priority !== "all" || filters.category !== "all" || filters.search !== "";

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <span className="brand-icon">✅</span>
            <div>
              <h1 className="brand-title">TaskFlow</h1>
              <p className="brand-subtitle">
                {isBA ? "Business Analyst Dashboard" : `Employee: ${user?.name}`}
              </p>
            </div>
          </div>

          <div className="header-actions">
            {/* Role badge */}
            <span className={`role-badge ${isBA ? "role-ba" : "role-emp"}`}>
              {isBA ? "👔 Business Analyst" : "👤 Employee"}
            </span>

            {/* Team management (BA only) */}
            {isBA && (
              <button className="btn btn-secondary btn-sm" onClick={() => setShowTeam(true)}>
                <Users size={15} />
                Team
                {pendingCount > 0 && <span className="notif-dot">{pendingCount}</span>}
              </button>
            )}

            {/* Add task (BA only) */}
            {isBA && (
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                <Plus size={18} /> Add Task
              </button>
            )}

            {/* Logout */}
            <button className="btn btn-ghost btn-sm" onClick={toggleTheme} title="Toggle theme">
  {theme === "dark" ? "☀️" : "🌙"}
</button>
<button className="btn btn-ghost btn-sm" onClick={logout} title="Logout">
  <LogOut size={16} />
</button>
          </div>
        </div>

        {/* Employee notice bar */}
        {!isBA && (
          <div className="employee-notice">
            <Bell size={13} />
            You can view your assigned tasks, change status to <strong>In Progress</strong>, and raise queries. Only the BA can mark tasks as <strong>Completed</strong>.
          </div>
        )}
      </header>

      <main className="main-content">
        <StatsBar />
        <FilterBar />

        {loading ? (
          <Loader />
        ) : tasks.length === 0 ? (
          <EmptyState hasFilters={hasActiveFilters} onAddClick={() => setShowAddModal(true)} isEmployee={!isBA} />
        ) : (
          <>
            <div className="tasks-count-label">
              {isBA ? `Showing all ${tasks.length} task(s)` : `Your assigned tasks: ${tasks.length}`}
            </div>
            <div className="tasks-grid">
              {tasks.map(task => (
                <TaskCard key={task._id} task={task} onEdit={t => setEditingTask(t)} onQueryOpen={t => setQueryTask(t)} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Add Task Modal (BA only) */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="➕ New Task" size="lg">
        <TaskForm onSubmit={handleAddSubmit} onCancel={() => setShowAddModal(false)} submitLabel="Create Task" />
      </Modal>

      {/* Edit Task Modal (BA only) */}
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} title="✏️ Edit Task" size="lg">
        {editingTask && (
          <TaskForm initialData={editingTask} onSubmit={handleEditSubmit} onCancel={() => setEditingTask(null)} submitLabel="Save Changes" />
        )}
      </Modal>

      {/* Query Panel Modal */}
      <Modal isOpen={!!queryTask} onClose={() => setQueryTask(null)} title="💬 Task Queries" size="md">
        {queryTask && <QueryPanel task={tasks.find(t => t._id === queryTask._id) || queryTask} onClose={() => setQueryTask(null)} />}
      </Modal>

      {/* Team Management Modal (BA only) */}
      <Modal isOpen={showTeam} onClose={() => { setShowTeam(false); getPendingUsers().then(r => setPendingCount(r.data.data.length)).catch(() => {}); }}
        title="👥 Team Management" size="md">
        <TeamPanel />
      </Modal>
    </div>
  );
};
export default Home;
