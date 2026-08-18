/**
 * MediPulse Healthcare Portal — Patient Dashboard Module
 * Manages patient appointments, medical records, prescriptions, and provider search.
 */

// TODO: Replace mock patient data arrays with backend REST API endpoints.
// Example API endpoints:
// GET /api/v1/patient/appointments
// GET /api/v1/patient/records
// GET /api/v1/patient/prescriptions
// GET /api/v1/providers?search={query}

// --- Mock Datasets ---
const mockPatientProfile = {
  id: "PAT-9082",
  name: "Aarav Patil",
  age: 32,
  gender: "Male",
  bloodGroup: "O+",
  emergencyContact: "+91 98765 43210",
  primaryDoctor: "Dr. Priya Sharma"
};

let patientAppointments = [
  {
    id: "APT-101",
    doctor: "Dr. Priya Sharma",
    hospital: "City Care Hospital",
    date: "2026-08-20",
    time: "10:30 AM",
    type: "General Consultation",
    status: "Confirmed"
  },
  {
    id: "APT-102",
    doctor: "Dr. Rahul Mehta",
    hospital: "HealthPlus Hospital",
    date: "2026-08-24",
    time: "04:00 PM",
    type: "Follow-up",
    status: "Pending"
  },
  {
    id: "APT-103",
    doctor: "Dr. Ananya Deshmukh",
    hospital: "Apollo Wellness Clinic",
    date: "2026-09-02",
    time: "11:15 AM",
    type: "Dermatology Screening",
    status: "Confirmed"
  }
];

const mockHealthRecords = [
  {
    category: "Vitals & Group",
    title: "Blood Group & Factor",
    value: "O Positive (O+)",
    date: "2026-01-10",
    notes: "Verified via standard lab panel."
  },
  {
    category: "Allergies",
    title: "Known Drug Allergies",
    value: "Penicillin, Sulfa Drugs",
    date: "2025-06-15",
    notes: "Mild hives reported upon exposure."
  },
  {
    category: "Diagnoses",
    title: "Primary Diagnosis History",
    value: "Mild Hypertension, Seasonal Rhinitis",
    date: "2026-03-22",
    notes: "Controlled via regular exercise and dietary management."
  },
  {
    category: "Lab Results",
    title: "Comprehensive Metabolic Panel",
    value: "All markers within normal physiological bounds",
    date: "2026-07-14",
    notes: "HbA1c: 5.6%, Fasting Blood Sugar: 94 mg/dL"
  }
];

const mockPrescriptions = [
  {
    id: "RX-401",
    doctor: "Dr. Priya Sharma",
    medicine: "Amoxicillin 500mg",
    dosage: "1 Tablet",
    frequency: "Twice daily after meals",
    duration: "5 Days",
    date: "2026-08-01",
    status: "Active"
  },
  {
    id: "RX-402",
    doctor: "Dr. Rahul Mehta",
    medicine: "Telmisartan 40mg",
    dosage: "1 Tablet",
    frequency: "Once daily (Morning)",
    duration: "30 Days",
    date: "2026-07-20",
    status: "Active"
  },
  {
    id: "RX-403",
    doctor: "Dr. Ananya Deshmukh",
    medicine: "Cetirizine 10mg",
    dosage: "1 Tablet",
    frequency: "As needed for allergies",
    duration: "10 Days",
    date: "2026-05-11",
    status: "Completed"
  }
];

const mockProviders = [
  {
    id: "DOC-01",
    doctor: "Dr. Priya Sharma",
    hospital: "City Care Hospital",
    specialization: "General Physician",
    location: "Pune",
    experience: "12 Years",
    rating: "4.9 ⭐"
  },
  {
    id: "DOC-02",
    doctor: "Dr. Rahul Mehta",
    hospital: "HealthPlus Hospital",
    specialization: "Cardiologist",
    location: "Pune",
    experience: "15 Years",
    rating: "4.8 ⭐"
  },
  {
    id: "DOC-03",
    doctor: "Dr. Ananya Deshmukh",
    hospital: "Apollo Wellness Clinic",
    specialization: "Dermatologist",
    location: "Mumbai",
    experience: "9 Years",
    rating: "4.9 ⭐"
  },
  {
    id: "DOC-04",
    doctor: "Dr. Vikram Verma",
    hospital: "Sunrise Multi-Specialty",
    specialization: "Orthopedic Surgeon",
    location: "Pune",
    experience: "18 Years",
    rating: "4.7 ⭐"
  },
  {
    id: "DOC-05",
    doctor: "Dr. Sunita Rao",
    hospital: "Lifeline Family Clinic",
    specialization: "Pediatrician",
    location: "Mumbai",
    experience: "11 Years",
    rating: "4.9 ⭐"
  }
];

