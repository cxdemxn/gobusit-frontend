import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { ticketService } from '../../services/ticketService'

const fmt = (dt) => new Date(dt).toLocaleString('en-GB', {
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
})

export default function AdminTicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const ticketData = await ticketService.getById(id)
        setTicket(ticketData)
      } catch (error) {
        console.error('Failed to load ticket:', error)
        navigate('/admin/tickets')
      } finally {
        setLoading(false)
      }
    }
    loadTicket()
  }, [id, navigate])

  if (loading) return <AdminLayout><div className="text-center py-16 text-gray-400">Loading...</div></AdminLayout>
  if (!ticket) return <AdminLayout><div className="text-center py-16 text-gray-400">Ticket not found.</div></AdminLayout>


  const handleCancel = async () => {
    try {
      await ticketService.cancel(id)
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
    <AdminLayout>
      {showConfirm && (
        <ConfirmDialog
          title="Cancel this ticket?"
          message="Cancel this ticket? The seat will be freed and the passenger will lose their booking."
          confirmLabel="Cancel Ticket"
          danger
          onConfirm={handleCancel}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="max-w-lg space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-extrabold text-gray-900">Ticket Detail</h1>
        </div>

        {ticket.status !== 'BOOKED' && (
          <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${
            ticket.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-100 text-gray-500 border border-gray-200'
          }`}>
            {ticket.status === 'CANCELLED' ? 'This ticket has been cancelled.' : 'This ticket has been used.'}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Ticket ID</p>
              <p className="font-extrabold text-gray-900 text-xl">{ticket.id}</p>
            </div>
            <Badge status={ticket.status} />
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-3">Passenger</p>
            <Row label="Name" value={ticket.passengerName} />
            <Row label="Phone" value={ticket.passengerPhone} />
          </div>

          <div className="mt-2">
            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1 mt-4">Journey</p>
            <Row label="Route" value={`${ticket.originName} → ${ticket.destinationName}`} />
            <Row label="Departure" value={fmt(ticket.departureTime)} />
            <Row label="Arrival" value={fmt(ticket.arrivalTime)} />
            <Row label="Bus" value={ticket.plateNumber} />
            <Row label="Seat" value={ticket.seatNumber} />
            <Row label="Price" value={`${ticket.price.toLocaleString()} FCFA`} />
            <Row label="Booked At" value={fmt(ticket.bookingTime)} />
          </div>
        </div>

        {ticket.status === 'BOOKED' && (
          <button onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 border-2 border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition">
            Cancel Ticket
          </button>
        )}
      </div>
    </AdminLayout>
  )
}
