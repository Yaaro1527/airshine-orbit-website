/**
 * Mobile menu toggle functionality
 */

export function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenu = document.getElementById('close-menu');
  const menuOverlay = document.getElementById('menu-overlay');

  function openMenu() {
    mobileMenu.classList.add('open');
    menuOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  closeMenu.addEventListener('click', closeMobileMenu);
  menuOverlay.addEventListener('click', closeMobileMenu);

  // Close menu when a link is clicked
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}