// Initialize Patient Portal Page
document.addEventListener('DOMContentLoaded', () => {
  // Ensure authentication guard
  requireRole('patient');
  populateUserProfileHeader('patient');

  // Initial UI Renderings
  renderPatientProfile();
  renderAppointments('all');
  renderHealthRecords();
  renderPrescriptions();
  renderProviderSearch('');

  // Event Listeners
  setupAppointmentFilters();
  setupProviderSearchInput();
  setupBookAppointmentModal();
});

/**
 * Renders patient profile card details.
 */
function renderPatientProfile() {
  const container = document.getElementById('patientProfileSummary');
  if (!container) return;

  const user = getCurrentUser();
  const displayName = user ? user.name : mockPatientProfile.name;

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">
          <i data-lucide="user-check"></i> Patient Profile Summary
        </h2>
        <span class="badge badge-info">${mockPatientProfile.id}</span>
      </div>
      <div class="grid-4">
        <div>
          <span class="form-label">Full Name</span>
          <p class="font-bold">${displayName}</p>
        </div>
        <div>
          <span class="form-label">Age / Gender</span>
          <p>${mockPatientProfile.age} yrs (${mockPatientProfile.gender})</p>
        </div>
        <div>
          <span class="form-label">Blood Group</span>
          <p><span class="badge badge-confirmed">${mockPatientProfile.bloodGroup}</span></p>
        </div>
        <div>
          <span class="form-label">Emergency Contact</span>
          <p>${mockPatientProfile.emergencyContact}</p>
        </div>
      </div>
    </div>
  `;

  initIcons();
}

/**
 * Renders patient appointments list with optional status filtering.
 * @param {string} filterStatus 
 */
function renderAppointments(filterStatus = 'all') {
  const container = document.getElementById('appointmentsListContainer');
  if (!container) return;

  let filtered = patientAppointments;
  if (filterStatus !== 'all') {
    filtered = patientAppointments.filter(a => a.status.toLowerCase() === filterStatus.toLowerCase());
  }

  if (filtered.length === 0) {
    renderEmptyState(container, 'No Appointments Found', `No appointments match the "${filterStatus}" filter status.`, 'calendar-x');
    return;
  }

  const rows = filtered.map(apt => `
    <tr>
      <td>
        <strong>${apt.doctor}</strong><br>
        <span class="text-muted" style="font-size: 0.8rem;">${apt.hospital}</span>
      </td>
      <td>
        <i data-lucide="calendar" style="width:14px; height:14px; display:inline;"></i> ${formatDate(apt.date)}<br>
        <i data-lucide="clock" style="width:14px; height:14px; display:inline;"></i> ${apt.time}
      </td>
      <td>${apt.type}</td>
      <td>${getStatusBadge(apt.status)}</td>
      <td>
        ${apt.status === 'Pending' ? `<button class="btn btn-danger btn-sm" onclick="cancelAppointment('${apt.id}')">Cancel</button>` : `<button class="btn btn-outline btn-sm" onclick="showToast('Reminder set for appointment with ${apt.doctor}', 'info')">Reminder</button>`}
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Doctor & Hospital</th>
            <th>Date & Time</th>
            <th>Consultation Type</th>
            <th>Status</th>
            <th>Action</th>
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
 * Configures filter tab buttons for appointments.
 */
function setupAppointmentFilters() {
  const filterBtns = document.querySelectorAll('.apt-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.getAttribute('data-filter');
      renderAppointments(filter);
    });
  });
}

/**
 * Cancels a pending appointment in local state.
 * @param {string} aptId 
 */
function cancelAppointment(aptId) {
  const index = patientAppointments.findIndex(a => a.id === aptId);
  if (index !== -1) {
    patientAppointments[index].status = 'Cancelled';
    showToast('Appointment cancelled successfully.', 'warning');
    const activeTab = document.querySelector('.apt-filter-btn.active');
    renderAppointments(activeTab ? activeTab.getAttribute('data-filter') : 'all');
  }
}

/**
 * Renders medical health records section.
 */
function renderHealthRecords() {
  const container = document.getElementById('healthRecordsContainer');
  if (!container) return;

  if (mockHealthRecords.length === 0) {
    renderEmptyState(container, 'No Medical Records', 'No health records registered in your patient history.', 'file-text');
    return;
  }

  const cardsHtml = mockHealthRecords.map(rec => `
    <div class="card" style="margin-bottom: 1rem;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
        <div>
          <span class="badge badge-info" style="margin-bottom:0.35rem;">${rec.category}</span>
          <h3 style="font-size: 1rem; font-weight: 600;">${rec.title}</h3>
        </div>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${formatDate(rec.date)}</span>
      </div>
      <p style="font-weight: 600; color: var(--primary-dark); margin-bottom: 0.35rem;">${rec.value}</p>
      <p style="font-size: 0.85rem; color: var(--text-secondary);">${rec.notes}</p>
    </div>
  `).join('');

  container.innerHTML = cardsHtml;
  initIcons();
}

