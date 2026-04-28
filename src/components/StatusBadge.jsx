export default function StatusBadge({ status }) {
  const statusConfig = {
    RECEIVED: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      dot: 'bg-slate-400',
    },
    PROCESSING: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      dot: 'bg-amber-400',
    },
    READY: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-400',
    },
    DELIVERED: {
      bg: 'bg-primary-50',
      text: 'text-primary-700',
      dot: 'bg-primary-500',
    },
  };

  const config = statusConfig[status] || statusConfig.RECEIVED;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
}
