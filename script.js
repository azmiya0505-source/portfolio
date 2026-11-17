/**
 * AZMIYA AAYAT — MODERN EDITORIAL DEVELOPER PORTFOLIO
 * High-End Creative Developer Architecture
 * Pure JavaScript (ES6+) with GSAP, ScrollTrigger, and Lenis Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* --------------------------------------------------------------------------
     1. Theme Toggle (Light / Dark Mode)
     Default Appearance: Dark Editorial Theme
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('azmiya_portfolio_theme') || 'dark';
  setTheme(savedTheme === 'light' ? 'light' : 'dark');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} theme`, 'info');
    });
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('azmiya_portfolio_theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  }

  /* --------------------------------------------------------------------------
     2. Lenis Smooth Scroll Integration with GSAP ScrollTrigger
     -------------------------------------------------------------------------- */
  let lenisInstance = null;

  if (typeof Lenis !== 'undefined' && !isReducedMotion) {
    lenisInstance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false
    });

    // Sync Lenis with GSAP ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  /* --------------------------------------------------------------------------
     3. Preloader Screen & Hero Masked Entrance
     -------------------------------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  const preloaderTitle = document.getElementById('preloader-title');
  const preloaderSubtitle = document.getElementById('preloader-subtitle');
  const preloaderCounter = document.getElementById('preloader-counter');
  const preloaderBar = document.getElementById('preloader-bar');

  if (preloader) {
    if (isReducedMotion) {
      preloader.style.display = 'none';
      initScrollAnimations();
    } else {
      // Animate preloader title up
      setTimeout(() => {
        if (preloaderTitle) preloaderTitle.style.transform = 'translateY(0%)';
        if (preloaderSubtitle) preloaderSubtitle.style.opacity = '1';
      }, 100);

      // Count up from 0 to 100%
      let count = 0;
      const countInterval = setInterval(() => {
        count += Math.floor(Math.random() * 8) + 4;
        if (count >= 100) {
          count = 100;
          clearInterval(countInterval);

          if (preloaderCounter) preloaderCounter.textContent = '100%';
          if (preloaderBar) preloaderBar.style.width = '100%';

          setTimeout(() => {
            // Dismiss preloader
            if (typeof gsap !== 'undefined') {
              gsap.to(preloader, {
                yPercent: -100,
                duration: 0.9,
                ease: 'power4.inOut',
                onComplete: () => {
                  preloader.classList.add('loaded');
                  preloader.style.display = 'none';
                  triggerHeroEntrance();
                  initScrollAnimations();
                }
              });
            } else {
              preloader.style.opacity = '0';
              setTimeout(() => {
                preloader.style.display = 'none';
                triggerHeroEntrance();
                initScrollAnimations();
              }, 400);
            }
          }, 350);
        } else {
          if (preloaderCounter) preloaderCounter.textContent = `${count < 10 ? '0' + count : count}%`;
          if (preloaderBar) preloaderBar.style.width = `${count}%`;
        }
      }, 35);
    }
  } else {
    triggerHeroEntrance();
    initScrollAnimations();
  }

  function triggerHeroEntrance() {
    if (typeof gsap === 'undefined' || isReducedMotion) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Hero title masked reveal
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
      tl.from(heroTitle, {
        yPercent: 105,
        duration: 1.1,
        ease: 'power4.out'
      }, 0.1);
    }

    // Role line
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) {
      tl.from(heroSubtitle, {
        opacity: 0,
        y: 30,
        duration: 0.8
      }, 0.4);
    }

    // Focus items
    const focusItems = document.querySelectorAll('.focus-item');
    if (focusItems.length) {
      tl.from(focusItems, {
        opacity: 0,
        x: -25,
        stagger: 0.08,
        duration: 0.6
      }, 0.55);
    }

    // CTA buttons & social pills
    const heroCtas = document.querySelectorAll('.hero-cta-group .btn, .hero-social-row .social-pill');
    if (heroCtas.length) {
      tl.from(heroCtas, {
        opacity: 0,
        y: 20,
        stagger: 0.06,
        duration: 0.6
      }, 0.7);
    }

    // Stats cards
    const statCards = document.querySelectorAll('.hero-stat-card');
    if (statCards.length) {
      tl.from(statCards, {
        opacity: 0,
        y: 35,
        stagger: 0.12,
        duration: 0.75
      }, 0.8);
    }
  }

  /* --------------------------------------------------------------------------
     4. Custom Cursor with Smooth Lerp Follower (Desktop Only)
     -------------------------------------------------------------------------- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorFollower = document.getElementById('cursor-follower');

  if (isFinePointer && cursorDot && cursorFollower && !isReducedMotion) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;
    let isCursorActive = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isCursorActive) {
        isCursorActive = true;
        cursorDot.style.opacity = '1';
        cursorFollower.style.opacity = '1';
      }

      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    // Smooth follower loop with requestAnimationFrame
    function updateFollower() {
      // Lerp smoothing (18% step per frame)
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;

      cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(updateFollower);
    }
    requestAnimationFrame(updateFollower);

    // Hover state over interactive elements
    const hoverElements = document.querySelectorAll('a, button, input, textarea, .tab-btn, .expertise-row-item');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    // View state over project cards
    const projectCards = document.querySelectorAll('.project-editorial-card');
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => document.body.classList.add('cursor-view'));
      card.addEventListener('mouseleave', () => document.body.classList.remove('cursor-view'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorFollower.style.opacity = '0';
      isCursorActive = false;
    });
  }

  /* --------------------------------------------------------------------------
     5. Magnetic Button Effect (Desktop Fine Pointer Only)
     -------------------------------------------------------------------------- */
  if (isFinePointer && !isReducedMotion) {
    const magneticBtns = document.querySelectorAll('.btn-accent, .brand-monogram, .hamburger-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. Sticky Header & Active Nav Spy
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-anchor, .menu-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));

  /* --------------------------------------------------------------------------
     7. Fullscreen Menu Overlay
     -------------------------------------------------------------------------- */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const fullscreenMenu = document.getElementById('fullscreen-menu');
  const menuLinks = document.querySelectorAll('.menu-link');

  function openFullscreenMenu() {
    if (!fullscreenMenu) return;
    fullscreenMenu.classList.add('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined' && !isReducedMotion) {
      const items = fullscreenMenu.querySelectorAll('.menu-link');
      gsap.fromTo(items,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'power3.out', delay: 0.2 }
      );
    }
  }

  function closeFullscreenMenu() {
    if (!fullscreenMenu) return;
    fullscreenMenu.classList.remove('open');
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (fullscreenMenu && fullscreenMenu.classList.contains('open')) {
        closeFullscreenMenu();
      } else {
        openFullscreenMenu();
      }
    });
  }

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeFullscreenMenu();
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl && lenisInstance) {
          lenisInstance.scrollTo(targetEl, { offset: -60 });
        }
      }
    });
  });

  // Smooth scroll click handler for desktop nav links
  document.querySelectorAll('.nav-anchor').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl && lenisInstance) {
          e.preventDefault();
          lenisInstance.scrollTo(targetEl, { offset: -60 });
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     8. Marquee Velocity Reactivity (Scroll-Driven Accentuation)
     -------------------------------------------------------------------------- */
  if (typeof ScrollTrigger !== 'undefined' && !isReducedMotion) {
    ScrollTrigger.create({
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity());
        const tracks = document.querySelectorAll('.marquee-track');
        tracks.forEach(track => {
          // Temporarily boost duration on rapid scroll
          if (velocity > 600) {
            track.style.animationDuration = '12s';
          } else {
            track.style.animationDuration = '28s';
          }
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     9. Stats Count-Up Animation
     -------------------------------------------------------------------------- */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsTriggered = false;

  function runStatsCountUp() {
    if (statsTriggered) return;
    statsTriggered = true;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10) || 0;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 20));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          stat.textContent = target;
          clearInterval(interval);
        } else {
          stat.textContent = current;
        }
      }, 40);
    });
  }

  const statsSection = document.querySelector('.hero-stats-column');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runStatsCountUp();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
  }

  /* --------------------------------------------------------------------------
     10. Core Expertise Rows: 01, 02, 03, 04 Hover Expansion
     -------------------------------------------------------------------------- */
  const expertiseRows = document.querySelectorAll('.expertise-row-item');
  expertiseRows.forEach(row => {
    row.addEventListener('click', () => {
      // Toggle expanded active highlight
      const wasActive = row.classList.contains('active');
      expertiseRows.forEach(r => r.classList.remove('active'));
      if (!wasActive) row.classList.add('active');
    });
  });

  /* --------------------------------------------------------------------------
     11. Skill Category Filter Tabs (Preserved Functionality)
     -------------------------------------------------------------------------- */
  const skillTabButtons = document.querySelectorAll('[data-filter]');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      skillTabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const filterValue = button.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.split(' ').includes(filterValue)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  /* --------------------------------------------------------------------------
     12. Project Category Filter Tabs (Preserved Functionality)
     -------------------------------------------------------------------------- */
  const projTabButtons = document.querySelectorAll('[data-proj-filter]');
  const projectEditorialCards = document.querySelectorAll('.project-editorial-card');

  projTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      projTabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const filterValue = button.getAttribute('data-proj-filter');

      projectEditorialCards.forEach(card => {
        const categories = card.getAttribute('data-proj-category') || '';
        if (filterValue === 'all' || categories.split(' ').includes(filterValue)) {
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });

      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  /* --------------------------------------------------------------------------
     13. Modal Window Handlers (Project Details & Resume)
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

  // Bind project modal triggers
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
  document.querySelectorAll('.modal-close-btn, .modal-close-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-backdrop');
      if (modal) closeModal(modal);
    });
  });

  // Resume Modal triggers
  const resumeModal = document.getElementById('resume-modal');
  const resumeNavBtn = document.getElementById('resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-trigger');
  const printResumeBtn = document.getElementById('print-resume-btn');
  const resumePrintFooter = document.getElementById('resume-print-footer');

  function handleResumeOpen() {
    closeFullscreenMenu();
    openModal(resumeModal);
  }

  if (resumeNavBtn) resumeNavBtn.addEventListener('click', handleResumeOpen);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', handleResumeOpen);

  function printResume() {
    window.print();
  }

  if (printResumeBtn) printResumeBtn.addEventListener('click', printResume);
  if (resumePrintFooter) resumePrintFooter.addEventListener('click', printResume);

  // Close modals on clicking outside or ESC key
  window.addEventListener('click', (e) => {
    allModals.forEach(modal => {
      if (e.target === modal) closeModal(modal);
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModals.forEach(modal => {
        if (modal.classList.contains('open')) closeModal(modal);
      });
      if (fullscreenMenu && fullscreenMenu.classList.contains('open')) closeFullscreenMenu();
    }
  });

  /* --------------------------------------------------------------------------
     14. Copy Email Address to Clipboard
     -------------------------------------------------------------------------- */
  const emailAddress = 'azmiyaaayat62@gmail.com';
  const copyPill = document.getElementById('copy-email-pill');
  const copyCard = document.getElementById('copy-email-card');

  function copyEmail() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(emailAddress)
        .then(() => {
          showToast(`Copied ${emailAddress} to clipboard!`, 'success');
        })
        .catch(() => {
          fallbackCopyText(emailAddress);
        });
    } else {
      fallbackCopyText(emailAddress);
    }
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${emailAddress} to clipboard!`, 'success');
    } catch (err) {
      showToast(`Email: ${emailAddress}`, 'info');
    }
    document.body.removeChild(textArea);
  }

  if (copyPill) copyPill.addEventListener('click', copyEmail);
  if (copyCard) copyCard.addEventListener('click', copyEmail);

  /* --------------------------------------------------------------------------
     15. Contact Form Validation & Mailto Trigger
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

  function clearErrors() {
    [nameError, emailError, subjectError, messageError].forEach(el => {
      if (el) el.textContent = '';
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();

      let isValid = true;
      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const subjectVal = subjectInput ? subjectInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal) {
        if (nameError) nameError.textContent = 'Please enter your name.';
        isValid = false;
      }

      if (!emailVal) {
        if (emailError) emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!validateEmail(emailVal)) {
        if (emailError) emailError.textContent = 'Please enter a valid email format (e.g. user@domain.com).';
        isValid = false;
      }

      if (!subjectVal) {
        if (subjectError) subjectError.textContent = 'Please enter a subject.';
        isValid = false;
      }

      if (!messageVal) {
        if (messageError) messageError.textContent = 'Please write a brief message.';
        isValid = false;
      }

      if (!isValid) return;

      const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectVal}`);
      const bodyContent = `Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`;
      const encodedBody = encodeURIComponent(bodyContent);

      const mailtoUrl = `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`;

      showToast('Opening your email client to dispatch message...', 'success');

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 300);

      contactForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     16. Back to Top Button
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     17. Toast Notification Helper
     -------------------------------------------------------------------------- */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'status');

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3800);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* --------------------------------------------------------------------------
     18. Interactive Hero Particle Canvas
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('hero-particles');
  if (canvas && !isReducedMotion) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }, { passive: true });

    const numParticles = Math.min(Math.floor(width / 35), 40);
    const particles = [];
    const mouse = { x: null, y: null, radius: 110 };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.35 + 0.15
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 255, 0, ${p.baseAlpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 255, 0, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }

    requestAnimationFrame(animateParticles);
  }

  /* --------------------------------------------------------------------------
     19. Voice Assistant Interactive Simulator Demo
     -------------------------------------------------------------------------- */
  const testVoiceBtn = document.getElementById('test-voice-btn');
  const vaBubbleText = document.getElementById('va-bubble-text');
  const vaBars = document.querySelectorAll('.voice-wave-bars .bar');

  if (testVoiceBtn && vaBubbleText) {
    const simulatedQueries = [
      {
        text: 'Query: "Explain MERN stack & Gemini integration"',
        response: 'Assistant: "MERN coordinates React and Express API to route voice prompts to Gemini models."'
      },
      {
        text: 'Query: "What is your latency optimization approach?"',
        response: 'Assistant: "Async websocket channels with fallback to lightweight Ollama edge endpoints."'
      },
      {
        text: 'Query: "Who built this Virtual Assistant?"',
        response: 'Assistant: "Built 100% by Azmiya Aayat as a full-stack graduation artifact!"'
      }
    ];

    let queryIdx = 0;
    let isSimulating = false;

    testVoiceBtn.addEventListener('click', () => {
      if (isSimulating) return;
      isSimulating = true;

      const current = simulatedQueries[queryIdx];
      queryIdx = (queryIdx + 1) % simulatedQueries.length;

      vaBars.forEach(bar => {
        bar.style.animationDuration = '0.35s';
      });

      vaBubbleText.textContent = `🎤 ${current.text}`;
      showToast('Simulating voice prompt execution...', 'info');

      setTimeout(() => {
        vaBubbleText.textContent = `⚡ ${current.response}`;
        showToast('Assistant voice response received!', 'success');

        setTimeout(() => {
          vaBars.forEach(bar => {
            bar.style.animationDuration = '1.3s';
          });
          isSimulating = false;
        }, 2200);
      }, 1300);
    });
  }

  /* --------------------------------------------------------------------------
     20. GSAP ScrollTrigger Global Scroll Reveals
     -------------------------------------------------------------------------- */
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || isReducedMotion) return;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Section headers reveal
    document.querySelectorAll('.section-header').forEach(header => {
      gsap.from(header.children, {
        scrollTrigger: {
          trigger: header,
          start: 'top 85%'
        },
        opacity: 0,
        y: 35,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      });
    });

    // Project Cards Reveal (fade + translateY + scale)
    document.querySelectorAll('.project-editorial-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 82%'
        },
        opacity: 0,
        y: 60,
        scale: 0.98,
        duration: 0.85,
        ease: 'power3.out'
      });
    });

    // Expertise Rows Reveal
    const expertiseRows = document.querySelectorAll('.expertise-row-item');
    if (expertiseRows.length) {
      gsap.from(expertiseRows, {
        scrollTrigger: {
          trigger: '.expertise-rows-wrapper',
          start: 'top 80%'
        },
        opacity: 0,
        x: -30,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out'
      });
    }

    // Timeline items reveal
    document.querySelectorAll('.timeline-item').forEach(item => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%'
        },
        opacity: 0,
        x: -25,
        duration: 0.7,
        ease: 'power3.out'
      });
    });

    // Cert cards reveal
    document.querySelectorAll('.cert-card').forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 88%'
        },
        opacity: 0,
        y: 30,
        duration: 0.65,
        ease: 'power3.out'
      });
    });

    // Giant Wordmark Reveal on Scroll
    const footerWordmark = document.getElementById('footer-wordmark');
    if (footerWordmark) {
      gsap.from(footerWordmark, {
        scrollTrigger: {
          trigger: footerWordmark,
          start: 'top 90%'
        },
        opacity: 0,
        scale: 0.94,
        duration: 1.1,
        ease: 'power4.out'
      });
    }
  }
});
