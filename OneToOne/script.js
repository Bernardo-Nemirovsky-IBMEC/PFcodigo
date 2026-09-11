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

  // Lógica do WhatsApp Isolada para One To One
  const wppBtn = document.getElementById("whatsapp-cta");
  const nameInput = document.getElementById("name");

  if (wppBtn) {
    wppBtn.addEventListener("click", () => {
      const userName = nameInput.value || "um visitante";
      const message = `Olá, equipe One To One. Me chamo ${userName} e gostaria de agendar uma avaliação.`;
      const url = `https://wa.me/5521000000000?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    });
  }
});
