import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { busService } from '../../services/busService'

export default function BusForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [existing, setExisting] = useState(null)
  const [loading, setLoading] = useState(isEdit)

  const [form, setForm] = useState({
    plateNumber: '',
    capacity: '',
    status: 'ACTIVE',
  })
  const [errors, setErrors] = useState({})
  const [showDelete, setShowDelete] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) {
      const loadBus = async () => {
        try {
          console.log(id)
          const data = await busService.getById(id)
          setExisting(data)
          setForm({
            plateNumber: data.plateNumber || '',
            capacity: data.capacity || '',
            status: data.status || 'ACTIVE',
          })
        } catch (error) {
          console.error('Failed to load bus:', error)
          navigate('/admin/buses')
        } finally {
          setLoading(false)
        }
      }
      loadBus()
    }
  }, [id, isEdit, navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.plateNumber.trim()) e.plateNumber = 'Plate number is required'
    if (!form.capacity || Number(form.capacity) < 1) e.capacity = 'Capacity must be at least 1'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      if (isEdit) {
        await busService.update(id, form)
      } else {
        await busService.create(form)
      }
      navigate('/admin/buses')
    } catch (error) {
      if (error.status === 409) {
        setErrors({ plateNumber: 'A bus with this plate number already exists.' })
      } else {
        console.error('Failed to save bus:', error)
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await busService.delete(id)
      navigate('/admin/buses')
    } catch (error) {
      console.error('Failed to delete bus:', error)
    }
  }

  return (
    <AdminLayout>
      {showDelete && (
        <ConfirmDialog
          title="Delete this bus?"
          message="This action is permanent and cannot be undone."
          confirmLabel="Delete Bus"
          danger
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
      <div className="max-w-md space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-extrabold text-gray-900">{isEdit ? 'Edit Bus' : 'Add Bus'}</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
              <input
                name="plateNumber"
                value={form.plateNumber}
                onChange={handleChange}
                placeholder="AB-1234-BJ"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.plateNumber ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.plateNumber && <p className="text-xs text-red-600 mt-1">{errors.plateNumber}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (seats)</label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                min="1"
                placeholder="30"
                className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.capacity ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.capacity && <p className="text-xs text-red-600 mt-1">{errors.capacity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
            >
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Bus'}
            </button>
          </form>
        </div>

        {isEdit && (
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition"
          >
            <Trash2 className="w-4 h-4" /> Delete this bus
          </button>
        )}
      </div>
    </AdminLayout>
  )
}
