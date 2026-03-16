import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bus, Clock, MapPin, AlertCircle } from 'lucide-react'
import PassengerLayout from '../../components/layout/PassengerLayout'
import Badge from '../../components/ui/Badge'
import { passengerScheduleService } from '../../services/passengerScheduleService'
import { ticketService } from '../../services/ticketService'
import { useAuth } from '../../context/AuthContext'

const fmt = (dt) => new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
const fmtDate = (dt) => new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function ScheduleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedSeat, setSelectedSeat] = useState(null)
  const [seatError, setSeatError] = useState('')
  const [booking, setBooking] = useState(false)
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const scheduleData = await passengerScheduleService.getById(id)
        setSchedule(scheduleData)
      } catch (error) {
        console.error('Failed to load schedule:', error)
        setSchedule(null)
      } finally {
        setLoading(false)
      }
    }
    loadSchedule()
  }, [id])

  if (loading) {
    return (
      <PassengerLayout>
        <div className="text-center py-16 text-gray-400">Loading schedule...</div>
      </PassengerLayout>
    )
  }

  if (!schedule) {
    return (
      <PassengerLayout>
        <div className="text-center py-16 text-gray-400">Schedule not found.</div>
      </PassengerLayout>
    )
  }

  const { originName, destinationName, plateNumber, totalSeats, availableSeats, takenSeats, departureTime, arrivalTime, price, status } = schedule
  const bookableStatuses = ['SCHEDULED', 'BOARDING']
  const isBookable = bookableStatuses.includes(status)

  const handleSeatClick = (num) => {
    setSeatError('')
    if (takenSeats.includes(num)) {
      setSeatError(`Seat ${num} is already taken.`)
      return
    }
    setSelectedSeat(num)
  }

  const handleBook = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/schedule/${id}` } })
      return
    }
    if (!selectedSeat) return
    setBooking(true)
    try {
      const ticket = await ticketService.bookTicket({ 
        scheduleId: id, 
        seatNumber: selectedSeat 
      })
      navigate('/booking-confirmation', {
        state: { ticket }
      })
    } catch (err) {
      console.log(err)
      if (err.status === 409) {
        setSeatError(`Sorry, seat ${selectedSeat} was just taken. Please choose another seat.`)
        setSelectedSeat(null)
      } else {
        setSeatError('Failed to book seat. Please try again.')
      }
    } finally {
      setBooking(false)
    }
  }

  const Wrap = ({ children }) => user
    ? <PassengerLayout>{children}</PassengerLayout>
    : (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => navigate(-1)} className="text-gray-500"><ArrowLeft className="w-5 h-5" /></button>
          <span className="font-bold text-gray-900">Trip Details</span>
        </header>
        <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">{children}</main>
      </div>
    )

  return (
    <Wrap>
      <div className="space-y-5">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Trip summary card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-extrabold text-gray-900">{originName} → {destinationName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{fmtDate(departureTime)}</p>
            </div>
            <Badge status={status} />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Departure</p>
              <p className="font-semibold text-gray-900">{fmt(departureTime)}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">Arrival</p>
              <p className="font-semibold text-gray-900">{fmt(arrivalTime)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-gray-500">
              <Bus className="w-4 h-4" />
              <span>{plateNumber}</span>
            </div>
            <div className="text-blue-700 font-bold text-base">{price.toLocaleString()} FCFA</div>
          </div>

          {(() => {
            const avail = availableSeats
            if (avail <= 0) return <p className="text-xs font-semibold text-red-500">Fully booked</p>
            if (avail <= 5) return <p className="text-xs font-semibold text-amber-600">Only {avail} seats left!</p>
            return <p className="text-xs text-gray-400">{avail} seats available</p>
          })()}

          {status === 'BOARDING' && (
            <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-xl px-3 py-2 text-sm text-teal-700">
              <Clock className="w-4 h-4 flex-shrink-0" />
              This bus is boarding now. Book quickly!
            </div>
          )}

          {!isBookable && (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {status === 'CANCELLED' ? 'This trip has been cancelled.' :
               status === 'IN_TRANSIT' ? 'This bus is already on the road.' :
               status === 'ARRIVED' ? 'This trip has already arrived.' : 'Booking is not available.'}
            </div>
          )}
        </div>

        {/* Seat map */}
        {isBookable && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-1">Select Your Seat</h2>
            <p className="text-xs text-gray-400 mb-4">Tap an available seat to select it</p>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-gray-200 border border-gray-300" /> Taken</div>
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-white border-2 border-gray-300" /> Available</div>
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded bg-blue-600 border-2 border-blue-600" /> Selected</div>
            </div>

            {/* Driver indicator */}
            <div className="flex justify-end mb-2">
              <div className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">🚗 Driver</div>
            </div>

            {/* Seat grid */}
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalSeats }, (_, i) => {
                const num = i + 1
                const taken = takenSeats.includes(num)
                const selected = selectedSeat === num
                return (
                  <button
                    key={num}
                    onClick={() => handleSeatClick(num)}
                    disabled={taken}
                    className={`aspect-square flex items-center justify-center text-xs font-semibold rounded-lg transition border-2
                      ${taken ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' :
                        selected ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105' :
                        'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    {num}
                  </button>
                )
              })}
            </div>

            {seatError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2 mt-3">{seatError}</p>
            )}
          </div>
        )}

        {/* Book button */}
        {isBookable && (
          <button
            onClick={handleBook}
            disabled={!selectedSeat || booking}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl text-base hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {booking ? 'Booking…' : selectedSeat ? `Book Seat ${selectedSeat} — ${price.toLocaleString()} FCFA` : 'Select a seat to book'}
          </button>
        )}
      </div>
    </Wrap>
  )
}
