export default function Paginator({ page = 1, totalPages = 1, onChange }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4 text-sm text-gray-500">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
      >
        ‹
      </button>
      <span>Page {page} of {totalPages}</span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition"
      >
        ›
      </button>
    </div>
  )
}
