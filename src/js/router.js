/**
 * Simple hash-based router for Airshine Orbit Solutions
 * Handles page navigation without full page reloads.
 */

export function initRouter() {
  function navigate() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const pages = document.querySelectorAll('.page');

    pages.forEach(p => p.classList.remove('active'));

    const target = document.getElementById('page-' + hash);
    if (target) {
      target.classList.add('active');
      target.classList.add('fade-in');
      setTimeout(() => target.classList.remove('fade-in'), 500);
    } else {
      document.getElementById('page-home').classList.add('active');
    }

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === hash) {
        link.classList.add('active');
      }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Re-init AOS animations
    if (window.AOS) {
      setTimeout(() => window.AOS.refresh(), 100);
    }
  }

  window.addEventListener('hashchange', navigate);
  window.addEventListener('load', navigate);

  // Initial navigation
  navigate();
}
