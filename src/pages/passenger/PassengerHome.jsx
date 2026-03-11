import { useNavigate } from 'react-router-dom'
import { Search, Ticket, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import PassengerLayout from '../../components/layout/PassengerLayout'
import Badge from '../../components/ui/Badge'
import { mockTickets, mockSchedules } from '../../mock/data'

export default function PassengerHome() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // TODO: fetch /api/tickets/my — filter to BOOKED
  const upcoming = mockTickets.filter(t => t.status === 'BOOKED')

  const fmt = (dt) => new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <PassengerLayout>
      <div className="space-y-6">
        {/* Greeting */}
        <div>
          <p className="text-gray-400 text-sm">Good day,</p>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Hello, {user?.firstName || 'Traveller'} 👋
          </h1>
        </div>

        {/* Quick search card */}
        <button
          onClick={() => navigate('/search')}
          className="w-full bg-blue-600 text-white rounded-2xl p-5 flex items-center justify-between shadow-md hover:bg-blue-700 transition"
        >
          <div className="text-left">
            <p className="text-sm text-blue-100 font-medium">Ready to travel?</p>
            <p className="text-lg font-bold">Find a Bus</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <Search className="w-6 h-6" />
          </div>
        </button>

        {/* Upcoming trips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 text-base">Upcoming Trips</h2>
            <button onClick={() => navigate('/tickets')} className="text-sm text-blue-600 font-medium hover:underline">
              View all
            </button>
          </div>

          {upcoming.length === 0 ? (
            <div className="bg-gray-100 rounded-2xl p-6 text-center">
              <p className="text-gray-500 text-sm">You have no upcoming trips.</p>
              <button onClick={() => navigate('/search')} className="mt-3 text-blue-600 text-sm font-medium hover:underline">
                Browse schedules →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">You have <strong>{upcoming.length}</strong> upcoming {upcoming.length === 1 ? 'trip' : 'trips'}</p>
              {upcoming.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className="w-full bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-sm transition text-left"
                >
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">
                      {ticket.schedule.route.origin} → {ticket.schedule.route.destination}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{fmt(ticket.schedule.departureTime)} · Seat {ticket.seatNumber}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge status={ticket.status} />
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick nav */}
        <button
          onClick={() => navigate('/tickets')}
          className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-sm transition"
        >
          <div className="bg-blue-50 rounded-xl p-2.5">
            <Ticket className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold text-gray-900 text-sm">My Tickets</p>
            <p className="text-xs text-gray-400">All bookings and history</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      </div>
    </PassengerLayout>
  )
}
