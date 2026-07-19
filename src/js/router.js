/**
 * Router for Airshine Orbit Solutions
 * Supports hash-based pages plus dedicated service detail routes.
 */

import { services } from './services-data.js';

function getServiceBySlug(slug) {
  return services.find(service => service.slug === slug) || null;
}

function getActivePageKey() {
  const pathname = window.location.pathname;
  const hash = window.location.hash.replace('#', '');

  if (pathname.startsWith('/services/')) {
    return 'service-detail';
  }

  if (pathname === '/services') {
    return 'services';
  }

  return hash || 'home';
}

function getServiceSlugFromPath() {
  const pathname = window.location.pathname;
  const match = pathname.match(/^\/services\/([^/]+)\/?.*$/);
  return match ? match[1] : null;
}

function renderServiceDetailPage(slug) {
  const container = document.getElementById('service-detail-content');
  if (!container) return;

  const service = getServiceBySlug(slug);
  if (!service) {
    container.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="glass-card-strong rounded-3xl p-10 text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-3">Service Not Found</h1>
          <p class="text-gray-600">The requested service page could not be found.</p>
        </div>
      </div>
    `;
    return;
  }

  const featuresMarkup = service.features.map((feature, index) => `
    <div class="glass-card-strong rounded-2xl p-6" data-aos="fade-up" data-aos-delay="${index * 70}">
      <div class="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
        <i class="fas ${feature.icon} text-primary-600"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">${feature.title}</h3>
      <p class="text-sm text-gray-600 leading-relaxed">${feature.description}</p>
    </div>
  `).join('');

  const benefitsMarkup = service.benefits.map((benefit, index) => `
    <div class="glass-card-strong rounded-2xl p-6" data-aos="fade-up" data-aos-delay="${index * 70}">
      <h3 class="font-semibold text-gray-900 mb-2">${benefit.title}</h3>
      <p class="text-sm text-gray-600 leading-relaxed">${benefit.description}</p>
    </div>
  `).join('');

  const processMarkup = service.process.map((step, index) => `
    <div class="glass-card-strong rounded-2xl p-6 text-center" data-aos="fade-up" data-aos-delay="${index * 70}">
      <div class="w-10 h-10 mx-auto rounded-full bg-primary-100 text-primary-700 font-semibold flex items-center justify-center mb-3">${index + 1}</div>
      <h3 class="font-semibold text-gray-900 mb-2">${step.title}</h3>
      <p class="text-sm text-gray-600 leading-relaxed">${step.description}</p>
    </div>
  `).join('');

  const technologiesMarkup = service.technologies.map((tech) => `<span class="inline-flex items-center rounded-full border border-primary-100 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-700">${tech}</span>`).join('');
  const industriesMarkup = service.industries.map((industry) => `<li class="flex items-center gap-2 text-gray-600"><i class="fas fa-check-circle text-primary-500"></i><span>${industry}</span></li>`).join('');
  const whyChooseMarkup = service.whyChoose.map((item, index) => `
    <div class="glass-card-strong rounded-2xl p-6" data-aos="fade-up" data-aos-delay="${index * 70}">
      <div class="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
        <i class="fas ${item.icon} text-primary-600"></i>
      </div>
      <h3 class="font-semibold text-gray-900 mb-2">${item.title}</h3>
      <p class="text-sm text-gray-600 leading-relaxed">${item.description}</p>
    </div>
  `).join('');

  const faqsMarkup = service.faqs.map((faq, index) => `
    <div class="glass-card-strong rounded-2xl p-6" data-aos="fade-up" data-aos-delay="${index * 70}">
      <h3 class="font-semibold text-gray-900 mb-3">${faq.q}</h3>
      <p class="text-sm text-gray-600 leading-relaxed">${faq.a}</p>
    </div>
  `).join('');

  const relatedMarkup = services.filter((item) => item.slug !== service.slug).slice(0, 3).map((item) => `
    <a href="/services/${item.slug}" class="glass-card-strong rounded-2xl p-6 text-left card-hover transition" data-service-link="true">
      <h3 class="font-semibold text-gray-900 mb-2">${item.title}</h3>
      <p class="text-sm text-gray-600">${item.description}</p>
    </a>
  `).join('');

  container.innerHTML = `
    <section class="bg-sky-light py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-sm text-gray-500"><a href="/" class="text-primary-600 hover:underline">Home</a> / <a href="/#services" class="text-primary-600 hover:underline">Services</a> / <span class="text-gray-700 font-medium">${service.title}</span></p>
      </div>
    </section>

    <section class="py-16 lg:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center">
          <div data-aos="fade-right">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-3">Professional Service</p>
            <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">${service.title}</h1>
            <p class="text-lg text-primary-700 font-medium mb-4">${service.subtitle}</p>
            <p class="text-gray-600 leading-relaxed mb-8">${service.overview}</p>
            <div class="flex flex-wrap gap-4">
              <a href="#service-detail-contact" class="btn-primary text-white font-semibold px-7 py-3 rounded-full inline-flex items-center gap-2">Get Quote <i class="fas fa-arrow-right"></i></a>
              <a href="#service-detail-contact" class="btn-outline font-semibold px-7 py-3 rounded-full inline-flex items-center gap-2">Contact Us</a>
            </div>
          </div>
          <div class="glass-card-strong rounded-[2rem] p-6 lg:p-8" data-aos="fade-left">
            <div class="rounded-[1.5rem] bg-gradient-to-br from-primary-50 via-white to-blue-100 p-4 lg:p-6">
              ${service.heroIllustration}
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-sky-light">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-10" data-aos="fade-up">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-2">Service Overview</p>
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900">Professional support designed for accuracy, speed, and business growth.</h2>
        </div>
        <div class="grid lg:grid-cols-2 gap-6">
          <div class="glass-card-strong rounded-2xl p-8" data-aos="fade-up">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">What We Deliver</h3>
            <p class="text-gray-600 leading-relaxed">${service.overview}</p>
          </div>
          <div class="glass-card-strong rounded-2xl p-8" data-aos="fade-up" data-aos-delay="100">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Business Value</h3>
            <p class="text-gray-600 leading-relaxed">Our approach helps organizations reduce manual effort, improve control, make better decisions, and scale operations with confidence.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-10" data-aos="fade-up">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-2">Key Features</p>
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900">Built around quality, efficiency, and adaptability.</h2>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${featuresMarkup}</div>
      </div>
    </section>

    <section class="py-16 bg-sky-light">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-10" data-aos="fade-up">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-2">Business Benefits</p>
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900">Why this service creates measurable value.</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-6">${benefitsMarkup}</div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-10" data-aos="fade-up">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-2">Our Process</p>
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900">A structured workflow from consultation to delivery.</h2>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-6">${processMarkup}</div>
      </div>
    </section>

    <section class="py-16 bg-sky-light">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-10" data-aos="fade-up">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-2">Technologies & Tools</p>
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900">Solutions delivered with modern platforms and trusted tools.</h2>
        </div>
        <div class="flex flex-wrap gap-3">${technologiesMarkup}</div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-10" data-aos="fade-up">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-2">Industries We Serve</p>
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900">Trusted across organizations of all sizes and sectors.</h2>
        </div>
        <ul class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">${industriesMarkup}</ul>
      </div>
    </section>

    <section class="py-16 bg-sky-light">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-10" data-aos="fade-up">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-2">Why Choose Us</p>
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900">A dependable partner for high-quality service delivery.</h2>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${whyChooseMarkup}</div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-10" data-aos="fade-up">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-2">Frequently Asked Questions</p>
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900">Answers to common questions about this service.</h2>
        </div>
        <div class="grid gap-6">${faqsMarkup}</div>
      </div>
    </section>

    <section id="service-detail-contact" class="py-16 bg-sky-light">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-10 items-start">
          <div data-aos="fade-right">
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-2">Contact Us</p>
            <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Ready to discuss your requirements?</h2>
            <p class="text-gray-600 leading-relaxed mb-6">Our team can help you evaluate the right approach for your business goals and timelines.</p>
            <div class="space-y-4">
              <div class="flex items-start gap-3"><i class="fas fa-phone text-primary-600 mt-1"></i><div><p class="font-semibold text-gray-900">Phone</p><p class="text-sm text-gray-600">+91 73853 83911</p><p class="text-sm text-gray-600">+91 98217 07551</p></div></div>
              <div class="flex items-start gap-3"><i class="fas fa-headset text-primary-600 mt-1"></i><div><p class="font-semibold text-gray-900">Customer Service</p><p class="text-sm text-gray-600">9373990262</p></div></div>
              <div class="flex items-start gap-3"><i class="fas fa-envelope text-primary-600 mt-1"></i><div><p class="font-semibold text-gray-900">Email</p><p class="text-sm text-gray-600">airshineorbitsolutions@gmail.com</p></div></div>
              <div class="flex items-start gap-3"><i class="fas fa-map-marker-alt text-primary-600 mt-1"></i><div><p class="font-semibold text-gray-900">Address</p><p class="text-sm text-gray-600">Chiplun, Maharashtra, India</p></div></div>
            </div>
          </div>
          <div class="glass-card-strong rounded-2xl p-8" data-aos="fade-left">
            <form data-contact-form="true" class="space-y-4 service-detail-contact-form">
              <input type="text" name="name" data-required="true" data-label="Full Name" placeholder="Your Name" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition text-sm">
              <p class="text-sm text-red-600 hidden" data-error-for="name"></p>
              <input type="email" name="email" data-required="true" data-type="email" data-label="Email Address" placeholder="Your Email" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition text-sm">
              <p class="text-sm text-red-600 hidden" data-error-for="email"></p>
              <input type="tel" name="phone" data-required="true" data-type="phone" data-label="Phone Number" placeholder="Phone Number" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition text-sm">
              <p class="text-sm text-red-600 hidden" data-error-for="phone"></p>
              <input type="text" name="subject" data-required="true" data-label="Subject" placeholder="Service Interest" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition text-sm">
              <p class="text-sm text-red-600 hidden" data-error-for="subject"></p>
              <textarea name="message" data-required="true" data-label="Message" rows="4" placeholder="Tell us about your project" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition text-sm resize-none"></textarea>
              <p class="text-sm text-red-600 hidden" data-error-for="message"></p>
              <input type="text" name="company" class="hidden" tabindex="-1" autocomplete="off">
              <div class="form-message hidden" role="status" aria-live="polite"></div>
              <button type="submit" class="w-full btn-primary text-white font-semibold py-3 rounded-lg text-sm">Request a Consultation</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mb-10" data-aos="fade-up">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 mb-2">Related Services</p>
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900">Explore other solutions we offer.</h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">${relatedMarkup}</div>
      </div>
    </section>
  `;

  if (window.AOS) {
    setTimeout(() => window.AOS.refresh(), 120);
  }
}

export function initRouter() {
  function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active', 'fade-in'));
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.add('active', 'fade-in');
      setTimeout(() => target.classList.remove('fade-in'), 500);
    }
  }

  function navigate() {
    const pageKey = getActivePageKey();
    const serviceSlug = getServiceSlugFromPath();

    if (serviceSlug) {
      showPage('page-service-detail');
      renderServiceDetailPage(serviceSlug);
      document.title = `${getServiceBySlug(serviceSlug)?.title || 'Service'} | Airshine Orbit Solutions`;
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === 'services') {
          link.classList.add('active');
        }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.AOS) {
        setTimeout(() => window.AOS.refresh(), 120);
      }
      return;
    }

    if (pageKey === 'services') {
      showPage('page-services');
      document.title = 'Services | Airshine Orbit Solutions';
    } else if (pageKey === 'home') {
      showPage('page-home');
      document.title = 'Airshine Orbit Solutions | Data Management & IT Services';
    } else {
      const targetPage = document.getElementById('page-' + pageKey);
      if (targetPage) {
        showPage('page-' + pageKey);
        document.title = `${pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} | Airshine Orbit Solutions`;
      } else {
        showPage('page-home');
      }
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageKey) {
        link.classList.add('active');
      }
      if (pageKey === 'service-detail' && link.getAttribute('data-page') === 'services') {
        link.classList.add('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.AOS) {
      setTimeout(() => window.AOS.refresh(), 120);
    }
  }

  window.addEventListener('popstate', navigate);
  window.addEventListener('hashchange', navigate);
  window.addEventListener('load', navigate);
  navigate();
}
