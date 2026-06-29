import React from "react";
const statusStyles = { todo: "badge-todo", "in-progress": "badge-inprogress", completed: "badge-completed" };
const priorityStyles = { low: "badge-low", medium: "badge-medium", high: "badge-high" };
const statusLabels = { todo: "To Do", "in-progress": "In Progress", completed: "Completed" };
const Badge = ({ type, value }) => {
  const styleMap = type === "status" ? statusStyles : priorityStyles;
  const label = type === "status" ? (statusLabels[value] || value) : value;
  return <span className={`badge ${styleMap[value] || "badge-default"}`}>{label}</span>;
};
export default Badge;
