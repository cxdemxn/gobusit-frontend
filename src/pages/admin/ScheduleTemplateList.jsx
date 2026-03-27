import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ChevronRight } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import { scheduleTemplateService } from '../../services/scheduleTemplateService'

const dayLabels = {
  MONDAY: 'Mon',
  TUESDAY: 'Tue', 
  WEDNESDAY: 'Wed',
  THURSDAY: 'Thu',
  FRIDAY: 'Fri',
  SATURDAY: 'Sat',
  SUNDAY: 'Sun'
}

export default function ScheduleTemplateList() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await scheduleTemplateService.getAll()
        setTemplates(data || [])
      } catch (error) {
        console.error('Failed to load templates:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTemplates()
  }, [])

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
      <div className="space-y-5 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Schedule Templates</h1>
            <p className="text-gray-400 text-sm mt-0.5">Recurring trip schedules that auto-generate daily trips</p>
          </div>
          <button
            onClick={() => navigate('/admin/schedule-templates/new')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" /> Add Template
          </button>
        </div>

        {templates.length === 0 ? (
          <EmptyState 
            icon="🗓️" 
            title="No templates yet" 
            message="Create a template to start generating trips automatically." 
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-50 text-xs text-gray-400 font-medium">
                  <th className="text-left px-5 py-3">Route</th>
                  <th className="text-left px-4 py-3">Departure</th>
                  <th className="text-left px-4 py-3">Arrival</th>
                  <th className="text-left px-4 py-3">Days</th>
                  <th className="text-right px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {templates.map(t => (
                  <tr
                    key={t.id}
                    onClick={() => navigate(`/admin/schedule-templates/${t.id}`)}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition"
                  >
                    <td className="px-5 py-3.5 font-medium text-gray-900">
                      {t.originName} → {t.destinationName}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {t.departureTime}
                    </td>
                    <td className="px-4 py-3.5 text-gray-500 whitespace-nowrap">
                      {t.arrivalTime}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {t.daysOfWeek.map(day => (
                          <span
                            key={day}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                          >
                            {dayLabels[day]}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right text-gray-700 font-medium">
                      {t.price.toLocaleString()} FCFA
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={t.active ? 'ACTIVE' : 'MAINTENANCE'} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                    </td>
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
