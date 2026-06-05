/* ===================================================================
   Kevin Lin — Portfolio JavaScript
   Scroll-reveal, nav active tracking, mobile menu
   =================================================================== */

(function () {
  'use strict';

  // ──────────────────────────────────────────────
  // 1. Scroll Reveal (IntersectionObserver)
  // ──────────────────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target); // animate once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show everything immediately
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // ──────────────────────────────────────────────
  // 2. Active Nav Link Tracking
  // ──────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const nav = document.getElementById('nav');

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const navHeight = nav.offsetHeight;

    let currentSection = '';

    sections.forEach((section) => {
      const top = section.offsetTop - navHeight - 100;
      const bottom = top + section.offsetHeight;

      if (scrollY >= top && scrollY < bottom) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentSection}`
      );
    });
  }

  // Throttle scroll handler for performance
  let scrollTicking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          updateActiveLink();
          updateNavBackground();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  // ──────────────────────────────────────────────
  // 3. Nav Background on Scroll
  // ──────────────────────────────────────────────
  function updateNavBackground() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  // ──────────────────────────────────────────────
  // 4. Mobile Nav Toggle
  // ──────────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.toggle('open');
    navLinksContainer.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navLinksContainer.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close mobile menu
      if (navLinksContainer.classList.contains('open')) {
        navToggle.classList.remove('open');
        navLinksContainer.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        navToggle.focus();
      }
      // Close email popup
      if (emailPopup.classList.contains('visible')) {
        emailPopup.classList.remove('visible');
        emailPopup.setAttribute('hidden', '');
      }
    }
  });

  // ──────────────────────────────────────────────
  // 5. Email Popup
  // ──────────────────────────────────────────────
  const emailBtn = document.getElementById('contact-email');
  const emailPopup = document.getElementById('email-popup');
  const emailCopyBtn = document.getElementById('email-copy');
  const emailAddress = document.getElementById('email-address');
  const copyIcon = document.getElementById('email-copy-icon');
  const checkIcon = document.getElementById('email-check-icon');

  // Toggle popup
  emailBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = emailPopup.classList.toggle('visible');
    if (isVisible) {
      emailPopup.removeAttribute('hidden');
    } else {
      emailPopup.setAttribute('hidden', '');
    }
  });

  // Copy email to clipboard
  emailCopyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const email = emailAddress.textContent;

    navigator.clipboard.writeText(email).then(() => {
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

  // Close popup when clicking outside
  document.addEventListener('click', (e) => {
    if (
      emailPopup.classList.contains('visible') &&
      !emailPopup.contains(e.target) &&
      e.target !== emailBtn
    ) {
      emailPopup.classList.remove('visible');
      emailPopup.setAttribute('hidden', '');
    }
  });

  // ──────────────────────────────────────────────
  // 6. Initial state
  // ──────────────────────────────────────────────
  updateActiveLink();
  updateNavBackground();
})();
