/**
 * Simple Client-Side Router
 * No page reloads, clean navigation
 */

const routes = {
  '/': {
    title: 'Dashboard',
    subtitle: 'This section will be built in the next step.'
  },
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'This section will be built in the next step.'
  },
  '/saved': {
    title: 'Saved',
    subtitle: 'This section will be built in the next step.'
  },
  '/digest': {
    title: 'Digest',
    subtitle: 'This section will be built in the next step.'
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'This section will be built in the next step.'
  },
  '/proof': {
    title: 'Proof',
    subtitle: 'This section will be built in the next step.'
  },
  '404': {
    title: 'Page Not Found',
    subtitle: 'The page you are looking for does not exist.'
  }
};

function renderRoute(path) {
  const route = routes[path] || routes['404'];
  const content = document.getElementById('app-content');
  
  updateActiveLink(path);
  document.title = `${route.title} - Job Notification App`;
  
  // Route-specific rendering
  if (path === '/settings') {
    renderSettings(content);
  } else if (path === '/' || path === '/dashboard') {
    renderDashboard(content);
  } else {
    content.innerHTML = `
      <div class="route-container">
        <h1 class="route-container__title">${route.title}</h1>
        <p class="route-container__subtitle">${route.subtitle}</p>
      </div>
    `;
  }
}

function updateActiveLink(path) {
  const links = document.querySelectorAll('.top-nav__link');
  links.forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === path || (path === '/dashboard' && route === '/')) {
      link.classList.add('top-nav__link--active');
    } else {
      link.classList.remove('top-nav__link--active');
    }
  });
}

function navigate(path) {
  window.history.pushState({}, '', path);
  renderRoute(path);
  closeMobileMenu();
}

function closeMobileMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.remove('top-nav__links--open');
}

// Handle navigation clicks
document.addEventListener('click', (e) => {
  if (e.target.matches('.top-nav__link')) {
    e.preventDefault();
    const path = e.target.getAttribute('data-route');
    navigate(path);
  }
});

// Handle browser back/forward
window.addEventListener('popstate', () => {
  renderRoute(window.location.pathname);
});

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('top-nav__links--open');
  });
  
  // Initial route render
  renderRoute(window.location.pathname);
});
