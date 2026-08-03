import nodemailer from 'nodemailer';

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM_NAME, SMTP_FROM_EMAIL, SITE_URL } = process.env;

const rateLimitMap = new Map();

const smtpPort = Number(SMTP_PORT || 587);
const smtpSecure = typeof process.env.SMTP_SECURE !== 'undefined'
  ? String(process.env.SMTP_SECURE).toLowerCase() === 'true'
  : smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: smtpPort,
  secure: smtpSecure,
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
  const method = (event && (event.httpMethod || event.method || event.request?.method || event.headers?.['x-http-method-override'] || event.headers?.['X-Http-Method-Override'])) || '';

  const getHeaderValue = (hdrs, key) => {
    if (!hdrs || !key) return undefined;
    if (typeof hdrs.get === 'function') {
      return hdrs.get(key) || hdrs.get(key.toLowerCase());
    }
    if (typeof hdrs === 'object') {
      return hdrs[key] || hdrs[key.toLowerCase()];
    }
    return undefined;
  };

  const safeHeaderDump = (hdrs) => {
    if (!hdrs) return {};
    try {
      if (typeof hdrs.entries === 'function') {
        const result = {};
        for (const [key, value] of hdrs.entries()) {
          result[key] = value;
        }
        return result;
      }
      return Object.keys(hdrs).reduce((acc, k) => {
        const v = hdrs[k];
        acc[k] = (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') ? v : String(v);
        return acc;
      }, {});
    } catch (e) {
      return { _error: String(e) };
    }
  };

  const buildBodySample = async () => {
    if (typeof event.body === 'string') return event.body.slice(0, 100);
    if (event.body && typeof event.body === 'object') {
      if (typeof event.body.text === 'function') {
        try {
          return (await event.body.text()).slice(0, 100);
        } catch (e) {
          return String(event.body).slice(0, 100);
        }
      }
      if (typeof event.body.arrayBuffer === 'function') {
        try {
          const buffer = await event.body.arrayBuffer();
          return new TextDecoder('utf-8').decode(buffer).slice(0, 100);
        } catch (e) {
          return String(event.body).slice(0, 100);
        }
      }
      return String(event.body).slice(0, 100);
    }
    if (event.request && typeof event.request.text === 'function') {
      try {
        return (await event.request.text()).slice(0, 100);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const parseTextBody = async (body) => {
    try {
      const text = await body.text();
      return JSON.parse(text || '{}');
    } catch (e) {
      try {
        if (typeof body.arrayBuffer === 'function') {
          const buffer = await body.arrayBuffer();
          const decoded = new TextDecoder('utf-8').decode(buffer);
          return JSON.parse(decoded || '{}');
        }
      } catch (secondError) {
        return {};
      }
      return {};
    }
  };

  const parseBody = async () => {
    if (typeof event.body === 'string') {
      try {
        return JSON.parse(event.body || '{}');
      } catch (e) {
        return {};
      }
    }

    if (event.body && typeof event.body === 'object') {
        // If the runtime exposes event.json() (common with Netlify's adapters)
        // prefer that for ReadableStream bodies so we correctly parse the JSON.
        if (typeof event.json === 'function') {
          try {
            return await event.json();
          } catch (e) {
            // fallthrough to try other parsing strategies
          }
        }

        if (typeof event.body.json === 'function') {
          try {
            return await event.body.json();
          } catch (e) {
            return await parseTextBody(event.body);
          }
        }
      if (typeof event.body.text === 'function') {
        return await parseTextBody(event.body);
      }
      if (typeof event.body.arrayBuffer === 'function') {
        return await parseTextBody(event.body);
      }
      if (ArrayBuffer.isView(event.body) || event.body instanceof ArrayBuffer) {
        try {
          const decoded = new TextDecoder('utf-8').decode(event.body);
          return JSON.parse(decoded || '{}');
        } catch (e) {
          return {};
        }
      }
      return event.body;
    }

    if (event.request && typeof event.request.json === 'function') {
      try {
        return await event.request.json();
      } catch (e) {
        try {
          return JSON.parse(await event.request.text() || '{}');
        } catch (err) {
          return {};
        }
      }
    }

    if (typeof event.json === 'function') {
      try {
        return await event.json();
      } catch (e) {
        return {};
      }
    }

    return {};
  };

  const debugRequested = Boolean(
    (event.headers && (getHeaderValue(event.headers, 'x-debug') === '1' || getHeaderValue(event.headers, 'X-Debug') === '1')) ||
    event.queryStringParameters?.debug === '1' ||
    event.query?.debug === '1' ||
    (typeof event.url === 'string' && event.url.includes('debug=1'))
  );

  if (debugRequested) {
    const bodySample = await buildBodySample();
    const bodyConstructor = event.body && event.body.constructor ? event.body.constructor.name : null;
    const bodyIsReadable = event.body && (typeof event.body.text === 'function' || typeof event.body.arrayBuffer === 'function');
    return new Response(JSON.stringify({
      debug: true,
      methodCandidates: {
        httpMethod: event.httpMethod,
        method: event.method,
        requestMethod: event.request?.method,
        headerOverride: getHeaderValue(event.headers, 'x-http-method-override') || getHeaderValue(event.headers, 'X-Http-Method-Override')
      },
      detected: method,
      headers: safeHeaderDump(event.headers),
      requestHeaders: safeHeaderDump(event.request?.headers),
      bodySample,
      bodyConstructor,
      bodyIsReadable,
      eventShape: {
        bodyType: typeof event.body,
        hasRequest: Boolean(event.request),
        hasJson: typeof event.json === 'function',
        hasRequestJson: typeof event.request?.json === 'function',
        hasRequestText: typeof event.request?.text === 'function'
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (String(method).toUpperCase() !== 'POST') {
    return new Response(JSON.stringify({ success: false, message: 'Method not allowed.' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const bodyObj = await parseBody();
    const payload = {
      name: sanitize(bodyObj.name),
      email: sanitize(bodyObj.email),
      phone: sanitize(bodyObj.phone),
      subject: sanitize(bodyObj.subject),
      message: sanitize(bodyObj.message),
      recipient: sanitize(bodyObj.recipient)
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
