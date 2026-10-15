// Dados da marca vêm de ../shared/data.js (fonte única); cada <html> define data-brand.
const BRAND = window.SITE_DATA.brands[document.documentElement.dataset.brand];

document.addEventListener("DOMContentLoaded", () => {
  // Configuração refinada do IntersectionObserver para renderização baseada na rolagem
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".animate-on-scroll")
    .forEach((el) => observer.observe(el));

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const primaryNav = document.getElementById("primary-navigation");
  const menuOverlay = document.getElementById("mobile-menu-overlay");

  function toggleMobileMenu() {
    if (!mobileMenuBtn || !primaryNav) return;
    const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
    mobileMenuBtn.classList.toggle("active");
    primaryNav.classList.toggle("nav-open");
    mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
    if (menuOverlay) menuOverlay.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  }

  function closeMobileMenu() {
    if (!mobileMenuBtn || !primaryNav) return;
    mobileMenuBtn.classList.remove("active");
    primaryNav.classList.remove("nav-open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    if (menuOverlay) menuOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  if (menuOverlay) menuOverlay.addEventListener("click", closeMobileMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });

  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", () => closeMobileMenu());
  });

  const modal = document.getElementById("contact");
  const openModalBtn = document.getElementById("open-contact-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const nameInput = document.getElementById("name");
  const wppBtn = document.getElementById("whatsapp-cta");

  // <dialog> nativo: ESC, trava de foco e retorno do foco ao gatilho são do navegador.
  function openModal(e) {
    if (e) e.preventDefault();
    if (!modal) return;
    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    document.body.classList.add("no-scroll");
  }

  if (openModalBtn) openModalBtn.addEventListener("click", openModal);
  if (modal) {
    const closeModal = () => {
      if (typeof modal.close === "function") return modal.close();
      modal.removeAttribute("open"); // fallback sem <dialog>: dispara o "close" na mão
      modal.dispatchEvent(new Event("close"));
    };
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    modal.addEventListener("close", () => {
      document.body.classList.remove("no-scroll");
      openModalBtn?.focus(); // Safari não foca <button> ao clicar; garante o retorno ao gatilho
    });
  }

  if (wppBtn) {
    wppBtn.addEventListener("click", () => {
      const userName = nameInput?.value?.trim() || BRAND.contactFallbackName;
      const url = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(BRAND.contactMessage(userName))}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) backToTopBtn.classList.add("show");
      else backToTopBtn.classList.remove("show");
    }, { passive: true });
    backToTopBtn.addEventListener("click", () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }
});
