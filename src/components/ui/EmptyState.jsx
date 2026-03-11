export default function EmptyState({ icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <p className="text-gray-700 font-semibold text-base mb-1">{title}</p>
      <p className="text-gray-400 text-sm max-w-xs">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
