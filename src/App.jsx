import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminLayout from "./pages/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Instructors from "./pages/admin/Instructors";
import Classrooms from "./pages/admin/Classrooms";
import AccountSettings from "./components/Settings";
import AdminsManagement from "./pages/admin/AdminsManagement";

import InstructorLayout from "./pages/layouts/InstructorLayout";
import InstructorDashboard from "./components/InstructorDashboard";

import AddStudentPage from "./pages/instructor/AddStudentPage";
import ClassesPage from "./pages/instructor/ClassesPage";
import CreateClassPage from "./pages/instructor/CreateClassPage";
import ClassViewPage from "./pages/instructor/ClassViewPage";

import AddStudentsToClassPage from "./pages/instructor/AddStudentsToClassPage";

import AssignmentDetailPage from "./pages/instructor/AssignmentDetailPage";
import MaterialsPage from "./pages/instructor/MaterialsPage";
import UploadMaterialPage from "./pages/instructor/UploadMaterialPage";
import EditMaterialPage from "./pages/instructor/EditMaterialPage";
import InstructorSettings from "./pages/instructor/SettingsPage";
import InstructorGradesPage from "./pages/instructor/GradesPage";

import StudentLayout from "./pages/layouts/StudentLayout";
import DashboardHome from "./pages/student/DashboardHome";
import ClassesPageStudent from "./pages/student/ClassesPage";
import ClassDetailPageStudent from "./pages/student/ClassDetailPage";
import LessonPracticePage from "./pages/student/LessonPracticePage";
import PracticePage from "./pages/student/PracticePage";
import AssignmentAnswerPage from "./pages/student/AssignmentAnswerPage";
import ViewAssignmentAnswerPage from "./pages/student/ViewAssignmentAnswerPage";
import GradesPage from "./pages/student/GradesPage";

import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ArchivePage from "./pages/instructor/ArchivePage";
import Students from "./pages/admin/Students";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (!userId || !role) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Redirect if already logged in
const PublicRoute = ({ children }) => {
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  if (userId && role) {
    switch (role) {
      case "admin":
        return <Navigate to="/admin/dashboard" replace />;
      case "instructor":
        return <Navigate to="/instructor/dashboard" replace />;
      case "student":
        return <Navigate to="/student/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="instructors" element={<Instructors />} />
            <Route path="students" element={<Students />} />
            <Route path="settings" element={<AccountSettings />} />
            <Route path="admins" element={<AdminsManagement />} />
          </Route>

          <Route
            path="/instructor"
            element={
              <ProtectedRoute requiredRole="instructor">
                <InstructorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route
              path="class/:classId/students/add"
              element={<AddStudentPage />}
            />
            <Route path="classes" element={<ClassesPage />} />
            <Route path="archive" element={<ArchivePage />} />
            <Route path="class/:classId" element={<ClassViewPage />} />
            <Route
              path="class/:classId/activity/:assignmentId"
              element={<AssignmentDetailPage />}
            />
            <Route path="settings" element={<AccountSettings />} />
          </Route>

          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="classes" element={<ClassesPageStudent />} />
            <Route path="class/:classId" element={<ClassDetailPageStudent />} />
            <Route
              path="class/:classId/:assignmentId/:type/answer"
              element={<AssignmentAnswerPage />}
            />
            <Route
              path="class/:classId/:assignmentId/:type/view_answer"
              element={<ViewAssignmentAnswerPage />}
            />
            <Route path="class/:classId/practice_with_ai" element={<PracticePage />} />
            <Route
              path="class/:classId/:lessonId/practice_with_lesson"
              element={<LessonPracticePage />}
            />
            <Route path="grades" element={<GradesPage />} />
            <Route path="settings" element={<AccountSettings />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default App;
