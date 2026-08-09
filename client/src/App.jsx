import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';


const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Events = lazy(() => import('./pages/Events/Events'));
const EventDetails = lazy(() => import('./pages/EventDetails/EventDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const CreateEvent = lazy(() => import('./pages/CreateEvent/CreateEvent'));
const EditEvent = lazy(() => import('./pages/EditEvent/EditEvent'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Certificates = lazy(() => import('./pages/Certificates/Certificates'));
const Checkout = lazy(() => import('./pages/Payment/Checkout'));
const AdminLayout = lazy(() => import('./pages/AdminDashboard/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/AdminDashboard/AdminUsers'));
const AdminEvents = lazy(() => import('./pages/AdminDashboard/AdminEvents'));
const AdminRegistrations = lazy(() => import('./pages/AdminDashboard/AdminRegistrations'));
const AdminPayments = lazy(() => import('./pages/AdminDashboard/AdminPayments'));
const AdminCertificates = lazy(() => import('./pages/AdminDashboard/AdminCertificates'));
const AdminOrganizerRequests = lazy(() => import('./pages/AdminDashboard/AdminOrganizerRequests'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1">
          <Suspense fallback={<Loader fullScreen label="Loading page" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:slug" element={<EventDetails />} />
              <Route
                path="/checkout/:id"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/certificates"
                element={
                  <ProtectedRoute>
                    <Certificates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/create"
                element={
                  <ProtectedRoute roles={['admin', 'organizer']}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events/:slug/edit"
                element={
                  <ProtectedRoute roles={['admin', 'organizer']}>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="events" element={<AdminEvents />} />
                <Route path="registrations" element={<AdminRegistrations />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="certificates" element={<AdminCertificates />} />
                <Route path="organizer-requests" element={<AdminOrganizerRequests />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#121826',
            color: '#E7E9F1',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: { iconTheme: { primary: '#06B6D4', secondary: '#121826' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#121826' } },
        }}
      />
    </ErrorBoundary>
  );
}
