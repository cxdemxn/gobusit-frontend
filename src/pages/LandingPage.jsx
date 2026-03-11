import { useNavigate } from 'react-router-dom'
import { Bus, MapPin, Clock, Shield } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/20 rounded-2xl p-3">
            <Bus className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-3">GoBusIt</h1>
        <p className="text-blue-100 text-lg max-w-sm mb-10">
          Book your intercity bus seat in seconds. Pick your spot, confirm your trip.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <button
            onClick={() => navigate('/search')}
            className="flex-1 bg-white text-blue-700 font-bold py-3.5 rounded-xl text-base shadow-lg hover:shadow-xl hover:bg-blue-50 transition"
          >
            Find a Bus
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex-1 bg-blue-500/30 border border-white/30 text-white font-bold py-3.5 rounded-xl text-base hover:bg-blue-500/50 transition"
          >
            Login
          </button>
        </div>

        <p className="text-blue-200 text-sm mt-6">
          No account needed to browse trips.
        </p>
      </div>

      {/* Features strip */}
      <div className="bg-white/10 backdrop-blur border-t border-white/10 px-6 py-6">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-4 text-center text-white">
          <div className="flex flex-col items-center gap-1.5">
            <MapPin className="w-5 h-5 text-blue-200" />
            <span className="text-xs font-medium text-blue-100">Live Routes</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Clock className="w-5 h-5 text-blue-200" />
            <span className="text-xs font-medium text-blue-100">Real-time Seats</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Shield className="w-5 h-5 text-blue-200" />
            <span className="text-xs font-medium text-blue-100">Secure Booking</span>
          </div>
        </div>
      </div>
    </div>
  )
}
