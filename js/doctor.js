/**
 * MediPulse Healthcare Portal — Doctor Dashboard Module
 * Manages today's clinical appointments, upcoming schedule, and patient search.
 */

// TODO: Replace mock doctor datasets with REST API endpoints.
// Example endpoints:
// GET /api/v1/doctor/appointments/today
// GET /api/v1/doctor/patients/upcoming
// GET /api/v1/doctor/patients?query={search}

let todayAppointments = [
  {
    id: "DAPT-01",
    patient: "Aarav Patil",
    patientId: "PAT-9082",
    time: "09:30 AM",
    type: "Consultation",
    status: "Confirmed",
    condition: "Hypertension Check"
  },
  {
    id: "DAPT-02",
    patient: "Riya Shah",
    patientId: "PAT-3411",
    time: "11:00 AM",
    type: "Follow-up",
    status: "Confirmed",
    condition: "Diabetes Follow-up"
  },
  {
    id: "DAPT-03",
    patient: "Rohan Gupta",
    patientId: "PAT-5120",
    time: "02:15 PM",
    type: "Routine Checkup",
    status: "Pending",
    condition: "General Fatigue"
  },
  {
    id: "DAPT-04",
    patient: "Meera Joshi",
    patientId: "PAT-8812",
    time: "04:30 PM",
    type: "Lab Review",
    status: "Confirmed",
    condition: "Lipid Profile Assessment"
  }
];

const upcomingPatients = [
  {
    id: "UP-201",
    patient: "Karan Malhotra",
    patientId: "PAT-7712",
    date: "2026-08-21",
    time: "10:00 AM",
    reason: "Post-surgery Knee Assessment",
    status: "Confirmed"
  },
  {
    id: "UP-202",
    patient: "Sneha Kulkarni",
    patientId: "PAT-6610",
    date: "2026-08-22",
    time: "11:30 AM",
    reason: "Thyroid Panel Consultation",
    status: "Confirmed"
  },
  {
    id: "UP-203",
    patient: "Vikramaditya Roy",
    patientId: "PAT-4091",
    date: "2026-08-23",
    time: "03:00 PM",
    reason: "ECG & Cardiac Screening",
    status: "Pending"
  }
];

const mockPatientDatabase = [
  {
    id: "PAT-9082",
    name: "Aarav Patil",
    age: 32,
    gender: "Male",
    condition: "Mild Hypertension",
    lastVisit: "2026-08-01",
    bloodGroup: "O+"
  },
  {
    id: "PAT-3411",
    name: "Riya Shah",
    age: 45,
    gender: "Female",
    condition: "Type-2 Diabetes",
    lastVisit: "2026-07-28",
    bloodGroup: "A+"
  },
  {
    id: "PAT-5120",
    name: "Rohan Gupta",
    age: 28,
    gender: "Male",
    condition: "Seasonal Allergy / Fatigue",
    lastVisit: "2026-06-12",
    bloodGroup: "B+"
  },
  {
    id: "PAT-8812",
    name: "Meera Joshi",
    age: 54,
    gender: "Female",
    condition: "Hypercholesterolemia",
    lastVisit: "2026-08-10",
    bloodGroup: "AB+"
  },
  {
    id: "PAT-7712",
    name: "Karan Malhotra",
    age: 39,
    gender: "Male",
    condition: "Post-ACL Reconstruction",
    lastVisit: "2026-07-15",
    bloodGroup: "O-"
  }
];

// Initialize Doctor Portal
document.addEventListener('DOMContentLoaded', () => {
  // Enforce doctor authentication
  requireRole('doctor');
  populateUserProfileHeader('doctor');

  // Initial renders
  renderDoctorMetrics();
  renderTodaySchedule();
  renderUpcomingPatients();
  renderPatientSearch('');

  // Setup live search event listener
  setupPatientSearchInput();
});

/**
 * Calculates and updates today's appointment counter and statistics.
 */
function renderDoctorMetrics() {
  const countElem = document.getElementById('todayCount');
  const pendingElem = document.getElementById('pendingCount');
  const completedElem = document.getElementById('completedCount');

  // Calculate stats dynamically from todayAppointments mock array
  const totalToday = todayAppointments.length;
  const pending = todayAppointments.filter(a => a.status === 'Pending').length;
  const completed = todayAppointments.filter(a => a.status === 'Completed').length;

  if (countElem) countElem.textContent = totalToday;
  if (pendingElem) pendingElem.textContent = pending;
  if (completedElem) completedElem.textContent = completed;
}

/**
 * Renders today's schedule list with dynamic status toggle buttons.
 */
