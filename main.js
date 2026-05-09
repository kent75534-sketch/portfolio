/* main.js — Portfolio interactions */

// ── NAV SCROLL EFFECT ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
});

// ── MOBILE MENU ──
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── ACTIVE NAV LINK ──
const sections = ['executive', 'deals', 'expertise', 'narrative', 'contact'];
function updateActiveNav() {
  let current = 'executive';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}
updateActiveNav();

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll(
  '.deal-card-mini, .deal-detail-card, .competency-card, .tools-row, .timeline-item, .edu-card, .info-card, .resource-item, .achievement-item, .linkedin-block, .quote-block, .proj-item, .cert-item'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// ── FORM SUBMIT ──
// Replace YOUR_FORM_ID below with your actual Formspree form ID
// Get it free at: https://formspree.io → New Form → copy the ID from the endpoint URL
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkoyqjad';

document.getElementById('inquiryForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  const originalText = btn.textContent;

  // Collect form data
  const data = {
    firstName: document.getElementById('firstName').value,
    lastName:  document.getElementById('lastName').value,
    organisation: document.getElementById('organisation').value,
    email: document.getElementById('email').value,
    inquiryType: document.getElementById('inquiryType').value,
    message: document.getElementById('message').value,
  };

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      btn.textContent = 'Inquiry Sent ✓';
      btn.style.background = '#5A7A5A';
      e.target.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    } else {
      throw new Error('Server error');
    }
  } catch (err) {
    btn.textContent = 'Failed — try email directly';
    btn.style.background = '#8B3A3A';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
  }
});

// ── SMOOTH NAV SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
