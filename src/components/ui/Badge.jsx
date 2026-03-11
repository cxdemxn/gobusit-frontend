const colours = {
  ACTIVE: 'bg-green-100 text-green-700',
  MAINTENANCE: 'bg-amber-100 text-amber-700',
  SCHEDULED: 'bg-blue-100 text-blue-700',
  BOARDING: 'bg-teal-100 text-teal-700',
  IN_TRANSIT: 'bg-amber-100 text-amber-700',
  ARRIVED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  BOOKED: 'bg-blue-100 text-blue-700',
  USED: 'bg-gray-100 text-gray-500',
  Active: 'bg-green-100 text-green-700',
  Disabled: 'bg-red-100 text-red-700',
  ADMIN: 'bg-purple-100 text-purple-700',
  USER: 'bg-gray-100 text-gray-600',
}

const labels = {
  IN_TRANSIT: 'IN TRANSIT',
}

export default function Badge({ status }) {
  const cls = colours[status] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {labels[status] || status}
    </span>
  )
}
