
export default function RadioGroup({ label, name, options, selectedValue, onChange, disabled }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
        {label}
      </label>
      <div className="flex flex-wrap gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition-colors">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={onChange}
              disabled={disabled}
              className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg"
            />
            <span className="text-sm text-light-text dark:text-dark-text">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
