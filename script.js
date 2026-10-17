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
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
});
