import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Shared
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Passenger
import PassengerHome from './pages/passenger/PassengerHome'
import ScheduleSearch from './pages/passenger/ScheduleSearch'
import ScheduleDetail from './pages/passenger/ScheduleDetail'
import BookingConfirmation from './pages/passenger/BookingConfirmation'
import MyTickets from './pages/passenger/MyTickets'
import TicketDetail from './pages/passenger/TicketDetail'
import PassengerProfile from './pages/passenger/PassengerProfile'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import BusList from './pages/admin/BusList'
import BusForm from './pages/admin/BusForm'
import RouteList from './pages/admin/RouteList'
import RouteForm from './pages/admin/RouteForm'
import ScheduleList from './pages/admin/ScheduleList'
import AdminScheduleDetail from './pages/admin/ScheduleDetail'
import ScheduleForm from './pages/admin/ScheduleForm'
import UserList from './pages/admin/UserList'
import UserDetail from './pages/admin/UserDetail'
import AdminTicketList from './pages/admin/AdminTicketList'
import AdminTicketDetail from './pages/admin/AdminTicketDetail'

// Route guards
function RequireAuth({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RequireAdmin({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/home" replace />
  return children
}

function RootRedirect() {
  const { user } = useAuth()
  if (!user) return <LandingPage />
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />
  return <Navigate to="/home" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing / auto-redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public schedule browse */}
      <Route path="/search" element={<ScheduleSearch />} />
      <Route path="/schedule/:id" element={<ScheduleDetail />} />

      {/* Passenger (protected) */}
      <Route path="/home" element={<RequireAuth><PassengerHome /></RequireAuth>} />
      <Route path="/booking-confirmation" element={<RequireAuth><BookingConfirmation /></RequireAuth>} />
      <Route path="/tickets" element={<RequireAuth><MyTickets /></RequireAuth>} />
      <Route path="/tickets/:id" element={<RequireAuth><TicketDetail /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><PassengerProfile /></RequireAuth>} />

      {/* Admin (protected, role=ADMIN) */}
      <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      <Route path="/admin/buses" element={<RequireAdmin><BusList /></RequireAdmin>} />
      <Route path="/admin/buses/new" element={<RequireAdmin><BusForm /></RequireAdmin>} />
      <Route path="/admin/buses/:id" element={<RequireAdmin><BusForm /></RequireAdmin>} />
      <Route path="/admin/routes" element={<RequireAdmin><RouteList /></RequireAdmin>} />
      <Route path="/admin/routes/new" element={<RequireAdmin><RouteForm /></RequireAdmin>} />
      <Route path="/admin/routes/:id" element={<RequireAdmin><RouteForm /></RequireAdmin>} />
      <Route path="/admin/schedules" element={<RequireAdmin><ScheduleList /></RequireAdmin>} />
      <Route path="/admin/schedules/new" element={<RequireAdmin><ScheduleForm /></RequireAdmin>} />
      <Route path="/admin/schedules/:id" element={<RequireAdmin><AdminScheduleDetail /></RequireAdmin>} />
      <Route path="/admin/users" element={<RequireAdmin><UserList /></RequireAdmin>} />
      <Route path="/admin/users/:id" element={<RequireAdmin><UserDetail /></RequireAdmin>} />
      <Route path="/admin/tickets" element={<RequireAdmin><AdminTicketList /></RequireAdmin>} />
      <Route path="/admin/tickets/:id" element={<RequireAdmin><AdminTicketDetail /></RequireAdmin>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
