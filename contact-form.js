// KTM Contact / Enquiry Form Handler
// Paste your deployed Apps Script Web App URL here (ends in /exec):
const CONTACT_FORM_URL = 'https://script.google.com/macros/s/AKfycbwzPZQY6FFgsQOM2RUkaADKSOUJy5nSDnh1pv5u_lHjdN9uTMy3q56miMX7N-mexxx0eA/exec';
// Must match FORM_TOKEN in ContactFormBackend.gs
const FORM_TOKEN = 'ktm-2026-enquiry';

function ktmValidateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function ktmValidatePhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

function ktmSanitize(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>'"&]/g, (c) => ({
      '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '&': '&amp;'
    }[c] || c))
    .substring(0, 300);
}

function ktmSetStatus(el, type, text) {
  if (!el) return;
  el.textContent = text;
  el.className = 'form-note' + (type ? ' ' + type : '');
}

let ktmLastSubmission = 0;
const KTM_SUBMISSION_COOLDOWN = 15000; // 15 seconds between submissions

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const status = document.getElementById('enquiryStatus');
    const submitBtn = form.querySelector('button[type="submit"]');
    const now = Date.now();

    if (CONTACT_FORM_URL.startsWith('PASTE_')) {
      ktmSetStatus(status, 'err', "Enquiry form isn't connected yet — add your Apps Script URL to contact-form.js.");
      return;
    }

    // Honeypot — real visitors never touch this hidden field
    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value) {
      form.reset();
      ktmSetStatus(status, 'ok', "Thanks — we've received your enquiry and will be in touch shortly.");
      return;
    }

    if (now - ktmLastSubmission < KTM_SUBMISSION_COOLDOWN) {
      const wait = Math.ceil((KTM_SUBMISSION_COOLDOWN - (now - ktmLastSubmission)) / 1000);
      ktmSetStatus(status, 'err', `Please wait ${wait} seconds before submitting again.`);
      return;
    }

    const name    = form.name.value.trim();
    const phone   = form.phone.value.trim();
    const email   = form.email.value.trim();
    const article = form.article.value.trim();

    if (!name || !phone) {
      ktmSetStatus(status, 'err', 'Please fill in your name and phone number.');
      return;
    }
    if (name.length < 2 || name.length > 60) {
      ktmSetStatus(status, 'err', 'Name must be between 2 and 60 characters.');
      return;
    }
    if (!ktmValidatePhone(phone)) {
      ktmSetStatus(status, 'err', 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (email && !ktmValidateEmail(email)) {
      ktmSetStatus(status, 'err', 'Please enter a valid email address.');
      return;
    }

    const suspicious = /<script|javascript:|onerror=|onclick=|onload=|eval\(/gi;
    if (suspicious.test(name + email + article)) {
      ktmSetStatus(status, 'err', 'Invalid characters detected. Please remove any special code from your input.');
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    ktmSetStatus(status, '', 'Sending...');

    try {
      const formData = new URLSearchParams();
      formData.append('name', ktmSanitize(name));
      formData.append('phone', ktmSanitize(phone));
      formData.append('email', ktmSanitize(email));
      formData.append('article', ktmSanitize(article));
      formData.append('website', honeypot ? honeypot.value : '');
      formData.append('token', FORM_TOKEN);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(CONTACT_FORM_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (result.status === 'success') {
        ktmSetStatus(status, 'ok', "Thanks — we've received your enquiry and will be in touch shortly.");
        form.reset();
        ktmLastSubmission = now;
      } else {
        ktmSetStatus(status, 'err', result.message || 'Something went wrong. Please call us instead.');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        ktmSetStatus(status, 'err', 'Request timed out. Please check your connection and try again.');
      } else {
        ktmSetStatus(status, 'err', 'Something went wrong sending your enquiry. Please call us instead.');
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});