import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, MapPin } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { routeService } from '../../services/routeService'

export default function RouteDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [route, setRoute] = useState(null)
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    const loadRoute = async () => {
      try {
        const [routeData, pointsData] = await Promise.all([
          routeService.getById(id),
          routeService.getPoints(id)
        ])
        setRoute(routeData)
        setStops(pointsData)
      } catch (error) {
        console.error('Failed to load route:', error)
        navigate('/admin/routes')
      } finally {
        setLoading(false)
      }
    }
    loadRoute()
  }, [id, navigate])




  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Loading route details...</div>
        </div>
      </AdminLayout>
    )
  }

  if (!route) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-400">Route not found.</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>

      <div className="max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin/routes')} className="text-gray-400 hover:text-gray-700">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-extrabold text-gray-900">Route Details</h1>
          </div>
          <button
            onClick={() => navigate(`/admin/routes/${id}/edit`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Edit className="w-4 h-4" /> Edit Route
          </button>
        </div>

        {/* Route information */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Route Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50">
                    {route.originName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50">
                    {route.destinationName}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                    <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50">
                      {route.distanceKm}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Est. Duration (min)</label>
                    <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50">
                      {route.estimatedDurationMin}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stop points */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Stop Points</h3>
          {stops.length === 0 ? (
            <p className="text-sm text-gray-400">No stops added yet.</p>
          ) : (
            <div className="space-y-2">
              {stops.map((stop) => (
                <div key={stop.uuid} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full flex-shrink-0">
                    {stop.sequenceOrder}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{stop.stopName}</p>
                    <p className="text-xs text-gray-400">{stop.latitude}, {stop.longitude}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  )
}
