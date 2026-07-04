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
    const card = document.createElement('div');
    card.className = 'glass-card-strong rounded-xl p-6 card-hover';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', String((index % 3) * 100));
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

  services.forEach((service) => {
    const item = document.createElement('div');
    item.className = 'service-list-item';
    item.innerHTML = `
      <div class="service-icon flex-shrink-0"><i class="fas ${service.icon}"></i></div>
      <div>
        <h3 class="font-bold text-gray-900 mb-1">${service.title}</h3>
        <p class="text-sm text-gray-500">${service.description}</p>
      </div>
      <div class="hidden sm:block w-24 h-16 rounded-lg bg-gradient-to-br from-primary-100 to-primary-200 flex-shrink-0 ml-auto"></div>
    `;
    servicesList.appendChild(item);
  });
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

// ===== Contact Form Handler =====
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    form.reset();
  });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
  renderServiceCards();
  renderServicesList();
  initNavbarScroll();
  initContactForm();
  initMobileMenu();
  initRouter();
});
