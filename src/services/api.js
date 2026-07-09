const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export function getUploadUrl(filePath) {
  if (!filePath) return '';
  if (filePath.startsWith('http')) return filePath;
  return `${API_ORIGIN}${filePath}`;
}

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

export async function submitKycVerification(formData, token) {
  const response = await fetch(`${API_BASE_URL}/auth/kyc`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseResponse(response);
}

export async function getPendingKycSubmissions(token) {
  const response = await fetch(`${API_BASE_URL}/auth/kyc/pending`, {
    headers: authHeaders(token),
  });

  return parseResponse(response);
}

export async function updateKycStatus({ userId, status, rejectionReason }, token) {
  const response = await fetch(`${API_BASE_URL}/auth/kyc/${userId}/status`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status, rejectionReason }),
  });

  return parseResponse(response);
}

export async function getDashboardData(token) {
  const response = await fetch(`${API_BASE_URL}/dashboard`, {
    headers: authHeaders(token),
  });

  return parseResponse(response);
}
