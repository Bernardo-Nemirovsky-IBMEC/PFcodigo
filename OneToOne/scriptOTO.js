function smoothScrollTo(targetY, duration = 1000) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutQuad(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

document.addEventListener("DOMContentLoaded", () => {
  // Configuração refinada do IntersectionObserver para renderização baseada na rolagem
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
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
    link.addEventListener("click", (e) => {
      closeMobileMenu();
      const targetId = link.getAttribute("href");
      if (link.id === "open-contact-modal" || targetId === "#") return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const headerHeight =
          document.querySelector(".site-header")?.offsetHeight || 60;
        const targetPosition =
          targetSection.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;
        window.scrollTo({ top: targetPosition, behavior: "smooth" });
      }
    });
  });

  const modal = document.getElementById("contact");
  const openModalBtn = document.getElementById("open-contact-modal");
  const openModalHeroBtn = document.getElementById("open-contact-hero");
  const closeModalBtn = document.getElementById("close-modal");
  const nameInput = document.getElementById("name");
  const wppBtn = document.getElementById("whatsapp-cta");

  function openModal(e) {
    if (e) e.preventDefault();
    if (!modal) return;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 150);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  if (openModalBtn) openModalBtn.addEventListener("click", openModal);
  if (openModalHeroBtn) openModalHeroBtn.addEventListener("click", openModal);
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
  if (modal)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

  if (wppBtn) {
    wppBtn.addEventListener("click", () => {
      const userName = nameInput?.value?.trim() || "um visitante";
      const message = `Olá, equipe One To One. Me chamo ${userName} e gostaria de agendar uma avaliação.`;
      const url = `https://wa.me/5521000000000?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    });
  }

  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) backToTopBtn.classList.add("show");
      else backToTopBtn.classList.remove("show");
    });
    backToTopBtn.addEventListener("click", () => {
      smoothScrollTo(0, 1200);
    });
  }
});
