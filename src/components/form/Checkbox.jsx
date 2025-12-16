
export default function Checkbox({ label, description, checked, onChange, disabled }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 cursor-pointer border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg"
      />
      <div className="flex-1">
        <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-primary-600 dark:group-hover:text-primary-400 transition">
          {label}
        </span>
        {description && (
          <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}
