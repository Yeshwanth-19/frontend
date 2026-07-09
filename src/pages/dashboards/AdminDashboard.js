import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getPendingKycSubmissions, getUploadUrl, updateKycStatus } from '../../services/api';
import { getToken } from '../../utils/auth';

const SYSTEM_STATS = [
  { label: 'Total Users', value: '128' },
  { label: 'Active Traders', value: '94' },
  { label: 'Open Tickets', value: '7' },
  { label: 'Server Uptime', value: '99.9%' },
];

function AdminDashboard({ user }) {
  const firstName = user?.name?.split(' ')[0] || 'Admin';
  const token = getToken();
  const [pendingKyc, setPendingKyc] = useState([]);
  const [loadingKyc, setLoadingKyc] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [processingId, setProcessingId] = useState('');

  const loadPendingKyc = () => {
    setLoadingKyc(true);
    getPendingKycSubmissions(token)
      .then((data) => setPendingKyc(data.submissions || []))
      .catch(() => setPendingKyc([]))
      .finally(() => setLoadingKyc(false));
  };

  useEffect(() => {
    loadPendingKyc();
  }, []);

  const handleReview = async (userId, status) => {
    let rejectionReason;

    if (status === 'rejected') {
      rejectionReason = window.prompt('Enter rejection reason (optional):', 'Documents could not be verified');
      if (rejectionReason === null) {
        return;
      }
    }

    setProcessingId(userId);
    setActionMessage('');
    setActionError('');

    try {
      await updateKycStatus({ userId, status, rejectionReason }, token);
      setActionMessage(`KYC ${status} successfully.`);
      loadPendingKyc();
    } catch (error) {
      setActionError(error.message || 'Failed to update KYC status.');
    } finally {
      setProcessingId('');
    }
  };

  return (
    <DashboardLayout user={user} roleLabel="Admin">
      <section className="dashboard-welcome">
        <h1>Admin Panel</h1>
        <p>Welcome, {firstName}. Review pending KYC submissions and manage the platform.</p>
      </section>

      <section className="stats-grid">
        {SYSTEM_STATS.map((stat) => (
          <article key={stat.label} className="stat-card stat-card--primary">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </article>
        ))}
      </section>

      {actionMessage && <section className="dashboard-error dashboard-success">{actionMessage}</section>}
      {actionError && <section className="dashboard-error">{actionError}</section>}

      <div className="dashboard-panels dashboard-panels--single">
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Pending KYC Verifications</h2>
            <span className="panel-badge">{pendingKyc.length} pending</span>
          </div>

          {loadingKyc ? (
            <p className="kyc-admin-loading">Loading pending KYC submissions...</p>
          ) : pendingKyc.length === 0 ? (
            <p className="kyc-admin-empty">No pending KYC submissions.</p>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Submitted</th>
                    <th>Documents</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingKyc.map((submission) => (
                    <tr key={submission._id}>
                      <td>
                        <strong>{submission.name}</strong>
                        <span className="row-sub">{submission.email}</span>
                        <span className="row-sub">Aadhaar ends with {submission.aadhaarLast}</span>
                      </td>
                      <td>
                        {submission.kycSubmittedAt
                          ? new Date(submission.kycSubmittedAt).toLocaleString()
                          : '—'}
                      </td>
                      <td>
                        <div className="kyc-doc-links">
                          <a href={getUploadUrl(submission.documents?.aadhaarFront)} target="_blank" rel="noreferrer">
                            Aadhaar Front
                          </a>
                          <a href={getUploadUrl(submission.documents?.aadhaarBack)} target="_blank" rel="noreferrer">
                            Aadhaar Back
                          </a>
                          <a href={getUploadUrl(submission.documents?.panCard)} target="_blank" rel="noreferrer">
                            PAN Card
                          </a>
                        </div>
                      </td>
                      <td>
                        <div className="kyc-admin-actions">
                          <button
                            type="button"
                            className="approval-btn approval-btn--approve"
                            disabled={processingId === submission._id}
                            onClick={() => handleReview(submission._id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="approval-btn approval-btn--review"
                            disabled={processingId === submission._id}
                            onClick={() => handleReview(submission._id, 'rejected')}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
