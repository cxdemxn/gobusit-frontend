import PassengerLayout from '../../components/layout/PassengerLayout'
import { User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function PassengerProfile() {
  const { user } = useAuth()
  return (
    <PassengerLayout>
      <div className="space-y-4 max-w-sm mx-auto">
        <h1 className="text-xl font-extrabold text-gray-900">Profile</h1>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <User className="w-8 h-8 text-blue-500" />
          </div>
          <p className="font-bold text-gray-900 text-lg">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-gray-400">{user?.phone}</p>
          <p className="text-sm text-gray-400">{user?.email}</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-sm text-amber-700 text-center">
          Profile editing is coming soon.
        </div>
      </div>
    </PassengerLayout>
  )
}
