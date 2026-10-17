/**
 * AZMIYA AAYAT — DEVELOPER PORTFOLIO
 * Modern Developer Portfolio Client Logic
 * Pure JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Theme Toggle (Light / Dark Mode)
     Default Appearance: Light Theme
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Always default to and initialize the light theme
  const savedTheme = localStorage.getItem('azmiya_portfolio_theme') || 'light';
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} color scheme`, 'info');
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
     2. Sticky Header & Scroll Spy
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // IntersectionObserver for active section highlighting
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        updateActiveNav(activeId);
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  function updateActiveNav(activeId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     3. Mobile Drawer Navigation
     -------------------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.add('open');
      drawerBackdrop.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      drawerBackdrop.setAttribute('aria-hidden', 'false');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer && drawerBackdrop) {
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      drawerBackdrop.setAttribute('aria-hidden', 'true');
      if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  /* --------------------------------------------------------------------------
     4. Skills Category Filter Tabs
     -------------------------------------------------------------------------- */
  const skillTabButtons = document.querySelectorAll('[data-filter]');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle active state on tabs
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
    });
  });

  /* --------------------------------------------------------------------------
     5. Project Category Filter Tabs
     -------------------------------------------------------------------------- */
  const projTabButtons = document.querySelectorAll('[data-proj-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      projTabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const filterValue = button.getAttribute('data-proj-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-proj-category') || '';
        if (filterValue === 'all' || categories.split(' ').includes(filterValue)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     6. Modal Window Handlers (Project Detail & Resume)
     -------------------------------------------------------------------------- */
  // Project Detail Modal
  const vaModal = document.getElementById('va-project-modal');
  const openVaModalBtn = document.getElementById('open-va-modal');
  const closeVaModalBtn = document.getElementById('va-modal-close');
  const closeVaFooterBtn = document.getElementById('va-modal-close-footer');

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

  if (openVaModalBtn) {
    openVaModalBtn.addEventListener('click', () => openModal(vaModal));
  }
  if (closeVaModalBtn) {
    closeVaModalBtn.addEventListener('click', () => closeModal(vaModal));
  }
  if (closeVaFooterBtn) {
    closeVaFooterBtn.addEventListener('click', () => closeModal(vaModal));
  }

  // Resume Modal
  const resumeModal = document.getElementById('resume-modal');
  const resumeNavBtn = document.getElementById('resume-btn');
  const heroResumeBtn = document.getElementById('hero-resume-trigger');
  const mobileResumeBtn = document.getElementById('mobile-resume-btn');
  const resumeModalClose = document.getElementById('resume-modal-close');
  const resumeModalCloseFooter = document.getElementById('resume-modal-close-footer');
  const printResumeBtn = document.getElementById('print-resume-btn');
  const resumePrintFooter = document.getElementById('resume-print-footer');

  function handleResumeOpen() {
    closeMobileMenu();
    openModal(resumeModal);
  }

  if (resumeNavBtn) resumeNavBtn.addEventListener('click', handleResumeOpen);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', handleResumeOpen);
  if (mobileResumeBtn) mobileResumeBtn.addEventListener('click', handleResumeOpen);
  if (resumeModalClose) resumeModalClose.addEventListener('click', () => closeModal(resumeModal));
  if (resumeModalCloseFooter) resumeModalCloseFooter.addEventListener('click', () => closeModal(resumeModal));

  function printResume() {
    window.print();
  }

  if (printResumeBtn) printResumeBtn.addEventListener('click', printResume);
  if (resumePrintFooter) resumePrintFooter.addEventListener('click', printResume);

  // Close modals on clicking outside or ESC key
  window.addEventListener('click', (e) => {
    if (e.target === vaModal) closeModal(vaModal);
    if (e.target === resumeModal) closeModal(resumeModal);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (vaModal && vaModal.classList.contains('open')) closeModal(vaModal);
      if (resumeModal && resumeModal.classList.contains('open')) closeModal(resumeModal);
      if (mobileDrawer && mobileDrawer.classList.contains('open')) closeMobileMenu();
    }
  });

  /* --------------------------------------------------------------------------
     7. Copy Email Address to Clipboard
     -------------------------------------------------------------------------- */
  const emailAddress = 'azmiya0505@gmail.com';
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
     8. Contact Form Validation & Mailto Trigger
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

      // Construct mailto link
      const encodedSubject = encodeURIComponent(`[Portfolio Inquiry] ${subjectVal}`);
      const bodyContent = `Name: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}`;
      const encodedBody = encodeURIComponent(bodyContent);

      const mailtoUrl = `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`;

      // Show user feedback
      showToast('Opening your email client to dispatch message...', 'success');

      // Trigger user's mail client
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 300);

      contactForm.reset();
    });
  }

  /* --------------------------------------------------------------------------
     9. Back to Top Button
     -------------------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Update current year dynamically in footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     10. Toast Notification Helper
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
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else {
      iconSvg = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto dismiss after 3.8s
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
     11. Animated Typewriter Headline Effect
     -------------------------------------------------------------------------- */
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const phrases = [
      "Aspiring software development",
      "Passionate about Mobile App Dev",
      "Voice AI & MERN Stack Builder",
      "Curious to learn new technology",
      "3-Time Chess Champion"
    ];

    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = false;
    let typeDelay = 2200;

    function typeLoop() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typewriterElement.textContent = currentPhrase.substring(0, charIndex);
        typeDelay = 40;
      } else {
        charIndex++;
        typewriterElement.textContent = currentPhrase.substring(0, charIndex);
        typeDelay = 85;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeDelay = 2000; // Pause at end of phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeDelay = 400; // Brief pause before typing next
      }

      setTimeout(typeLoop, typeDelay);
    }

    // Start typing after initial display
    setTimeout(typeLoop, 2500);
  }

  /* --------------------------------------------------------------------------
     12. Interactive Hero Particle Canvas
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('hero-particles');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.parentElement.offsetWidth;
    let height = canvas.height = canvas.parentElement.offsetHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }, { passive: true });

    const numParticles = Math.min(Math.floor(width / 30), 45);
    const particles = [];
    const mouse = { x: null, y: null, radius: 100 };

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
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.2
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

        // Subtle mouse reaction
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

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(2, 132, 199, ${p.baseAlpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }

    requestAnimationFrame(animateParticles);
  }

  /* --------------------------------------------------------------------------
     13. Card Dynamic Spotlight Cursor Glow
     -------------------------------------------------------------------------- */
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  });

  /* --------------------------------------------------------------------------
     14. Scroll Reveal Observer (AOS Animation)
     -------------------------------------------------------------------------- */
  // Auto-mark cards and sections for reveal
  document.querySelectorAll('.card, .section-header, .timeline-item').forEach((el, index) => {
    el.classList.add('reveal');
    if (index % 3 === 1) el.classList.add('stagger-1');
    if (index % 3 === 2) el.classList.add('stagger-2');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
     15. Animated Skill Meter Expansion on View
     -------------------------------------------------------------------------- */
  const meterBars = document.querySelectorAll('.meter-bar');
  const skillsSection = document.getElementById('skills');

  // Store original target widths
  meterBars.forEach(bar => {
    const currentWidth = bar.style.width || '50%';
    bar.setAttribute('data-target-width', currentWidth);
    bar.style.width = '0%';
  });

  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          meterBars.forEach((bar, idx) => {
            setTimeout(() => {
              const target = bar.getAttribute('data-target-width') || '50%';
              bar.style.width = target;
            }, idx * 40);
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(skillsSection);
  }

  /* --------------------------------------------------------------------------
     16. Voice Assistant Interactive Simulator Demo
     -------------------------------------------------------------------------- */
  const testVoiceBtn = document.getElementById('test-voice-btn');
  const vaBubbleText = document.getElementById('va-bubble-text');
  const vaBars = document.querySelectorAll('.voice-wave-bars .bar');

  if (testVoiceBtn && vaBubbleText) {
    const simulatedQueries = [
      {
        text: 'Query: "Explain MERN stack & Gemini integration"',
        response: 'Assistant: "MERN coordinates frontend React and Express API to route voice prompts to Gemini models."'
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

      // Intensify waveform animation
      vaBars.forEach(bar => {
        bar.style.animationDuration = '0.4s';
      });

      vaBubbleText.textContent = `🎙️ ${current.text}`;
      showToast('Simulating voice prompt execution...', 'info');

      setTimeout(() => {
        vaBubbleText.textContent = `⚡ ${current.response}`;
        showToast('Assistant voice response received!', 'success');

        // Reset wave speed after 2.5s
        setTimeout(() => {
          vaBars.forEach(bar => {
            bar.style.animationDuration = '1.3s';
          });
          isSimulating = false;
        }, 2200);
      }, 1400);
    });
  }
});
