import React from "react";
import { ClipboardList } from "lucide-react";
const EmptyState = ({ hasFilters, onAddClick, isEmployee }) => (
  <div className="empty-state">
    <ClipboardList size={56} className="empty-icon" />
    {hasFilters ? (
      <><h3>No tasks match your filters</h3><p>Try adjusting or clearing the filters.</p></>
    ) : isEmployee ? (
      <><h3>No tasks assigned to you yet</h3><p>Your Business Analyst will assign tasks soon.</p></>
    ) : (
      <><h3>No tasks yet!</h3><p>Create your first task to get started.</p>
        <button className="btn btn-primary" onClick={onAddClick}>＋ Add First Task</button></>
    )}
  </div>
);
export default EmptyState;
