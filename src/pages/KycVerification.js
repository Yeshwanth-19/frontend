import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { getUser, updateUser } from '../utils/auth';
import './KycVerification.css';

const ROLE_LABELS = {
  trader: 'Trader',
  admin: 'Admin',
  manager: 'Manager',
};

function KycVerification() {
  const navigate = useNavigate();
  const user = getUser();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    panNumber: '',
    aadhaarLast4: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase() || 'trader';
  const roleLabel = ROLE_LABELS[role] || 'Trader';

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (error) setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(form.panNumber.trim())) {
      setError('Enter a valid PAN number');
      return;
    }

    if (!/^[0-9]{4}$/.test(form.aadhaarLast4.trim())) {
      setError('Enter valid Aadhaar last 4 digits');
      return;
    }

    setIsSubmitting(true);

    updateUser({
      name: form.fullName.trim(),
      kycVerified: true,
      kycVerifiedAt: new Date().toISOString(),
    });

    navigate('/dashboard', { replace: true });
  };

  return (
    <DashboardLayout user={user} roleLabel={roleLabel}>
      <section className="dashboard-welcome">
        <h1>eKYC Verification</h1>
        <p>Complete KYC to unlock stock buying and full trading access.</p>
      </section>

      <section className="kyc-panel">
        <div className="kyc-panel-header">
          <h2>Identity Details</h2>
          <span className="kyc-status-pill">Pending</span>
        </div>

        {error && <div className="kyc-alert kyc-alert--error">{error}</div>}

        <form className="kyc-form" onSubmit={handleSubmit} noValidate>
          <div className="kyc-form-grid">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange('fullName')}
                placeholder="As per PAN card"
              />
            </div>

            <div className="form-group">
              <label htmlFor="panNumber">PAN Number</label>
              <input
                id="panNumber"
                type="text"
                value={form.panNumber}
                onChange={handleChange('panNumber')}
                placeholder="ABCDE1234F"
                maxLength={10}
              />
            </div>

            <div className="form-group">
              <label htmlFor="aadhaarLast4">Aadhaar Last 4 Digits</label>
              <input
                id="aadhaarLast4"
                type="text"
                value={form.aadhaarLast4}
                onChange={handleChange('aadhaarLast4')}
                placeholder="1234"
                maxLength={4}
              />
            </div>
          </div>

          <div className="kyc-form-actions">
            <button
              type="button"
              className="kyc-btn kyc-btn--secondary"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
            <button type="submit" className="kyc-btn kyc-btn--primary" disabled={isSubmitting}>
              {isSubmitting ? 'Verifying...' : 'Verify KYC'}
            </button>
          </div>
        </form>
      </section>
    </DashboardLayout>
  );
}

export default KycVerification;
