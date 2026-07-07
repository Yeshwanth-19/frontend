import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../../services/api';
import { getToken } from '../../utils/auth';
import DashboardLayout from '../../components/DashboardLayout';

const FALLBACK_DATA = {
  balance: 24850.75,
  equity: 25120.3,
  marginUsed: 4200.0,
  buyingPower: 20650.75,
  dayPnL: 269.55,
  dayPnLPercent: 1.08,
  positions: [
    { symbol: 'AAPL', name: 'Apple Inc.', qty: 25, avgPrice: 178.4, lastPrice: 182.15, pnl: 93.75 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', qty: 10, avgPrice: 410.2, lastPrice: 415.8, pnl: 56.0 },
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', qty: 10000, avgPrice: 1.0842, lastPrice: 1.0871, pnl: 29.0 },
  ],
  recentTrades: [
    { id: 1, symbol: 'AAPL', side: 'BUY', qty: 10, price: 181.2, time: '10:32 AM' },
    { id: 2, symbol: 'TSLA', side: 'SELL', qty: 5, price: 248.9, time: '09:15 AM' },
    { id: 3, symbol: 'MSFT', side: 'BUY', qty: 5, price: 414.5, time: 'Yesterday' },
  ],
};

function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPnL(value) {
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${formatCurrency(value)}`;
}

function TraderDashboard({ user }) {
  const navigate = useNavigate();
  const currency = user?.baseCurrency || 'USD';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    getDashboardData(token)
      .then(setData)
      .catch(() => setData(FALLBACK_DATA))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout user={user} roleLabel="Trader">
        <div className="dashboard-loading-inline">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  const isPositivePnL = data.dayPnL >= 0;
  const firstName = user?.name?.split(' ')[0] || 'Trader';
  const isKycVerified = Boolean(user?.kycVerified);

  return (
    <DashboardLayout user={user} roleLabel="Trader">
      <section className="dashboard-welcome">
        <h1>Welcome back, {firstName}</h1>
        <p>Your trading account overview — positions, P&amp;L, and recent activity.</p>
        <div className="trader-actions">
          <button
            type="button"
            className={`buy-stock-btn ${!isKycVerified ? 'buy-stock-btn--disabled' : ''}`}
            onClick={() => {
              if (!isKycVerified) {
                navigate('/kyc-verification');
                return;
              }
              alert('Stock buy flow can be added here.');
            }}
          >
            {isKycVerified ? 'Buy Stocks' : 'Complete KYC to Buy Stocks'}
          </button>
        </div>
      </section>

      {!isKycVerified && (
        <section className="kyc-warning">
          KYC verification is required before buying stocks.
          <button
            type="button"
            className="kyc-warning-link"
            onClick={() => navigate('/kyc-verification')}
          >
            Verify KYC now
          </button>
        </section>
      )}

      <section className="stats-grid">
        <article className="stat-card stat-card--primary">
          <span className="stat-label">Account Balance</span>
          <span className="stat-value">{formatCurrency(data.balance, currency)}</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Equity</span>
          <span className="stat-value">{formatCurrency(data.equity, currency)}</span>
        </article>
        <article className="stat-card">
          <span className="stat-label">Buying Power</span>
          <span className="stat-value">{formatCurrency(data.buyingPower, currency)}</span>
        </article>
        <article className={`stat-card ${isPositivePnL ? 'stat-card--gain' : 'stat-card--loss'}`}>
          <span className="stat-label">Today&apos;s P&amp;L</span>
          <span className="stat-value">
            {formatPnL(data.dayPnL)}
            <small>({isPositivePnL ? '+' : ''}{data.dayPnLPercent}%)</small>
          </span>
        </article>
      </section>

      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Open Positions</h2>
            <span className="panel-badge">{data.positions.length} active</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Qty</th>
                  <th>Avg Price</th>
                  <th>Last</th>
                  <th>P&amp;L</th>
                </tr>
              </thead>
              <tbody>
                {data.positions.map((position) => (
                  <tr key={position.symbol}>
                    <td>
                      <strong>{position.symbol}</strong>
                      <span className="row-sub">{position.name}</span>
                    </td>
                    <td>{position.qty.toLocaleString()}</td>
                    <td>{position.avgPrice}</td>
                    <td>{position.lastPrice}</td>
                    <td className={position.pnl >= 0 ? 'text-gain' : 'text-loss'}>
                      {formatPnL(position.pnl)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Trades</h2>
          </div>
          <ul className="trade-list">
            {data.recentTrades.map((trade) => (
              <li key={trade.id} className="trade-item">
                <div className="trade-main">
                  <span className={`trade-side trade-side--${trade.side.toLowerCase()}`}>
                    {trade.side}
                  </span>
                  <span className="trade-symbol">{trade.symbol}</span>
                  <span className="trade-qty">{trade.qty} @ {trade.price}</span>
                </div>
                <span className="trade-time">{trade.time}</span>
              </li>
            ))}
          </ul>
          <div className="margin-summary">
            <span>Margin Used</span>
            <strong>{formatCurrency(data.marginUsed, currency)}</strong>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default TraderDashboard;
