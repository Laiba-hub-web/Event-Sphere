import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'

// Public pages
import Home from './pages/Home'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import ExpoListPage from './pages/ExpoListPage'
import ExpoDetailPage from './pages/ExpoDetailPage'

// Dashboard redirect
import DashboardRedirect from './pages/DashboardRedirect'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminExpoList from './pages/admin/AdminExpoList'
import CreateExpoPage from './pages/admin/CreateExpoPage'
import EditExpoPage from './pages/admin/EditExpoPage'
import FloorPlanPage from './pages/admin/FloorPlanPage'
import ScheduleManagerPage from './pages/admin/ScheduleManagerPage'
import ExhibitorApplicationsPage from './pages/admin/ExhibitorApplicationsPage'
import AnalyticsPage from './pages/admin/AnalyticsPage'

// Exhibitor pages
import ExhibitorDashboard from './pages/exhibitor/ExhibitorDashboard'
import MyApplicationsPage from './pages/exhibitor/MyApplicationsPage'
import ApplyToExpoPage from './pages/exhibitor/ApplyToExpoPage'
import BoothSelectionPage from './pages/exhibitor/BoothSelectionPage'
import ExhibitorProfilePage from './pages/exhibitor/ExhibitorProfilePage'

// Attendee pages
import AttendeeDashboard from './pages/attendee/AttendeeDashboard'
import MyExposPage from './pages/attendee/MyExposPage'
import MySchedulePage from './pages/attendee/MySchedulePage'

// Shared pages
import MessagesPage from './pages/MessagesPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#1f2937', color: '#f9fafb', borderRadius: '8px' },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/expos" element={<ExpoListPage />} />
            <Route path="/expos/:id" element={<ExpoDetailPage />} />

            {/* Dashboard redirect */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/expos"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminExpoList />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/expos/create"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <CreateExpoPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/expos/:id/edit"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <EditExpoPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/expos/:id/floor-plan"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <FloorPlanPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/expos/:id/schedule"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <ScheduleManagerPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/exhibitors"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <ExhibitorApplicationsPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/expos/:id/exhibitors"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <ExhibitorApplicationsPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics/:expoId"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <AnalyticsPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Exhibitor routes */}
            <Route
              path="/exhibitor/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['exhibitor']}>
                    <ExhibitorDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exhibitor/applications"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['exhibitor']}>
                    <MyApplicationsPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exhibitor/apply/:expoId"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['exhibitor']}>
                    <ApplyToExpoPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exhibitor/booth/:expoId"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['exhibitor']}>
                    <BoothSelectionPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exhibitor/profile"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['exhibitor']}>
                    <ExhibitorProfilePage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Attendee routes */}
            <Route
              path="/attendee/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['attendee']}>
                    <AttendeeDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendee/my-expos"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['attendee']}>
                    <MyExposPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendee/schedule"
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['attendee']}>
                    <MySchedulePage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* Shared */}
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  )
}
