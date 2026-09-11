document.addEventListener("DOMContentLoaded", () => {
  // ── Animação de Scroll ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  });

  document
    .querySelectorAll(".animate-on-scroll")
    .forEach((el) => observer.observe(el));

  // ── Smooth Scroll para Links Internos (com compensação de Header Fixo) ──
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      // Se for o botão de contato ou âncora vazia, deixa o handler específico agir
      if (link.id === "open-contact-modal" || targetId === "#") return;

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        const headerHeight =
          document.querySelector(".site-header")?.offsetHeight || 75;
        const targetPosition =
          targetSection.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ── Lógica do Modal de Contato ──
  const modal = document.getElementById("contact-modal");
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
    document.body.style.overflow = "hidden"; // Previne scroll do fundo
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 150);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Abre pelo nav "Contato"
  if (openModalBtn) {
    openModalBtn.addEventListener("click", openModal);
  }

  // Abre pelo CTA "Agendar Avaliação" do hero
  if (openModalHeroBtn) {
    openModalHeroBtn.addEventListener("click", openModal);
  }

  // Fecha pelo botão ×
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  // Fecha ao clicar no fundo (overlay)
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Fecha com Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // ── Lógica do WhatsApp — One To One ──
  if (wppBtn) {
    wppBtn.addEventListener("click", () => {
      const userName = nameInput?.value?.trim() || "um visitante";
      const message = `Olá, equipe One To One. Me chamo ${userName} e gostaria de agendar uma avaliação.`;
      const url = `https://wa.me/5521000000000?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    });
  }

  // ── Botão Voltar ao Topo ──
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      const startY = window.scrollY;
      if (startY <= 0) return;

      const duration = 650;
      const startTime = performance.now();

      function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Curva ease-in-out cúbica (suave nos extremos)
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startY * (1 - ease));

        if (progress < 1) {
          requestAnimationFrame(scrollStep);
        }
      }

      requestAnimationFrame(scrollStep);
    });
  }
});
