const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed. Please try again.');
  }

  return data;
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function registerTradingAccount(accountData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(accountData),
  });

  return parseResponse(response);
}

export async function loginTradingAccount(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  return parseResponse(response);
}

export async function googleTradingLogin(credential) {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });

  return parseResponse(response);
}

export async function requestPasswordReset(email) {
  const response = await fetch(`${API_BASE_URL}/auth/forget-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  return parseResponse(response);
}

export async function resetPassword({ token, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });

  return parseResponse(response);
}

export async function getDashboardData(token) {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: authHeaders(token),
  });

  return parseResponse(response);
}
