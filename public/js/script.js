gsap.registerPlugin(ScrollTrigger);

// GSAP Scroll Animations
gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
});

// Tech Stack Web Drift
const techItems = document.querySelectorAll(".tech-item");
const driftDirs = ["drift-up", "drift-down", "drift-left", "drift-right"];
techItems.forEach((el, i) => {
  el.style.setProperty("--delay", (i * 0.15).toFixed(2) + "s");
  el.style.setProperty("--anim", driftDirs[Math.floor(i / 2) % 4]);
});

// Skill Tags Leaf Drift
const skillTags = document.querySelectorAll(".skill-tag");
const leafAnims = ["leaf-drift", "leaf-drift-alt"];
skillTags.forEach((el, i) => {
  el.style.setProperty("--leaf-delay", (i * 0.12).toFixed(2) + "s");
  el.style.setProperty("--leaf-anim", leafAnims[i % 2]);
});

// Typewriter Effect
const typedText = document.getElementById("typed-text");
const roles = ["Abdullah Al Mamun", "Full Stack Developer", "Web Application Builder"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

const typeAnimation = () => {
  if (!typedText) return;
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

// ===== NAVBAR FUNCTIONALITY =====

// Theme Toggle
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

const applyTheme = (theme) => {
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.setProperty("color-scheme", "dark");
  } else {
    root.classList.remove("dark");
    root.style.setProperty("color-scheme", "light");
  }
};

const setTheme = (theme) => {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  applyTheme(theme);
  if (themeToggle) {
    themeToggle.innerHTML =
      theme === "dark"
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  }
};

const initTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) {
    setTheme(saved);
  } else {
    setTheme(prefersDark ? "dark" : "light");
  }
};

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const current = root.getAttribute("data-theme") || "light";
    setTheme(current === "dark" ? "light" : "dark");
  });
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) setTheme(e.matches ? "dark" : "light");
  });

initTheme();

// Mobile Menu
const mobileBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
let mobileOpen = false;

const openMobile = () => {
  mobileOpen = true;
  mobileMenu.style.display = "block";
  requestAnimationFrame(() => {
    mobileMenu.style.opacity = "1";
    mobileMenu.style.transform = "translateY(0)";
  });
  mobileBtn.setAttribute("aria-expanded", "true");
  mobileBtn.innerHTML = '<i class="fas fa-times"></i>';
};

const closeMobile = () => {
  mobileOpen = false;
  mobileMenu.style.opacity = "0";
  mobileMenu.style.transform = "translateY(-8px)";
  setTimeout(() => {
    mobileMenu.style.display = "none";
  }, 200);
  mobileBtn.setAttribute("aria-expanded", "false");
  mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
};

if (mobileBtn && mobileMenu) {
  mobileMenu.style.opacity = "0";
  mobileMenu.style.transform = "translateY(-8px)";
  mobileMenu.style.transition = "opacity 0.2s ease, transform 0.2s ease";

  mobileBtn.addEventListener("click", () => {
    mobileOpen ? closeMobile() : openMobile();
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobile);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileOpen) closeMobile();
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
    const section = link.dataset.section;
    if (section === currentId) {
      link.classList.add(ACTIVE_CLASS);
    } else {
      link.classList.remove(ACTIVE_CLASS);
    }
  });
};

window.addEventListener("scroll", highlightNav, { passive: true });
window.addEventListener("load", highlightNav);

// Smooth Scroll with Navbar Offset
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : "";
    if (formMessage) {
      formMessage.textContent = "Sending...";
      formMessage.style.color = "#a78bfa";
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
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
