export default function DashboardCard({ title, value, icon, color = 'primary', subtitle }) {
  const colorMap = {
    primary: 'bg-primary-50 text-primary-600 border-primary-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
  };

  const iconBgMap = {
    primary: 'bg-primary-100',
    emerald: 'bg-emerald-100',
    amber: 'bg-amber-100',
    rose: 'bg-rose-100',
    slate: 'bg-slate-200',
    blue: 'bg-blue-100',
    purple: 'bg-purple-100',
    teal: 'bg-teal-100',
  };

  return (
    <div className={`card-stagger animate-fade-in glass-card rounded-2xl p-5`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-800">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${iconBgMap[color] || iconBgMap.primary} w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
