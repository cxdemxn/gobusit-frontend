import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Paginator from '../../components/ui/Paginator'
import { scheduleService } from '../../services/scheduleService'
import { routeService } from '../../services/routeService'

const fmt = (dt) => new Date(dt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

const STATUSES = ['ALL', 'SCHEDULED', 'BOARDING', 'IN_TRANSIT', 'ARRIVED', 'CANCELLED']

export default function ScheduleList() {
  const navigate = useNavigate()
  const [routeFilter, setRouteFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [schedules, setSchedules] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  const handleRouteFilterChange = (value) => {
    setRouteFilter(value)
    setPage(1)
  }

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
    setPage(1)
  }

  const handleDateFilterChange = (value) => {
    setDateFilter(value)
    setPage(1)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const [schedulesData, routesData] = await Promise.all([
          scheduleService.getAll({ routeId: routeFilter, status: statusFilter, date: dateFilter, page }),
          routeService.getAll()
        ])
        const content = schedulesData.content || schedulesData
        setSchedules([...content].sort((a, b) => new Date(b.departureTime) - new Date(a.departureTime)))
        setRoutes(routesData)
        setTotalPages(schedulesData.totalPages || 1)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [routeFilter, statusFilter, dateFilter, page])

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Schedules</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage all trip schedules</p>
          </div>
          <button
            onClick={() => navigate('/admin/schedules/new')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Create Schedule
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={routeFilter}
            onChange={e => handleRouteFilterChange(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Routes</option>
            {routes.map(r => (
              <option key={r.uuid} value={r.uuid}>{r.originName} → {r.destinationName}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={e => handleStatusFilterChange(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>)}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={e => handleDateFilterChange(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {schedules.length === 0 ? (
          <EmptyState icon="📅" title="No schedules found" message="No schedules match your filters." />
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-gray-50 text-xs text-gray-400 font-medium">
                    <th className="text-left px-5 py-3">Route</th>
                    <th className="text-left px-4 py-3">Departure</th>
                    <th className="text-left px-4 py-3">Bus</th>
                    <th className="text-right px-4 py-3">Price</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-right px-4 py-3">Seats</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(s => (
                    <tr
                      key={s.id}
                      onClick={() => navigate(`/admin/schedules/${s.id}`)}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-5 py-3.5 font-medium text-gray-900">{s.originName} → {s.destinationName}</td>
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{fmt(s.departureTime)}</td>
                      <td className="px-4 py-3.5 text-gray-500">{s.plateNumber}</td>
                      <td className="px-4 py-3.5 text-right text-gray-700 font-medium">{s.price.toLocaleString()}</td>
                      <td className="px-4 py-3.5"><Badge status={s.status} /></td>
                      <td className="px-4 py-3.5 text-right text-gray-500">{s.bookedSeats}/{s.totalSeats}</td>
                      <td className="px-4 py-3.5 text-right"><ChevronRight className="w-4 h-4 text-gray-300 ml-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paginator page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </AdminLayout>
  )
}