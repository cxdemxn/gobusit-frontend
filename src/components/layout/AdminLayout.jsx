import { NavLink, useNavigate } from 'react-router-dom'
import { Bus, Route, Calendar, CalendarDays, Users, Ticket, LayoutDashboard, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

const nav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/buses', icon: Bus, label: 'Buses' },
  { to: '/admin/routes', icon: Route, label: 'Routes' },
  { to: '/admin/schedules', icon: Calendar, label: 'Schedules' },
  { to: '/admin/schedule-templates', icon: CalendarDays, label: 'Templates' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/tickets', icon: Ticket, label: 'Tickets' },
]

export default function AdminLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const Sidebar = () => (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-gray-900 text-white min-h-screen">
      <div className="h-14 flex items-center px-5 border-b border-gray-800">
        <Bus className="w-5 h-5 text-blue-400 mr-2" />
        <span className="font-bold text-base">GoBusIt</span>
        <span className="ml-2 text-xs text-gray-400 font-medium uppercase tracking-wide">Admin</span>
      </div>
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  )

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10">
            <Sidebar />
          </div>
          <button className="absolute top-3 right-3 text-white z-20" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500">
            <Menu className="w-5 h-5" />
          </button>
          <Bus className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-gray-900">GoBusIt Admin</span>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
