import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import AdminLayout from '../../components/layout/AdminLayout'
import Badge from '../../components/ui/Badge'
import Paginator from '../../components/ui/Paginator'
import { userService } from '../../services/userService'

export default function UserList() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userService.getAll(page)
        setUsers(data.content || data)
        setTotalPages(data.totalPages || 1)
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [page])

  return (
    <AdminLayout>
      <div className="space-y-5 max-w-4xl">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Users</h1>
          <p className="text-gray-400 text-sm mt-0.5">All registered accounts</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 text-xs text-gray-400 font-medium">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-4 py-3">Phone</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr
                  key={u.id}
                  onClick={() => navigate(`/admin/users/${u.id}`)}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition"
                >
                  <td className="px-5 py-3.5 font-medium text-gray-900">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3.5 text-gray-500">{u.phone}</td>
                  <td className="px-4 py-3.5 text-gray-400 hidden sm:table-cell">{u.email}</td>
                  <td className="px-4 py-3.5"><Badge status={u.roles[0]} /></td>
                  <td className="px-4 py-3.5"><Badge status={u.active ? 'Active' : 'Disabled'} /></td>
                  <td className="px-4 py-3.5 text-right"><ChevronRight className="w-4 h-4 text-gray-300 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Paginator page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </AdminLayout>
  )
}
