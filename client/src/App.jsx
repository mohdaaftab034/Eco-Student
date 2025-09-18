import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { userDataContext } from "./Context/UserContext";
// import SmoothScroll from "./components/SmoothScroll";

import LandingPage from "./pages/LandingPage";
import TeacherLogin from "./pages/TeacherLogin";
import NGOLogin from "./pages/NGOLogin";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import NGODashboard from "./pages/NGODashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateStudentProfile from "./pages/Student/CreateProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AboutPage from "./components/AboutPage";
import StudentProfile from "./pages/Student/StudentProfile.jsx";

//  Role detection
const getUserRole = (user) => {
  if (!user) return null;

  if (user.role) return user.role.toLowerCase();
  if (user.metadata?.role) return user.metadata.role.toLowerCase();
  if (user.userType) return user.userType.toLowerCase();

  const email = user.email?.toLowerCase() || "";
  const userName = user.userName?.toLowerCase() || "";

  if (
    email.includes("teacher") ||
    email.includes("edu") ||
    email.includes("school") ||
    userName.includes("teacher") ||
    userName.includes("prof")
  )
    return "teacher";

  if (
    email.includes("ngo") ||
    email.includes("org") ||
    email.includes("foundation") ||
    email.includes("charity") ||
    userName.includes("ngo") ||
    userName.includes("org")
  )
    return "ngo";

  return "student";
};

// ✅ store selected role from login page
let selectedRole = null;

export const setSelectedRole = (role) => {
  selectedRole = role;
  localStorage.setItem("selectedRole", role);
};

export const getSelectedRole = () => {
  return selectedRole || localStorage.getItem("selectedRole");
};

function App() {
  const { user, isAuthenticated, isCheckingAuth } = useContext(userDataContext);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  // ✅ Not logged in
  if (!isAuthenticated) {
    return (
      <>
        
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<AboutPage />} />
            <Route path="/page" element={<LandingPage />} />
            <Route path="/teacher-login" element={<TeacherLogin />} />
            <Route path="/ngo-login" element={<NGOLogin />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
       
      </>
    );
  }

  // ✅ logged in user
  const userRole = getSelectedRole() || getUserRole(user);
  console.log(`UserRole ${userRole}, user:`, user);

  return (
    <>

      <Toaster position="top-right" />
      
        <Routes>
          {/* All role dashboards */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/ngo" element={<NGODashboard />} />
          <Route path="/create-profile" element={<CreateStudentProfile />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Default redirect based on role */}
          <Route path="/" element={<Navigate to={`/${userRole}`} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      
    </>
  );
}

export default App;
