export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeMap = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className={`${sizeMap[size]} border-3 border-slate-200 border-t-primary-500 rounded-full`} style={{ animation: 'spin 0.8s linear infinite' }}></div>
      {text && <p className="text-sm text-slate-400 font-medium">{text}</p>}
    </div>
  );
}
