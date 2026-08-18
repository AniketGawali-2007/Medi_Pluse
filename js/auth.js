/**
 * MediPulse Healthcare Portal — Authentication & Role Guard Module
 * Simulates role-based authorization using localStorage.
 */

// Storage Keys
const ROLE_KEY = 'healthcare_role';
const USER_KEY = 'healthcare_user';

/**
 * Validates authentication status on protected pages.
 * Redirects unauthorized users back to landing page.
 * 
 * @param {string} requiredRole - 'patient' or 'doctor'
 */
function requireRole(requiredRole) {
  const role = localStorage.getItem(ROLE_KEY);

  // TODO: Replace simulated localStorage auth guard with real server-side session/JWT validation.
  // Example:
  // const response = await fetch('/api/v1/auth/verify', { headers: { Authorization: `Bearer ${token}` } });
  // if (!response.ok) window.location.href = 'index.html';

  if (!role || role !== requiredRole) {
    console.warn(`[MediPulse Auth] Access denied. Required: ${requiredRole}, Found: ${role || 'None'}`);
    window.location.href = 'index.html';
  }
}

/**
 * Redirects already logged-in users away from login/landing page to their dashboard.
 */
function redirectIfAuthenticated() {
  const role = localStorage.getItem(ROLE_KEY);
  if (role === 'patient') {
    window.location.href = 'patient.html';
  } else if (role === 'doctor') {
    window.location.href = 'doctor.html';
  }
}

/**
 * Simulates user login and sets role tokens.
 * 
 * @param {string} role - 'patient' or 'doctor'
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 */
function loginUser(role, name, email) {
  if (!role || !['patient', 'doctor'].includes(role)) {
    throw new Error('Invalid role specified for login.');
  }

  if (!name.trim() || !email.trim()) {
    throw new Error('Name and email are required fields.');
  }

  // TODO: Connect to backend authentication API.
  // Example API Integration:
  // const res = await fetch('/api/v1/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ role, name, email, password })
  // });
  // const data = await res.json();
  // localStorage.setItem('jwt_token', data.token);

  // Simulated MVP authentication state
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USER_KEY, JSON.stringify({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: role,
    loggedInAt: new Date().toISOString()
  }));

  console.log(`[MediPulse Auth] Logged in successfully as ${role}: ${name}`);

  // Redirect based on role
  if (role === 'doctor') {
    window.location.href = 'doctor.html';
  } else {
    window.location.href = 'patient.html';
  }
}

/**
 * Returns currently authenticated user details.
 * @returns {Object|null} User object or default mock user
 */
function getCurrentUser() {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('[MediPulse Auth] Error parsing user details:', e);
    return null;
  }
}

/**
 * Logs out user by clearing role tokens and redirecting to index.html.
 */
function logout() {
  // TODO: Send logout request to backend API to invalidate server session / revoke JWT token.
  // fetch('/api/v1/auth/logout', { method: 'POST' });

  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
  console.log('[MediPulse Auth] User logged out.');
  window.location.href = 'index.html';
}
