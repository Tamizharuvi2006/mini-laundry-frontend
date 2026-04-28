import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'No data found', message = 'There are no items to display.', icon = <FiInbox /> }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="text-5xl mb-4 text-slate-300">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs">{message}</p>
    </div>
  );
}
