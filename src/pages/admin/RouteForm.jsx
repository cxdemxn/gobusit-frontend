import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2, Plus, Pencil } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { routeService } from '../../services/routeService'

export default function RouteForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [existing, setExisting] = useState(null)
  const [loading, setLoading] = useState(isEdit)

  const [form, setForm] = useState({
    origin: '',
    destination: '',
    distanceKm: '',
    durationMinutes: '',
  })
  const [errors, setErrors] = useState({})
  const [stops, setStops] = useState([])
  const [showDeleteRoute, setShowDeleteRoute] = useState(false)
  const [showDeleteStop, setShowDeleteStop] = useState(null)
  const [editStop, setEditStop] = useState(null)
  const [stopForm, setStopForm] = useState({ name: '', lat: '', lng: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const loadRoute = async () => {
        try {
          const [routeData, pointsData] = await Promise.all([
            routeService.getById(id),
            routeService.getPoints(id)
          ])
          setExisting(routeData)
          setForm({
            origin: routeData.origin || '',
            destination: routeData.destination || '',
            distanceKm: routeData.distanceKm || '',
            durationMinutes: routeData.durationMinutes || '',
          })
          setStops(pointsData)
        } catch (error) {
          console.error('Failed to load route:', error)
          navigate('/admin/routes')
        } finally {
          setLoading(false)
        }
      }
      loadRoute()
    }
  }, [id, isEdit, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.origin.trim()) e.origin = 'Origin is required'
    if (!form.destination.trim()) e.destination = 'Destination is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      if (isEdit) {
        await routeService.update(id, form)
      } else {
        const newRoute = await routeService.create(form)
        if (newRoute.id) {
          navigate(`/admin/routes/${newRoute.id}`)
          return
        }
      }
      navigate('/admin/routes')
    } catch (error) {
      console.error('Failed to save route:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRoute = async () => {
    try {
      await routeService.delete(id)
      navigate('/admin/routes')
    } catch (error) {
      console.error('Failed to delete route:', error)
    }
  }

  const handleAddStop = async () => {
    if (!stopForm.name.trim() || !stopForm.lat || !stopForm.lng) return
    try {
      const newStop = await routeService.addPoint(id, {
        name: stopForm.name,
        lat: Number(stopForm.lat),
        lng: Number(stopForm.lng),
      })
      setStops([...stops, newStop])
      setStopForm({ name: '', lat: '', lng: '' })
      setEditStop(null)
    } catch (error) {
      console.error('Failed to add stop:', error)
    }
  }

  const handleDeleteStop = async (stopId) => {
    try {
      await routeService.deletePoint(id, stopId)
      setStops(stops.filter(s => s.id !== stopId))
      setShowDeleteStop(null)
    } catch (error) {
      console.error('Failed to delete stop:', error)
    }
  }

  return (
    <AdminLayout>
      {showDeleteRoute && (
        <ConfirmDialog
          title="Delete this route?"
          message="Deleting this route will permanently remove it and all its stop points. This cannot be undone."
          confirmLabel="Delete Route"
          danger
          onConfirm={handleDeleteRoute}
          onCancel={() => setShowDeleteRoute(false)}
        />
      )}
      {showDeleteStop && (
        <ConfirmDialog
          title="Remove this stop?"
          message="Are you sure you want to remove this stop from the route?"
          confirmLabel="Remove Stop"
          danger
          onConfirm={() => handleDeleteStop(showDeleteStop)}
          onCancel={() => setShowDeleteStop(null)}
        />
      )}

      <div className="max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">{isEdit ? 'Edit Route' : 'Add Route'}</h1>
        </div>

        {/* Route fields */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                <input name="origin" value={form.origin} onChange={handleChange} placeholder="Cotonou"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.origin ? 'border-red-400' : 'border-gray-200'}`} />
                {errors.origin && <p className="text-xs text-red-600 mt-1">{errors.origin}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input name="destination" value={form.destination} onChange={handleChange} placeholder="Lagos"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.destination ? 'border-red-400' : 'border-gray-200'}`} />
                {errors.destination && <p className="text-xs text-red-600 mt-1">{errors.destination}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                <input type="number" name="distanceKm" value={form.distanceKm} onChange={handleChange} placeholder="125"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input type="number" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} placeholder="180"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60">
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Route'}
            </button>
          </form>
        </div>

        {/* Stop points — only shown when editing an existing route */}
        {isEdit && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-gray-900">Stop Points</h2>

            {stops.length === 0 ? (
              <p className="text-sm text-gray-400">No stops added yet.</p>
            ) : (
              <div className="space-y-2">
                {stops.map((stop, i) => (
                  <div key={stop.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                      {stop.sequence}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{stop.name}</p>
                      <p className="text-xs text-gray-400">{stop.lat}, {stop.lng}</p>
                    </div>
                    <button onClick={() => setShowDeleteStop(stop.id)} className="text-gray-400 hover:text-red-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add stop form */}
            <div className="border-t border-gray-50 pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Add Stop</p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input placeholder="Stop name" value={stopForm.name} onChange={e => setStopForm({ ...stopForm, name: e.target.value })}
                  className="col-span-3 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" step="any" placeholder="Latitude" value={stopForm.lat} onChange={e => setStopForm({ ...stopForm, lat: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" step="any" placeholder="Longitude" value={stopForm.lng} onChange={e => setStopForm({ ...stopForm, lng: e.target.value })}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={handleAddStop}
                  className="flex items-center justify-center gap-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>
            </div>
          </div>
        )}

        {isEdit && (
          <button onClick={() => setShowDeleteRoute(true)} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition">
            <Trash2 className="w-4 h-4" /> Delete this route
          </button>
        )}
      </div>
    </AdminLayout>
  )
}
