import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { submitKycVerification } from '../services/api';
import { getToken, getUser, setAuth } from '../utils/auth';
import { encryptAes } from '../utils/crypto';
import './KycVerification.css';

const ROLE_LABELS = {
  trader: 'Trader',
  admin: 'Admin',
  manager: 'Manager',
};

const STATUS_LABELS = {
  not_submitted: 'Not Submitted',
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

const INITIAL_FILES = {
  aadhaarFront: null,
  aadhaarBack: null,
  panCard: null,
};

function KycVerification() {
  const navigate = useNavigate();
  const user = getUser();
  const token = getToken();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    panNumber: '',
    aadhaarLast: '',
  });
  const [files, setFiles] = useState(INITIAL_FILES);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase() || 'trader';
  const roleLabel = ROLE_LABELS[role] || 'Trader';
  const kycStatus = user?.kycStatus || (user?.kycVerified ? 'approved' : 'not_submitted');
  const isPending = kycStatus === 'pending';
  const isApproved = kycStatus === 'approved' || user?.kycVerified;
  const isRejected = kycStatus === 'rejected';
  const canSubmit = !isPending && !isApproved;

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleFileChange = (field) => (event) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [field]: file }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    if (!form.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(form.panNumber.trim())) {
      setError('Enter a valid PAN number');
      return;
    }

    if (!/^[0-9]{12}$/.test(form.aadhaarLast.trim())) {
      setError('Enter valid Aadhaar Number');
      return;
    }

    if (!files.aadhaarFront || !files.aadhaarBack || !files.panCard) {
      setError('Please upload Aadhaar front, Aadhaar back, and PAN card');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('fullName', form.fullName.trim());
      formData.append('panNumber', encryptAes(form.panNumber.trim().toUpperCase()));
      formData.append('aadhaarLast', encryptAes(form.aadhaarLast.trim()));
      formData.append('isEncrypted', 'true');
      formData.append('aadhaarFront', files.aadhaarFront);
      formData.append('aadhaarBack', files.aadhaarBack);
      formData.append('panCard', files.panCard);

      const data = await submitKycVerification(formData, token);

      if (data.user) {
        setAuth(token, data.user);
      }

      setSuccess(data.message || 'KYC submitted successfully. Waiting for admin verification.');
      setFiles(INITIAL_FILES);
      setTimeout(() => navigate('/dashboard', { replace: true }), 2000);
    } catch (submitError) {
      setError(submitError.message || 'KYC submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout user={user} roleLabel={roleLabel}>
      <section className="dashboard-welcome">
        <h1>eKYC Verification</h1>
        <p>Upload your identity documents. Admin will verify your KYC before trading access is enabled.</p>
      </section>

      <section className="kyc-panel">
        <div className="kyc-panel-header">
          <h2>Identity Details</h2>
          <span className={`kyc-status-pill kyc-status-pill--${kycStatus}`}>
            {STATUS_LABELS[kycStatus] || 'Pending'}
          </span>
        </div>

        {isPending && (
          <div className="kyc-alert kyc-alert--info">
            Your KYC documents are submitted and pending admin verification.
          </div>
        )}

        {isApproved && (
          <div className="kyc-alert kyc-alert--success">
            Your KYC has been approved. You can now buy stocks.
          </div>
        )}

        {isRejected && (
          <div className="kyc-alert kyc-alert--error">
            Your KYC was rejected
            {user?.kycRejectionReason ? `: ${user.kycRejectionReason}` : '.'} Please resubmit with correct documents.
          </div>
        )}

        {error && <div className="kyc-alert kyc-alert--error">{error}</div>}
        {success && <div className="kyc-alert kyc-alert--success">{success}</div>}

        {canSubmit && (
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
                <label htmlFor="aadhaarLast">Aadhaar number</label>
                <input
                  id="aadhaarLast"
                  type="text"
                  value={form.aadhaarLast}
                  onChange={handleChange('aadhaarLast')}
                  placeholder="1234"
                  maxLength={12}
                />
              </div>
            </div>

            <div className="kyc-upload-grid">
              <div className="form-group">
                <label htmlFor="aadhaarFront">Aadhaar Card (Front)</label>
                <input
                  id="aadhaarFront"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange('aadhaarFront')}
                />
                {files.aadhaarFront && (
                  <span className="kyc-file-name">{files.aadhaarFront.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="aadhaarBack">Aadhaar Card (Back)</label>
                <input
                  id="aadhaarBack"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange('aadhaarBack')}
                />
                {files.aadhaarBack && (
                  <span className="kyc-file-name">{files.aadhaarBack.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="panCard">PAN Card</label>
                <input
                  id="panCard"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={handleFileChange('panCard')}
                />
                {files.panCard && (
                  <span className="kyc-file-name">{files.panCard.name}</span>
                )}
              </div>
            </div>

            <p className="kyc-upload-hint">Accepted formats: JPG, PNG, PDF. Max size 5MB per file.</p>

            <div className="kyc-form-actions">
              <button
                type="button"
                className="kyc-btn kyc-btn--secondary"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>
              <button type="submit" className="kyc-btn kyc-btn--primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit KYC'}
              </button>
            </div>
          </form>
        )}

        {!canSubmit && (
          <div className="kyc-form-actions">
            <button
              type="button"
              className="kyc-btn kyc-btn--secondary"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

export default KycVerification;
