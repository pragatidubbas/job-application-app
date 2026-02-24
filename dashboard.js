/**
 * Dashboard Logic
 * Job listing with filtering, sorting, and match scoring
 */

// Sample job data for demonstration
const sampleJobs = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    company: 'Tech Corp',
    location: 'Remote',
    mode: 'Remote',
    experience: 'Senior',
    description: 'Build modern web applications using React and TypeScript',
    skills: ['React', 'TypeScript', 'JavaScript'],
    postedDaysAgo: 1,
    source: 'LinkedIn',
    salary: '$120k-$160k'
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'StartupXYZ',
    location: 'San Francisco',
    mode: 'Hybrid',
    experience: 'Mid',
    description: 'Work on backend APIs and frontend interfaces',
    skills: ['Node.js', 'React', 'PostgreSQL'],
    postedDaysAgo: 3,
    source: 'Indeed',
    salary: '$100k-$140k'
  },
  {
    id: 3,
    title: 'React Developer',
    company: 'Digital Agency',
    location: 'New York',
    mode: 'Onsite',
    experience: 'Mid',
    description: 'Create responsive user interfaces for client projects',
    skills: ['React', 'CSS', 'JavaScript'],
    postedDaysAgo: 5,
    source: 'LinkedIn',
    salary: '$90k-$120k'
  }
];

let currentFilters = {
  keyword: '',
  location: '',
  mode: '',
  experience: '',
  source: '',
  status: '',
  showOnlyMatches: false
};

let currentSort = 'latest';

function renderDashboard(container) {
  const preferences = getPreferences();
  const showBanner = !preferences;
  
  container.innerHTML = `
    <div class="route-container">
      <h1 class="route-container__title">Dashboard</h1>
      <p class="route-container__subtitle">Track and manage your job applications.</p>
      
      ${showBanner ? `
        <div class="banner spacing-md">
          <p class="banner__message">Set your preferences to activate intelligent matching.</p>
          <a href="/settings" class="btn btn-primary" data-route="/settings">Go to Settings</a>
        </div>
      ` : ''}
      
      <div class="filter-bar spacing-md">
        <input type="text" id="keywordFilter" class="input filter-input" placeholder="Search by keyword..." value="${currentFilters.keyword}">
        
        <select id="locationFilter" class="input filter-input">
          <option value="">All Locations</option>
          <option value="Remote" ${currentFilters.location === 'Remote' ? 'selected' : ''}>Remote</option>
          <option value="New York" ${currentFilters.location === 'New York' ? 'selected' : ''}>New York</option>
          <option value="San Francisco" ${currentFilters.location === 'San Francisco' ? 'selected' : ''}>San Francisco</option>
          <option value="London" ${currentFilters.location === 'London' ? 'selected' : ''}>London</option>
          <option value="Berlin" ${currentFilters.location === 'Berlin' ? 'selected' : ''}>Berlin</option>
          <option value="Austin" ${currentFilters.location === 'Austin' ? 'selected' : ''}>Austin</option>
        </select>
        
        <select id="modeFilter" class="input filter-input">
          <option value="">All Modes</option>
          <option value="Remote" ${currentFilters.mode === 'Remote' ? 'selected' : ''}>Remote</option>
          <option value="Hybrid" ${currentFilters.mode === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
          <option value="Onsite" ${currentFilters.mode === 'Onsite' ? 'selected' : ''}>Onsite</option>
        </select>
        
        <select id="experienceFilter" class="input filter-input">
          <option value="">All Levels</option>
          <option value="Entry" ${currentFilters.experience === 'Entry' ? 'selected' : ''}>Entry</option>
          <option value="Mid" ${currentFilters.experience === 'Mid' ? 'selected' : ''}>Mid</option>
          <option value="Senior" ${currentFilters.experience === 'Senior' ? 'selected' : ''}>Senior</option>
          <option value="Lead" ${currentFilters.experience === 'Lead' ? 'selected' : ''}>Lead</option>
        </select>
        
        <select id="sourceFilter" class="input filter-input">
          <option value="">All Sources</option>
          <option value="LinkedIn" ${currentFilters.source === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
          <option value="Indeed" ${currentFilters.source === 'Indeed' ? 'selected' : ''}>Indeed</option>
          <option value="Glassdoor" ${currentFilters.source === 'Glassdoor' ? 'selected' : ''}>Glassdoor</option>
        </select>
        
        <select id="statusFilter" class="input filter-input">
          <option value="">All Statuses</option>
          <option value="Not Applied" ${currentFilters.status === 'Not Applied' ? 'selected' : ''}>Not Applied</option>
          <option value="Applied" ${currentFilters.status === 'Applied' ? 'selected' : ''}>Applied</option>
          <option value="Rejected" ${currentFilters.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          <option value="Selected" ${currentFilters.status === 'Selected' ? 'selected' : ''}>Selected</option>
        </select>
        
        <select id="sortBy" class="input filter-input">
          <option value="latest" ${currentSort === 'latest' ? 'selected' : ''}>Latest</option>
          <option value="matchScore" ${currentSort === 'matchScore' ? 'selected' : ''}>Match Score</option>
          <option value="salary" ${currentSort === 'salary' ? 'selected' : ''}>Salary</option>
        </select>
        
        ${preferences ? `
          <label class="checkbox-label toggle-label">
            <input type="checkbox" id="showOnlyMatches" ${currentFilters.showOnlyMatches ? 'checked' : ''}>
            Show only jobs above my threshold
          </label>
        ` : ''}
      </div>
      
      <div id="jobList"></div>
    </div>
  `;
  
  // Attach filter listeners
  document.getElementById('keywordFilter').addEventListener('input', (e) => {
    currentFilters.keyword = e.target.value;
    renderJobList();
  });
  
  document.getElementById('locationFilter').addEventListener('change', (e) => {
    currentFilters.location = e.target.value;
    renderJobList();
  });
  
  document.getElementById('modeFilter').addEventListener('change', (e) => {
    currentFilters.mode = e.target.value;
    renderJobList();
  });
  
  document.getElementById('experienceFilter').addEventListener('change', (e) => {
    currentFilters.experience = e.target.value;
    renderJobList();
  });
  
  document.getElementById('sourceFilter').addEventListener('change', (e) => {
    currentFilters.source = e.target.value;
    renderJobList();
  });
  
  document.getElementById('statusFilter').addEventListener('change', (e) => {
    currentFilters.status = e.target.value;
    renderJobList();
  });
  
  document.getElementById('sortBy').addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderJobList();
  });
  
  if (preferences) {
    document.getElementById('showOnlyMatches').addEventListener('change', (e) => {
      currentFilters.showOnlyMatches = e.target.checked;
      renderJobList();
    });
  }
  
  renderJobList();
}

