import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { userService } from '../../services/userService'

export default function UserDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRoleConfirm, setShowRoleConfirm] = useState(false)
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await userService.getById(id)
        setUser(userData)
      } catch (error) {
        console.error('Failed to load user:', error)
        navigate('/admin/users')
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [id, navigate])

  if (loading) return <AdminLayout><div className="text-center py-16 text-gray-400">Loading...</div></AdminLayout>
  if (!user) return <AdminLayout><div className="text-center py-16 text-gray-400">User not found.</div></AdminLayout>

  const handleChangeRole = async () => {
    try {
      const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
      await userService.updateRole(id, newRole)
      setUser({ ...user, role: newRole })
      setShowRoleConfirm(false)
    } catch (error) {
      console.error('Failed to change role:', error)
    }
  }

  const handleToggleStatus = async () => {
    try {
      if (user.active) {
        await userService.disable(id)
        setUser({ ...user, active: false })
      } else {
        await userService.enable(id)
        setUser({ ...user, active: true })
      }
      setShowStatusConfirm(false)
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'

  return (
    <AdminLayout>
      {showRoleConfirm && (
        <ConfirmDialog
          title="Change user role?"
          message={`This will change this user's role to ${newRole}, which will change their access level immediately.`}
          confirmLabel="Change Role"
          onConfirm={handleChangeRole}
          onCancel={() => setShowRoleConfirm(false)}
        />
      )}
      {showStatusConfirm && (
        <ConfirmDialog
          title={user.active ? 'Disable this account?' : 'Enable this account?'}
          message={user.active
            ? 'The user will be immediately locked out of their account. Their existing session will stop working.'
            : 'The user will be able to log in again immediately.'}
          confirmLabel={user.active ? 'Disable Account' : 'Enable Account'}
          danger={user.active}
          onConfirm={handleToggleStatus}
          onCancel={() => setShowStatusConfirm(false)}
        />
      )}

      <div className="max-w-lg space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-2xl font-extrabold text-gray-900">User Detail</h1>
        </div>

        {/* Disabled banner */}
        {!user.active && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 text-sm text-red-700 font-medium">
            This account is currently disabled. The user cannot log in.
          </div>
        )}

        {/* User info card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-400">{user.phone}</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-50 pt-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-400">Email</span>
              <span className="text-sm font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm text-gray-400">Role</span>
              <Badge status={user.role} />
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-400">Account Status</span>
              <Badge status={user.active ? 'Active' : 'Disabled'} />
            </div>
          </div>
        </div>

        {/* Access control note */}
        <p className="text-xs text-gray-400 px-1">This screen is for access control only. Personal details cannot be edited from here.</p>

        {/* Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <h2 className="font-semibold text-gray-900 text-sm">Access Controls</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowRoleConfirm(true)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
            >
              Change Role to {newRole}
            </button>
            <button
              onClick={() => setShowStatusConfirm(true)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                user.active
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {user.active ? 'Disable Account' : 'Enable Account'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
