import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bus } from 'lucide-react'
import PassengerLayout from '../../components/layout/PassengerLayout'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { ticketService } from '../../services/ticketService'

const fmt = (dt) => new Date(dt).toLocaleString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
})

export default function TicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const ticketData = await ticketService.getMyTicketById(id)
        setTicket(ticketData)
      } catch (error) {
        console.error('Failed to load ticket:', error)
        setTicket(null)
      } finally {
        setLoading(false)
      }
    }
    loadTicket()
  }, [id])

  if (loading) {
    return <PassengerLayout><div className="text-center py-16 text-gray-400">Loading ticket...</div></PassengerLayout>
  }

  if (!ticket) {
    return <PassengerLayout><div className="text-center py-16 text-gray-400">Ticket not found.</div></PassengerLayout>
  }

  // No longer need to destructure schedule since data is now flattened

  const handleCancel = async () => {
    try {
      await ticketService.cancelMyTicket(id)
      setTicket({ ...ticket, status: 'CANCELLED' })
      setShowConfirm(false)
    } catch (error) {
      console.error('Failed to cancel ticket:', error)
    }
  }

  const Row = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-gray-900 text-right ml-4 max-w-[60%]">{value}</span>
    </div>
  )

  return (
    <PassengerLayout>
      {showConfirm && (
        <ConfirmDialog
          title="Cancel this booking?"
          message="Are you sure you want to cancel this booking? This cannot be undone."
          confirmLabel="Cancel Booking"
          danger
          onConfirm={handleCancel}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="space-y-5 max-w-sm mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Status banner for inactive tickets */}
        {ticket.status !== 'BOOKED' && (
          <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${
            ticket.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-500 border border-gray-200'
          }`}>
            {ticket.status === 'CANCELLED' ? 'This ticket has been cancelled.' : 'This ticket has been used. Your trip is complete.'}
          </div>
        )}

        {/* Ticket card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 px-5 py-4 text-white">
            <p className="text-xs text-blue-200 font-medium mb-0.5">Ticket Reference</p>
            <p className="text-xl font-extrabold">{ticket.id}</p>
            <div className="mt-2">
              <Badge status={ticket.status} />
            </div>
          </div>
          <div className="px-5 py-2">
            <Row label="Route" value={`${ticket.originName} → ${ticket.destinationName}`} />
            <Row label="Bus" value={ticket.plateNumber} />
            <Row label="Departure" value={fmt(ticket.departureTime)} />
            <Row label="Arrival" value={fmt(ticket.arrivalTime)} />
            <Row label="Seat Number" value={ticket.seatNumber} />
            <Row label="Price Paid" value={`${ticket.price.toLocaleString()} FCFA`} />
            <Row label="Booked At" value={fmt(ticket.bookingTime)} />
          </div>
        </div>

        {ticket.status === 'BOOKED' && (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-full border-2 border-red-200 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-50 transition"
          >
            Cancel Ticket
          </button>
        )}
      </div>
    </PassengerLayout>
  )
}
