import { useState } from "react";

const initialFormData = {
  title: "", description: "", status: "todo", priority: "medium",
  dueDate: "", category: "General", tags: "", imageUrl: "", assignedTo: "", assignedToName: "",
};

const validate = (data) => {
  const errors = {};
  if (!data.title.trim()) errors.title = "Title is required";
  else if (data.title.trim().length < 3) errors.title = "Min 3 characters";
  else if (data.title.trim().length > 100) errors.title = "Max 100 characters";
  if (data.description && data.description.length > 1000) errors.description = "Max 1000 characters";
  if (data.imageUrl && !/^https?:\/\/.+/.test(data.imageUrl)) errors.imageUrl = "Must be a valid URL (https://...)";
  return errors;
};

const useTaskForm = (initialData = null) => {
  const [formData, setFormData] = useState(
    initialData ? {
      title: initialData.title || "",
      description: initialData.description || "",
      status: initialData.status || "todo",
      priority: initialData.priority || "medium",
      dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split("T")[0] : "",
      category: initialData.category || "General",
      tags: Array.isArray(initialData.tags) ? initialData.tags.join(", ") : "",
      imageUrl: initialData.imageUrl || "",
      assignedTo: initialData.assignedTo?._id || initialData.assignedTo || "",
      assignedToName: initialData.assignedToName || "",
    } : initialFormData
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validate(formData);
    setErrors(prev => ({ ...prev, [name]: errs[name] || "" }));
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      const tags = formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
      onSubmit({ ...formData, tags });
    }
  };

  const resetForm = () => { setFormData(initialFormData); setErrors({}); setTouched({}); };

  return { formData, errors, touched, handleChange, handleBlur, handleSubmit, resetForm, setFormData };
};

export default useTaskForm;
