export default function LoadingSpinner({ size = 12, color = 'primary-500', className = '' }) {
  return (
    <div
      className={`animate-spin rounded-full h-${size} w-${size} border-b-2 border-${color} ${className}`}
      style={{ minWidth: `${size * 4}px`, minHeight: `${size * 4}px` }}
    ></div>
  );
}
