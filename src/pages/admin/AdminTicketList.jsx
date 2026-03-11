import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Paginator from '../../components/ui/Paginator'
import { mockAllTickets, mockSchedules } from '../../mock/data'

const fmt = (dt) => new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

const STATUSES = ['ALL', 'BOOKED', 'CANCELLED', 'USED']

export default function AdminTicketList() {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [scheduleFilter, setScheduleFilter] = useState('')
  const [page, setPage] = useState(1)

  // TODO: GET /api/admin/tickets?status=&scheduleId=&userId=
  const tickets = mockAllTickets
    .filter(t => statusFilter === 'ALL' || t.status === statusFilter)
    .filter(t => !scheduleFilter || t.schedule.id === Number(scheduleFilter))

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-5xl">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tickets</h1>
          <p className="text-gray-400 text-sm mt-0.5">All passenger bookings across every schedule</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {STATUSES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>)}
          </select>
          <select value={scheduleFilter} onChange={e => setScheduleFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Schedules</option>
            {mockSchedules.map(s => (
              <option key={s.id} value={s.id}>{s.route.origin} → {s.route.destination} ({fmt(s.departureTime)})</option>
            ))}
          </select>
        </div>

        {tickets.length === 0 ? (
          <EmptyState icon="🎟️" title="No tickets found" message="No tickets match your current filters." />
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-50 text-xs text-gray-400 font-medium">
                    <th className="text-left px-5 py-3">Passenger</th>
                    <th className="text-left px-4 py-3">Route</th>
                    <th className="text-left px-4 py-3">Departure</th>
                    <th className="text-center px-4 py-3">Seat</th>
                    <th className="text-left px-4 py-3">Booked On</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.id} onClick={() => navigate(`/admin/tickets/${t.id}`)}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">{t.passenger.firstName} {t.passenger.lastName}</p>
                        <p className="text-xs text-gray-400">{t.passenger.email}</p>
                      </td>
                      <td className="px-4 py-3.5 text-gray-700">{t.schedule.route.origin} → {t.schedule.route.destination}</td>
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{fmt(t.schedule.departureTime)}</td>
                      <td className="px-4 py-3.5 text-center font-semibold text-gray-900">{t.seatNumber}</td>
                      <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">{fmt(t.bookedAt)}</td>
                      <td className="px-4 py-3.5"><Badge status={t.status} /></td>
                      <td className="px-4 py-3.5 text-right"><ChevronRight className="w-4 h-4 text-gray-300 ml-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Paginator page={page} totalPages={1} onChange={setPage} />
          </>
        )}
      </div>
    </AdminLayout>
  )
}
