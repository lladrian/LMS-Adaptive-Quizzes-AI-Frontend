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
import AdminDashboard from "./components/AdminDashboard";
import Instructors from "./pages/admin/Instructors";
import Classrooms from "./pages/admin/Classrooms";
import AdminSettings from "./pages/admin/Settings";
import AdminsManagement from "./pages/admin/AdminsManagement";

import InstructorLayout from "./pages/layouts/InstructorLayout";
import InstructorDashboard from "./components/InstructorDashboard";

import AddStudentPage from "./pages/instructor/AddStudentPage";
import EditStudentPage from "./pages/instructor/EditStudentPage";
import ClassesPage from "./pages/instructor/ClassesPage";
import CreateClassPage from "./pages/instructor/CreateClassPage";
import ClassViewPage from "./pages/instructor/ClassViewPage";
import ClassStudentsPage from "./pages/instructor/ClassStudentsPage";
import AddStudentsToClassPage from "./pages/instructor/AddStudentsToClassPage";

import AssignmentDetailPage from "./pages/instructor/AssignmentDetailPage";
import MaterialsPage from "./pages/instructor/MaterialsPage";
import UploadMaterialPage from "./pages/instructor/UploadMaterialPage";
import EditMaterialPage from "./pages/instructor/EditMaterialPage";
import InstructorSettings from "./pages/instructor/SettingsPage";
import IntructorGradesPage from "./pages/instructor/GradesPage";

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

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/instructors" element={<Instructors />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="instructors" element={<Instructors />} />
            <Route path="classrooms" element={<Classrooms />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="admins" element={<AdminsManagement />} />
          </Route>

          <Route path="/instructor" element={<InstructorLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="students/add" element={<AddStudentPage />} />
            <Route path="students/edit/:id" element={<EditStudentPage />} />
            <Route path="classes" element={<ClassesPage />} />
           
            <Route path="class/:classId" element={<ClassViewPage />} />

            <Route
              path="class/:classId/students"
              element={<ClassStudentsPage />}
            />


            <Route
              path="class/:classId/students/add"
              element={<AddStudentsToClassPage />}
            />


            <Route
              path="class/:classId/activity/:assignmentId"
              element={<AssignmentDetailPage />}
            />
            <Route path="materials" element={<MaterialsPage />} />
            <Route path="materials/upload" element={<UploadMaterialPage />} />
            <Route path="materials/edit/:id" element={<EditMaterialPage />} />
            <Route path="grades" element={<IntructorGradesPage />} />
            <Route path="settings" element={<InstructorSettings />} />
            
          </Route>



          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="classes" element={<ClassesPageStudent />} />
            <Route path="class/:classId" element={<ClassDetailPageStudent />} />
            <Route path="class/:classId/:assignmentId/:type/answer" element={<AssignmentAnswerPage />} />
            <Route path="class/:classId/:assignmentId/:type/view_answer" element={<ViewAssignmentAnswerPage />} />
            <Route path="class/practice_with_ai" element={<PracticePage />} />
            <Route path="class/:lessonId/practice_with_lesson" element={<LessonPracticePage />} />
            <Route path="grades" element={<GradesPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>




          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>

      {/* ✅ Toast container (place once globally) */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default App;
