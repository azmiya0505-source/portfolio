/**
 * AZMIYA AAYAT — MODERN EDITORIAL DEVELOPER PORTFOLIO
 * Pure Vanilla JavaScript (ES6+) Architecture
 * Zero external frameworks, zero libraries, zero build steps
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* --------------------------------------------------------------------------
     1. Top Scroll Progress Bar
     -------------------------------------------------------------------------- */
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  if (scrollProgressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     2. Preloader Animation & Hero Entrance Trigger
     -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const heroNameDisplay = document.getElementById('hero-title');
  const heroGoldLine = document.getElementById('hero-gold-line');
  const focusItems = document.querySelectorAll('.focus-item');

  function splitHeroNameIntoSpans() {
    if (!heroNameDisplay) return;
    const rawText = heroNameDisplay.textContent.trim();
    heroNameDisplay.innerHTML = '';

    rawText.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.className = 'split-char';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.transitionDelay = `${0.2 + index * 0.045}s`;
      heroNameDisplay.appendChild(span);
    });
  }

  splitHeroNameIntoSpans();

  function triggerHeroSequence() {
    if (isReducedMotion) {
      if (heroNameDisplay) heroNameDisplay.classList.add('revealed');
      if (heroGoldLine) heroGoldLine.classList.add('revealed');
      focusItems.forEach(item => item.classList.add('revealed'));
      return;
    }

    setTimeout(() => {
      if (heroNameDisplay) heroNameDisplay.classList.add('revealed');
      if (heroGoldLine) heroGoldLine.classList.add('revealed');

      focusItems.forEach((item, idx) => {
        setTimeout(() => {
          item.classList.add('revealed');
        }, 550 + idx * 80);
      });
    }, 150);
  }

  if (preloader) {
    if (isReducedMotion) {
      preloader.classList.add('fade-out');
      triggerHeroSequence();
    } else {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        triggerHeroSequence();
      }, 1000);
    }
  } else {
    triggerHeroSequence();
  }

  /* --------------------------------------------------------------------------
     3. Custom Gold Cursor (Dot + Ring with Lerp on Desktop Fine Pointer)
     -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (isFinePointer && cursorDot && cursorRing && !isReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isCursorVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isCursorVisible) {
        isCursorVisible = true;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }

      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    function renderCursor() {
      // Smooth lerp (16% per frame)
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover state over links and buttons
    document.querySelectorAll('a, button, input, textarea, .filter-tab-btn, .skill-row-item').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // View state over project cards
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => document.body.classList.add('cursor-view'));
      card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-view'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
      isCursorVisible = false;
    });
  }

  /* --------------------------------------------------------------------------
     4. Magnetic Buttons (Pure JavaScript Translation)
     -------------------------------------------------------------------------- */
  if (isFinePointer && !isReducedMotion) {
    const magneticElements = document.querySelectorAll('.btn-gold, .brand-monogram, .hamburger-btn');
    magneticElements.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. Sticky Header & Active Nav IntersectionObserver
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const navAnchors = document.querySelectorAll('.nav-anchor, .menu-link');
  const trackedSections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  trackedSections.forEach(s => navObserver.observe(s));

  /* --------------------------------------------------------------------------
     6. Fullscreen Menu Overlay (Clip-Path & Body Scroll Lock)
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const fullscreenMenu = document.getElementById('fullscreen-menu');
  const menuLinks = document.querySelectorAll('.menu-link');

  function openMenu() {
    if (!fullscreenMenu) return;
    fullscreenMenu.classList.add('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Stagger links entrance
    menuLinks.forEach((link, i) => {
      link.style.transitionDelay = `${0.15 + i * 0.05}s`;
    });
  }

  function closeMenu() {
    if (!fullscreenMenu) return;
    fullscreenMenu.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (fullscreenMenu && fullscreenMenu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  /* --------------------------------------------------------------------------
     7. Stat Counters (requestAnimationFrame with Quadratic Ease-Out)
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsStarted = false;

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  function animateCounters() {
    if (statsStarted) return;
    statsStarted = true;

    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10) || 0;
      const duration = 1600;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = Math.round(target * easeOutQuad(progress));

        el.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  const heroStatsWrap = document.querySelector('.hero-stats-wrap');
  if (heroStatsWrap) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    statsObserver.observe(heroStatsWrap);
  }

  /* --------------------------------------------------------------------------
     8. Decorative Parallax SVG Curves on Scroll
     -------------------------------------------------------------------------- */
  const heroCurves = document.getElementById('hero-curves');
  const footerCurves = document.getElementById('footer-curves');

  if (!isReducedMotion && (heroCurves || footerCurves)) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (heroCurves) {
            heroCurves.style.transform = `translateY(${scrollY * 0.12}px)`;
          }
          if (footerCurves) {
            const footerRect = footerCurves.getBoundingClientRect();
            if (footerRect.top < window.innerHeight) {
              footerCurves.style.transform = `translateY(${(footerRect.top - window.innerHeight) * 0.08}px)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     9. Scroll Reveals (.in-view via IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-fade');
  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* --------------------------------------------------------------------------
     10. Skills: Numbered 01-04 Rows & Plain Text Category Filters
     -------------------------------------------------------------------------- */
  const skillRowItems = document.querySelectorAll('.skill-row-item');
  skillRowItems.forEach(row => {
    row.addEventListener('click', () => {
      const isActive = row.classList.contains('active');
      skillRowItems.forEach(r => r.classList.remove('active'));
      if (!isActive) row.classList.add('active');
    });
  });

  // Filter tabs for detailed cards (hide with CSS, never remove from DOM)
  const filterTabs = document.querySelectorAll('[data-filter]');
  const skillCards = document.querySelectorAll('.skill-item-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filterCategory = tab.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cardCats = (card.getAttribute('data-category') || '').split(' ');
        if (filterCategory === 'all' || cardCats.includes(filterCategory)) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     11. Modals (Project Breakdown & ATS Resume Modal)
     -------------------------------------------------------------------------- */
  const allModals = document.querySelectorAll('.modal-backdrop');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const focusable = modal.querySelector('button, [href], input, select, textarea');
    if (focusable) focusable.focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const modalTriggers = [
    { triggerId: 'open-va-modal', modalId: 'va-project-modal' },
    { triggerId: 'open-bus-modal', modalId: 'bus-project-modal' },
    { triggerId: 'open-scratch-modal', modalId: 'scratch-project-modal' },
    { triggerId: 'open-anim-modal', modalId: 'anim-project-modal' }
  ];

  modalTriggers.forEach(({ triggerId, modalId }) => {
    const triggerBtn = document.getElementById(triggerId);
    const modalEl = document.getElementById(modalId);
    if (triggerBtn && modalEl) {
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalEl);
      });
    }
  });

  // Generic modal close buttons
  document.querySelectorAll('.modal-close-icon, .modal-close-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  // Resume Modal Triggers
  const resumeModal = document.getElementById('resume-modal');
  const resumeNavBtn = document.getElementById('resume-nav-btn');
  const heroResumeBtn = document.getElementById('hero-resume-btn');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function handleResumeOpen() {
    closeMenu();
    openModal(resumeModal);
  }

  if (resumeNavBtn) resumeNavBtn.addEventListener('click', handleResumeOpen);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', handleResumeOpen);

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Outside click & ESC key
  window.addEventListener('click', (e) => {
    allModals.forEach(m => {
      if (e.target === m) closeModal(m);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(m => {
        if (m.classList.contains('open')) closeModal(m);
      });
      if (fullscreenMenu && fullscreenMenu.classList.contains('open')) closeMenu();
    }
  });

  /* --------------------------------------------------------------------------
     12. Copy Email to Clipboard
     -------------------------------------------------------------------------- */
  const emailAddress = 'azmiyaaayat62@gmail.com';
  const copyPill = document.getElementById('copy-email-pill');
  const copyCard = document.getElementById('copy-email-card');

  function copyEmail() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emailAddress)
        .then(() => showToast(`Copied ${emailAddress} to clipboard!`))
        .catch(() => fallbackCopy(emailAddress));
    } else {
      fallbackCopy(emailAddress);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${emailAddress} to clipboard!`);
    } catch (e) {
      showToast(`Email: ${emailAddress}`);
    }
    document.body.removeChild(ta);
  }

  if (copyPill) copyPill.addEventListener('click', copyEmail);
  if (copyCard) copyCard.addEventListener('click', copyEmail);

  /* --------------------------------------------------------------------------
     13. Contact Form Mailto Trigger
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  function clearFormErrors() {
    [nameError, emailError, subjectError, messageError].forEach(el => {
      if (el) el.textContent = '';
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors();

      let valid = true;
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name) {
        if (nameError) nameError.textContent = 'Please enter your name.';
        valid = false;
      }

      if (!email) {
        if (emailError) emailError.textContent = 'Please enter your email.';
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        valid = false;
      }

      if (!subject) {
        if (subjectError) subjectError.textContent = 'Please provide a subject.';
        valid = false;
      }

      if (!message) {
        if (messageError) messageError.textContent = 'Please provide a message.';
        valid = false;
      }

      if (!valid) return;

      const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(`[Portfolio Inquiry] ${subject}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

      showToast('Opening your email client...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 300);

      contactForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     14. Back to Top Button
     -------------------------------------------------------------------------- */
  const backTopBtn = document.getElementById('back-to-top');
  if (backTopBtn) {
    backTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     15. Toast Notification Helper
     -------------------------------------------------------------------------- */
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;

    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  }

  /* --------------------------------------------------------------------------
     16. Voice Assistant Interactive Demo Simulator
     -------------------------------------------------------------------------- */
  const testVoiceBtn = document.getElementById('test-voice-btn');
  const vaBubble = document.getElementById('va-bubble');
  const waveBars = document.querySelectorAll('.wave-bar');

  if (testVoiceBtn && vaBubble) {
    const demoQueries = [
      { q: 'Explain MERN stack & Gemini integration', a: 'MERN coordinates React UI and Express API to route voice queries to Gemini models with websocket streaming.' },
      { q: 'What is your latency optimization approach?', a: 'Async speech processing with local Ollama edge fallbacks for responsive conversation.' },
      { q: 'Who built this assistant?', a: 'Engineered 100% by Azmiya Aayat as a full-stack graduation artifact.' }
    ];
    let qIdx = 0;
    let isTesting = false;

    testVoiceBtn.addEventListener('click', () => {
      if (isTesting) return;
      isTesting = true;

      const current = demoQueries[qIdx];
      qIdx = (qIdx + 1) % demoQueries.length;

      waveBars.forEach(b => b.style.animationDuration = '0.35s');
      vaBubble.textContent = `🎙️ Query: "${current.q}"`;
      showToast('Simulating voice prompt execution...');

      setTimeout(() => {
        vaBubble.textContent = `✨ Assistant: "${current.a}"`;
        showToast('Voice response received!');
        setTimeout(() => {
          waveBars.forEach(b => b.style.animationDuration = '1.3s');
          isTesting = false;
        }, 2000);
      }, 1200);
    });
  }
});
