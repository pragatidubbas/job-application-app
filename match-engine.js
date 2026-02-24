/**
 * Match Score Engine
 * Deterministic scoring based on user preferences
 */

function calculateMatchScore(job, preferences) {
  if (!preferences) return 0;
  
  let score = 0;
  
  // +25 if any roleKeyword appears in job.title (case-insensitive)
  if (preferences.roleKeywords) {
    const keywords = preferences.roleKeywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
    const titleLower = (job.title || '').toLowerCase();
    if (keywords.some(keyword => titleLower.includes(keyword))) {
      score += 25;
    }
    
    // +15 if any roleKeyword appears in job.description
    const descLower = (job.description || '').toLowerCase();
    if (keywords.some(keyword => descLower.includes(keyword))) {
      score += 15;
    }
  }
  
  // +15 if job.location matches preferredLocations
  if (preferences.preferredLocations && preferences.preferredLocations.length > 0) {
    if (preferences.preferredLocations.includes(job.location)) {
      score += 15;
    }
  }
  
  // +10 if job.mode matches preferredMode
  if (preferences.preferredMode && preferences.preferredMode.length > 0) {
    if (preferences.preferredMode.includes(job.mode)) {
      score += 10;
    }
  }
  
  // +10 if job.experience matches experienceLevel
  if (preferences.experienceLevel && job.experience === preferences.experienceLevel) {
    score += 10;
  }
  
  // +15 if overlap between job.skills and user.skills (any match)
  if (preferences.skills && job.skills) {
    const userSkills = preferences.skills.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
    const jobSkills = (Array.isArray(job.skills) ? job.skills : job.skills.split(',')).map(s => s.trim().toLowerCase());
    const hasOverlap = userSkills.some(skill => jobSkills.includes(skill));
    if (hasOverlap) {
      score += 15;
    }
  }
  
  // +5 if postedDaysAgo <= 2
  if (job.postedDaysAgo !== undefined && job.postedDaysAgo <= 2) {
    score += 5;
  }
  
  // +5 if source is LinkedIn
  if (job.source && job.source.toLowerCase() === 'linkedin') {
    score += 5;
  }
  
  // Cap score at 100
  return Math.min(score, 100);
}

function getScoreBadgeClass(score) {
  if (score >= 80) return 'badge--success';
  if (score >= 60) return 'badge--warning';
  if (score >= 40) return 'badge--neutral';
  return 'badge--low';
}

function getScoreBadgeText(score) {
  return `${score}% Match`;
}
