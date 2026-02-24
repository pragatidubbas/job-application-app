/**
 * Daily Digest Engine
 * Generates and persists top 10 job matches
 */

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `jobTrackerDigest_${year}-${month}-${day}`;
}

function getTodayDate() {
  const today = new Date();
  return today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

function getDigest() {
  const key = getTodayKey();
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

function generateDigest() {
  const preferences = getPreferences();
  if (!preferences) return null;
  
  let jobs = [...sampleJobs];
  
  // Calculate match scores
  jobs = jobs.map(job => ({
    ...job,
    matchScore: calculateMatchScore(job, preferences)
  }));
  
  // Sort by matchScore descending, then postedDaysAgo ascending
  jobs.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.postedDaysAgo - b.postedDaysAgo;
  });
  
  // Take top 10
  const topJobs = jobs.slice(0, 10);
  
  const digest = {
    date: getTodayDate(),
    jobs: topJobs,
    generatedAt: new Date().toISOString()
  };
  
  // Store in localStorage
  const key = getTodayKey();
  localStorage.setItem(key, JSON.stringify(digest));
  
  return digest;
}

function renderDigest(container) {
  const preferences = getPreferences();
  
  if (!preferences) {
    container.innerHTML = `
      <div class="route-container">
        <h1 class="route-container__title">Digest</h1>
        <div class="banner spacing-md">
          <p class="banner__message">Set preferences to generate a personalized digest.</p>
          <a href="/settings" class="btn btn-primary" data-route="/settings">Go to Settings</a>
        </div>
      </div>
    `;
    return;
  }
  
  let digest = getDigest();
  
  container.innerHTML = `
    <div class="route-container">
      <h1 class="route-container__title">Digest</h1>
      <p class="route-container__subtitle">Your personalized daily job digest.</p>
      
      <div class="spacing-md">
        <button class="btn btn-primary" id="generateDigest">Generate Today's 9AM Digest (Simulated)</button>
        ${digest ? `
          <button class="btn btn-secondary" id="copyDigest">Copy Digest to Clipboard</button>
          <button class="btn btn-secondary" id="emailDigest">Create Email Draft</button>
        ` : ''}
      </div>
      
      <p class="text-small text-secondary spacing-md">Demo Mode: Daily 9AM trigger simulated manually.</p>
      
      <div id="digestContent"></div>
    </div>
  `;
  
  document.getElementById('generateDigest').addEventListener('click', () => {
    digest = generateDigest();
    if (digest) {
      renderDigest(container);
      showNotification('Digest generated successfully');
    } else {
      showNotification('Failed to generate digest');
    }
  });
  
  if (digest) {
    if (document.getElementById('copyDigest')) {
      document.getElementById('copyDigest').addEventListener('click', () => {
        copyDigestToClipboard(digest);
      });
    }
    
    if (document.getElementById('emailDigest')) {
      document.getElementById('emailDigest').addEventListener('click', () => {
        createEmailDraft(digest);
      });
    }
    
    renderDigestContent(digest);
  }
}

function renderDigestContent(digest) {
  const digestContainer = document.getElementById('digestContent');
  
  if (!digest || digest.jobs.length === 0) {
    digestContainer.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state__title">No matching roles today</h3>
        <p class="empty-state__message">Check again tomorrow.</p>
      </div>
    `;
    return;
  }
  
  digestContainer.innerHTML = `
    <div class="digest-email">
      <div class="digest-email__header">
        <h2 class="digest-email__title">Top 10 Jobs For You — 9AM Digest</h2>
        <p class="digest-email__date">${digest.date}</p>
      </div>
      
      <div class="digest-email__body">
        ${digest.jobs.map((job, index) => `
          <div class="digest-job">
            <div class="digest-job__header">
              <span class="digest-job__number">${index + 1}</span>
              <div class="digest-job__info">
                <h3 class="digest-job__title">${job.title}</h3>
                <p class="digest-job__company">${job.company}</p>
              </div>
              <span class="badge ${getScoreBadgeClass(job.matchScore)}">${getScoreBadgeText(job.matchScore)}</span>
            </div>
            <div class="digest-job__details">
              <span>${job.location}</span>
              <span>${job.mode}</span>
              <span>${job.experience}</span>
              ${job.salary ? `<span>${job.salary}</span>` : ''}
            </div>
            <button class="btn btn-secondary digest-job__apply" onclick="window.open('#', '_blank')">Apply</button>
          </div>
        `).join('')}
      </div>
      
      <div class="digest-email__footer">
        <p class="text-small text-secondary">This digest was generated based on your preferences.</p>
      </div>
    </div>
  `;
}

function renderDigestContent(digest) {
  const digestContainer = document.getElementById('digestContent');
  
  if (!digest || digest.jobs.length === 0) {
    digestContainer.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state__title">No matching roles today</h3>
        <p class="empty-state__message">Check again tomorrow.</p>
      </div>
    `;
    return;
  }
  
  digestContainer.innerHTML = `
    <div class="digest-email">
      <div class="digest-email__header">
        <h2 class="digest-email__title">Top 10 Jobs For You — 9AM Digest</h2>
        <p class="digest-email__date">${digest.date}</p>
      </div>
      
      <div class="digest-email__body">
        ${digest.jobs.map((job, index) => `
          <div class="digest-job">
            <div class="digest-job__header">
              <span class="digest-job__number">${index + 1}</span>
              <div class="digest-job__info">
                <h3 class="digest-job__title">${job.title}</h3>
                <p class="digest-job__company">${job.company}</p>
              </div>
              <span class="badge ${getScoreBadgeClass(job.matchScore)}">${getScoreBadgeText(job.matchScore)}</span>
            </div>
            <div class="digest-job__details">
              <span>${job.location}</span>
              <span>${job.mode}</span>
              <span>${job.experience}</span>
              ${job.salary ? `<span>${job.salary}</span>` : ''}
            </div>
            <button class="btn btn-secondary digest-job__apply" onclick="window.open('#', '_blank')">Apply</button>
          </div>
        `).join('')}
      </div>
      
      <div class="digest-email__footer">
        <p class="text-small text-secondary">This digest was generated based on your preferences.</p>
      </div>
    </div>
  `;
}

function copyDigestToClipboard(digest) {
  const text = formatDigestAsText(digest);
  navigator.clipboard.writeText(text).then(() => {
    showNotification('Digest copied to clipboard');
  }).catch(() => {
    showNotification('Failed to copy digest');
  });
}

function formatDigestAsText(digest) {
  let text = `Top 10 Jobs For You — 9AM Digest\n`;
  text += `${digest.date}\n\n`;
  
  digest.jobs.forEach((job, index) => {
    text += `${index + 1}. ${job.title}\n`;
    text += `   ${job.company}\n`;
    text += `   ${job.location} • ${job.mode} • ${job.experience}\n`;
    text += `   Match Score: ${job.matchScore}%\n`;
    if (job.salary) text += `   ${job.salary}\n`;
    text += `\n`;
  });
  
  text += `This digest was generated based on your preferences.\n`;
  return text;
}

function createEmailDraft(digest) {
  const subject = encodeURIComponent('My 9AM Job Digest');
  const body = encodeURIComponent(formatDigestAsText(digest));
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
