function getFocusable(container) {
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => el.offsetParent !== null);
}

function trapFocus(e, container) {
  if (e.key !== "Tab") return;
  const focusable = getFocusable(container);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

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
  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -60px 0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
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

  // Modal "Contato" (WhatsApp) — mesmo padrão usado em indexPKZ.html
  const contactModal = document.getElementById("contact");
  const openContactBtn = document.getElementById("open-contact-modal");
  const closeContactBtn = document.getElementById("close-modal");
  const nameInput = document.getElementById("name");
  const wppBtn = document.getElementById("whatsapp-cta");
  let lastFocusedBeforeContact = null;

  function openContactModal(e) {
    if (e) e.preventDefault();
    if (!contactModal) return;
    lastFocusedBeforeContact = document.activeElement;
    contactModal.classList.add("active");
    contactModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 150);
  }

  function closeContactModal() {
    if (!contactModal) return;
    contactModal.classList.remove("active");
    contactModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocusedBeforeContact) lastFocusedBeforeContact.focus();
  }

  if (openContactBtn) openContactBtn.addEventListener("click", openContactModal);
  if (closeContactBtn) closeContactBtn.addEventListener("click", closeContactModal);
  if (contactModal) {
    contactModal.addEventListener("click", (e) => {
      if (e.target === contactModal) closeContactModal();
    });
    contactModal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeContactModal();
      else trapFocus(e, contactModal);
    });
  }

  if (wppBtn) {
    wppBtn.addEventListener("click", () => {
      const userName = nameInput?.value?.trim() || "Atleta";
      const message = `Fala equipe PKZ! Meu nome é ${userName} e gostaria de saber mais sobre as modalidades.`;
      const url = `https://wa.me/5521000000000?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
    });
  }

  // Modal "Aula Experimental"
  const bookingModal = document.getElementById("booking-modal");
  const bookingCloseBtn = document.getElementById("booking-close-modal");
  const bookingBadge = document.getElementById("booking-slot-badge");
  const bookingForm = document.getElementById("booking-form");
  const bookingError = document.getElementById("booking-error");
  const bookingConfirmation = document.getElementById("booking-confirmation");
  const bookingConfirmationText = document.getElementById(
    "booking-confirmation-text",
  );
  const bookingDoneBtn = document.getElementById("booking-done-btn");
  const bookingNameInput = document.getElementById("booking-name");
  const bookingPhoneInput = document.getElementById("booking-phone");
  const bookingCpfInput = document.getElementById("booking-cpf");

  let selectedSlot = null;
  let lastFocusedBeforeBooking = null;

  function openBookingModal(day, time, trigger) {
    if (!bookingModal) return;
    lastFocusedBeforeBooking = trigger || document.activeElement;
    selectedSlot = { day, time };
    if (bookingBadge) bookingBadge.textContent = `${day} · ${time}`;
    if (bookingForm) bookingForm.hidden = false;
    if (bookingConfirmation) bookingConfirmation.hidden = true;
    if (bookingError) bookingError.hidden = true;
    bookingModal.classList.add("active");
    bookingModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    setTimeout(() => {
      if (bookingNameInput) bookingNameInput.focus();
    }, 150);
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove("active");
    bookingModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lastFocusedBeforeBooking) lastFocusedBeforeBooking.focus();
  }

  document.querySelectorAll(".schedule-slot").forEach((slot) => {
    slot.addEventListener("click", () =>
      openBookingModal(slot.dataset.day, slot.dataset.time, slot),
    );
  });

  if (bookingCloseBtn)
    bookingCloseBtn.addEventListener("click", closeBookingModal);
  if (bookingDoneBtn) bookingDoneBtn.addEventListener("click", closeBookingModal);
  if (bookingModal) {
    bookingModal.addEventListener("click", (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
    bookingModal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeBookingModal();
      else trapFocus(e, bookingModal);
    });
  }

  if (bookingCpfInput) {
    bookingCpfInput.addEventListener("input", () => {
      let v = bookingCpfInput.value.replace(/\D/g, "").slice(0, 11);
      v = v
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      bookingCpfInput.value = v;
    });
  }

  if (bookingPhoneInput) {
    bookingPhoneInput.addEventListener("input", () => {
      let v = bookingPhoneInput.value.replace(/\D/g, "").slice(0, 11);
      if (v.length > 6)
        v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
      else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, "($1) $2");
      bookingPhoneInput.value = v;
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = bookingNameInput?.value.trim() || "";
      const phone = bookingPhoneInput?.value.trim() || "";
      const cpfDigits = bookingCpfInput?.value.replace(/\D/g, "") || "";

      if (!name || !phone || cpfDigits.length !== 11) {
        if (bookingError) {
          bookingError.textContent =
            "Preencha nome, telefone e um CPF válido (11 dígitos).";
          bookingError.hidden = false;
        }
        return;
      }

      if (bookingError) bookingError.hidden = true;
      if (bookingConfirmationText && selectedSlot) {
        bookingConfirmationText.textContent = `Aula marcada para ${selectedSlot.day} às ${selectedSlot.time}! Entraremos em contato.`;
      }
      if (bookingForm) bookingForm.hidden = true;
      if (bookingConfirmation) bookingConfirmation.hidden = false;
      bookingForm.reset();
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
