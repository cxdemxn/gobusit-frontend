import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Ticket, Search } from 'lucide-react'
import PassengerLayout from '../../components/layout/PassengerLayout'

const fmt = (dt) => new Date(dt).toLocaleString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
})

export default function BookingConfirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const ticket = location.state?.ticket

  if (!ticket) {
    navigate('/search', { replace: true })
    return null
  }

  const { id, schedule, seatNumber, price, status, bookedAt } = ticket

  return (
    <PassengerLayout>
      <div className="space-y-6 max-w-sm mx-auto">
        {/* Success header */}
        <div className="text-center pt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-9 h-9 text-green-500" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Seat Confirmed!</h1>
          <p className="text-gray-400 text-sm mt-1">Your booking is confirmed. Have a great trip!</p>
        </div>

        {/* Ticket card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Ticket top */}
          <div className="bg-blue-600 px-5 py-4 text-white">
            <p className="text-xs text-blue-200 font-medium mb-0.5">Booking Reference</p>
            <p className="text-xl font-extrabold tracking-wide">{id}</p>
          </div>

          {/* Dashed divider */}
          <div className="border-t-2 border-dashed border-gray-100 mx-0" />

          {/* Ticket body */}
          <div className="px-5 py-5 space-y-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Route</p>
              <p className="font-bold text-gray-900">{schedule.route.origin} → {schedule.route.destination}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Departure</p>
                <p className="text-sm font-semibold text-gray-900">{fmt(schedule.departureTime)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Arrival</p>
                <p className="text-sm font-semibold text-gray-900">{fmt(schedule.arrivalTime)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Seat Number</p>
                <p className="text-2xl font-extrabold text-blue-600">{seatNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Price Paid</p>
                <p className="text-sm font-semibold text-gray-900">{price.toLocaleString()} FCFA</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Status</p>
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Booked at</p>
              <p className="text-xs text-gray-600">{fmt(bookedAt)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/tickets')}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
          >
            <Ticket className="w-4 h-4" />
            View My Tickets
          </button>
          <button
            onClick={() => navigate('/search')}
            className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
          >
            <Search className="w-4 h-4" />
            Search More Trips
          </button>
        </div>
      </div>
    </PassengerLayout>
  )
}
