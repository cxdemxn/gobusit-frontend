import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Bus, ChevronRight } from 'lucide-react'
import PassengerLayout from '../../components/layout/PassengerLayout'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { mockSchedules } from '../../mock/data'
import { useAuth } from '../../context/AuthContext'

const fmt = (dt) => new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
const fmtDate = (dt) => new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function ScheduleSearch() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')

  // TODO: replace with GET /api/schedules?from=&to=&date= (only SCHEDULED + BOARDING returned by backend)
  const visibleStatuses = ['SCHEDULED', 'BOARDING']
  const filtered = mockSchedules
    .filter(s => visibleStatuses.includes(s.status))
    .filter(s => !from || s.route.origin.toLowerCase().includes(from.toLowerCase()))
    .filter(s => !to || s.route.destination.toLowerCase().includes(to.toLowerCase()))
    .filter(s => !date || s.departureTime.startsWith(date))

  const availableSeats = (s) => s.totalSeats - s.bookedSeats

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <PassengerLayout>
          <Content navigate={navigate} from={from} setFrom={setFrom} to={to} setTo={setTo} date={date} setDate={setDate} filtered={filtered} availableSeats={availableSeats} />
        </PassengerLayout>
      ) : (
        <GuestWrapper navigate={navigate}>
          <Content navigate={navigate} from={from} setFrom={setFrom} to={to} setTo={setTo} date={date} setDate={setDate} filtered={filtered} availableSeats={availableSeats} />
        </GuestWrapper>
      )}
    </div>
  )
}

function GuestWrapper({ children, navigate }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-gray-900 text-lg">GoBusIt</span>
        </div>
        <button onClick={() => navigate('/login')} className="text-sm font-medium text-blue-600 hover:underline">Login</button>
      </header>
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">{children}</main>
    </div>
  )
}

function Content({ navigate, from, setFrom, to, setTo, date, setDate, filtered, availableSeats }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-gray-900">Find a Bus</h1>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="From (e.g. Cotonou)"
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
          <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="To (e.g. Lagos)"
            value={to}
            onChange={e => setTo(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Results */}
      <p className="text-xs text-gray-400 font-medium px-1">{filtered.length} trip{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🚌"
          title="No trips found"
          message="No trips match your search. Try different dates or locations."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(s => {
            const seats = availableSeats(s)
            const full = seats <= 0
            return (
              <button
                key={s.id}
                onClick={() => navigate(`/schedule/${s.id}`)}
                disabled={full}
                className={`w-full bg-white rounded-2xl border p-4 text-left transition hover:shadow-sm ${full ? 'opacity-60 border-gray-100' : 'border-gray-100 hover:border-blue-200'}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900 text-base">
                      {s.route.origin} → {s.route.destination}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{fmtDate(s.departureTime)}</p>
                  </div>
                  <Badge status={s.status} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{fmt(s.departureTime)} → {fmt(s.arrivalTime)}</span>
                    <span className="text-gray-300">|</span>
                    <span className="font-semibold text-gray-900">
                      {s.price.toLocaleString()} FCFA
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
                <div className="mt-2">
                  {full ? (
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Fully Booked</span>
                  ) : seats <= 5 ? (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Only {seats} seats left!</span>
                  ) : (
                    <span className="text-xs text-gray-400">{seats} seats available</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
