import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import { scheduleTemplateService } from '../../services/scheduleTemplateService'
import { routeService } from '../../services/routeService'
import { busService } from '../../services/busService'

const Field = ({ name, label, type, form, errors, onChange, children, helper }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children || (
      <input
        type={type}
        name={name}
        value={form[name] || ''}
        onChange={onChange}
        className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? 'border-red-400' : 'border-gray-200'}`}
      />
    )}
    {errors[name] && <p className="text-xs text-red-600 mt-1">{errors[name]}</p>}
    {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
  </div>
)

const DAYS = [
  { key: 'MONDAY', label: 'Mon' },
  { key: 'TUESDAY', label: 'Tue' },
  { key: 'WEDNESDAY', label: 'Wed' },
  { key: 'THURSDAY', label: 'Thu' },
  { key: 'FRIDAY', label: 'Fri' },
  { key: 'SATURDAY', label: 'Sat' },
  { key: 'SUNDAY', label: 'Sun' }
]

export default function ScheduleTemplateForm() {
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    routeId: '',
    busId: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    daysOfWeek: []
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const loadData = async () => {
      try {
        const [routesData, busesData] = await Promise.all([
          routeService.getAll(),
          busService.getAll()
        ])
        setRoutes(routesData || [])
        setBuses((busesData || []).filter(b => b.status === 'ACTIVE'))
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleDayToggle = (day) => {
    const newDays = form.daysOfWeek.includes(day)
      ? form.daysOfWeek.filter(d => d !== day)
      : [...form.daysOfWeek, day]
    setForm({ ...form, daysOfWeek: newDays })
    setErrors({ ...errors, daysOfWeek: '' })
  }

  const validate = () => {
    const e = {}
    
    if (!form.routeId) e.routeId = 'Route is required'
    if (!form.busId) e.busId = 'Bus is required'
    if (!form.departureTime) e.departureTime = 'Departure time is required'
    if (!form.arrivalTime) e.arrivalTime = 'Arrival time is required'
    if (form.departureTime && form.arrivalTime && form.arrivalTime <= form.departureTime) {
      e.arrivalTime = 'Arrival time must be after departure time'
    }
    if (!form.price || Number(form.price) <= 0) e.price = 'Price must be greater than 0'
    if (form.daysOfWeek.length === 0) e.daysOfWeek = 'At least one day must be selected'
    
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { 
      setErrors(errs) 
      return 
    }
    
    setSaving(true)
    try {
      await scheduleTemplateService.create({
        routeId: form.routeId,
        busId: form.busId,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        price: Number(form.price),
        daysOfWeek: form.daysOfWeek
      })
      navigate('/admin/schedule-templates')
    } catch (error) {
      if (error.status === 409) {
        setErrors({ busId: 'This bus already has a template that overlaps with this time window.' })
      } else {
        console.error('Failed to create template:', error)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-16">
          <div className="text-gray-400">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-md space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">Add Schedule Template</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              name="routeId"
              label="Route"
              type="select"
              form={form}
              errors={errors}
              onChange={handleChange}
            >
              <select
                name="routeId"
                value={form.routeId}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.routeId ? 'border-red-400' : 'border-gray-200'}`}
              >
                <option value="">Select a route</option>
                {routes.map(r => (
                  <option key={r.uuid} value={r.uuid}>
                    {r.originName} → {r.destinationName}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              name="busId"
              label="Bus"
              type="select"
              form={form}
              errors={errors}
              onChange={handleChange}
            >
              <select
                name="busId"
                value={form.busId}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.busId ? 'border-red-400' : 'border-gray-200'}`}
              >
                <option value="">Select a bus</option>
                {buses.map(b => (
                  <option key={b.uuid} value={b.uuid}>
                    {b.plateNumber} — {b.capacity} seats
                  </option>
                ))}
              </select>
            </Field>

            <Field
              name="departureTime"
              label="Departure Time"
              type="time"
              form={form}
              errors={errors}
              onChange={handleChange}
            />

            <Field
              name="arrivalTime"
              label="Arrival Time"
              type="time"
              form={form}
              errors={errors}
              onChange={handleChange}
            />

            <Field
              name="price"
              label="Price (FCFA)"
              type="number"
              form={form}
              errors={errors}
              onChange={handleChange}
            >
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="100"
                placeholder="5000"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-400' : 'border-gray-200'}`}
              />
            </Field>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
              <div className="flex flex-wrap gap-2">
                {DAYS.map(day => (
                  <label
                    key={day.key}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer transition ${
                      form.daysOfWeek.includes(day.key)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={form.daysOfWeek.includes(day.key)}
                      onChange={() => handleDayToggle(day.key)}
                    />
                    {day.label}
                  </label>
                ))}
              </div>
              {errors.daysOfWeek && <p className="text-xs text-red-600 mt-1">{errors.daysOfWeek}</p>}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Create Template'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
