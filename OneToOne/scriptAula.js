// Dados da marca vêm de ../shared/data.js (fonte única); cada <html> define data-brand.
const BRAND = window.SITE_DATA.brands[document.documentElement.dataset.brand];
const SCHEDULE = BRAND.schedule;

// <dialog> nativo: ESC, trava de foco e backdrop são do navegador (fallback mínimo p/ navegadores sem showModal).
function showDialog(dialog) {
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
  document.body.classList.add("no-scroll");
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function") return dialog.close();
  dialog.removeAttribute("open");
  dialog.dispatchEvent(new Event("close"));
}

function whatsappUrl(message) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`;
}

// CPF com dígitos verificadores válidos (rejeita sequências como 111.111.111-11).
function isValidCpf(digits) {
  if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) return false;
  for (let len = 9; len < 11; len++) {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(digits[i]) * (len + 1 - i);
    if (((sum * 10) % 11) % 10 !== Number(digits[len])) return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
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

  // Com o menu aberto, só o header (botão + links) recebe foco: o resto da página fica inerte.
  const setPageInert = (on) =>
    document
      .querySelectorAll("body > *:not(header):not(#mobile-menu-overlay):not(script)")
      .forEach((el) => (el.inert = on));

  function toggleMobileMenu() {
    if (!mobileMenuBtn || !primaryNav) return;
    const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
    setPageInert(!isExpanded);
    mobileMenuBtn.classList.toggle("active");
    primaryNav.classList.toggle("nav-open");
    mobileMenuBtn.setAttribute("aria-expanded", !isExpanded);
    if (menuOverlay) menuOverlay.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  }

  function closeMobileMenu(returnFocus = false) {
    if (!mobileMenuBtn || !primaryNav) return;
    const wasOpen = mobileMenuBtn.getAttribute("aria-expanded") === "true";
    setPageInert(false);
    mobileMenuBtn.classList.remove("active");
    primaryNav.classList.remove("nav-open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    if (menuOverlay) menuOverlay.classList.remove("active");
    document.body.classList.remove("no-scroll");
    if (returnFocus && wasOpen) mobileMenuBtn.focus(); // Esc devolve o foco ao botão do menu
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  if (menuOverlay) menuOverlay.addEventListener("click", () => closeMobileMenu());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu(true);
  });

  // Devolve o foco ao gatilho do diálogo; se ele está dentro do menu recolhido (mobile), vai ao botão do menu.
  const focusTrigger = (el) => {
    const visible = el && el.getClientRects().length && getComputedStyle(el).visibility !== "hidden";
    (visible ? el : mobileMenuBtn)?.focus();
  };

  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  navLinks.forEach((link) => {
    link.addEventListener("click", () => closeMobileMenu());
  });

  // Modal "Contato" (WhatsApp)
  const contactModal = document.getElementById("contact");
  const openContactBtn = document.getElementById("open-contact-modal");
  const closeContactBtn = document.getElementById("close-modal");
  const nameInput = document.getElementById("name");
  const wppBtn = document.getElementById("whatsapp-cta");

  if (openContactBtn) {
    openContactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (contactModal) showDialog(contactModal);
    });
  }
  if (contactModal) {
    if (closeContactBtn) closeContactBtn.addEventListener("click", () => closeDialog(contactModal));
    contactModal.addEventListener("click", (e) => {
      if (e.target === contactModal) closeDialog(contactModal);
    });
    contactModal.addEventListener("close", () => {
      document.body.classList.remove("no-scroll");
      focusTrigger(openContactBtn); // Safari não foca <button> ao clicar; garante o retorno ao gatilho
    });
  }

  if (wppBtn) {
    wppBtn.addEventListener("click", () => {
      const userName = nameInput?.value?.trim() || BRAND.contactFallbackName;
      window.open(whatsappUrl(BRAND.contactMessage(userName)), "_blank", "noopener,noreferrer");
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
  const bookingModalityInput = document.getElementById("booking-modality");
  const bookingNameInput = document.getElementById("booking-name");
  const bookingPhoneInput = document.getElementById("booking-phone");
  const bookingCpfInput = document.getElementById("booking-cpf");
  const bookingNotesInput = document.getElementById("booking-notes");
  const bookingConsentInput = document.getElementById("booking-consent");

  if (bookingModalityInput) {
    BRAND.modalities.forEach((m) => bookingModalityInput.add(new Option(m, m)));
  }

  let selectedSlot = null;
  let bookingTrigger = null;

  function openBookingModal(day, time, trigger) {
    if (!bookingModal) return;
    bookingTrigger = trigger || document.activeElement;
    selectedSlot = { day, time };
    if (bookingBadge) bookingBadge.textContent = `${day} · ${time}`;
    if (bookingForm) bookingForm.hidden = false;
    if (bookingConfirmation) bookingConfirmation.hidden = true;
    if (bookingError) bookingError.hidden = true;
    showDialog(bookingModal); // o select de modalidade tem autofocus
  }

  // Agenda: chips de dia + lista de horários, gerados a partir de SCHEDULE.
  const dayChips = document.getElementById("day-chips");
  const timeList = document.getElementById("time-list");
  const timeHeading = document.getElementById("time-heading");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let selectedDay = null;

  function selectDay(day, { smooth = false } = {}) {
    selectedDay = day;
    dayChips.querySelectorAll(".day-chip").forEach((chip) => {
      const on = chip.dataset.day === day.name;
      chip.setAttribute("aria-pressed", String(on));
      if (on) {
        // Centraliza o chip na faixa rolável (mobile) sem rolar a página.
        dayChips.scrollTo({
          left: chip.offsetLeft - (dayChips.clientWidth - chip.offsetWidth) / 2,
          behavior: smooth && !reduceMotion ? "smooth" : "auto",
        });
      }
    });
    timeHeading.textContent = `Horários de ${day.name}`;
    timeList.replaceChildren(
      ...SCHEDULE.times.map((time) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "time-slot";
        btn.dataset.time = time;
        btn.textContent = time;
        btn.setAttribute("aria-label", `${day.name} às ${time}`);
        li.append(btn);
        return li;
      }),
    );
    // Reinicia o fade curto (desligado em prefers-reduced-motion via CSS).
    timeList.classList.remove("is-fresh");
    void timeList.offsetWidth;
    timeList.classList.add("is-fresh");
  }

  if (dayChips && timeList && timeHeading) {
    SCHEDULE.days.forEach((day) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "day-chip";
      chip.dataset.day = day.name;
      chip.textContent = day.short;
      chip.setAttribute("aria-label", day.name);
      chip.setAttribute("aria-pressed", "false");
      dayChips.append(chip);
    });
    dayChips.addEventListener("click", (e) => {
      const chip = e.target.closest(".day-chip");
      if (!chip) return;
      selectDay(SCHEDULE.days.find((d) => d.name === chip.dataset.day), { smooth: true });
    });
    timeList.addEventListener("click", (e) => {
      const slot = e.target.closest(".time-slot");
      if (slot) openBookingModal(selectedDay.name, slot.dataset.time, slot);
    });
    const today = new Date().getDay();
    selectDay(SCHEDULE.days.find((d) => d.dow === today) || SCHEDULE.days[0]);
  }

  if (bookingModal) {
    const close = () => closeDialog(bookingModal);
    if (bookingCloseBtn) bookingCloseBtn.addEventListener("click", close);
    if (bookingDoneBtn) bookingDoneBtn.addEventListener("click", close);
    bookingModal.addEventListener("click", (e) => {
      if (e.target === bookingModal) close();
    });
    bookingModal.addEventListener("close", () => {
      document.body.classList.remove("no-scroll");
      bookingTrigger?.focus();
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
    // (21) 3333-4444 para fixo, (21) 99999-9999 para celular; hífen só depois que houver dígito.
    bookingPhoneInput.addEventListener("input", () => {
      const v = bookingPhoneInput.value.replace(/\D/g, "").slice(0, 11);
      let out = v;
      if (v.length > 6) {
        const split = v.length === 11 ? 7 : 6;
        out = `(${v.slice(0, 2)}) ${v.slice(2, split)}-${v.slice(split)}`;
      } else if (v.length > 2) {
        out = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      }
      bookingPhoneInput.value = out;
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const modality = bookingModalityInput?.value || "";
      const name = bookingNameInput?.value.trim() || "";
      const phone = bookingPhoneInput?.value.trim() || "";
      const phoneDigits = phone.replace(/\D/g, "");
      const cpf = bookingCpfInput?.value.trim() || "";
      const notes = bookingNotesInput?.value.trim() || "";

      const problems = [
        [!modality, bookingModalityInput, "a modalidade"],
        [!name, bookingNameInput, "seu nome"],
        [phoneDigits.length < 10, bookingPhoneInput, "um telefone com DDD"],
        [!isValidCpf(cpf.replace(/\D/g, "")), bookingCpfInput, "um CPF válido"],
        [!bookingConsentInput?.checked, bookingConsentInput, "a autorização de uso dos dados"],
      ].filter(([invalid]) => invalid);

      [bookingModalityInput, bookingNameInput, bookingPhoneInput, bookingCpfInput, bookingConsentInput]
        .forEach((el) => el?.removeAttribute("aria-invalid"));

      if (problems.length) {
        problems.forEach(([, el]) => el?.setAttribute("aria-invalid", "true"));
        if (bookingError) {
          bookingError.textContent = `Falta informar: ${problems.map(([, , label]) => label).join(", ")}.`;
          bookingError.hidden = false;
        }
        problems[0][1]?.focus();
        return;
      }

      if (bookingError) bookingError.hidden = true;

      const slotText = selectedSlot ? `${selectedSlot.day} às ${selectedSlot.time}` : "";
      const message = [
        `Olá, equipe ${BRAND.name}! Quero agendar uma aula experimental pelo site.`,
        `Horário: ${slotText}`,
        `Modalidade: ${modality}`,
        `Nome: ${name}`,
        `Telefone: ${phone}`,
        `CPF: ${cpf}`,
        notes && `Observação: ${notes}`,
      ]
        .filter(Boolean)
        .join("\n");
      window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");

      if (bookingConfirmationText) {
        bookingConfirmationText.textContent = `Abrimos o WhatsApp com o seu pedido para ${slotText}. Envie a mensagem para a equipe confirmar o horário.`;
      }
      if (bookingForm) bookingForm.hidden = true;
      if (bookingConfirmation) bookingConfirmation.hidden = false;
      bookingDoneBtn?.focus();
      bookingForm.reset();
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
