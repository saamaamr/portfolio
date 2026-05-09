const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const safeAnimations = (animFn, fallbackFn) => {
  if (prefersReducedMotion()) { fallbackFn?.(); return; }
  animFn();
};

// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Tech Stack Web Drift
safeAnimations(() => {
  const techItems = document.querySelectorAll(".tech-item");
  const driftDirs = ["drift-up", "drift-down", "drift-left", "drift-right"];
  techItems.forEach((el, i) => {
    el.style.setProperty("--delay", (i * 0.15).toFixed(2) + "s");
    el.style.setProperty("--anim", driftDirs[Math.floor(i / 2) % 4]);
  });
});

// Skill Tags Leaf Drift
safeAnimations(() => {
  const skillTags = document.querySelectorAll(".skill-tag");
  const leafAnims = ["leaf-drift", "leaf-drift-alt"];
  skillTags.forEach((el, i) => {
    el.style.setProperty("--leaf-delay", (i * 0.12).toFixed(2) + "s");
    el.style.setProperty("--leaf-anim", leafAnims[i % 2]);
  });
});

// Typewriter Effect
const typedText = document.getElementById("typed-text");
const cursor = document.querySelector(".typed-cursor");
const roles = ["Abdullah Al Mamun", "Technical Support Engineer", "Web Application Developer"];

if (typedText) {
  if (prefersReducedMotion()) {
    typedText.textContent = roles[0];
  } else {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    const typeAnimation = () => {
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
const mobileBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

const closeMobile = () => {
  if (!mobileMenu || !mobileBtn) return;
  mobileMenu.classList.add("hidden");
  mobileBtn.setAttribute("aria-expanded", "false");
  mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
};

const openMobile = () => {
  if (!mobileMenu || !mobileBtn) return;
  mobileMenu.classList.remove("hidden");
  mobileBtn.setAttribute("aria-expanded", "true");
  mobileBtn.innerHTML = '<i class="fas fa-times"></i>';
  mobileMenu.querySelector("a")?.focus();
};

const toggleMobile = () => {
  if (mobileMenu.classList.contains("hidden")) {
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
    if (e.key === "Escape") closeMobile();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) closeMobile();
  });
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

// Contact Form
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {
// Highlights Stats Count-up
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
        const duration = Math.min(target * 20, 2000);
        const start = performance.now();
        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          el.textContent = Math.floor(progress * target);
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

safeAnimations(() => {
  // Enhanced reveal: scale + fade with stagger
  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play reverse play reverse",
      },
    });
  });
});

initHighlightsStats();

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerHTML || "";

    if (formMessage) {
      formMessage.textContent = "Sending...";
      formMessage.style.color = "#a78bfa";
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
      }
      contactForm.reset();
    } catch (error) {
      if (formMessage) {
        formMessage.textContent = error.message;
        formMessage.style.color = "#f87171";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}
