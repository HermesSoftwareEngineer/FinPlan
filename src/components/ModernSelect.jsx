import { useState } from 'react';

export default function ModernSelect({ options, value, onChange, className = '', placeholder = 'Selecione...', disabled = false }) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative w-full ${className}`}>
      <button
        type="button"
        className={`flex items-center justify-between w-full px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-lg shadow-sm text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${!selectedOption ? 'text-light-text-secondary dark:text-dark-text-secondary' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="ml-2 text-lg">▼</span>
      </button>
      {open && (
        <ul
          className="absolute z-10 mt-2 w-full bg-white dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-lg shadow-lg max-h-60 overflow-auto animate-fade-in"
          role="listbox"
        >
          {options.map(opt => (
            <li
              key={opt.value}
              className={`px-4 py-2 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition text-light-text dark:text-dark-text ${opt.value === value ? 'bg-primary-100 dark:bg-primary-900/30 font-semibold' : ''}`}
              onClick={() => {
                setOpen(false);
                onChange(opt.value);
              }}
              role="option"
              aria-selected={opt.value === value}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
