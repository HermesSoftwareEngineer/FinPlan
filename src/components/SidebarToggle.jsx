export default function SidebarToggle({
  isOpen,
  onToggle,
  className = '',
  openLabel = 'Ocultar menu lateral',
  closedLabel = 'Mostrar menu lateral',
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`p-2 text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary rounded-lg transition ${className}`}
      aria-label={isOpen ? openLabel : closedLabel}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
}
