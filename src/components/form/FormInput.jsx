
export default function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  required,
  icon,
  ...props
}) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-2">
        {label} {required && '*'}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary dark:text-dark-text-secondary">
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`w-full px-3 py-2 rounded-lg border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow duration-200 ease-in-out ${icon ? 'pl-10' : ''}`}
          {...props}
        />
      </div>
    </div>
  );
}
