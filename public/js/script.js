const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const safeAnimations = (animFn, fallbackFn) => {
  if (prefersReducedMotion()) { fallbackFn?.(); return; }
  animFn();
};

// GSAP Scroll Animations — guarded against missing library
if (typeof gsap !== "undefined") {
  try { gsap.registerPlugin(ScrollTrigger); } catch (e) {}
}

// Tech Stack Web Drift
safeAnimations(() => {
  const techItems = document.querySelectorAll(".tech-item");
  if (!techItems.length) return;
  const driftDirs = ["drift-up", "drift-down", "drift-left", "drift-right"];
  techItems.forEach((el, i) => {
    el.style.setProperty("--delay", (i * 0.15).toFixed(2) + "s");
    el.style.setProperty("--anim", driftDirs[Math.floor(i / 2) % 4]);
  });
});

// Skill Tags Leaf Drift
safeAnimations(() => {
  const skillTags = document.querySelectorAll(".skill-tag");
  if (!skillTags.length) return;
  const leafAnims = ["leaf-drift", "leaf-drift-alt"];
  skillTags.forEach((el, i) => {
    el.style.setProperty("--leaf-delay", (i * 0.12).toFixed(2) + "s");
    el.style.setProperty("--leaf-anim", leafAnims[i % 2]);
  });
});

// Typewriter Effect
const typedText = document.getElementById("typed-text");
const cursor = document.querySelector(".typed-cursor");

if (typedText) {
  if (prefersReducedMotion()) {
    typedText.textContent = "Abdullah Al Mamun";
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    const typeAnimation = () => {
      const roles = ["Abdullah Al Mamun", "Technical Support Engineer", "Full-Stack Developer", "Web Application Developer"];
      const currentRole = roles[roleIndex];
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
      setTimeout(typeAnimation, typeSpeed);
    };
    setTimeout(typeAnimation, 1000);
  }
} else if (cursor) {
  cursor.style.display = "none";
}

// Theme Toggle
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

const setTheme = (theme) => {
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);
  root.style.setProperty("color-scheme", isDark ? "dark" : "light");
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  if (themeToggle) {
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
};

const initTheme = () => {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(saved || (prefersDark ? "dark" : "light"));
};

themeToggle?.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "light";
  setTheme(current === "dark" ? "light" : "dark");
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!localStorage.getItem("theme")) setTheme(e.matches ? "dark" : "light");
});

initTheme();

// Mobile Menu
const navbar = document.getElementById("navbar");
const mobileBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

const closeMobile = () => {
  if (!mobileMenu || !mobileBtn) return;
  mobileMenu.classList.remove("open");
  mobileBtn.setAttribute("aria-expanded", "false");
  mobileMenu.setAttribute("aria-hidden", "true");
  mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
  // Allow body scroll
  document.body.style.overflow = "";
};

const openMobile = () => {
  if (!mobileMenu || !mobileBtn) return;
  mobileMenu.classList.add("open");
  mobileBtn.setAttribute("aria-expanded", "true");
  mobileMenu.setAttribute("aria-hidden", "false");
  mobileBtn.innerHTML = '<i class="fas fa-times"></i>';
  // Prevent body scroll
  document.body.style.overflow = "hidden";
  mobileMenu.querySelector("a")?.focus();
};

const toggleMobile = () => {
  if (!mobileMenu.classList.contains("open")) {
    openMobile();
  } else {
    closeMobile();
  }
};

if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener("click", toggleMobile);

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobile);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeMobile();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) closeMobile();
  });
}

// Scroll-driven compact nav
if (navbar) {
  const SCROLL_THRESHOLD = 80;
  const toggleCompactNav = () => {
    navbar.classList.toggle("scrolled", window.scrollY > SCROLL_THRESHOLD);
  };
  toggleCompactNav();
  window.addEventListener("scroll", toggleCompactNav, { passive: true });
}

// Active Nav Link on Scroll
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");
const ACTIVE_CLASS = "active-nav";

const highlightNav = () => {
  const scrollY = window.scrollY + 120;
  let currentId = "";
  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollY >= top && scrollY < bottom) {
      currentId = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle(ACTIVE_CLASS, link.dataset.section === currentId);
  });
};

window.addEventListener("scroll", highlightNav, { passive: true });
window.addEventListener("load", highlightNav);

// Smooth Scroll with Navbar Offset
const OFFSET = 100;
const SCROLL_BEHAVIOR = prefersReducedMotion() ? "auto" : "smooth";

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: SCROLL_BEHAVIOR });
    }
  });
});

// Skip to Content
document.getElementById("skip-to-content")?.addEventListener("click", (e) => {
  e.preventDefault();
  const main = document.querySelector("main");
  if (main) {
    main.setAttribute("tabindex", "-1");
    main.focus();
    window.scrollTo({ top: main.offsetTop - OFFSET, behavior: SCROLL_BEHAVIOR });
  }
});