function renderTodaySchedule() {
  const container = document.getElementById('todayScheduleContainer');
  if (!container) return;

  if (todayAppointments.length === 0) {
    renderEmptyState(container, 'No Appointments Today', 'Your schedule is currently clear for today.', 'calendar-check');
    return;
  }

  const rows = todayAppointments.map(apt => `
    <tr>
      <td>
        <strong>${apt.patient}</strong><br>
        <span class="text-muted" style="font-size: 0.8rem;">ID: ${apt.patientId} • ${apt.condition}</span>
      </td>
      <td><i data-lucide="clock" style="width:14px; height:14px; display:inline;"></i> ${apt.time}</td>
      <td>${apt.type}</td>
      <td>${getStatusBadge(apt.status)}</td>
      <td>
        <div style="display:flex; gap:0.35rem;">
          ${apt.status !== 'Completed' ? `<button class="btn btn-primary btn-sm" onclick="updateAppointmentStatus('${apt.id}', 'Completed')">Complete</button>` : ''}
          ${apt.status === 'Pending' ? `<button class="btn btn-secondary btn-sm" onclick="updateAppointmentStatus('${apt.id}', 'Confirmed')">Confirm</button>` : ''}
          ${apt.status !== 'Cancelled' && apt.status !== 'Completed' ? `<button class="btn btn-danger btn-sm" onclick="updateAppointmentStatus('${apt.id}', 'Cancelled')">Cancel</button>` : ''}
        </div>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Patient Name & ID</th>
            <th>Time</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;

  initIcons();
}

/**
 * Updates status of an appointment in local memory and re-renders metrics.
 * @param {string} aptId 
 * @param {string} newStatus 
 */
function updateAppointmentStatus(aptId, newStatus) {
  const index = todayAppointments.findIndex(a => a.id === aptId);
  if (index !== -1) {
    todayAppointments[index].status = newStatus;
    
    // TODO: Send status patch request to backend API
    // await fetch(`/api/v1/doctor/appointments/${aptId}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });

    showToast(`Appointment status updated to "${newStatus}".`, 'success');
    renderDoctorMetrics();
    renderTodaySchedule();
  }
}

/**
 * Renders upcoming patient queue.
 */
function renderUpcomingPatients() {
  const container = document.getElementById('upcomingPatientsContainer');
  if (!container) return;

  if (upcomingPatients.length === 0) {
    renderEmptyState(container, 'No Upcoming Patients', 'No future appointments recorded.', 'user-x');
    return;
  }

  const rows = upcomingPatients.map(p => `
    <tr>
      <td>
        <strong>${p.patient}</strong><br>
        <span class="text-muted" style="font-size: 0.8rem;">ID: ${p.patientId}</span>
      </td>
      <td>${formatDate(p.date)}</td>
      <td>${p.time}</td>
      <td>${p.reason}</td>
      <td>${getStatusBadge(p.status)}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Scheduled Date</th>
            <th>Time</th>
            <th>Clinical Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;

  initIcons();
}

/**
 * Real-time dynamic patient search renderer.
 * @param {string} query 
 */
function renderPatientSearch(query = '') {
  const container = document.getElementById('doctorPatientSearchResults');
  if (!container) return;

  const cleanQuery = query.trim().toLowerCase();

  const matches = mockPatientDatabase.filter(p =>
    p.name.toLowerCase().includes(cleanQuery) ||
    p.id.toLowerCase().includes(cleanQuery) ||
    p.condition.toLowerCase().includes(cleanQuery)
  );

  if (matches.length === 0) {
    renderEmptyState(container, 'No Patients Found', `No patient records match "${query}". Try searching "Aarav", "PAT-9082", or "Diabetes".`, 'search-x');
    return;
  }

  const cards = matches.map(p => `
    <div class="card" style="margin-bottom: 1rem;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <span class="badge badge-info" style="margin-bottom: 0.35rem;">${p.id}</span>
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${p.name}</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
            ${p.age} yrs (${p.gender}) • Blood Group: <strong>${p.bloodGroup}</strong>
          </p>
          <p style="font-size: 0.85rem; color: var(--primary-dark); margin-top: 0.25rem; font-weight: 600;">
            Primary Condition: ${p.condition}
          </p>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.75rem; color: var(--text-muted);">Last Visit: ${formatDate(p.lastVisit)}</span>
        </div>
      </div>
      <div style="margin-top: 1rem; border-top: 1px solid var(--bg-subtle); padding-top: 0.75rem; display:flex; justify-content:flex-end; gap:0.5rem;">
        <button class="btn btn-outline btn-sm" onclick="showToast('Viewing medical chart for ${p.name}', 'info')">
          <i data-lucide="file-text" style="width:14px; height:14px;"></i> View Health Chart
        </button>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Issued quick prescription draft for ${p.name}', 'success')">
          <i data-lucide="pill" style="width:14px; height:14px;"></i> Add Prescription
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `<div class="grid-2">${cards}</div>`;
  initIcons();
}

/**
 * Attaches listener for patient search input box.
 */
function setupPatientSearchInput() {
  const input = document.getElementById('doctorPatientSearchInput');
  if (input) {
    input.addEventListener('input', (e) => {
      renderPatientSearch(e.target.value);
    });
  }
}
