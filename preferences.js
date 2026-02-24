/**
 * Preferences Management
 * Handles user preferences and localStorage
 */

const PREFERENCES_KEY = 'jobTrackerPreferences';

function getPreferences() {
  const stored = localStorage.getItem(PREFERENCES_KEY);
  return stored ? JSON.parse(stored) : null;
}

function savePreferences(preferences) {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

function renderSettings(container) {
  const prefs = getPreferences() || {
    roleKeywords: '',
    preferredLocations: [],
    preferredMode: [],
    experienceLevel: '',
    skills: '',
    minMatchScore: 40
  };
  
  container.innerHTML = `
    <div class="route-container">
      <h1 class="route-container__title">Settings</h1>
      <p class="route-container__subtitle">Configure your job matching preferences.</p>
      
      <div class="card spacing-md">
        <div class="card__body">
          
          <div class="spacing-md">
            <label class="label" for="roleKeywords">Role Keywords</label>
            <input type="text" id="roleKeywords" class="input" placeholder="e.g. Frontend, React, Engineer" value="${prefs.roleKeywords}">
            <p class="text-small text-secondary spacing-xs">Comma-separated keywords to match job titles and descriptions</p>
          </div>
          
          <div class="spacing-md">
            <label class="label" for="preferredLocations">Preferred Locations</label>
            <select id="preferredLocations" class="input" multiple size="5">
              <option value="Remote" ${prefs.preferredLocations.includes('Remote') ? 'selected' : ''}>Remote</option>
              <option value="New York" ${prefs.preferredLocations.includes('New York') ? 'selected' : ''}>New York</option>
              <option value="San Francisco" ${prefs.preferredLocations.includes('San Francisco') ? 'selected' : ''}>San Francisco</option>
              <option value="London" ${prefs.preferredLocations.includes('London') ? 'selected' : ''}>London</option>
              <option value="Berlin" ${prefs.preferredLocations.includes('Berlin') ? 'selected' : ''}>Berlin</option>
              <option value="Austin" ${prefs.preferredLocations.includes('Austin') ? 'selected' : ''}>Austin</option>
            </select>
            <p class="text-small text-secondary spacing-xs">Hold Ctrl/Cmd to select multiple</p>
          </div>
          
          <div class="spacing-md">
            <label class="label">Preferred Work Mode</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" id="modeRemote" value="Remote" ${prefs.preferredMode.includes('Remote') ? 'checked' : ''}>
                Remote
              </label>
              <label class="checkbox-label">
                <input type="checkbox" id="modeHybrid" value="Hybrid" ${prefs.preferredMode.includes('Hybrid') ? 'checked' : ''}>
                Hybrid
              </label>
              <label class="checkbox-label">
                <input type="checkbox" id="modeOnsite" value="Onsite" ${prefs.preferredMode.includes('Onsite') ? 'checked' : ''}>
                Onsite
              </label>
            </div>
          </div>
          
          <div class="spacing-md">
            <label class="label" for="experienceLevel">Experience Level</label>
            <select id="experienceLevel" class="input">
              <option value="">Any</option>
              <option value="Entry" ${prefs.experienceLevel === 'Entry' ? 'selected' : ''}>Entry</option>
              <option value="Mid" ${prefs.experienceLevel === 'Mid' ? 'selected' : ''}>Mid</option>
              <option value="Senior" ${prefs.experienceLevel === 'Senior' ? 'selected' : ''}>Senior</option>
              <option value="Lead" ${prefs.experienceLevel === 'Lead' ? 'selected' : ''}>Lead</option>
            </select>
          </div>
          
          <div class="spacing-md">
            <label class="label" for="skills">Skills</label>
            <input type="text" id="skills" class="input" placeholder="e.g. JavaScript, React, Node.js" value="${prefs.skills}">
            <p class="text-small text-secondary spacing-xs">Comma-separated skills</p>
          </div>
          
          <div class="spacing-md">
            <label class="label" for="minMatchScore">Minimum Match Score: <span id="scoreValue">${prefs.minMatchScore}</span></label>
            <input type="range" id="minMatchScore" class="slider" min="0" max="100" value="${prefs.minMatchScore}">
          </div>
          
          <div class="spacing-md">
            <button class="btn btn-primary" id="savePreferences">Save Preferences</button>
            <button class="btn btn-secondary" id="resetPreferences">Reset</button>
          </div>
          
        </div>
      </div>
    </div>
  `;
  
  // Attach event listeners
  const slider = document.getElementById('minMatchScore');
  const scoreValue = document.getElementById('scoreValue');
  slider.addEventListener('input', (e) => {
    scoreValue.textContent = e.target.value;
  });
  
  document.getElementById('savePreferences').addEventListener('click', () => {
    const selectedLocations = Array.from(document.getElementById('preferredLocations').selectedOptions).map(opt => opt.value);
    const selectedModes = [];
    if (document.getElementById('modeRemote').checked) selectedModes.push('Remote');
    if (document.getElementById('modeHybrid').checked) selectedModes.push('Hybrid');
    if (document.getElementById('modeOnsite').checked) selectedModes.push('Onsite');
    
    const preferences = {
      roleKeywords: document.getElementById('roleKeywords').value,
      preferredLocations: selectedLocations,
      preferredMode: selectedModes,
      experienceLevel: document.getElementById('experienceLevel').value,
      skills: document.getElementById('skills').value,
      minMatchScore: parseInt(document.getElementById('minMatchScore').value)
    };
    
    savePreferences(preferences);
    showNotification('Preferences saved successfully');
  });
  
  document.getElementById('resetPreferences').addEventListener('click', () => {
    localStorage.removeItem(PREFERENCES_KEY);
    renderSettings(container);
    showNotification('Preferences reset');
  });
}

function showNotification(message) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => notification.remove(), 3000);
}
