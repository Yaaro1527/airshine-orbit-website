import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_NAME, SMTP_FROM_EMAIL, SITE_URL } = process.env;

const rateLimitMap = new Map();

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

function sanitize(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildCustomerHtml(name, email) {
  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="color: #2563eb;">Thank You for Contacting Airshine Orbit Solutions</h2>
      <p>Dear ${escapeHtml(name || 'Valued Customer')},</p>
      <p>Thank you for contacting Airshine Orbit Solutions.</p>
      <p>We have successfully received your enquiry and our team will review your message and get back to you as soon as possible.</p>
      <p>Regards,<br/>Airshine Orbit Solutions<br/>Email: ${escapeHtml(email || 'airshineorbitsolutions@gmail.com')}</p>
    </div>
  `;
}

function buildAdminHtml(payload) {
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  return `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <h2 style="color: #2563eb;">New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name || '')}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email || '')}</p>
      <p><strong>Phone:</strong> ${escapeHtml(payload.phone || '')}</p>
      <p><strong>Subject:</strong> ${escapeHtml(payload.subject || '')}</p>
      <p><strong>Message:</strong><br/>${escapeHtml(payload.message || '')}</p>
      <p><strong>Date & Time:</strong> ${escapeHtml(now)}</p>
      <p><strong>Source:</strong> ${escapeHtml(SITE_URL || 'Website')}</p>
    </div>
  `;
}

export default async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Method not allowed.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const payload = {
      name: sanitize(body.name),
      email: sanitize(body.email),
      phone: sanitize(body.phone),
      subject: sanitize(body.subject),
      message: sanitize(body.message),
      recipient: sanitize(body.recipient)
    };

    const forwardedFor = event.headers?.['x-forwarded-for'] || event.headers?.['client-ip'] || '';
    const clientIp = String(forwardedFor).split(',')[0].trim() || 'unknown';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000;
    const maxRequests = 5;
    const entry = rateLimitMap.get(clientIp) || { count: 0, resetAt: now + windowMs };

    if (now > entry.resetAt) {
      entry.count = 0;
      entry.resetAt = now + windowMs;
    }

    if (entry.count >= maxRequests) {
      return new Response(JSON.stringify({ success: false, message: 'Too many submissions. Please try again later.' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    }

    entry.count += 1;
    rateLimitMap.set(clientIp, entry);

    if (!payload.name || !payload.email || !payload.phone || !payload.subject || !payload.message) {
      return new Response(JSON.stringify({ success: false, message: 'Please complete all required fields.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return new Response(JSON.stringify({ success: false, message: 'Valid email is required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return new Response(JSON.stringify({ success: false, message: 'Email service is not configured.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const mailOptions = {
      from: `${SMTP_FROM_NAME || 'Airshine Orbit Solutions'} <${SMTP_FROM_EMAIL || SMTP_USER}>`,
      to: payload.recipient || 'airshineorbitsolutions@gmail.com',
      subject: `New Contact Form Submission: ${payload.subject}`,
      html: buildAdminHtml(payload)
    };

    const confirmationOptions = {
      from: `${SMTP_FROM_NAME || 'Airshine Orbit Solutions'} <${SMTP_FROM_EMAIL || SMTP_USER}>`,
      to: payload.email,
      subject: 'Thank You for Contacting Airshine Orbit Solutions',
      html: buildCustomerHtml(payload.name, payload.email)
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationOptions);

    return new Response(JSON.stringify({ success: true, message: 'Message delivered successfully.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message || 'Unable to send email.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
