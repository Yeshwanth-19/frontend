import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../utils/auth';
import Sidebar, { ICONS } from './Sidebar';
import '../pages/Dashboard.css';

const SIDEBAR_COLLAPSED_KEY = 'tradevault_sidebar_collapsed';

function DashboardLayout({ user, roleLabel, children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || 'trader';
  const displayName = user?.name || user?.email || 'User';

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login', { replace: true });
  };

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className={`dashboard-page dashboard-page--${role}${collapsed ? ' dashboard-page--sidebar-collapsed' : ''}`}>
      <Sidebar
        user={user}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={handleToggleCollapse}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            <button
              type="button"
              className="dashboard-menu-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              {ICONS.menu}
            </button>
            <div className="dashboard-brand">
              <span className="dashboard-brand-name">Dashboard</span>
              <span className={`role-pill role-pill--${role}`}>{roleLabel}</span>
            </div>
          </div>


        </header>

        <main className="dashboard-main">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
