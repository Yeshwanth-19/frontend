import DashboardLayout from '../../components/DashboardLayout';

const USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'trader', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager', status: 'active' },
  { id: 3, name: 'Alex Kumar', email: 'alex@example.com', role: 'trader', status: 'inactive' },
  { id: 4, name: 'Priya Nair', email: 'priya@example.com', role: 'admin', status: 'active' },
  { id: 5, name: 'Mike Ross', email: 'mike@example.com', role: 'trader', status: 'pending' },
];

const SYSTEM_STATS = [
  { label: 'Total Users', value: '128' },
  { label: 'Active Traders', value: '94' },
  { label: 'Open Tickets', value: '7' },
  { label: 'Server Uptime', value: '99.9%' },
];

function AdminDashboard({ user }) {
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  return (
    <DashboardLayout user={user} roleLabel="Admin">
      <section className="dashboard-welcome">
        <h1>Admin Panel</h1>
        <p>Welcome, {firstName}. Manage users, roles, and platform health.</p>
      </section>

      <section className="stats-grid">
        {SYSTEM_STATS.map((stat) => (
          <article key={stat.label} className="stat-card stat-card--primary">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </article>
        ))}
      </section>

      <div className="dashboard-panels dashboard-panels--single">
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>User Management</h2>
            <span className="panel-badge">{USERS.length} users</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {USERS.map((row) => (
                  <tr key={row.id}>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.email}</td>
                    <td>
                      <span className={`role-tag role-tag--${row.role}`}>{row.role}</span>
                    </td>
                    <td>
                      <span className={`status-tag status-tag--${row.status}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="table-action">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;
