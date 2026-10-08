const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

/**
 * Universal Fetch Helper with JWT Token Header
 */
const request = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('suprema_token') || localStorage.getItem('suprema_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  // If FormData, remove Content-Type header so browser sets multipart boundary automatically
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch (networkError) {
    // fetch() rejects for both a dead server AND a CORS rejection. The server
    // may even have logged a 200 in the CORS case, because the browser throws
    // the response away after the server has already handled it. Reporting this
    // as a plain "authentication failed" sent debugging in completely the wrong
    // direction, so name both possibilities explicitly.
    const message =
      'Cannot reach the API server at ' + BASE_URL + '. Either the backend is not ' +
      'running, or it is blocked by CORS - check that the server is on port 5000 ' +
      'and that your dev client origin is allowed (CLIENT_ORIGIN).';

    const error = new Error(message);
    error.isNetworkError = true;
    error.cause = networkError;
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `HTTP error! Status: ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options = {}) => request(endpoint, { method: 'POST', body, ...options }),
  put: (endpoint, body, options = {}) => request(endpoint, { method: 'PUT', body, ...options }),
  patch: (endpoint, body, options = {}) => request(endpoint, { method: 'PATCH', body, ...options }),
  delete: (endpoint, options = {}) => request(endpoint, { method: 'DELETE', ...options })
};

export default api;
