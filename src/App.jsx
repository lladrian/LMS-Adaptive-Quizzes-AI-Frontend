import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard";
import Instructors from "./pages/admin/Instructors";
import AdminSettings from "./pages/admin/Settings";

import InstructorDashboard from "./components/InstructorDashboard";
import StudentsPage from "./pages/instructor/StudentsPage";
import MaterialsPage from "./pages/instructor/MaterialsPage";
import ClassesPage from "./pages/instructor/ClassesPage";
import ClassViewPage from "./pages/instructor/ClassViewPage";

import StudentDashboard from "./components/StudentDashboard";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/instructors" element={<Instructors />} />
        <Route path="/admin/settings" element={<AdminSettings />} />

        <Route path="/instructor" element={<InstructorDashboard />} />

        <Route path="/instructor/students" element={<StudentsPage />} />
        <Route path="/instructor/materials" element={<MaterialsPage />} />
        <Route path="/instructor/classes" element={<ClassesPage />} />
        <Route path="/instructor/classes/:classId" element={<ClassViewPage />} />

        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
