import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Verify2FA from "../pages/Verify2FA";
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";

const Main = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-2fa" element={<Verify2FA />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default Main;