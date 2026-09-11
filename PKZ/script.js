document.addEventListener("DOMContentLoaded", () => {
  // Animação de Scroll
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

  // Lógica do Modal de Contato
  const modal = document.getElementById("contact-modal");
  const openModalBtn = document.getElementById("open-contact-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const nameInput = document.getElementById("name");
  const wppBtn = document.getElementById("whatsapp-cta");

  function openModal(e) {
    if (e) e.preventDefault();
    if (!modal) return;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Previne scroll de fundo
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

  if (openModalBtn) {
    openModalBtn.addEventListener("click", openModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // Lógica do WhatsApp Isolada para PKZ
  if (wppBtn) {
    wppBtn.addEventListener("click", () => {
      const userName = nameInput?.value?.trim() || "Atleta";
      const message = `Fala equipe PKZ! Meu nome é ${userName} e gostaria de saber mais sobre as modalidades.`;
      const url = `https://wa.me/5521000000000?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    });
  }

  // Lógica da Seta Voltar ao Topo (scroll ligeiramente rápido)
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

      const duration = 650; // Duração ideal para uma subida fluida e suave
      const startTime = performance.now();

      function scrollStep(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Curva suave ease-in-out (início e fim desacelerados suavemente)
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
