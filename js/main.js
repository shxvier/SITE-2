// main.js
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const page = document.querySelector(".page");

  /* ========= ТЕМА ========= */
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  }

  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "light" ? "light" : "dark";
      const next = current === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      showToast(
        next === "dark" ? "Тёмная тема включена." : "Светлая тема включена.",
        "info"
      );
    });
  }

  /* ========= САКУРА ========= */
  const sakuraContainer = document.querySelector(".sakura-container");
  if (sakuraContainer) {
    const petals = 26;
    for (let i = 0; i < petals; i++) {
      const petal = document.createElement("div");
      petal.className = "sakura-petal";

      const startX = Math.random() * 100;
      const endX = startX + (Math.random() * 20 - 10);
      const duration = 14 + Math.random() * 8;
      const delay = -Math.random() * duration;

      petal.style.setProperty("--x-start", startX + "vw");
      petal.style.setProperty("--x-end", endX + "vw");
      petal.style.animationDuration = `${duration}s, ${6 + Math.random() * 4}s`;
      petal.style.animationDelay = `${delay}s, ${delay}s`;

      sakuraContainer.appendChild(petal);
    }
  }

  /* ========= REVEAL ПРИ СКРОЛЛЕ ========= */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("reveal--visible"));
  }

  /* ========= TOAST‑УВЕДОМЛЕНИЯ ========= */
  const toastRoot =
    document.querySelector(".toast-root") ||
    (() => {
      const root = document.createElement("div");
      root.className = "toast-root";
      document.body.appendChild(root);
      return root;
    })();

  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${
        type === "success" ? "✔" : type === "info" ? "✦" : "!"
      }</div>
      <div class="toast-message">${message}</div>
    `;
    toastRoot.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3800);
  }

  window.showToast = showToast;

  /* ========= КОЛОКОЛЬЧИК / ПАНЕЛЬ ========= */
  const bell = document.querySelector("[data-notification-bell]");
  const panel = document.querySelector(".notifications-panel");
  if (bell && panel) {
    const dot = bell.querySelector(".notification-dot");

    function togglePanel() {
      const isHidden = panel.hasAttribute("hidden");
      if (isHidden) {
        panel.removeAttribute("hidden");
        dot && dot.remove();
      } else {
        panel.setAttribute("hidden", "");
      }
    }

    bell.addEventListener("click", () => {
      togglePanel();
      showToast("Открыта панель уведомлений.", "info");
    });

    document.addEventListener("click", (e) => {
      if (!panel.hasAttribute("hidden")) {
        if (!panel.contains(e.target) && !bell.contains(e.target)) {
          panel.setAttribute("hidden", "");
        }
      }
    });
  }

  /* ========= МОБИЛЬНОЕ МЕНЮ ========= */
  const navToggle = document.querySelector("[data-nav-toggle]");
  if (navToggle && page) {
    navToggle.addEventListener("click", () => {
      page.classList.toggle("page--nav-open");
    });
  }

  /* ========= ПЛАВНЫЙ СКРОЛЛ ========= */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const rect = target.getBoundingClientRect();
        const top = rect.top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
        if (page && page.classList.contains("page--nav-open")) {
          page.classList.remove("page--nav-open");
        }
      }
    });
  });

  /* ========= ФОРМА КОНТАКТА ========= */
  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const name = formData.get("name")?.toString().trim();
      const email = formData.get("email")?.toString().trim();
      const message = formData.get("message")?.toString().trim();

      if (!name || !email || !message) {
        showToast("Заполни все поля формы.", "info");
        return;
      }

      showToast("Сообщение отправлено. Ответ в течение 24 часов.", "success");
      contactForm.reset();
    });
  }

  /* ========= КОПИРОВАНИЕ ПОЧТЫ ========= */
  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.getAttribute("data-copy-email");
      if (!email) return;
      navigator.clipboard
        .writeText(email)
        .then(() => showToast("Почта скопирована в буфер обмена.", "success"))
        .catch(() => showToast("Не удалось скопировать почту.", "info"));
    });
  });
});
