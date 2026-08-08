(function (globalScope, factory) {
  const api = factory(globalScope);
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    api.init();
  }
})(typeof window !== 'undefined' ? window : globalThis, function (windowRef) {
  const resolveTheme = (storedTheme, prefersDark) => {
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    return prefersDark ? 'dark' : 'light';
  };

  const validateContactFields = ({ name = '', email = '', message = '' }) => {
    const errors = {};
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim();
    const cleanMessage = String(message).trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!cleanName) errors.name = 'Name is required.';
    else if (String(name).length > 100) errors.name = 'Name must not exceed 100 characters.';

    if (!cleanEmail) errors.email = 'Email is required.';
    else if (String(email).length > 254) errors.email = 'Email must not exceed 254 characters.';
    else if (!emailPattern.test(cleanEmail)) errors.email = 'Please enter a valid email address.';

    if (!cleanMessage) errors.message = 'Message is required.';
    else if (String(message).length > 5000) errors.message = 'Message must not exceed 5000 characters.';
    else if (cleanMessage.length < 20) errors.message = 'Message must be at least 20 characters long.';

    return errors;
  };

  const setActiveNavigation = (links, activeId) => {
    links.forEach((link) => {
      const isActive = link.dataset.section === activeId;
      link.classList.toggle('active-nav', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const initMobileMenu = ({ button, menu, documentRef }) => {
    const setIcon = (open) => {
      const icon = button.querySelector('i');
      if (icon) icon.className = open ? 'fas fa-xmark' : 'fas fa-bars';
      button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };

    const open = () => {
      menu.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      documentRef.body.classList.add('menu-open');
      setIcon(true);
      menu.querySelector('a, button')?.focus();
    };

    const close = ({ restoreFocus = false } = {}) => {
      menu.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      documentRef.body.classList.remove('menu-open');
      setIcon(false);
      if (restoreFocus) button.focus();
    };

    const toggle = () => {
      if (menu.classList.contains('open')) close({ restoreFocus: true });
      else open();
    };

    button.addEventListener('click', toggle);
    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => close()));
    documentRef.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menu.classList.contains('open')) close({ restoreFocus: true });
    });
    documentRef.addEventListener('click', (event) => {
      if (menu.classList.contains('open') && !menu.contains(event.target) && !button.contains(event.target)) {
        close();
      }
    });

    return { open, close, toggle };
  };

  const initTheme = (documentRef) => {
    const root = documentRef.documentElement;
    const toggle = documentRef.getElementById('theme-toggle');
    const media = windowRef.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme, persist = false) => {
      const isDark = theme === 'dark';
      root.classList.toggle('dark', isDark);
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      if (persist) windowRef.localStorage.setItem('theme', theme);
      if (toggle) {
        toggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
        toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      }
    };

    const savedTheme = windowRef.localStorage.getItem('theme');
    applyTheme(resolveTheme(savedTheme, media.matches));
    toggle?.addEventListener('click', () => {
      applyTheme(root.classList.contains('dark') ? 'light' : 'dark', true);
    });
    media.addEventListener?.('change', (event) => {
      if (!windowRef.localStorage.getItem('theme')) applyTheme(event.matches ? 'dark' : 'light');
    });
  };

  const prefersReducedMotion = () =>
    windowRef.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const initSmoothScroll = (documentRef) => {
    documentRef.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const selector = anchor.getAttribute('href');
        const target = selector && documentRef.querySelector(selector);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
        if (anchor.id === 'skip-to-content') target.focus({ preventScroll: true });
      });
    });
  };

  const initScrollNavigation = (documentRef) => {
    const header = documentRef.getElementById('navbar');
    const links = documentRef.querySelectorAll('.nav-link');
    const sections = documentRef.querySelectorAll('main > section[id]');
    const sectionMap = {
      capabilities: 'home',
      education: 'skills',
    };
    const update = () => {
      header?.classList.toggle('scrolled', windowRef.scrollY > 24);
      let active = 'home';
      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 160) active = sectionMap[section.id] || section.id;
      });
      setActiveNavigation(links, active);
    };
    update();
    windowRef.addEventListener('scroll', update, { passive: true });
  };

  const initReveals = (documentRef) => {
    const elements = documentRef.querySelectorAll('.reveal');
    if (prefersReducedMotion() || !('IntersectionObserver' in windowRef)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new windowRef.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => {
      element.classList.add('will-reveal');
      observer.observe(element);
    });
  };

  const initCounters = (documentRef) => {
    const counters = documentRef.querySelectorAll('.stat-number');
    const showFinal = (counter) => {
      counter.textContent = `${counter.dataset.target}${counter.dataset.suffix || ''}`;
    };
    if (prefersReducedMotion() || !('IntersectionObserver' in windowRef)) {
      counters.forEach(showFinal);
      return;
    }
    const observer = new windowRef.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        const target = Number(counter.dataset.target);
        const suffix = counter.dataset.suffix || '';
        const startedAt = windowRef.performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startedAt) / 900, 1);
          counter.textContent = `${Math.round(target * (1 - (1 - progress) ** 3))}${suffix}`;
          if (progress < 1) windowRef.requestAnimationFrame(tick);
        };
        windowRef.requestAnimationFrame(tick);
        observer.unobserve(counter);
      });
    }, { threshold: 0.6 });
    counters.forEach((counter) => observer.observe(counter));
  };

  const initTypewriter = (documentRef) => {
    const target = documentRef.getElementById('typed-text');
    if (!target) return;
    const phrases = ['website maintenance', 'technical documentation', 'full-stack development'];
    if (prefersReducedMotion()) {
      target.textContent = phrases[0];
      return;
    }
    let phraseIndex = 0;
    let characterIndex = phrases[0].length;
    let deleting = true;
    const type = () => {
      const phrase = phrases[phraseIndex];
      characterIndex += deleting ? -1 : 1;
      target.textContent = phrase.slice(0, characterIndex);
      let delay = deleting ? 45 : 75;
      if (!deleting && characterIndex === phrase.length) {
        deleting = true;
        delay = 1500;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 320;
      }
      windowRef.setTimeout(type, delay);
    };
    windowRef.setTimeout(type, 900);
  };

  const initContactForm = (documentRef) => {
    const form = documentRef.getElementById('contact-form');
    if (!form) return;
    const fields = ['name', 'email', 'message'];
    const status = documentRef.getElementById('form-message');
    const submit = form.querySelector('button[type="submit"]');

    const values = () => Object.fromEntries(fields.map((name) => [name, form.elements[name].value]));
    const showFieldError = (name, message = '') => {
      const field = form.elements[name];
      const error = documentRef.getElementById(`${name}-error`);
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      error.textContent = message;
    };
    fields.forEach((name) => {
      form.elements[name].addEventListener('blur', () => {
        showFieldError(name, validateContactFields(values())[name]);
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const payload = values();
      const errors = validateContactFields(payload);
      fields.forEach((name) => showFieldError(name, errors[name]));
      if (Object.keys(errors).length) {
        status.textContent = 'Please correct the highlighted fields.';
        status.dataset.state = 'error';
        form.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      submit.disabled = true;
      submit.classList.add('is-loading');
      status.textContent = 'Sending your message…';
      status.dataset.state = 'pending';
      try {
        const response = await windowRef.fetch('/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => ({ message: 'The server returned an unexpected response.' }));
        if (!response.ok) {
          Object.entries(data.data?.errors || {}).forEach(([name, message]) => showFieldError(name, message));
          throw new Error(data.message || 'Unable to send your message.');
        }
        form.reset();
        fields.forEach((name) => showFieldError(name));
        status.textContent = data.message;
        status.dataset.state = 'success';
      } catch (error) {
        status.textContent = error.message || 'Unable to send your message. Please try again.';
        status.dataset.state = 'error';
      } finally {
        submit.disabled = false;
        submit.classList.remove('is-loading');
      }
    });
  };

  const init = () => {
    const documentRef = windowRef.document;
    initTheme(documentRef);
    const button = documentRef.getElementById('mobile-menu-btn');
    const menu = documentRef.getElementById('mobile-menu');
    if (button && menu) initMobileMenu({ button, menu, documentRef });
    initSmoothScroll(documentRef);
    initScrollNavigation(documentRef);
    initReveals(documentRef);
    initCounters(documentRef);
    initTypewriter(documentRef);
    initContactForm(documentRef);
  };

  return {
    init,
    resolveTheme,
    validateContactFields,
    setActiveNavigation,
    initMobileMenu,
  };
});
