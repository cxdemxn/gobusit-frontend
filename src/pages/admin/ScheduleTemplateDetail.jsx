import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
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

export default function ScheduleTemplateDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [template, setTemplate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const data = await scheduleTemplateService.getById(id)
        setTemplate(data)
      } catch (error) {
        console.error('Failed to load template:', error)
        navigate('/admin/schedule-templates')
      } finally {
        setLoading(false)
      }
    }
    loadTemplate()
  }, [id, navigate])

  const handleActivate = async () => {
    try {
      await scheduleTemplateService.activate(id)
      setTemplate({ ...template, active: true })
    } catch (error) {
      console.error('Failed to activate template:', error)
    }
  }

  const handleDeactivate = async () => {
    try {
      await scheduleTemplateService.deactivate(id)
      setTemplate({ ...template, active: false })
    } catch (error) {
      console.error('Failed to deactivate template:', error)
    }
  }

  const handleDelete = async () => {
    try {
      await scheduleTemplateService.delete(id)
      navigate('/admin/schedule-templates')
    } catch (error) {
      console.error('Failed to delete template:', error)
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

  if (!template) {
    return null
  }

  return (
    <AdminLayout>
      {showDelete && (
        <ConfirmDialog
          title="Delete this template?"
          message="Deleting this template will stop future trips from being generated. Existing scheduled trips will not be affected."
          confirmLabel="Delete Template"
          danger
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
      
      <div className="max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {template.originName} → {template.destinationName}
            </h1>
            <div className="mt-1">
              <Badge status={template.active ? 'ACTIVE' : 'MAINTENANCE'} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Route</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {template.originName} → {template.destinationName}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Bus</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{template.plateNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Departure Time</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{template.departureTime}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Arrival Time</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{template.arrivalTime}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Price</p>
              <p className="text-sm font-medium text-gray-900 mt-1">
                {template.price.toLocaleString()} FCFA
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Days of Week</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {template.daysOfWeek.map(day => (
                  <span
                    key={day}
                    className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                  >
                    {dayLabels[day]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {!template.active ? (
            <button
              onClick={handleActivate}
              className="bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Activate
            </button>
          ) : (
            <button
              onClick={handleDeactivate}
              className="border-2 border-amber-200 text-amber-600 font-semibold py-2.5 px-6 rounded-lg hover:bg-amber-50 transition"
            >
              Deactivate
            </button>
          )}
        </div>

        <button
          onClick={() => setShowDelete(true)}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition"
        >
          <Trash2 className="w-4 h-4" /> Delete Template
        </button>
      </div>
    </AdminLayout>
  )
}