// ============================================================
// SCROLL REVEAL ANIMATIONS — Fixed: no more disappearing sections
// ============================================================
// All .reveal elements are VISIBLE by default via CSS (opacity: 1, transform: none).
// GSAP uses fromTo() with clearStart: true so initial state never persists.
// If GSAP/ScrollTrigger fails, elements remain fully visible.
// ============================================================

safeAnimations(() => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const revealEls = gsap.utils.toArray(".reveal");
  if (!revealEls.length) return;

  revealEls.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 50, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );
  });

  // Refresh ScrollTrigger after fonts/images load so positions are correct
  window.addEventListener("load", () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 500);
});

// Highlights Stats Count-up with smooth easing
function initHighlightsStats() {
  const stats = document.querySelectorAll("#highlights-stats .stat-number");
  if (!stats.length) return;
  if (prefersReducedMotion()) {
    stats.forEach((el) => { el.textContent = el.dataset.target; });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = Math.min(target * 25, 2200);
        const start = performance.now();
        function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutCubic(progress);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach((el) => observer.observe(el));
}

// Smooth progress bar animation on scroll
function initProgressBars() {
  const fills = document.querySelectorAll(".progress-fill");
  if (!fills.length) return;
  if (prefersReducedMotion()) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetWidth = el.style.width || "0%";
        el.style.width = "0%";
        requestAnimationFrame(() => {
          el.style.width = targetWidth;
        });
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach((el) => observer.observe(el));
}

// Interest Card Animations
safeAnimations(() => {
  const interests = {
    travelling: { anim: 'interest-travel', duration: '4s' },
    gardening: { anim: 'interest-grow', duration: '3s' },
    cycling: { anim: 'interest-cycle', duration: '2.5s' },
    photography: { anim: 'interest-shutter', duration: '3.5s' },
  };
  document.querySelectorAll('.interest-card').forEach((card, i) => {
    const name = card.dataset.interest;
    const config = interests[name];
    if (!config) return;
    const icon = card.querySelector('.interest-icon');
    if (!icon) return;
    icon.style.setProperty('--interest-anim', config.anim);
    icon.style.setProperty('--interest-duration', config.duration);
    icon.style.setProperty('--interest-delay', `${i * 0.3}s`);
  });
});

initHighlightsStats();
initProgressBars();

// Contact Form with Client-side Validation
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

// Validation utilities
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
};

const validateContactForm = (name, email, message) => {
  const errors = [];

  if (!name || !name.trim()) {
    errors.push("Name is required.");
  } else if (name.length > 100) {
    errors.push("Name must not exceed 100 characters.");
  }

  if (!email || !email.trim()) {
    errors.push("Email is required.");
  } else if (email.length > 254) {
    errors.push("Email must not exceed 254 characters.");
  } else if (!validateEmail(email)) {
    errors.push("Please enter a valid email address.");
  }

  if (!message || !message.trim()) {
    errors.push("Message is required.");
  } else if (message.length > 5000) {
    errors.push("Message must not exceed 5000 characters.");
  } else if (message.trim().length < 20) {
    errors.push("Message must be at least 20 characters long.");
  }

  return errors;
};

const showValidationError = (errors) => {
  if (formMessage) {
    formMessage.innerHTML = errors.map(err => `<div class="error-item">• ${err}</div>`).join('');
    formMessage.style.color = "#f87171";
    formMessage.setAttribute("role", "alert");
    formMessage.setAttribute("aria-live", "polite");
  }
};

const clearMessage = () => {
  if (formMessage) {
    formMessage.textContent = "";
    formMessage.style.color = "inherit";
  }
};

if (contactForm) {
  // Real-time validation on input
  const nameInput = contactForm.querySelector('[name="name"]');
  const emailInput = contactForm.querySelector('[name="email"]');
  const messageInput = contactForm.querySelector('[name="message"]');

  [nameInput, emailInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener("blur", () => {
        const name = nameInput?.value || "";
        const email = emailInput?.value || "";
        const message = messageInput?.value || "";
        const errors = validateContactForm(name, email, message);
        if (errors.length > 0) {
          input.setAttribute("aria-invalid", "true");
        } else {
          input.setAttribute("aria-invalid", "false");
          clearMessage();
        }
      });
    }
  });

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearMessage();

    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    // Validate on submit
    const errors = validateContactForm(name, email, message);
    if (errors.length > 0) {
      showValidationError(errors);
      return;
    }

    const payload = { name, email, message };
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML || "";

    if (formMessage) {
      formMessage.textContent = "Sending...";
      formMessage.style.color = "#a78bfa";
      formMessage.setAttribute("aria-live", "polite");
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
    }

    try {
      const response = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to send message");
      if (formMessage) {
        formMessage.textContent = data.message;
        formMessage.style.color = "#4ade80";
        formMessage.setAttribute("role", "status");
        formMessage.setAttribute("aria-live", "polite");
      }
      contactForm.reset();
    } catch (error) {
      if (formMessage) {
        formMessage.textContent = error.message;
        formMessage.style.color = "#f87171";
        formMessage.setAttribute("role", "alert");
        formMessage.setAttribute("aria-live", "polite");
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}