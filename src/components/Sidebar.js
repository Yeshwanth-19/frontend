import { NavLink, useNavigate } from 'react-router-dom';
import { clearAuth } from '../utils/auth';
import './Sidebar.css';

const ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4h7v9H4V4zm9 0h7v5h-7V4zM4 15h7v5H4v-5zm9 4h7v-5h-7v5z" />
    </svg>
  ),
  portfolio: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19V5h16v14H4zm2-2h12V7H6v10zm2-6h3v4H8v-4zm0-2h8v2H8V9z" />
    </svg>
  ),
  trades: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7h10v2H7V7zm0 4h7v2H7v-2zm-2-5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm0 2v10h14V8H5z" />
    </svg>
  ),
  kyc: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2 3 7v2c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.18 7 3.89v1.43c0 4.52-3.07 8.78-7 9.93-3.93-1.15-7-5.41-7-9.93V8.07l7-3.89zM11 11h2v5h-2v-5zm0-3h2v2h-2V8z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  ),
  team: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm7-2c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm2 2h-2.2c.58.64 1.2 1.53 1.2 2.5v1.5h5v-1.5c0-2.21-3.12-3.5-4-3.5zM5 12c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1zm0 2c-.88 0-4 1.29-4 3.5V19h5v-1.5c0-.97.62-1.86 1.2-2.5H5z" />
    </svg>
  ),
  approvals: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
  ),
  analytics: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3h2v18H3V3zm4 10h2v8H7v-8zm4-6h2v14h-2V7zm4 4h2v10h-2V11zm4-8h2v18h-2V3z" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.14 12.94a7.43 7.43 0 0 0 .05-.94 7.43 7.43 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.28 7.28 0 0 0-1.63-.94l-.36-2.54A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.49.42l-.36 2.54a7.28 7.28 0 0 0-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.88a.5.5 0 0 0 .12.64l2.03 1.58c-.03.31-.05.63-.05.94s.02.63.05.94L2.83 14.5a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.39 1.05.71 1.63.94l.36 2.54A.5.5 0 0 0 10 22h4a.5.5 0 0 0 .49-.42l.36-2.54c.58-.23 1.13-.55 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" />
    </svg>
  ),
  collapse: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8v-2H4V5z" />
    </svg>
  ),
};

const NAV_BY_ROLE = {
  trader: [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
    { to: '/dashboard', label: 'Portfolio', icon: 'portfolio', disabled: true },
    { to: '/dashboard', label: 'Trades', icon: 'trades', disabled: true },
    { to: '/kyc-verification', label: 'KYC Verification', icon: 'kyc', end: true },
  ],
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
    { to: '/dashboard', label: 'Users', icon: 'users', disabled: true },
    { to: '/dashboard', label: 'Analytics', icon: 'analytics', disabled: true },
    { to: '/dashboard', label: 'Settings', icon: 'settings', disabled: true },
  ],
  manager: [
    { to: '/dashboard', label: 'Dashboard', icon: 'dashboard', end: true },
    { to: '/dashboard', label: 'Team', icon: 'team', disabled: true },
    { to: '/dashboard', label: 'Approvals', icon: 'approvals', disabled: true },
    { to: '/dashboard', label: 'Analytics', icon: 'analytics', disabled: true },
  ],
};

function SidebarItem({ item, collapsed }) {
  const content = (
    <>
      <span className="sidebar-item-icon">{ICONS[item.icon]}</span>
      {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
      {collapsed && <span className="sidebar-tooltip">{item.label}</span>}
    </>
  );

  if (item.disabled) {
    return (
      <div className="sidebar-item sidebar-item--disabled" title={item.label}>
        {content}
      </div>
    );
  }

  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `sidebar-item${isActive ? ' sidebar-item--active' : ''}`
      }
      title={collapsed ? item.label : undefined}
    >
      {content}
    </NavLink>
  );
}

function Sidebar({ user, collapsed, mobileOpen, onToggleCollapse, onCloseMobile }) {
  const navigate = useNavigate();
  const role = user?.role?.toLowerCase() || 'trader';
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.trader;
  const displayName = user?.name || user?.email || 'User';
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    clearAuth();
    onCloseMobile?.();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}${
          mobileOpen ? ' sidebar--mobile-open' : ''
        } sidebar--${role}`}
      >
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-logo">◈</span>
            {!collapsed && <span className="sidebar-brand-name">TradeVault</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {!collapsed && <span className="sidebar-section-label">Menu</span>}
          {navItems.map((item) => (
            <SidebarItem key={item.label} item={item} collapsed={collapsed} />
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <span className="sidebar-avatar">{initials}</span>
            {!collapsed && (
              <div className="sidebar-profile-meta">
                <span className="sidebar-profile-name">{displayName}</span>
                <span className="sidebar-profile-role">{role}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
            aria-label="Log out"
            title={collapsed ? 'Log out' : undefined}
          >
            <span className="sidebar-item-icon">{ICONS.logout}</span>
            {!collapsed && <span>Log Out</span>}
            {collapsed && <span className="sidebar-tooltip">Log Out</span>}
          </button>

          <button
            type="button"
            className="sidebar-toggle"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className={`sidebar-toggle-icon${collapsed ? ' sidebar-toggle-icon--flipped' : ''}`}>
              {ICONS.collapse}
            </span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

export { ICONS };
export default Sidebar;
