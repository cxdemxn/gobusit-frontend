import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { scheduleService } from '../../services/scheduleService'
import { routeService } from '../../services/routeService'
import { busService } from '../../services/busService'
import { api } from '../../services/api'

const fmt = (dt) => new Date(dt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const STATUS_FLOW = ['SCHEDULED', 'BOARDING', 'IN_TRANSIT', 'ARRIVED']
const CANCELLABLE = ['SCHEDULED', 'BOARDING', 'IN_TRANSIT']

export default function AdminScheduleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [schedule, setSchedule] = useState(null)
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    routeId: '',
    busId: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [scheduleData, routesData, busesData] = await Promise.all([
          scheduleService.getById(id),
          routeService.getAll(),
          busService.getAll()
        ])
        setSchedule(scheduleData)
        setRoutes(routesData)
        setBuses(busesData)
        setForm({
          routeId: scheduleData.routeId || '',
          busId: scheduleData.busId || '',
          departureTime: scheduleData.departureTime?.slice(0, 16) || '',
          arrivalTime: scheduleData.arrivalTime?.slice(0, 16) || '',
          price: scheduleData.price || '',
        })
      } catch (error) {
        console.error('Failed to load schedule:', error)
        navigate('/admin/schedules')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, navigate])

  if (loading) return <AdminLayout><div className="text-center py-16 text-gray-400">Loading...</div></AdminLayout>
  if (!schedule) return <AdminLayout><div className="text-center py-16 text-gray-400">Schedule not found.</div></AdminLayout>

  const isCancelled = schedule.status === 'CANCELLED'
  const canCancel = CANCELLABLE.includes(schedule.status)
  const canAdvance = STATUS_FLOW.includes(schedule.status) && schedule.status !== 'ARRIVED' && !isCancelled
  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(schedule.status) + 1]

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (form.departureTime && form.arrivalTime && form.departureTime >= form.arrivalTime)
      e.arrivalTime = 'Arrival time must be after departure time'
    if (!form.price || Number(form.price) <= 0) e.price = 'Price must be greater than 0'
    return e
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      await scheduleService.update(id, form)
      const updated = await scheduleService.getById(id)
      setSchedule(updated)
    } catch (error) {
      if (error.status === 409) {
        setErrors({ busId: 'This bus is already assigned to another schedule at this time.' })
      } else {
        console.error('Failed to save schedule:', error)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    try {
      const updated = await scheduleService.cancel(id)
      setSchedule(updated)
      setShowCancel(false)
    } catch (error) {
      console.error('Failed to cancel schedule:', error)
    }
  }

  const handleAdvance = async () => {
    try {
      const updated = await api.patch(`/api/admin/schedules/${id}/status`, { status: nextStatus })
      setSchedule(updated)
    } catch (error) {
      console.error('Failed to advance status:', error)
    }
  }

  const handleComplete = async () => {
    try {
      const updated = await api.patch(`/api/admin/schedules/${id}/complete`)
      setSchedule(updated)
      setShowComplete(false)
    } catch (error) {
      console.error('Failed to complete schedule:', error)
    }
  }

  const activeBuses = buses.filter(b => b.status === 'ACTIVE')

  return (
    <AdminLayout>
      {showCancel && (
        <ConfirmDialog
          title="Cancel this schedule?"
          message="Cancelling this schedule will NOT automatically cancel passenger tickets. You may need to handle those separately."
          confirmLabel="Cancel Schedule"
          danger
          onConfirm={handleCancel}
          onCancel={() => setShowCancel(false)}
        />
      )}
      {showComplete && (
        <ConfirmDialog
          title="Mark as complete?"
          message="This will set the schedule to ARRIVED and mark all passenger tickets as USED. This cannot be undone."
          confirmLabel="Mark Complete"
          onConfirm={handleComplete}
          onCancel={() => setShowComplete(false)}
        />
      )}

      <div className="max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{schedule.originName} → {schedule.destinationName}</h1>
            <p className="text-sm text-gray-400">{fmt(schedule.departureTime)}</p>
          </div>
          <div className="ml-auto"><Badge status={schedule.status} /></div>
        </div>

        {/* Cancelled banner */}
        {isCancelled && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            This schedule has been cancelled. No further edits are possible.
          </div>
        )}

        {/* Seat occupancy */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">Seat Occupancy</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{schedule.bookedSeats}</span>
            <span className="text-gray-400 text-sm mb-1">/ {schedule.totalSeats} seats booked</span>
          </div>
          <div className="mt-2 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(schedule.bookedSeats / schedule.totalSeats) * 100}%` }}
            />
          </div>
        </div>

        {/* Edit form */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Schedule Details</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <select name="routeId" value={form.routeId} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {routes.map(r => <option key={r.uuid} value={r.uuid}>{r.originName} → {r.destinationName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bus (Active only)</label>
                <select name="busId" value={form.busId} onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {activeBuses.map(b => <option key={b.uuid} value={b.uuid}>{b.plateNumber} ({b.capacity} seats)</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                  <input type="datetime-local" name="departureTime" value={form.departureTime} onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrival</label>
                  <input type="datetime-local" name="arrivalTime" value={form.arrivalTime} onChange={handleChange}
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.arrivalTime ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.arrivalTime && <p className="text-xs text-red-600 mt-1">{errors.arrivalTime}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (FCFA)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} min="0"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-400' : 'border-gray-200'}`} />
                {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
              </div>
              <button type="submit" disabled={saving}
                className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Status advance */}
        {canAdvance && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Advance Status</p>
            <button onClick={handleAdvance}
              className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition">
              Mark as {nextStatus?.replace('_', ' ')}
            </button>
          </div>
        )}

        {/* Actions: Cancel + Complete */}
        {(canCancel || schedule.status !== 'CANCELLED') && !isCancelled && (
          <div className="flex flex-wrap gap-3">
            {/* Coming soon: Mark as Complete */}
            <button
              onClick={() => setShowComplete(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
            >
              Mark as Complete
            </button>
            {canCancel && (
              <button
                onClick={() => setShowCancel(true)}
                className="flex items-center gap-2 border-2 border-red-200 text-red-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 transition"
              >
                Cancel Schedule
              </button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
