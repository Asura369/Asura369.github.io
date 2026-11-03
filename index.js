/* ===================================================================
   Kevin Lin — portfolio
   Reveal on scroll, rail scroll-spy + meter, mobile menu, email popup.
   =================================================================== */

(function () {
  'use strict';

  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.rail__link');
  const navToggle = document.getElementById('nav-toggle');
  const navPanel = document.getElementById('nav-links');
  const sections = document.querySelectorAll('section[id]');

  // ──────────────────────────────────────────────
  // 1. Scroll reveal
  // ──────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // ──────────────────────────────────────────────
  // 2. Rail: active section + scroll meter
  // ──────────────────────────────────────────────
  function updateRail() {
    const probe = window.innerHeight * 0.45;
    let current = '';

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= probe) current = section.id;
    });

    // At the very bottom the last section may never reach the probe line
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 120) {
      current = sections[sections.length - 1].id;
    }

    navLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      if (active) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    nav.style.setProperty('--p', progress.toFixed(4));
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateRail();
        ticking = false;
      });
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    updateRail();
    if (window.innerWidth > 900) closeMenu();
  });

  // ──────────────────────────────────────────────
  // 3. Mobile menu
  // ──────────────────────────────────────────────
  function closeMenu() {
    navToggle.classList.remove('open');
    navPanel.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    const open = navToggle.classList.toggle('open');
    navPanel.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));

  // ──────────────────────────────────────────────
  // 4. Email popup
  // ──────────────────────────────────────────────
  const emailBtn = document.getElementById('contact-email');
  const emailPopup = document.getElementById('email-popup');
  const emailCopyBtn = document.getElementById('email-copy');
  const emailAddress = document.getElementById('email-address');
  const copyIcon = document.getElementById('email-copy-icon');
  const checkIcon = document.getElementById('email-check-icon');

  function hidePopup() {
    emailPopup.classList.remove('visible');
    emailPopup.setAttribute('hidden', '');
  }

  emailBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const visible = emailPopup.classList.toggle('visible');
    if (visible) {
      emailPopup.removeAttribute('hidden');
    } else {
      emailPopup.setAttribute('hidden', '');
    }
  });

  emailCopyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(emailAddress.textContent).then(() => {
      emailCopyBtn.classList.add('copied');
      copyIcon.style.display = 'none';
      checkIcon.style.display = 'block';

      setTimeout(() => {
        emailCopyBtn.classList.remove('copied');
        copyIcon.style.display = 'block';
        checkIcon.style.display = 'none';
      }, 2000);
    });
  });

  document.addEventListener('click', (e) => {
    if (
      emailPopup.classList.contains('visible') &&
      !emailPopup.contains(e.target) &&
      e.target !== emailBtn
    ) {
      hidePopup();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    if (navPanel.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }

    if (emailPopup.classList.contains('visible')) {
      hidePopup();
      emailBtn.focus();
    }
  });

  updateRail();
})();
