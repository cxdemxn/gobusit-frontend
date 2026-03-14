import { useMemo } from 'react'
import { Bus, ChevronRight } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'

const fmt = (dt) => new Date(dt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
const fmtDate = (dt) => new Date(dt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export default function ScheduleResults({ schedules, loading, availableSeats, navigate }) {
  const memoizedResults = useMemo(() => {
    if (loading) {
      return (
        <div className="text-center py-8 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Searching schedules...</p>
        </div>
      )
    }

    if (schedules.length === 0) {
      return (
        <EmptyState
          icon="🚌"
          title="No trips found"
          message="No trips match your search. Try different dates or locations."
        />
      )
    }

    return (
      <div className="space-y-3">
        {schedules.map(s => {
          const seats = availableSeats(s)
          const full = seats <= 0
          return (
            <button
              key={s.id}
              onClick={() => navigate(`/schedule/${s.id}`)}
              disabled={full}
              className={`w-full bg-white rounded-2xl border p-4 text-left transition hover:shadow-sm ${full ? 'opacity-60 border-gray-100' : 'border-gray-100 hover:border-blue-200'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-900 text-base">
                    {s.originName} → {s.destinationName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{fmtDate(s.departureTime)}</p>
                </div>
                <Badge status={s.status} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{fmt(s.departureTime)} → {fmt(s.arrivalTime)}</span>
                  <span className="text-gray-300">|</span>
                  <span className="font-semibold text-gray-900">
                    {s.price.toLocaleString()} FCFA
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </div>
              <div className="mt-2">
                {full ? (
                  <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Fully Booked</span>
                ) : seats <= 5 ? (
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Only {seats} seats left!</span>
                ) : (
                  <span className="text-xs text-gray-400">{seats} seats available</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    )
  }, [schedules, loading, availableSeats, navigate])

  return (
    <>
      {/* Results count */}
      <p className="text-xs text-gray-400 font-medium px-1">
        {!loading && `${schedules.length} trip${schedules.length !== 1 ? 's' : ''} found`}
      </p>
      
      {/* Results */}
      {memoizedResults}
    </>
  )
}
