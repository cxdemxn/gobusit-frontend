import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import PassengerLayout from '../../components/layout/PassengerLayout'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Paginator from '../../components/ui/Paginator'
import { ticketService } from '../../services/ticketService'

const fmt = (dt) => new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtTime = (dt) => new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

export default function MyTickets() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('upcoming')
  const [page, setPage] = useState(1)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await ticketService.getMyTickets()
        setTickets(data.content || data)
      } catch (error) {
        console.error('Failed to load tickets:', error)
        setTickets([])
      } finally {
        setLoading(false)
      }
    }
    loadTickets()
  }, [])

  const upcoming = tickets.filter(t => t.status === 'BOOKED')
  const past = tickets.filter(t => t.status !== 'BOOKED')
  const list = tab === 'upcoming' ? upcoming : past

  return (
    <PassengerLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-extrabold text-gray-900">My Tickets</h1>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {[['upcoming', 'Upcoming', upcoming.length], ['past', 'Past', past.length]].map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setPage(1) }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon="🎟️"
            title={tab === 'upcoming' ? "No upcoming trips" : "No past trips"}
            message={tab === 'upcoming'
              ? "You haven't booked any trips yet. Find a bus to get started."
              : "Your completed and cancelled trips will appear here."}
            action={
              tab === 'upcoming' && (
                <button onClick={() => navigate('/search')} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                  Find a Bus
                </button>
              )
            }
          />
        ) : (
          <>
            <div className="space-y-3">
              {list.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                  className={`w-full bg-white rounded-2xl border text-left p-4 transition hover:shadow-sm flex items-start justify-between gap-3 ${
                    ticket.status === 'BOOKED' ? 'border-blue-100 hover:border-blue-200' : 'border-gray-100 opacity-70'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge status={ticket.status} />
                      <span className="text-xs text-gray-400">{ticket.id}</span>
                    </div>
                    <p className="font-bold text-gray-900 text-sm truncate">
                      {ticket.originName} → {ticket.destinationName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {fmt(ticket.departureTime)} at {fmtTime(ticket.departureTime)} · Seat {ticket.seatNumber}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{ticket.price.toLocaleString()} FCFA</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                </button>
              ))}
            </div>
            <Paginator page={page} totalPages={1} onChange={setPage} />
          </>
        )}
      </div>
    </PassengerLayout>
  )
}
