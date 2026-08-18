/**
 * MediPulse Healthcare Portal — Global Utilities & UI Helpers
 * Common functions for DOM manipulation, formatters, and components.
 */

// Initialize UI components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  setupMobileNav();
});

/**
 * Safely initializes Lucide SVG icons if CDN script is available.
 */
function initIcons() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

/**
 * Sets up mobile navigation sidebar toggle behavior.
 */
function setupMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const sidebar = document.querySelector('.sidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
    });

    // Close sidebar on outer click in mobile view
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('mobile-open') &&
          !sidebar.contains(e.target) &&
          !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    });
  }
}

/**
 * Formats ISO date string (YYYY-MM-DD) into readable format (e.g. "Aug 20, 2026").
 * @param {string} dateStr 
 * @returns {string}
 */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Returns HTML string for status badges.
 * @param {string} status 
 * @returns {string} HTML snippet
 */
function getStatusBadge(status) {
  const normalized = (status || '').toLowerCase();
  let badgeClass = 'badge-info';

  if (['confirmed', 'verified', 'active', 'completed'].includes(normalized)) {
    badgeClass = 'badge-confirmed';
  } else if (['pending'].includes(normalized)) {
    badgeClass = 'badge-pending';
  } else if (['cancelled', 'rejected'].includes(normalized)) {
    badgeClass = 'badge-cancelled';
  }

  return `<span class="badge ${badgeClass}">${status}</span>`;
}

/**
 * Renders standardized empty state component inside target container.
 * 
 * @param {HTMLElement} container 
 * @param {string} title 
 * @param {string} description 
 * @param {string} iconName - Lucide icon name
 */
function renderEmptyState(container, title, description, iconName = 'folder-open') {
  if (!container) return;

  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">
        <i data-lucide="${iconName}"></i>
      </div>
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
  `;

  initIcons();
}

/**
 * Displays brief floating toast notification.
 * 
 * @param {string} message 
 * @param {string} type - 'success' | 'info' | 'warning' | 'danger'
 */
function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'info';
  if (type === 'success') iconName = 'check-circle';
  if (type === 'danger') iconName = 'alert-circle';
  if (type === 'warning') iconName = 'alert-triangle';

  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  initIcons();

  // Auto remove after 3.5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(1rem)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/**
 * Helper to update user badge elements in header/sidebar.
 */
function populateUserProfileHeader(defaultRole) {
  const user = getCurrentUser();
  const userNameElem = document.getElementById('headerUserName');
  const userRoleElem = document.getElementById('headerUserRole');
  const userAvatarElem = document.getElementById('headerUserAvatar');

  const name = user ? user.name : (defaultRole === 'doctor' ? 'Dr. Priya Sharma' : 'Aarav Patil');
  const role = user ? user.role : defaultRole;

  if (userNameElem) userNameElem.textContent = name;
  if (userRoleElem) userRoleElem.textContent = role;
  if (userAvatarElem) {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    userAvatarElem.textContent = initials || 'MP';
  }
}
