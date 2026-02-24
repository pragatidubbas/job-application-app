/**
 * Job Status Tracking
 * Persistent status management with localStorage
 */

const STATUS_KEY = 'jobTrackerStatus';
const STATUS_HISTORY_KEY = 'jobTrackerStatusHistory';

const JOB_STATUSES = {
  NOT_APPLIED: 'Not Applied',
  APPLIED: 'Applied',
  REJECTED: 'Rejected',
  SELECTED: 'Selected'
};

function getJobStatus(jobId) {
  const statuses = JSON.parse(localStorage.getItem(STATUS_KEY) || '{}');
  return statuses[jobId] || JOB_STATUSES.NOT_APPLIED;
}

function setJobStatus(jobId, status, jobTitle, company) {
  const statuses = JSON.parse(localStorage.getItem(STATUS_KEY) || '{}');
  statuses[jobId] = status;
  localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
  
  // Track status history
  const history = JSON.parse(localStorage.getItem(STATUS_HISTORY_KEY) || '[]');
  history.unshift({
    jobId,
    jobTitle,
    company,
    status,
    changedAt: new Date().toISOString()
  });
  
  // Keep only last 20 updates
  if (history.length > 20) {
    history.splice(20);
  }
  
  localStorage.setItem(STATUS_HISTORY_KEY, JSON.stringify(history));
  
  // Show notification for specific statuses
  if (status !== JOB_STATUSES.NOT_APPLIED) {
    showNotification(`Status updated: ${status}`);
  }
}

function getStatusHistory() {
  return JSON.parse(localStorage.getItem(STATUS_HISTORY_KEY) || '[]');
}

function getStatusBadgeClass(status) {
  switch (status) {
    case JOB_STATUSES.APPLIED:
      return 'badge--applied';
    case JOB_STATUSES.REJECTED:
      return 'badge--rejected';
    case JOB_STATUSES.SELECTED:
      return 'badge--selected';
    default:
      return 'badge--neutral';
  }
}

function renderStatusButtons(jobId, currentStatus, jobTitle, company) {
  const statuses = Object.values(JOB_STATUSES);
  
  return `
    <div class="status-buttons">
      ${statuses.map(status => `
        <button 
          class="btn-status ${currentStatus === status ? 'btn-status--active' : ''}" 
          data-job-id="${jobId}"
          data-status="${status}"
          data-job-title="${jobTitle}"
          data-company="${company}">
          ${status}
        </button>
      `).join('')}
    </div>
  `;
}

// Attach status button listeners
document.addEventListener('click', (e) => {
  if (e.target.matches('.btn-status')) {
    const jobId = e.target.getAttribute('data-job-id');
    const status = e.target.getAttribute('data-status');
    const jobTitle = e.target.getAttribute('data-job-title');
    const company = e.target.getAttribute('data-company');
    
    setJobStatus(jobId, status, jobTitle, company);
    
    // Re-render current route
    const path = window.location.pathname;
    renderRoute(path);
  }
});
