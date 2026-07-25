const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
const adminTokenKey = 'adminToken';
const legacyAdminTokenKey = 'easylane_admin_token';

export function readAdminAuthToken() {
  try {
    return window.localStorage.getItem(adminTokenKey) || '';
  } catch {
    return '';
  }
}

export function writeAdminAuthToken(token) {
  try {
    if (token) window.localStorage.setItem(adminTokenKey, token);
    else window.localStorage.removeItem(adminTokenKey);
    window.localStorage.removeItem(legacyAdminTokenKey);
  } catch {
    // Ignore storage errors and fall back to cookie-based auth if available.
  }
}

export function clearAdminAuthToken() {
  try {
    window.localStorage.removeItem(adminTokenKey);
    window.localStorage.removeItem(legacyAdminTokenKey);
  } catch {
    // Ignore storage errors.
  }
}

export async function api(path, options = {}) {
  const normalizedPath = String(path).replace(/^\/+/, '');
  const url = `${apiBaseUrl}/${normalizedPath}`;
  const storedToken = readAdminAuthToken();
  const { headers: requestHeaders, body, auth = true, ...restOptions } = options;
  const shouldAttachAuth = auth !== false && !/^admin\/login$/.test(normalizedPath) && !/^admin\/auth\/login$/.test(normalizedPath);
  const method = String(restOptions.method || 'GET').toUpperCase();
  let response;
  try {
    response = await fetch(url, {
      credentials: 'include',
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(shouldAttachAuth && storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        ...requestHeaders,
      },
      ...restOptions,
      body: body && typeof body !== 'string' ? JSON.stringify(body) : body,
    });
  } catch {
    const error = new Error('Unable to connect to the backend server. Confirm that the backend is running and the API URL is configured correctly.');
    error.status = 0;
    error.url = url;
    error.pathname = `/${normalizedPath}`;
    error.method = method;
    error.received = false;
    error.reachedBackend = false;
    throw error;
  }
  if (!response.ok) {
    if (response.status === 401 && storedToken) clearAdminAuthToken();
    const payload = await response.json().catch(() => ({}));
    const error = new Error(payload.message || 'Request failed.');
    error.status = response.status;
    error.url = url;
    error.pathname = new URL(url, window.location.origin).pathname;
    error.method = method;
    error.received = true;
    error.reachedBackend = true;
    throw error;
  }
  if (response.headers.get('content-type')?.includes('application/json')) {
    const data = await response.json();
    return data && typeof data === 'object' ? Object.assign({ data }, data) : { data };
  }
  return response;
}
