import React, { useEffect, useState } from "react";
import useTaskForm from "../hooks/useTaskForm";
import { getEmployees } from "../utils/api";
import { Image, User } from "lucide-react";

const TaskForm = ({ initialData = null, onSubmit, onCancel, submitLabel = "Save Task" }) => {
  const { formData, errors, touched, handleChange, handleBlur, handleSubmit, resetForm } = useTaskForm(initialData);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees().then(res => setEmployees(res.data.data)).catch(() => {});
  }, []);

  const handleEmployeeChange = (e) => {
    const selected = employees.find(emp => emp._id === e.target.value);
    handleChange({ target: { name: "assignedTo", value: e.target.value } });
    handleChange({ target: { name: "assignedToName", value: selected?.name || "" } });
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    const result = await onSubmit(data);
    if (result?.success && !initialData) resetForm();
  });

  return (
    <form onSubmit={handleFormSubmit} noValidate className="task-form">
      {/* Title */}
      <div className="form-group">
        <label className="form-label">Title <span className="required">*</span></label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} onBlur={handleBlur}
          placeholder="e.g. Fix login bug on mobile" maxLength={100}
          className={`form-input ${touched.title && errors.title ? "input-error" : ""}`} />
        {touched.title && errors.title && <span className="error-msg">{errors.title}</span>}
        <span className="char-count">{formData.title.length}/100</span>
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} onBlur={handleBlur}
          placeholder="Describe the task, bug details, steps to reproduce..." rows={3}
          maxLength={1000} className={`form-textarea ${touched.description && errors.description ? "input-error" : ""}`} />
        {touched.description && errors.description && <span className="error-msg">{errors.description}</span>}
        <span className="char-count">{formData.description.length}/1000</span>
      </div>

      {/* Image URL */}
      <div className="form-group">
        <label className="form-label">
          <Image size={14} style={{display:"inline",marginRight:4}} />
          Bug Screenshot URL <span className="form-hint">(paste image link from Imgur, Google Drive, etc.)</span>
        </label>
        <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} onBlur={handleBlur}
          placeholder="https://i.imgur.com/example.png"
          className={`form-input ${touched.imageUrl && errors.imageUrl ? "input-error" : ""}`} />
        {touched.imageUrl && errors.imageUrl && <span className="error-msg">{errors.imageUrl}</span>}
        {formData.imageUrl && !errors.imageUrl && (
          <div className="img-preview-wrap">
            <img src={formData.imageUrl} alt="Preview" className="img-preview"
              onError={e => { e.target.style.display = "none"; }} />
          </div>
        )}
      </div>

      {/* Assign to Employee */}
      <div className="form-group">
        <label className="form-label">
          <User size={14} style={{display:"inline",marginRight:4}} />
          Assign To Employee
        </label>
        <select name="assignedTo" value={formData.assignedTo} onChange={handleEmployeeChange} className="form-select">
          <option value="">— Unassigned —</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
          ))}
        </select>
      </div>

      {/* Status + Priority */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="form-select">
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="form-select">
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
      </div>

      {/* Due Date + Category */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label">Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange}
            placeholder="e.g. Frontend, Backend" maxLength={50} className="form-input" />
        </div>
      </div>

      {/* Tags */}
      <div className="form-group">
        <label className="form-label">Tags <span className="form-hint">(comma separated)</span></label>
        <input type="text" name="tags" value={formData.tags} onChange={handleChange}
          placeholder="e.g. bug, urgent, api" className="form-input" />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">{submitLabel}</button>
      </div>
    </form>
  );
};
export default TaskForm;
