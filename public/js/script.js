// Theme Toggle Functionality
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Initialize theme
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    setTheme(prefersDark ? 'dark' : 'light');
  }
};

// Set theme
const setTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeIcon(theme);
};

// Update theme icon
const updateThemeIcon = (theme) => {
  if (themeToggle) {
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
};

// Theme toggle click
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});

// Initialize theme on load
initTheme();

// Mobile Navigation Toggle
const navbarToggle = document.getElementById('navbar-toggle');
const navbarMenu = document.getElementById('navbar-menu');
const navbarLinks = document.querySelectorAll('.navbar-link');

if (navbarToggle && navbarMenu) {
  navbarToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
    navbarToggle.classList.toggle('active');
    const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
    navbarToggle.setAttribute('aria-expanded', !isExpanded);
  });
}

// Close mobile menu when clicking a link
navbarLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navbarMenu.classList.contains('active')) {
      navbarMenu.classList.remove('active');
      navbarToggle.classList.remove('active');
      navbarToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal-up');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

// Typing Animation
const typedText = document.querySelector('.typed-text');
const roles = ['Full Stack Web Developer', 'IT Professional', 'Web Application Builder'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

const typeAnimation = () => {
  const currentRole = roles[roleIndex];
  
  if (typedText) {
    if (isDeleting) {
      typedText.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typedText.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500;
    }
  }

  setTimeout(typeAnimation, typeSpeed);
};

// Start typing animation
setTimeout(typeAnimation, 1000);

// Active Navbar Link on Scroll
const navSections = document.querySelectorAll('section[id]');

const highlightNavLink = () => {
  const scrollY = window.scrollY;
  
  navSections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navbarLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
          link.classList.add('active');
        }
      });
    }
  });
};

window.addEventListener('scroll', highlightNavLink);

// Section Observer for Stagger Animations
const sections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Uncomment the line below if you want to animate only once
        // sectionObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
);

sections.forEach((section) => sectionObserver.observe(section));

// Floating Item Animation — Web-like motion
const driftDirs = ['drift-up', 'drift-down', 'drift-left', 'drift-right'];
document.querySelectorAll('.tech-item, .interest-item, .language-item').forEach((el, i) => {
  const delay = el.getAttribute('data-delay') || 0;
  el.style.setProperty('--d', delay + 'ms');
  el.style.setProperty('--anim', driftDirs[Math.floor(i / 2) % 4]);
  el.classList.add('has-float');
});

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    if (formMessage) {
      formMessage.textContent = 'Sending message...';
      formMessage.style.color = 'var(--accent)';
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }

    try {
      const response = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to send message');
      }

      if (formMessage) {
        formMessage.textContent = data.message;
        formMessage.style.color = '#4ade80';
      }
      contactForm.reset();
    } catch (error) {
      if (formMessage) {
        formMessage.textContent = error.message;
        formMessage.style.color = '#f87171';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    }
  });
}