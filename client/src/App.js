import React from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import PendingPage from "./pages/PendingPage";
import Loader from "./components/Loader";
import "./App.css";

const AppRoutes = () => {
  const { user, loading, isPending } = useAuth();
const [theme, setTheme] = React.useState(() => localStorage.getItem("tf_theme") || "light");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tf_theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}><Loader text="Starting TaskFlow..." /></div>;
  if (!user) return <AuthPage />;
  if (isPending) return <PendingPage />;
  return <TaskProvider><Home toggleTheme={toggleTheme} theme={theme} /></TaskProvider>;
};


function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { borderRadius: "10px", background: "#1e293b", color: "#f1f5f9", fontSize: "14px" },
        success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
      }} />
      <AppRoutes />
    </AuthProvider>
  );
}
export default App;
