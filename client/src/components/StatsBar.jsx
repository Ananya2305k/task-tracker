import React from "react";
import { ClipboardList, Loader, CheckCircle, LayoutGrid } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";

const StatCard = ({ icon: Icon, label, count, color }) => (
  <div className={`stat-card stat-card-${color}`}>
    <div className="stat-icon"><Icon size={22} /></div>
    <div className="stat-info">
      <span className="stat-count">{count}</span>
      <span className="stat-label">{label}</span>
    </div>
  </div>
);

const StatsBar = () => {
  const { stats } = useTaskContext();
  return (
    <div className="stats-bar">
      <StatCard icon={LayoutGrid} label="Total" count={stats.total} color="total" />
      <StatCard icon={ClipboardList} label="To Do" count={stats.todo} color="todo" />
      <StatCard icon={Loader} label="In Progress" count={stats["in-progress"]} color="progress" />
      <StatCard icon={CheckCircle} label="Completed" count={stats.completed} color="done" />
    </div>
  );
};
export default StatsBar;
