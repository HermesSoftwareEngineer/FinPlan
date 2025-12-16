
export default function TextArea({ label, value, onChange, placeholder, disabled, rows = 3 }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-shadow duration-200 ease-in-out"
      />
    </div>
  );
}
