import { useState } from 'react';
import './PasswordInput.css';

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 6.5c2.76 0 5.26 1.12 7.07 2.93l1.41-1.41C18.2 5.57 15.28 4.25 12 4.25 7 4.25 2.73 7.36 1 11.25c.69 1.55 1.78 2.9 3.13 3.93l1.53-1.53A7.82 7.82 0 0 1 12 6.5zM3.27 3 2 4.27l2.79 2.79C3.53 8.28 2.55 9.66 1.84 11.25 3.57 15.14 7.84 18.25 12.8 18.25c1.55 0 3.03-.34 4.36-.95l3.08 3.08L21.73 21 3.27 3zM12.8 16.25c-3.15 0-5.8-2.03-6.73-4.85l1.74-1.74a4.5 4.5 0 0 0 6.42 2.42l1.58 1.58c-.88.37-1.85.59-2.01.59z"
      />
    </svg>
  );
}

function PasswordInput({
  id,
  label,
  labelExtra,
  value,
  onChange,
  placeholder,
  autoComplete = 'current-password',
  error = '',
  className = '',
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`form-group password-field ${className}`.trim()}>
      {(label || labelExtra) && (
        <div className="password-label-row">
          {label && <label htmlFor={id}>{label}</label>}
          {labelExtra}
        </div>
      )}

      <div className={`password-input-wrap ${error ? 'password-input-wrap--error' : ''}`}>
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={error ? 'input-error' : ''}
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {error && <span className="field-error">{error}</span>}
    </div>
  );
}

export default PasswordInput;
