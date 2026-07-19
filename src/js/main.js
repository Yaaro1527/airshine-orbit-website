/**
 * Main entry point for Airshine Orbit Solutions website
 * This file initializes all modules and renders dynamic content.
 */

import '../css/styles.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { services } from './services-data.js';
import { initRouter } from './router.js';
import { initMobileMenu } from './mobile-menu.js';
import { initContactForms } from './contact-form.js';

// ===== Initialize AOS (Animate On Scroll) =====
AOS.init({
  duration: 700,
  once: true,
  offset: 80
});

// ===== Render Home Page Service Cards =====
function renderServiceCards() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;

  services.forEach((service, index) => {
    const card = document.createElement('a');
    card.href = `/services/${service.slug}`;
    card.className = 'glass-card-strong rounded-xl p-6 card-hover block h-full';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((index % 3) * 100));
    card.setAttribute('data-service-link', 'true');
    card.innerHTML = `
      <div class="service-icon mb-4"><i class="fas ${service.icon}"></i></div>
      <h3 class="font-bold text-gray-900 mb-2">${service.title}</h3>
      <p class="text-sm text-gray-500 leading-relaxed">${service.description}</p>
    `;
    servicesGrid.appendChild(card);
  });
}

// ===== Render Services Page List =====
function renderServicesList() {
  const servicesList = document.getElementById('services-list');
  if (!servicesList) return;

  services.forEach((service, index) => {
    const item = document.createElement('a');
    item.href = `/services/${service.slug}`;
    item.className = 'service-list-item';
    item.setAttribute('data-aos', 'fade-up');
    item.setAttribute('data-aos-delay', String(index * 80));
    item.setAttribute('data-service-link', 'true');
    item.innerHTML = `
      <div class="service-icon flex-shrink-0"><i class="fas ${service.icon}"></i></div>
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-gray-900 mb-1">${service.title}</h3>
        <p class="text-sm text-gray-500">${service.description}</p>
      </div>
      <div class="service-visual hidden sm:flex flex-shrink-0 ml-auto" aria-hidden="true">
        ${service.illustration}
      </div>
    `;
    servicesList.appendChild(item);
  });

  AOS.refresh();
}

// ===== Navbar Shadow on Scroll =====
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 10) {
      navbar.classList.add('shadow-md');
    } else {
      navbar.classList.remove('shadow-md');
    }
  });
}

// ===== Service Link Navigation =====
function initServiceLinks() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-service-link]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || !href.startsWith('/services/')) return;

    event.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  renderServiceCards();
  renderServicesList();
  initNavbarScroll();
  initContactForms();
  initMobileMenu();
  initServiceLinks();
  initRouter();
});
