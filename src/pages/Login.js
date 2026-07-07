import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { googleTradingLogin, loginTradingAccount } from '../services/api';
import { setAuth } from '../utils/auth';
import PasswordInput from '../components/PasswordInput';
import './Login.css';

const INITIAL_FORM = {
  email: '',
  password: '',
};

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required';
    }

    return nextErrors;
  };

  const handleAuthSuccess = (data) => {
      const token = data.token;
      const user = data.user || {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      if (!token) {
        throw new Error('Login failed. No token received.');
      }

      setAuth(token, user);
      navigate(from, { replace: true });
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
      const data = await loginTradingAccount(form);
      handleAuthSuccess(data);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Invalid email or password.',
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
          <h1>Sign In</h1>
          <p>Access your trading account and portfolio.</p>
        </header>

        {status.message && (
          <div className={`login-alert login-alert--${status.type}`}>
            {status.message}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={updateField('email')}
              placeholder="john@example.com"
              autoComplete="email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && (
              <span className="field-error">{errors.email}</span>
            )}
          </div>

          <PasswordInput
            id="password"
            label="Password"
            labelExtra={
              <Link to="/forgot-password" className="login-forgot-link">
                Forgot password?
              </Link>
            }
            value={form.password}
            onChange={updateField('password')}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
          />

          <>
            {/* <div className="login-divider">
              <span>or</span>
            </div>
            <div className="google-login-wrap">
              {googleClientId ? (
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      setStatus({ type: '', message: '' });
                      const credential = credentialResponse?.credential;
                      if (!credential) {
                        throw new Error('Google login failed. Missing credential.');
                      }
                      const data = await googleTradingLogin(credential);
                      handleAuthSuccess(data);
                    } catch (error) {
                      setStatus({
                        type: 'error',
                        message: error.message || 'Google login failed.',
                      });
                    }
                  }}
                  onError={() =>
                    setStatus({
                      type: 'error',
                      message: 'Google sign-in was cancelled or failed.',
                    })
                  }
                  useOneTap={false}
                  text="signin_with"
                  shape="rectangular"
                  width="320"
                />
              ) : (
                <button
                  type="button"
                  className="google-login-disabled"
                  onClick={() =>
                    setStatus({
                      type: 'error',
                      message:
                        'Google sign-in is not configured. Set REACT_APP_GOOGLE_CLIENT_ID in frontend/.env.',
                    })
                  }
                >
                  Continue with Google
                </button>
              )}
            </div> */}
          </>

          <button
            type="submit"
            className="login-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <footer className="login-footer">
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Login;
