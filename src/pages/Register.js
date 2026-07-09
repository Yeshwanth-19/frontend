import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link,useNavigate } from 'react-router-dom';
import { googleTradingLogin, registerTradingAccount } from '../services/api';
import { setAuth } from '../utils/auth';
import { encryptAes } from '../utils/crypto';
import PasswordInput from '../components/PasswordInput';
import './Register.css';

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  role: 'trader',
  mobile: '',
};

const ROLES = [
  { value: 'trader', label: 'Trader' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
];

function Register() {
   const navigate = useNavigate();
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

    if (!form.name.trim()) {
      nextErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (!form.role) {
      nextErrors.role = 'Role is required';
    }

    if (!form.mobile.trim()) {
      nextErrors.mobile = 'Mobile number is required';
    } else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.mobile)) {
      nextErrors.mobile = 'Enter a valid mobile number';
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
      await registerTradingAccount({
        ...form,
        password: encryptAes(form.password),
      });

      setStatus({
        type: 'success',
        message: 'Account created successfully. You can now sign in.',
      });
      setForm(INITIAL_FORM);
      setErrors({});
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuthSuccess = (data) => {
    const token = data.token;
    const user = data.user || {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    };

    if (!token) {
      throw new Error('Google registration failed. No token received.');
    }

    setAuth(token, user);
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <header className="register-header">
          <div className="register-brand">
            <span className="register-logo">◈</span>
            <span className="register-brand-name">TradeVault</span>
          </div>
          <h1>Create Account</h1>
          <p>Register with your name, email, password, role, and mobile number.</p>
        </header>

        {status.message && (
          <div className={`register-alert register-alert--${status.type}`}>
            {status.message}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={updateField('name')}
              placeholder="John Doe"
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && (
              <span className="field-error">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
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
            value={form.password}
            onChange={updateField('password')}
            placeholder="Enter password"
            autoComplete="new-password"
            error={errors.password}
          />

          <div className="form-group">
            <label htmlFor="mobile">Mobile No</label>
            <input
              id="mobile"
              type="tel"
              value={form.mobile}
              onChange={updateField('mobile')}
              placeholder="+91 98765 43210"
              autoComplete="tel"
              className={errors.mobile ? 'input-error' : ''}
            />
            {errors.mobile && (
              <span className="field-error">{errors.mobile}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={form.role}
              onChange={updateField('role')}
              className={errors.role ? 'input-error' : ''}
            >
              {ROLES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <span className="field-error">{errors.role}</span>
            )}
          </div>

          <button
            type="submit"
            className="register-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Register'}
          </button>

          {googleClientId && (
            <>
              <div className="register-divider">
                <span>or</span>
              </div>
              <div className="google-register-wrap">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    try {
                      setStatus({ type: '', message: '' });
                      const credential = credentialResponse?.credential;
                      if (!credential) {
                        throw new Error('Google signup failed. Missing credential.');
                      }
                      const data = await googleTradingLogin(credential);
                      handleGoogleAuthSuccess(data);
                    } catch (error) {
                      setStatus({
                        type: 'error',
                        message: error.message || 'Google signup failed.',
                      });
                    }
                  }}
                  onError={() =>
                    setStatus({
                      type: 'error',
                      message: 'Google sign-up was cancelled or failed.',
                    })
                  }
                  useOneTap={false}
                  text="signup_with"
                  shape="rectangular"
                  width="320"
                />
              </div>
            </>
          )}
        </form>

        <footer className="register-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Register;
