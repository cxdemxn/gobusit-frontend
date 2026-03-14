import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Bus, ChevronRight } from 'lucide-react'
import PassengerLayout from '../../components/layout/PassengerLayout'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { passengerScheduleService } from '../../services/passengerScheduleService'
import { useAuth } from '../../context/AuthContext'
import ScheduleResults from './ScheduleResults'

const fmt = (dt) => new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
const fmtDate = (dt) => new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function ScheduleSearch() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [originName, setOriginName] = useState('')
  const [destinationName, setDestinationName] = useState('')
  const [date, setDate] = useState('')
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTrigger, setSearchTrigger] = useState(0)

  // Initial load on mount
  useEffect(() => {
    const loadInitialSchedules = async () => {
      setLoading(true)
      try {
        const data = await passengerScheduleService.getAll({})
        setSchedules(data)
      } catch (error) {
        console.error('Failed to load initial schedules:', error)
        setSchedules([])
      } finally {
        setLoading(false)
      }
    }
    loadInitialSchedules()
  }, []) // Run only once on mount

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (originName || destinationName || date) {
        const loadSchedules = async () => {
          setLoading(true)
          try {
            const data = await passengerScheduleService.getAll({ originName, destinationName, date })
            setSchedules(data)
          } catch (error) {
            console.error('Failed to load schedules:', error)
            setSchedules([])
          } finally {
            setLoading(false)
          }
        }
        loadSchedules()
      } else {
        // Reset to all schedules when filters are cleared
        const loadAllSchedules = async () => {
          setLoading(true)
          try {
            const data = await passengerScheduleService.getAll({})
            setSchedules(data)
          } catch (error) {
            console.error('Failed to load all schedules:', error)
            setSchedules([])
          } finally {
            setLoading(false)
          }
        }
        loadAllSchedules()
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [originName, destinationName, date, searchTrigger])

  const availableSeats = (s) => s.totalSeats - s.bookedSeats

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <PassengerLayout>
          <Content navigate={navigate} originName={originName} setOriginName={setOriginName} destinationName={destinationName} setDestinationName={setDestinationName} date={date} setDate={setDate} schedules={schedules} loading={loading} availableSeats={availableSeats} />
        </PassengerLayout>
      ) : (
        <GuestWrapper navigate={navigate}>
          <Content navigate={navigate} originName={originName} setOriginName={setOriginName} destinationName={destinationName} setDestinationName={setDestinationName} date={date} setDate={setDate} schedules={schedules} loading={loading} availableSeats={availableSeats} />
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

function Content({ navigate, originName, setOriginName, destinationName, setDestinationName, date, setDate, schedules, loading, availableSeats }) {
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
            value={originName}
            onChange={e => setOriginName(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
          <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="To (e.g. Lagos)"
            value={destinationName}
            onChange={e => setDestinationName(e.target.value)}
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

      {/* Results - This is now a separate component */}
      <ScheduleResults 
        schedules={schedules} 
        loading={loading} 
        availableSeats={availableSeats} 
        navigate={navigate} 
      />
    </div>
  )
}