function renderJobList() {
  const container = document.getElementById('jobList');
  const preferences = getPreferences();
  
  let jobs = [...sampleJobs];
  
  // Calculate match scores and add status
  jobs = jobs.map(job => ({
    ...job,
    matchScore: calculateMatchScore(job, preferences),
    status: getJobStatus(job.id)
  }));
  
  // Apply filters (AND logic)
  jobs = jobs.filter(job => {
    if (currentFilters.keyword) {
      const keyword = currentFilters.keyword.toLowerCase();
      const matchesKeyword = 
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.description.toLowerCase().includes(keyword);
      if (!matchesKeyword) return false;
    }
    
    if (currentFilters.location && job.location !== currentFilters.location) return false;
    if (currentFilters.mode && job.mode !== currentFilters.mode) return false;
    if (currentFilters.experience && job.experience !== currentFilters.experience) return false;
    if (currentFilters.source && job.source !== currentFilters.source) return false;
    if (currentFilters.status && job.status !== currentFilters.status) return false;
    
    if (currentFilters.showOnlyMatches && preferences) {
      if (job.matchScore < preferences.minMatchScore) return false;
    }
    
    return true;
  });
  
  // Apply sorting
  if (currentSort === 'latest') {
    jobs.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
  } else if (currentSort === 'matchScore') {
    jobs.sort((a, b) => b.matchScore - a.matchScore);
  } else if (currentSort === 'salary') {
    jobs.sort((a, b) => {
      const salaryA = extractSalary(a.salary);
      const salaryB = extractSalary(b.salary);
      return salaryB - salaryA;
    });
  }
  
  // Render jobs or empty state
  if (jobs.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state__title">No roles match your criteria</h3>
        <p class="empty-state__message">Adjust filters or lower threshold to see more opportunities.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = jobs.map(job => `
    <div class="card job-card">
      <div class="job-card__header">
        <div>
          <h3 class="job-card__title">${job.title}</h3>
          <p class="job-card__company">${job.company} • ${job.location} • ${job.mode}</p>
        </div>
        <div class="job-card__badges">
          ${preferences ? `<span class="badge ${getScoreBadgeClass(job.matchScore)}">${getScoreBadgeText(job.matchScore)}</span>` : ''}
          <span class="badge ${getStatusBadgeClass(job.status)}">${job.status}</span>
        </div>
      </div>
      <p class="job-card__description">${job.description}</p>
      <div class="job-card__meta">
        <span class="job-card__meta-item">${job.experience}</span>
        <span class="job-card__meta-item">${job.skills.join(', ')}</span>
        <span class="job-card__meta-item">${job.postedDaysAgo}d ago</span>
        <span class="job-card__meta-item">${job.source}</span>
        ${job.salary ? `<span class="job-card__meta-item">${job.salary}</span>` : ''}
      </div>
      <div class="job-card__actions">
        ${renderStatusButtons(job.id, job.status, job.title, job.company)}
      </div>
    </div>
  `).join('');
}

function extractSalary(salaryStr) {
  if (!salaryStr) return 0;
  const match = salaryStr.match(/\$(\d+)k/);
  return match ? parseInt(match[1]) : 0;
}