/**
 * Renders prescriptions list table.
 */
function renderPrescriptions() {
  const container = document.getElementById('prescriptionsContainer');
  if (!container) return;

  if (mockPrescriptions.length === 0) {
    renderEmptyState(container, 'No Prescriptions', 'You currently have no active or historical prescriptions.', 'pill');
    return;
  }

  const rows = mockPrescriptions.map(rx => `
    <tr>
      <td>
        <strong>${rx.medicine}</strong><br>
        <span class="text-muted" style="font-size: 0.8rem;">Prescribed by ${rx.doctor}</span>
      </td>
      <td>${rx.dosage}</td>
      <td>${rx.frequency}</td>
      <td>${rx.duration}</td>
      <td>${formatDate(rx.date)}</td>
      <td>${getStatusBadge(rx.status)}</td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="table-responsive">
      <table class="data-table">
        <thead>
          <tr>
            <th>Medicine & Doctor</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
            <th>Prescription Date</th>
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
 * Dynamic live search filtering against mock doctors and hospitals.
 * @param {string} query 
 */
function renderProviderSearch(query = '') {
  const container = document.getElementById('providerSearchResults');
  if (!container) return;

  const cleanQuery = query.trim().toLowerCase();
  
  const matches = mockProviders.filter(p => 
    p.doctor.toLowerCase().includes(cleanQuery) ||
    p.hospital.toLowerCase().includes(cleanQuery) ||
    p.specialization.toLowerCase().includes(cleanQuery) ||
    p.location.toLowerCase().includes(cleanQuery)
  );

  if (matches.length === 0) {
    renderEmptyState(container, 'No Providers Found', `No doctors or hospitals match your search "${query}". Try searching "Cardiologist" or "Pune".`, 'search-x');
    return;
  }

  const cardsHtml = matches.map(p => `
    <div class="card" style="margin-bottom: 1rem;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${p.doctor}</h3>
          <p style="color: var(--primary); font-weight: 600; font-size: 0.875rem;">${p.specialization}</p>
          <p style="color: var(--text-secondary); font-size: 0.85rem;">${p.hospital} • ${p.location}</p>
        </div>
        <div style="text-align:right;">
          <span style="font-size: 0.85rem; font-weight: 700; color: var(--warning);">${p.rating}</span>
          <p style="font-size: 0.75rem; color: var(--text-muted);">${p.experience} exp</p>
        </div>
      </div>
      <div style="margin-top: 1rem; display:flex; justify-content:flex-end; gap:0.5rem;">
        <button class="btn btn-outline btn-sm" onclick="openBookingModal('${p.doctor}', '${p.hospital}')">
          <i data-lucide="calendar-plus" style="width:14px; height:14px;"></i> Book Appointment
        </button>
      </div>
    </div>
  `).join('');

  container.innerHTML = `<div class="grid-2">${cardsHtml}</div>`;
  initIcons();
}

/**
 * Attaches real-time keyup listener for provider search input.
 */
function setupProviderSearchInput() {
  const searchInput = document.getElementById('providerSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderProviderSearch(e.target.value);
    });
  }
}

/**
 * Setup and handles New Appointment Modal.
 */
function setupBookAppointmentModal() {
  const modal = document.getElementById('bookAppointmentModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('bookAppointmentForm');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const doctor = document.getElementById('modalDoctorName').value;
      const hospital = document.getElementById('modalHospitalName').value;
      const date = document.getElementById('modalApptDate').value;
      const time = document.getElementById('modalApptTime').value;
      const type = document.getElementById('modalApptType').value;

      if (!date || !time) {
        showToast('Please select valid date and time.', 'warning');
        return;
      }

      // Add to local state
      const newApt = {
        id: `APT-${Math.floor(100 + Math.random() * 900)}`,
        doctor,
        hospital,
        date,
        time,
        type,
        status: 'Pending'
      };

      patientAppointments.unshift(newApt);
      
      // TODO: Post new appointment request to backend REST API endpoint.
      // await fetch('/api/v1/appointments', { method: 'POST', body: JSON.stringify(newApt) });

      showToast(`Appointment request sent to ${doctor}!`, 'success');
      modal.classList.remove('active');
      renderAppointments('all');
    });
  }
}

/**
 * Opens booking modal with prefilled doctor/hospital.
 * @param {string} doctor 
 * @param {string} hospital 
 */
function openBookingModal(doctor, hospital) {
  const modal = document.getElementById('bookAppointmentModal');
  const doctorInput = document.getElementById('modalDoctorName');
  const hospitalInput = document.getElementById('modalHospitalName');

  if (modal && doctorInput && hospitalInput) {
    doctorInput.value = doctor;
    hospitalInput.value = hospital;
    
    // Default tomorrow date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('modalApptDate').value = tomorrow.toISOString().split('T')[0];

    modal.classList.add('active');
  }
}
