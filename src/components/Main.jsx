import { Route, Routes } from "react-router-dom";
import Login          from "../pages/Login";
import Register       from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword  from "../pages/ResetPassword";
import Verify2FA      from "../pages/Verify2FA";
import Home           from "../pages/Home";
import Dashboard      from "../pages/Dashboard";
import TasksPage      from "../pages/TasksPage";
import ProtectedRoute from "../ProtectedRoute";
import { AppProvider } from "../context/AppContext";

const Main = () => {
  return (
    <Routes>
      {/* ── Public ──────────────────────────────────────────────── */}
      <Route path="/"                element={<Home />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password"  element={<ResetPassword />} />
      <Route path="/verify-2fa"      element={<Verify2FA />} />

      {/* ── Protected ───────────────────────────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <AppProvider>
              <Dashboard />
            </AppProvider>
          }
        />
        <Route
          path="/tasks"
          element={
            <AppProvider>
              <TasksPage />
            </AppProvider>
          }
        />
        {/* add more protected routes here the same way */}
      </Route>
    </Routes>
  );
};

export default Main;