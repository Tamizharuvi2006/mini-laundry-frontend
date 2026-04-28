export default function FilterBar({
  search,
  onSearchChange,
  garmentFilter,
  onGarmentFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClear,
}) {
  const statuses = ['ALL', 'RECEIVED', 'PROCESSING', 'READY', 'DELIVERED', 'REFUNDED'];

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 animate-fade-in">
      <div className="relative flex-1 min-w-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
        />
      </div>

      <input
        type="text"
        placeholder="Filter by garment..."
        value={garmentFilter}
        onChange={(e) => onGarmentFilterChange(e.target.value)}
        className="w-full lg:w-56 px-4 py-2.5 rounded-xl glass-input text-sm text-slate-700 placeholder-slate-400 focus:outline-none transition-all"
      />

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="w-full lg:w-auto px-4 py-2.5 rounded-xl glass-input text-sm text-slate-700 focus:outline-none transition-all cursor-pointer"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s === 'ALL' ? 'All Status' : s}
          </option>
        ))}
      </select>

      {(search || garmentFilter || statusFilter !== 'ALL') && (
        <button
          onClick={onClear}
          className="w-full lg:w-auto px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-all cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  );
}
