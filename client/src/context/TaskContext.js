import React, { createContext, useContext, useReducer, useCallback } from "react";
import toast from "react-hot-toast";
import * as api from "../utils/api";

const initialState = {
  tasks: [], loading: false, error: null,
  stats: { todo: 0, "in-progress": 0, completed: 0, total: 0 },
  categories: ["General"],
  filters: { status: "all", priority: "all", category: "all", sort: "newest", search: "" },
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING": return { ...state, loading: action.payload };
    case "SET_TASKS": return { ...state, tasks: action.payload.tasks, stats: action.payload.stats, loading: false };
    case "UPDATE_TASK": return { ...state, tasks: state.tasks.map(t => t._id === action.payload._id ? action.payload : t) };
    case "DELETE_TASK": return { ...state, tasks: state.tasks.filter(t => t._id !== action.payload) };
    case "SET_FILTERS": return { ...state, filters: { ...state.filters, ...action.payload } };
    case "SET_CATEGORIES": return { ...state, categories: action.payload };
    default: return state;
  }
};

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const loadTasks = useCallback(async (filters = initialState.filters) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const params = {};
      if (filters.status !== "all") params.status = filters.status;
      if (filters.priority !== "all") params.priority = filters.priority;
      if (filters.category !== "all") params.category = filters.category;
      if (filters.sort !== "newest") params.sort = filters.sort;
      if (filters.search) params.search = filters.search;
      const res = await api.fetchTasks(params);
      dispatch({ type: "SET_TASKS", payload: { tasks: res.data.data, stats: res.data.stats } });
    } catch (err) {
      dispatch({ type: "SET_LOADING", payload: false });
      if (err.response?.status !== 401) toast.error("Failed to load tasks");
    }
  }, []);

  const addTask = async (data) => {
    try {
      await api.createTask(data);
      toast.success("✅ Task created!");
      await loadTasks(state.filters);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create task";
      toast.error(msg); return { success: false };
    }
  };

  const editTask = async (id, data) => {
    try {
      const res = await api.updateTask(id, data);
      dispatch({ type: "UPDATE_TASK", payload: res.data.data });
      toast.success("✏️ Task updated!");
      await loadTasks(state.filters);
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update"); return { success: false };
    }
  };

  const changeStatus = async (id, status) => {
    try {
      const res = await api.updateTaskStatus(id, status);
      dispatch({ type: "UPDATE_TASK", payload: res.data.data });
      toast.success(status === "completed" ? "🎉 Task completed!" : `Moved to ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const removeTask = async (id) => {
    try {
      await api.deleteTask(id);
      dispatch({ type: "DELETE_TASK", payload: id });
      toast.success("🗑️ Task deleted");
    } catch (err) { toast.error("Failed to delete task"); }
  };

  const clearCompleted = async () => {
    try {
      const res = await api.deleteCompletedTasks();
      toast.success(`🧹 ${res.data.message}`);
      await loadTasks(state.filters);
    } catch (err) { toast.error("Failed to clear completed"); }
  };

  const setFilters = (newFilters) => {
    const updated = { ...state.filters, ...newFilters };
    dispatch({ type: "SET_FILTERS", payload: newFilters });
    loadTasks(updated);
  };

  const loadCategories = async () => {
    try {
      const res = await api.fetchCategories();
      dispatch({ type: "SET_CATEGORIES", payload: res.data.data });
    } catch {}
  };

  const postQuery = async (taskId, message) => {
    try {
      const res = await api.addQuery(taskId, message);
      // update task queries in state
      const updatedTask = state.tasks.find(t => t._id === taskId);
      if (updatedTask) {
        dispatch({ type: "UPDATE_TASK", payload: { ...updatedTask, queries: res.data.data } });
      }
      toast.success("💬 Query sent!");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send query");
      return { success: false };
    }
  };

  return (
    <TaskContext.Provider value={{
      ...state, loadTasks, addTask, editTask, changeStatus,
      removeTask, clearCompleted, setFilters, loadCategories, postQuery,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be inside TaskProvider");
  return ctx;
};
