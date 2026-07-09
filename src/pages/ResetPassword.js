import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { encryptAes } from '../utils/crypto';
import PasswordInput from '../components/PasswordInput';
import './Login.css';

const INITIAL_FORM = {
  password: '',
  confirmPassword: '',
};

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!token) {
      nextErrors.token = 'Reset token is missing or invalid';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        token,
        password: encryptAes(form.password),
      });
      setStatus({
        type: 'success',
        message: 'Password reset successful. You can now sign in.',
      });
      setForm(INITIAL_FORM);
      setErrors({});
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Unable to reset password. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <header className="login-header">
          <div className="login-brand">
            <span className="login-logo">◈</span>
            <span className="login-brand-name">TradeVault</span>
          </div>
          <h1>Reset Password</h1>
          <p>Choose a new password for your account.</p>
        </header>

        {status.message && (
          <div className={`login-alert login-alert--${status.type}`}>
            {status.message}
          </div>
        )}

        {!token && (
          <div className="login-alert login-alert--error">
            Reset token is missing. Please use the link from your email.
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <PasswordInput
            id="password"
            label="New Password"
            value={form.password}
            onChange={updateField('password')}
            placeholder="Enter new password"
            autoComplete="new-password"
            error={errors.password}
          />

          <PasswordInput
            id="confirmPassword"
            label="Confirm Password"
            value={form.confirmPassword}
            onChange={updateField('confirmPassword')}
            placeholder="Confirm new password"
            autoComplete="new-password"
            error={errors.confirmPassword}
          />

          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting || !token}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <footer className="login-footer">
          <p>
            <Link to="/login">Back to sign in</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default ResetPassword;
