import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { busService } from '../../services/busService'

export default function BusList() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('ALL')
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBuses = async () => {
      try {
        const data = await busService.getAll()
        setBuses(data)
      } catch (error) {
        console.error('Failed to load buses:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBuses()
  }, [])

  const filteredBuses = buses.filter(b => filter === 'ALL' || b.status === filter)

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Buses</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage your fleet</p>
          </div>
          <button
            onClick={() => navigate('/admin/buses/new')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Bus
          </button>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['ALL', 'ACTIVE', 'MAINTENANCE'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {filteredBuses.length === 0 ? (
          <EmptyState icon="🚌" title="No buses found" message="No buses match this filter." />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50 text-xs text-gray-400 font-medium">
                  <th className="text-left px-5 py-3">Plate Number</th>
                  <th className="text-left px-4 py-3">Capacity</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map(bus => (
                  <tr
                    key={bus.id}
                    onClick={() => navigate(`/admin/buses/${bus.id}`)}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-5 py-3.5 font-semibold text-gray-900">{bus.plateNumber}</td>
                    <td className="px-4 py-3.5 text-gray-500">{bus.capacity} seats</td>
                    <td className="px-4 py-3.5"><Badge status={bus.status} /></td>
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
