import { useState, useRef, useEffect } from 'react';

export default function ModernSelect({ options, value, onChange, className = '', placeholder = 'Selecione...', disabled = false }) {
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const ref = useRef(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setFocusIdx(-1);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) setFocusIdx(options.findIndex(opt => opt.value === value));
  }, [open, value, options]);

  // Keyboard navigation
  function handleKeyDown(e) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }
    if (e.key === 'Escape') {
      setOpen(false);
      setFocusIdx(-1);
    } else if (e.key === 'ArrowDown') {
      setFocusIdx(idx => Math.min(options.length - 1, idx + 1));
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      setFocusIdx(idx => Math.max(0, idx - 1));
      e.preventDefault();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (focusIdx >= 0 && options[focusIdx]) {
        onChange(options[focusIdx].value);
        setOpen(false);
        setFocusIdx(-1);
      }
      e.preventDefault();
    }
  }

  return (
    <div
      className={`relative w-full ${className}`}
      ref={ref}
      style={{
        border: '1px solid rgba(120, 120, 140, 0.15)',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
        background: 'transparent',
      }}
    >
      <button
        type="button"
        className={`flex items-center justify-between w-full px-3 py-2 bg-light-bg dark:bg-dark-bg border-none rounded-md text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 transition cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <span className={`truncate ${!selectedOption ? 'text-light-text-secondary dark:text-dark-text-secondary' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className={`ml-2 w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
          <path d="M6 8l4 4 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul
          className="absolute z-10 mt-1 w-full bg-white dark:bg-dark-bg-secondary border border-light-border dark:border-dark-border rounded-md shadow max-h-56 overflow-auto animate-fade-in"
          role="listbox"
        >
          {options.length === 0 ? (
            <li className="px-4 py-2 text-light-text-secondary dark:text-dark-text-secondary">Nenhuma opção</li>
          ) : (
            options.map((opt, idx) => (
              <li
                key={opt.value}
                className={`px-4 py-2 cursor-pointer select-none transition text-light-text dark:text-dark-text ${
                  value === opt.value ? 'bg-primary-100 dark:bg-primary-900/20 font-semibold' : ''
                } ${focusIdx === idx ? 'bg-primary-50 dark:bg-primary-900/10' : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setFocusIdx(-1);
                }}
                role="option"
                aria-selected={value === opt.value}
                tabIndex={-1}
                onMouseEnter={() => setFocusIdx(idx)}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
