import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bus, Route, Calendar, Ticket, Plus, ChevronRight } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import { api } from '../../services/api'

const fmt = (dt) => new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.get('/api/admin/dashboard/stats')
        setStats(data)
      } catch (error) {
        console.error('Failed to load dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading dashboard...</div>
        </div>
      </AdminLayout>
    )
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Failed to load dashboard</div>
        </div>
      </AdminLayout>
    )
  }
  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
    </div>
  )

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-0.5">Operations overview</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Bus} label="Total Buses" value={stats.totalBuses} color="bg-blue-100 text-blue-600" />
          <StatCard icon={Route} label="Total Routes" value={stats.totalRoutes} color="bg-purple-100 text-purple-600" />
          <StatCard icon={Calendar} label="Schedules Today" value={stats.schedulesToday} color="bg-teal-100 text-teal-600" />
          <StatCard icon={Ticket} label="Active Bookings" value={stats.activeBookings} color="bg-green-100 text-green-600" />
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Add Bus', to: '/admin/buses/new', color: 'bg-blue-600 text-white hover:bg-blue-700' },
              { label: 'Add Route', to: '/admin/routes/new', color: 'bg-purple-600 text-white hover:bg-purple-700' },
              { label: 'Create Schedule', to: '/admin/schedules/new', color: 'bg-teal-600 text-white hover:bg-teal-700' },
            ].map(({ label, to, color }) => (
              <button
                key={to}
                onClick={() => navigate(to)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${color}`}
              >
                <Plus className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Today's schedules */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Today's Schedules</h2>
            <button onClick={() => navigate('/admin/schedules')} className="text-sm text-blue-600 hover:underline font-medium">
              View all
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {stats.todaysSchedules.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No schedules today.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 text-xs text-gray-400 font-medium">
                    <th className="text-left px-5 py-3">Route</th>
                    <th className="text-left px-4 py-3">Departure</th>
                    <th className="text-left px-4 py-3">Bus</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Seats</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {stats.todaysSchedules.map((s, i) => (
                    <tr
                      key={s.id}
                      onClick={() => navigate(`/admin/schedules/${s.id}`)}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-5 py-3.5 font-medium text-gray-900">{s.originName} → {s.destinationName}</td>
                      <td className="px-4 py-3.5 text-gray-500">{fmt(s.departureTime)}</td>
                      <td className="px-4 py-3.5 text-gray-500">{s.plateNumber}</td>
                      <td className="px-4 py-3.5"><Badge status={s.status} /></td>
                      <td className="px-4 py-3.5 text-right text-gray-500">{s.bookedSeats}/{s.totalSeats}</td>
                      <td className="px-4 py-3.5 text-right"><ChevronRight className="w-4 h-4 text-gray-300 ml-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
