const EMAIL_RECIPIENT = 'airshineorbitsolutions@gmail.com';

function setFieldError(form, fieldName, message) {
  const input = form.querySelector(`[name="${fieldName}"]`);
  const error = form.querySelector(`[data-error-for="${fieldName}"]`);
  if (!input || !error) return;

  input.classList.add('border-red-400', 'focus:border-red-500', 'focus:ring-red-200');
  input.classList.remove('border-gray-200', 'focus:border-primary-400', 'focus:ring-primary-100');
  error.textContent = message;
  error.classList.remove('hidden');
}

function clearFieldError(form, fieldName) {
  const input = form.querySelector(`[name="${fieldName}"]`);
  const error = form.querySelector(`[data-error-for="${fieldName}"]`);
  if (!input || !error) return;

  input.classList.remove('border-red-400', 'focus:border-red-500', 'focus:ring-red-200');
  input.classList.add('border-gray-200', 'focus:border-primary-400', 'focus:ring-primary-100');
  error.textContent = '';
  error.classList.add('hidden');
}

function showFormMessage(form, type, message) {
  const messageBox = form.querySelector('.form-message');
  if (!messageBox) return;

  messageBox.className = `form-message is-visible ${type}`;
  messageBox.innerHTML = message;
}

function clearFormMessages(form) {
  const messageBox = form.querySelector('.form-message');
  if (!messageBox) return;
  messageBox.className = 'form-message';
  messageBox.innerHTML = '';
}

function sanitize(value) {
  return String(value || '').trim().replace(/<[^>]*>/g, '');
}

function validateForm(form) {
  const fields = form.querySelectorAll('[data-required="true"]');
  const errors = [];

  fields.forEach((field) => {
    const name = field.getAttribute('name');
    const label = field.getAttribute('data-label') || name;
    const value = sanitize(field.value);
    const type = field.getAttribute('data-type') || 'text';

    clearFieldError(form, name);

    if (!value) {
      setFieldError(form, name, `${label} is required.`);
      errors.push(name);
      return;
    }

    if (type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setFieldError(form, name, 'Please enter a valid email address.');
        errors.push(name);
      }
    }

    if (type === 'phone') {
      const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,15}$/;
      if (!phonePattern.test(value)) {
        setFieldError(form, name, 'Please enter a valid phone number.');
        errors.push(name);
      }
    }
  });

  const honeypot = form.querySelector('[name="company"]');
  if (honeypot && honeypot.value) {
    errors.push('bot');
  }

  return errors;
}

function extractFormValues(form) {
  const data = new FormData(form);
  return {
    name: sanitize(data.get('name')),
    email: sanitize(data.get('email')),
    phone: sanitize(data.get('phone')),
    subject: sanitize(data.get('subject')),
    message: sanitize(data.get('message'))
  };
}

export function initContactForms() {
  const forms = document.querySelectorAll('[data-contact-form="true"]');

  forms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      clearFormMessages(form);
      const validationErrors = validateForm(form);
      if (validationErrors.length > 0) {
        showFormMessage(form, 'error', 'Please correct the highlighted fields and try again.');
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton?.textContent || 'Send Message';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="inline-flex items-center gap-2"><span class="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span> Sending...</span>';
      }

      try {
        const payload = extractFormValues(form);
        const response = await fetch('/.netlify/functions/send-contact-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, recipient: EMAIL_RECIPIENT })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(result.message || 'Unable to send your message.');
        }

        showFormMessage(form, 'success', '<strong>✅ Message Sent Successfully!</strong><br>Thank you for contacting Airshine Orbit Solutions.<br>Our team will contact you shortly.');
        form.reset();
      } catch (error) {
        showFormMessage(form, 'error', '<strong>Unable to send your message.</strong><br>Please try again later or contact us directly at <a href="mailto:airshineorbitsolutions@gmail.com" class="underline">airshineorbitsolutions@gmail.com</a>.');
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  });
}
