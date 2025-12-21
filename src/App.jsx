import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CameraCapture from "./components/CameraCapture";
import DocumentUploader from "./components/DocumentUploader";
import Govt from "./components/Govt";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Admin from "./components/Admin";
import AdminDashboard from "./components/AdminDashboard";
import Approval from "./components/Approval";
import Profile from "./components/Profile";
import Messages from "./components/Messages";
import GovernmentPortal from "./components/GovermentPortal";
import Info from "./components/Info";
import Nodal from "./components/Nodal";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<GovernmentPortal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/approval/:applicationId" element={<Approval />} />
          <Route path="/camera" element={<CameraCapture />} />
          <Route path="/documents" element={<DocumentUploader />} />
          <Route path="/schemes" element={<Govt />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/info" element={<Info />} />
          <Route path="/nodal" element={<Nodal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
