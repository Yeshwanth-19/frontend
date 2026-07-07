import DashboardLayout from '../../components/DashboardLayout';

const TEAM = [
  { id: 1, name: 'John Doe', trades: 24, pnl: 1250.5, status: 'active' },
  { id: 2, name: 'Sarah Lee', trades: 18, pnl: -320.0, status: 'active' },
  { id: 3, name: 'Ravi Patel', trades: 31, pnl: 2100.75, status: 'active' },
  { id: 4, name: 'Emma Wilson', trades: 12, pnl: 540.2, status: 'away' },
];

const PENDING = [
  { id: 1, type: 'Withdrawal', user: 'John Doe', amount: '$2,500', time: '2h ago' },
  { id: 2, type: 'KYC Review', user: 'Mike Ross', amount: '—', time: '5h ago' },
  { id: 3, type: 'Limit Increase', user: 'Sarah Lee', amount: '$10,000', time: 'Yesterday' },
];

function formatCurrency(value) {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)}`;
}

function ManagerDashboard({ user }) {
  const firstName = user?.name?.split(' ')[0] || 'Manager';
  const totalPnl = TEAM.reduce((sum, member) => sum + member.pnl, 0);
  const activeTraders = TEAM.filter((m) => m.status === 'active').length;

  return (
    <DashboardLayout user={user} roleLabel="Manager">
      <section className="dashboard-welcome">
        <h1>Manager Dashboard</h1>
        <p>Welcome, {firstName}. Monitor your team&apos;s performance and pending approvals.</p>
      </section>

      <section className="stats-grid">
        <article className="stat-card stat-card--primary">
          <span className="stat-label">Team Traders</span>
          <span className="stat-value">{TEAM.length}</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Active Now</span>
          <span className="stat-value">{activeTraders}</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Pending Approvals</span>
          <span className="stat-value">{PENDING.length}</span>
        </article>
        <article className={`stat-card ${totalPnl >= 0 ? 'stat-card--gain' : 'stat-card--loss'}`}>
          <span className="stat-label">Team P&amp;L</span>
          <span className="stat-value">{formatCurrency(totalPnl)}</span>
        </article>
      </section>

      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Team Performance</h2>
            <span className="panel-badge">{TEAM.length} traders</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trader</th>
                  <th>Trades</th>
                  <th>P&amp;L</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {TEAM.map((member) => (
                  <tr key={member.id}>
                    <td><strong>{member.name}</strong></td>
                    <td>{member.trades}</td>
                    <td className={member.pnl >= 0 ? 'text-gain' : 'text-loss'}>
                      {formatCurrency(member.pnl)}
                    </td>
                    <td>
                      <span className={`status-tag status-tag--${member.status}`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Pending Approvals</h2>
            <span className="panel-badge">{PENDING.length} pending</span>
          </div>
          <ul className="trade-list">
            {PENDING.map((item) => (
              <li key={item.id} className="trade-item">
                <div className="trade-main">
                  <span className="approval-type">{item.type}</span>
                  <span className="trade-symbol">{item.user}</span>
                  <span className="trade-qty">{item.amount}</span>
                </div>
                <span className="trade-time">{item.time}</span>
              </li>
            ))}
          </ul>
          <div className="approval-actions">
            <button type="button" className="approval-btn approval-btn--approve">Approve All</button>
            <button type="button" className="approval-btn approval-btn--review">Review Queue</button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default ManagerDashboard;
