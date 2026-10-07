const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const apiBaseUrl = configuredApiBaseUrl || (import.meta.env.PROD ? '' : '/api');
const adminTokenKey = 'adminToken';
const legacyAdminTokenKey = 'easylane_admin_token';
const publicResponseCache = new Map();
const inFlightPublicRequests = new Map();
let apiConfigurationWarningShown = false;

function publicFallback(path) {
  return path === 'settings/public' ? { socialLinks: {}, navigationLinks: [], trustedLogos: {} } : null;
}

function getApiConfigurationError() {
  if (!apiBaseUrl) return new Error('Production API URL is missing. Configure VITE_API_BASE_URL when building the frontend.');
  if (import.meta.env.PROD) {
    try {
      const parsed = new URL(apiBaseUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
      return new Error('Production API URL is invalid. Configure VITE_API_BASE_URL as an absolute http:// or https:// URL.');
    }
  }
  return null;
}

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
  const method = String(options.method || 'GET').toUpperCase();
  const isPublicRequest = method === 'GET' && ['content', 'settings/public'].includes(normalizedPath);
  const configurationError = getApiConfigurationError();
  if (configurationError) {
    if (!apiConfigurationWarningShown) {
      console.error(`[EasyLane API] ${configurationError.message}`);
      apiConfigurationWarningShown = true;
    }
    if (isPublicRequest) return publicFallback(normalizedPath);
    throw configurationError;
  }
  const url = `${apiBaseUrl}/${normalizedPath}`;
  const storedToken = readAdminAuthToken();
  const { headers: requestHeaders, body, auth = true, ...restOptions } = options;
  const shouldAttachAuth = auth !== false && !/^admin\/login$/.test(normalizedPath) && !/^admin\/auth\/login$/.test(normalizedPath);
  const requestKey = isPublicRequest ? `${url}:${storedToken}` : '';
  if (requestKey && publicResponseCache.has(requestKey)) return publicResponseCache.get(requestKey);
  if (requestKey && inFlightPublicRequests.has(requestKey)) return inFlightPublicRequests.get(requestKey);

  const safeFallback = publicFallback(normalizedPath);

  const request = performApiRequest({
    normalizedPath,
    url,
    storedToken,
    requestHeaders,
    body,
    shouldAttachAuth,
    method,
    restOptions,
    timeoutMs: options.timeoutMs,
  });
  if (!requestKey) return request;

  const publicRequest = request.then((result) => {
    publicResponseCache.set(requestKey, result);
    return result;
  }).catch(() => safeFallback).finally(() => {
    inFlightPublicRequests.delete(requestKey);
  });
  inFlightPublicRequests.set(requestKey, publicRequest);
  return publicRequest;
}

async function performApiRequest({ normalizedPath, url, storedToken, requestHeaders, body, shouldAttachAuth, method, restOptions, timeoutMs: requestedTimeout }) {
  const controller = new AbortController();
  const callerSignal = restOptions.signal;
  const { timeoutMs: _timeoutMs, signal: _signal, ...fetchOptions } = restOptions;
  const timeoutMs = Math.max(1000, Number(requestedTimeout) || (['content', 'settings/public'].includes(normalizedPath) ? 6000 : normalizedPath.startsWith('assistant/') ? 22000 : 15000));
  const timeout = setTimeout(() => controller.abort(new DOMException('Request timed out.', 'TimeoutError')), timeoutMs);
  const abortFromCaller = () => controller.abort(callerSignal.reason);
  if (callerSignal?.aborted) abortFromCaller();
  else callerSignal?.addEventListener('abort', abortFromCaller, { once: true });
  try {
    const response = await fetch(url, {
      credentials: 'include',
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(shouldAttachAuth && storedToken ? { Authorization: `Bearer ${storedToken}` } : {}),
        ...requestHeaders,
      },
      ...fetchOptions,
      signal: controller.signal,
      body: body && typeof body !== 'string' ? JSON.stringify(body) : body,
    });
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
  } catch (cause) {
    if (cause?.received) throw cause;
    const timedOut = controller.signal.aborted && !callerSignal?.aborted;
    const error = new Error(timedOut ? 'The API request timed out.' : 'Unable to connect to the backend server. Confirm that the backend is running and the API URL is configured correctly.');
    error.cause = cause;
    error.code = timedOut ? 'API_TIMEOUT' : 'API_UNAVAILABLE';
    error.status = 0;
    error.url = url;
    error.pathname = `/${normalizedPath}`;
    error.method = method;
    error.received = false;
    error.reachedBackend = false;
    throw error;
  } finally {
    clearTimeout(timeout);
    callerSignal?.removeEventListener('abort', abortFromCaller);
  }
}
