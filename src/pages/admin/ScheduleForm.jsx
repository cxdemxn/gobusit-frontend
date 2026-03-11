import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { mockRoutes, mockBuses } from '../../mock/data'

export default function ScheduleForm() {
  const navigate = useNavigate()
  const activeBuses = mockBuses.filter(b => b.status === 'ACTIVE')

  const [form, setForm] = useState({
    routeId: '',
    busId: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    status: 'SCHEDULED',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.routeId) e.routeId = 'Route is required'
    if (!form.busId) e.busId = 'Bus is required'
    if (!form.departureTime) e.departureTime = 'Departure time is required'
    if (!form.arrivalTime) e.arrivalTime = 'Arrival time is required'
    if (form.departureTime && form.arrivalTime && form.departureTime >= form.arrivalTime)
      e.arrivalTime = 'Arrival time must be after departure time'
    if (!form.price || Number(form.price) <= 0) e.price = 'Price must be greater than 0'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      // TODO: POST /api/schedules
      // On 409 bus conflict: setErrors({ busId: "This bus is already scheduled during this time..." })
      navigate('/admin/schedules')
    } finally {
      setSaving(false)
    }
  }

  const Field = ({ name, label, type = 'text', children, helper }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children || (
        <input type={type} name={name} value={form[name]} onChange={handleChange}
          className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-400' : 'border-gray-200'}`} />
      )}
      {helper && !errors[name] && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
      {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <AdminLayout>
      <div className="max-w-md space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-extrabold text-gray-900">Create Schedule</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field name="routeId" label="Route">
              <select name="routeId" value={form.routeId} onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.routeId ? 'border-red-400' : 'border-gray-200'}`}>
                <option value="">Select a route…</option>
                {mockRoutes.map(r => <option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>)}
              </select>
              {errors.routeId && <p className="text-xs text-red-600 mt-1">{errors.routeId}</p>}
            </Field>

            <Field name="busId" label="Bus" helper="Only active buses are shown">
              <select name="busId" value={form.busId} onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.busId ? 'border-red-400' : 'border-gray-200'}`}>
                <option value="">Select a bus…</option>
                {activeBuses.map(b => <option key={b.id} value={b.id}>{b.plateNumber} — {b.capacity} seats</option>)}
              </select>
              {errors.busId && <p className="text-xs text-red-600 mt-1">{errors.busId}</p>}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field name="departureTime" label="Departure" type="datetime-local" />
              <Field name="arrivalTime" label="Arrival" type="datetime-local" />
            </div>

            <Field name="price" label="Price (FCFA)" type="number" />

            <Field name="status" label="Status">
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="SCHEDULED">Scheduled</option>
                <option value="BOARDING">Boarding</option>
              </select>
            </Field>

            <button type="submit" disabled={saving}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60">
              {saving ? 'Creating…' : 'Create Schedule'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
