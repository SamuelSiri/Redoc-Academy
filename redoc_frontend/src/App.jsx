import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage';

// Common pages
import BrowsePage from './pages/BrowsePage';
import ResourceViewPage from './pages/ResourceViewPage';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import MessagesPage from './pages/MessagesPage';
import NotFoundPage from './pages/NotFoundPage';

// Student pages
import DashboardPage from './pages/student/DashboardPage';
import StudentCoursesPage from './pages/student/MyCoursesPage';
import MyDownloadsPage from './pages/student/MyDownloadsPage';
import FavoritesPage from './pages/student/FavoritesPage';
import CertificatesPage from './pages/student/CertificatesPage';
import StudentProfilePage from './pages/student/StudentProfile';

// Teacher pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherCoursesPage from './pages/teacher/MyCoursesPage';
import CreateCoursePage from './pages/teacher/CreateCoursePage';
import EditCoursePage from './pages/teacher/EditCoursePage';
import UploadPage from './pages/teacher/UploadPage';
import MyUploadsPage from './pages/teacher/MyUploadsPage';
import ManageCategoriesPage from './pages/teacher/ManageCategoriesPage';

// Admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';

const App = () => {
  const { checkAuth, isAuthenticated, isTeacher, isAdmin } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'inherit', fontSize: 14, fontWeight: 600 } }} />
      <Routes>
        {/* Auth — sin layout */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

        {/* App — con layout */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={isAdmin ? <AdminDashboardPage /> : isTeacher ? <TeacherDashboard /> : <DashboardPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/resource/:id" element={<ResourceViewPage />} />
          <Route path="/courses" element={<CourseCatalogPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/courses/:id/learn" element={<CoursePlayerPage />} />
          <Route path="/messages" element={<MessagesPage />} />

          {/* Student routes */}
          <Route path="/student/courses" element={<StudentCoursesPage />} />
          <Route path="/student/downloads" element={<MyDownloadsPage />} />
          <Route path="/student/favorites" element={<FavoritesPage />} />
          <Route path="/student/certificates" element={<CertificatesPage />} />
          <Route path="/student/profile" element={<StudentProfilePage />} />

          {/* Teacher routes */}
          <Route path="/teacher/courses" element={<ProtectedRoute requiredRole="TEACHER"><TeacherCoursesPage /></ProtectedRoute>} />
          <Route path="/teacher/courses/new" element={<ProtectedRoute requiredRole="TEACHER"><CreateCoursePage /></ProtectedRoute>} />
          <Route path="/teacher/courses/:id/edit" element={<ProtectedRoute requiredRole="TEACHER"><EditCoursePage /></ProtectedRoute>} />
          <Route path="/teacher/upload" element={<ProtectedRoute requiredRole="TEACHER"><UploadPage /></ProtectedRoute>} />
          <Route path="/teacher/my-uploads" element={<ProtectedRoute requiredRole="TEACHER"><MyUploadsPage /></ProtectedRoute>} />
          <Route path="/teacher/categories" element={<ProtectedRoute requiredRole="TEACHER"><ManageCategoriesPage /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requiredRole="ADMIN"><UserManagementPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
