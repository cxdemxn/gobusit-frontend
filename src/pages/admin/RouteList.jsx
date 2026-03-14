import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import EmptyState from '../../components/ui/EmptyState'
import { routeService } from '../../services/routeService'

export default function RouteList() {
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const data = await routeService.getAll()
        setRoutes(data)
      } catch (error) {
        console.error('Failed to load routes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadRoutes()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Routes</h1>
            <p className="text-gray-400 text-sm mt-0.5">All bus routes in the system</p>
          </div>
          <button
            onClick={() => navigate('/admin/routes/new')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Route
          </button>
        </div>

        {routes.length === 0 ? (
          <EmptyState icon="🛣" title="No routes yet" message="Create your first route to get started." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-xs text-gray-400 font-medium">
                  <th className="text-left px-5 py-3">Route</th>
                  <th className="text-left px-4 py-3">Distance</th>
                  <th className="text-left px-4 py-3">Est. Duration</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {routes.map(r => (
                  <tr
                    key={r.uuid}
                    onClick={() => navigate(`/admin/routes/${r.uuid}`)}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{r.originName} → {r.destinationName}</td>
                    <td className="px-4 py-3.5 text-gray-500">{r.distanceKm ? `${r.distanceKm} km` : '—'}</td>
                    <td className="px-4 py-3.5 text-gray-500">{r.estimatedDurationMin ? `${r.estimatedDurationMin} min` : '—'}</td>
                    <td className="px-4 py-3.5 text-right"><ChevronRight className="w-4 h-4 text-gray-300 ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
