import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../services/api';
import './Login.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState({
    type: '',
    message: '',
    resetToken: '',
    resetUrl: '',
    previewUrl: '',
    emailSent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Enter a valid email address';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '', resetToken: '', resetUrl: '', previewUrl: '', emailSent: false });

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const data = await requestPasswordReset(email.trim());
      setStatus({
        type: 'success',
        message: data.message || 'If an account exists with that email, a reset link has been sent.',
        resetToken: data.resetToken || '',
        resetUrl: data.resetUrl || '',
        previewUrl: data.previewUrl || '',
        emailSent: Boolean(data.emailSent),
      });
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Something went wrong. Please try again.',
        resetToken: '',
        resetUrl: '',
        previewUrl: '',
        emailSent: false,
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
          <h1>Forgot Password</h1>
          <p>Enter your email and we&apos;ll send you a reset link.</p>
        </header>

        {status.message && (
          <div className={`login-alert login-alert--${status.type}`}>
            {status.message}
            {!status.emailSent && status.resetUrl && (
              <div className="reset-dev-link">
                <p>Email is not configured. Use this reset link:</p>
                <Link to={`/reset-password?token=${status.resetToken}`}>
                  Open reset page
                </Link>
                {status.previewUrl && (
                  <p>
                    <a href={status.previewUrl} target="_blank" rel="noopener noreferrer">
                      View test email preview
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError('');
              }}
              placeholder="john@example.com"
              autoComplete="email"
              className={error ? 'input-error' : ''}
            />
            {error && <span className="field-error">{error}</span>}
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <footer className="login-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login">Back to sign in</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default ForgotPassword;
