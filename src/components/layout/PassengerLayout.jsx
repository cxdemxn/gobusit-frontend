import { NavLink, useNavigate } from 'react-router-dom'
import { Bus, Search, Ticket, User, LogOut, Home } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/search', icon: Search, label: 'Find a Bus' },
  { to: '/tickets', icon: Ticket, label: 'My Tickets' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export default function PassengerLayout({ children }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-gray-900 text-lg">GoBusIt</span>
        </div>
        <button onClick={handleLogout} className="text-gray-400 hover:text-gray-700 transition">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">{children}</main>

      {/* Bottom nav */}
      <nav className="bg-white border-t border-gray-100 sticky bottom-0 z-30">
        <div className="flex justify-around max-w-2xl mx-auto">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-3 px-4 text-xs font-medium transition ${
                  isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
