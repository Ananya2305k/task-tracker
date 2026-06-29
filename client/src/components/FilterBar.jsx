import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTaskContext } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";

const FilterBar = () => {
  const { filters, setFilters, categories, clearCompleted, stats } = useTaskContext();
  const { isBA } = useAuth();

  const handleChange = (e) => setFilters({ [e.target.name]: e.target.value });

  const handleClearAll = () => setFilters({ status: "all", priority: "all", category: "all", sort: "newest", search: "" });

  const hasActive = filters.status !== "all" || filters.priority !== "all" || filters.category !== "all" || filters.search !== "";

  return (
    <div className="filter-bar">
      <div className="filter-row">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input type="text" name="search" value={filters.search} onChange={handleChange}
            placeholder="Search tasks..." className="search-input" />
          {filters.search && (
            <button className="search-clear" onClick={() => setFilters({ search: "" })}><X size={14} /></button>
          )}
        </div>
        <select name="status" value={filters.status} onChange={handleChange} className="filter-select">
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select name="priority" value={filters.priority} onChange={handleChange} className="filter-select">
          <option value="all">All Priorities</option>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <select name="category" value={filters.category} onChange={handleChange} className="filter-select">
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="sort-wrapper">
          <SlidersHorizontal size={14} />
          <select name="sort" value={filters.sort} onChange={handleChange} className="filter-select">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
            <option value="due-asc">Due: Earliest</option>
            <option value="due-desc">Due: Latest</option>
            <option value="title-asc">Title A→Z</option>
          </select>
        </div>
      </div>
      <div className="filter-actions">
        {hasActive && (
          <button className="btn btn-ghost btn-sm" onClick={handleClearAll}><X size={13} /> Clear Filters</button>
        )}
        {isBA && stats.completed > 0 && (
          <button className="btn btn-danger-outline btn-sm"
            onClick={() => { if (window.confirm(`Delete all ${stats.completed} completed tasks?`)) clearCompleted(); }}>
            🧹 Clear Completed ({stats.completed})
          </button>
        )}
      </div>
    </div>
  );
};
export default FilterBar;
