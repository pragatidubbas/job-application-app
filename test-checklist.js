/**
 * Test Checklist System
 * Built-in testing and ship lock enforcement
 */

const TEST_STATUS_KEY = 'jobTrackerTestStatus';

const TEST_ITEMS = [
  {
    id: 'test-1',
    label: 'Preferences persist after refresh',
    tooltip: 'Go to /settings, save preferences, refresh page, verify fields are prefilled'
  },
  {
    id: 'test-2',
    label: 'Match score calculates correctly',
    tooltip: 'Set preferences with keywords, check dashboard job badges show correct scores'
  },
  {
    id: 'test-3',
    label: '"Show only matches" toggle works',
    tooltip: 'Enable toggle on dashboard, verify only jobs above threshold appear'
  },
  {
    id: 'test-4',
    label: 'Save job persists after refresh',
    tooltip: 'Save a job, refresh page, verify it remains saved'
  },
  {
    id: 'test-5',
    label: 'Apply opens in new tab',
    tooltip: 'Click Apply button on any job, verify new tab opens'
  },
  {
    id: 'test-6',
    label: 'Status update persists after refresh',
    tooltip: 'Change job status to Applied, refresh page, verify status badge persists'
  },
  {
    id: 'test-7',
    label: 'Status filter works correctly',
    tooltip: 'Set status filter to Applied, verify only Applied jobs show'
  },
  {
    id: 'test-8',
    label: 'Digest generates top 10 by score',
    tooltip: 'Generate digest, verify jobs are sorted by match score descending'
  },
  {
    id: 'test-9',
    label: 'Digest persists for the day',
    tooltip: 'Generate digest, refresh page, verify same digest loads without regenerating'
  },
  {
    id: 'test-10',
    label: 'No console errors on main pages',
    tooltip: 'Open browser console, navigate all routes, verify no errors appear'
  }
];

function getTestStatus() {
  const stored = localStorage.getItem(TEST_STATUS_KEY);
  return stored ? JSON.parse(stored) : {};
}

function setTestStatus(testId, checked) {
  const status = getTestStatus();
  status[testId] = checked;
  localStorage.setItem(TEST_STATUS_KEY, JSON.stringify(status));
}

function resetTestStatus() {
  localStorage.removeItem(TEST_STATUS_KEY);
}

function getTestProgress() {
  const status = getTestStatus();
  const total = TEST_ITEMS.length;
  const passed = TEST_ITEMS.filter(item => status[item.id] === true).length;
  return { passed, total };
}

function allTestsPassed() {
  const { passed, total } = getTestProgress();
  return passed === total;
}

function renderTestChecklist(container) {
  const status = getTestStatus();
  const { passed, total } = getTestProgress();
  
  container.innerHTML = `
    <div class="route-container">
      <h1 class="route-container__title">Test Checklist</h1>
      <p class="route-container__subtitle">Verify all functionality before shipping.</p>
      
      <div class="test-summary spacing-md">
        <p class="test-summary__score">Tests Passed: ${passed} / ${total}</p>
        ${passed < total ? `
          <p class="test-summary__warning">Resolve all issues before shipping.</p>
        ` : `
          <p class="test-summary__success">All tests passed. Ready to ship.</p>
        `}
      </div>
      
      <div class="card spacing-md">
        <div class="card__body">
          <ul class="test-checklist">
            ${TEST_ITEMS.map(item => `
              <li class="test-checklist__item">
                <label class="test-checklist__label">
                  <input 
                    type="checkbox" 
                    class="test-checklist__checkbox"
                    data-test-id="${item.id}"
                    ${status[item.id] ? 'checked' : ''}>
                  <span class="test-checklist__text">${item.label}</span>
                </label>
                <p class="test-checklist__tooltip">${item.tooltip}</p>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
      
      <button class="btn btn-secondary" id="resetTests">Reset Test Status</button>
    </div>
  `;
  
  // Attach checkbox listeners
  document.querySelectorAll('.test-checklist__checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const testId = e.target.getAttribute('data-test-id');
      setTestStatus(testId, e.target.checked);
      renderTestChecklist(container);
    });
  });
  
  document.getElementById('resetTests').addEventListener('click', () => {
    resetTestStatus();
    renderTestChecklist(container);
    showNotification('Test status reset');
  });
}

function renderShipPage(container) {
  if (!allTestsPassed()) {
    container.innerHTML = `
      <div class="route-container">
        <h1 class="route-container__title">Ship</h1>
        
        <div class="banner spacing-md">
          <div>
            <p class="banner__message">Complete all tests before shipping.</p>
            <p class="text-small text-secondary">You must pass all 10 tests on the test checklist.</p>
          </div>
          <a href="/jt/07-test" class="btn btn-primary" data-route="/jt/07-test">Go to Tests</a>
        </div>
        
        <div class="empty-state">
          <h3 class="empty-state__title">Shipping Locked</h3>
          <p class="empty-state__message">Complete the test checklist to unlock shipping.</p>
        </div>
      </div>
    `;
    return;
  }
  
  const { passed, total } = getTestProgress();
  
  container.innerHTML = `
    <div class="route-container">
      <h1 class="route-container__title">Ship</h1>
      <p class="route-container__subtitle">All tests passed. Ready to deploy.</p>
      
      <div class="card spacing-md">
        <div class="card__body">
          <div class="ship-ready">
            <h3 class="ship-ready__title">Tests Passed: ${passed} / ${total}</h3>
            <p class="body-text spacing-md">Your Job Notification Tracker is ready to ship.</p>
            <button class="btn btn-primary">Deploy to Production</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
