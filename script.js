const PKZ_URL = "PKZ/indexPKZ.html";
const OTO_URL = "OneToOne/indexOTO.html";
const EDGE = 10; // soltar com p <= 10 (PKZ) ou p >= 90 (One To One) redireciona

const handle = document.getElementById("handle");
const track = document.getElementById("track");
const pkzPanel = document.getElementById("pkz");
const pkzInner = pkzPanel.querySelector(".p-inner");
const otoInner = document.querySelector("#oto .p-inner");
const fillL = document.getElementById("fill-l");
const fillR = document.getElementById("fill-r");
const divLine = document.getElementById("div-line");
const arrL = document.getElementById("arr-l");
const arrR = document.getElementById("arr-r");
const redir = document.getElementById("redir");
const rName = document.getElementById("redir-name");
const redirCancel = document.getElementById("redir-cancel");

const dragHint = document.getElementById("drag-hint");

const hintPkzBox = document.getElementById("hint-pkz-box");

const btnPkzCta = document.getElementById("btn-pkz-cta");
const btnOtoCta = document.getElementById("btn-oto-cta");

let dragging = false;
let redirected = false;
let hasDragged = false;
let redirTimer = null;
let pos = 50;

function toPercent(clientX) {
  const r = track.getBoundingClientRect();
  return Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
}

// Conteúdo do painel: 0 abaixo de 22% de largura, 1 acima de 38%, linear no meio
function fadeInner(el, width) {
  const o = Math.max(0, Math.min(1, (width - 22) / 16));
  el.style.opacity = o;
  el.style.visibility = o === 0 ? "hidden" : "visible";
  el.inert = o === 0;
}

function apply(p) {
  pos = p;
  handle.style.left = p + "%";
  handle.setAttribute("aria-valuenow", Math.round(p));
  handle.setAttribute(
    "aria-valuetext",
    p <= EDGE
      ? "PKZ. Pressione Enter para visitar"
      : p >= 100 - EDGE
        ? "One To One. Pressione Enter para visitar"
        : p < 45
          ? "Mais perto da PKZ"
          : p > 55
            ? "Mais perto da One To One"
            : "Centro",
  );

  const pkzWidth = 100 - p;

  pkzPanel.style.width = pkzWidth + "%";
  divLine.style.left = `calc(${pkzWidth}% - 1px)`;
  fillL.style.width = pkzWidth + "%";
  fillR.style.width = p + "%";
  fadeInner(pkzInner, pkzWidth);
  fadeInner(otoInner, p);

  if (hintPkzBox) {
    hintPkzBox.style.width = pkzWidth + "%";
  }

  // sinal de "solte para entrar"
  arrL.classList.toggle("on", p <= EDGE);
  arrR.classList.toggle("on", p >= 100 - EDGE);
}

// Só redireciona ao soltar (ou Enter/Espaço) perto de uma borda
function commit(ms) {
  if (pos <= EDGE) doRedirect("PKZ", "#07111e", "#ffffff", PKZ_URL, ms);
  else if (pos >= 100 - EDGE)
    doRedirect("ONE TO ONE", "#014c6f", "#ffffff", OTO_URL, ms);
}

// Quem usa teclado/leitor de tela ganha mais tempo para ouvir o aviso e cancelar (900ms para ponteiro).
const REDIRECT_MS = 900;
const REDIRECT_MS_KEYBOARD = 3000;
// Enquanto o aviso está aberto o resto da página fica inerte (foco preso no botão Cancelar).
const behind = () => document.querySelectorAll("#bar, main, #site-footer");

function doRedirect(name, bg, color, url, ms = REDIRECT_MS) {
  if (redirected) return;
  redirected = true;
  behind().forEach((el) => (el.inert = true));
  redir.style.background = bg;
  redir.style.color = color;
  rName.textContent = name;
  redir.hidden = false;
  void redir.offsetWidth;
  redir.classList.add("on");
  redirCancel.focus();
  redirTimer = setTimeout(() => {
    window.location.href = url;
  }, ms);
}

function cancelRedirect() {
  clearTimeout(redirTimer);
  redirected = false;
  behind().forEach((el) => (el.inert = false));
  redir.classList.remove("on");
  redir.hidden = true;
  apply(50);
}

redirCancel.addEventListener("click", () => {
  cancelRedirect();
  handle.focus();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && redirected) redirCancel.click();
});

if (btnPkzCta) {
  btnPkzCta.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    // e.detail === 0: ativado por teclado (Enter) ou tecnologia assistiva
    doRedirect("PKZ", "#07111e", "#ffffff", PKZ_URL, e.detail === 0 ? REDIRECT_MS_KEYBOARD : REDIRECT_MS);
  });
}

if (btnOtoCta) {
  btnOtoCta.addEventListener("click", (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    doRedirect("ONE TO ONE", "#014c6f", "#ffffff", OTO_URL, e.detail === 0 ? REDIRECT_MS_KEYBOARD : REDIRECT_MS);
  });
}

// A barra fica fixa no topo e os painéis abaixo da apresentação: ao mexer no halter,
// leva a página até os painéis para o arrasto nunca acontecer "às cegas".
const stageEl = document.getElementById("stage");
function showStage() {
  const r = stageEl.getBoundingClientRect();
  if (r.top < innerHeight * 0.25 && r.bottom > innerHeight * 0.75) return; // já está à vista
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  stageEl.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

// Primeiro uso: some a dica de texto e para o "empurrão" do halter
function firstUse() {
  showStage();
  if (hasDragged) return;
  hasDragged = true;
  dragHint.style.opacity = "0";
  handle.classList.add("used");
}

// Aplica no máximo uma vez por frame (evita reflow a cada evento de ponteiro)
let pendingP = null;
function scheduleApply(p) {
  if (pendingP === null) {
    requestAnimationFrame(() => {
      if (pendingP !== null) apply(pendingP);
      pendingP = null;
    });
  }
  pendingP = p;
}

// Pointer Events cobrem mouse, touch e caneta; touch-action: none no CSS evita o scroll
handle.addEventListener("pointerdown", (e) => {
  if (e.button !== 0) return;
  dragging = true;
  firstUse();
  handle.setPointerCapture(e.pointerId);
  e.preventDefault();
});

handle.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  scheduleApply(toPercent(e.clientX));
});

handle.addEventListener("pointerup", () => {
  if (!dragging) return;
  dragging = false;
  // aplica a posição pendente antes de decidir o redirecionamento
  if (pendingP !== null) {
    apply(pendingP);
    pendingP = null;
  }
  commit();
});

handle.addEventListener("pointercancel", () => {
  dragging = false;
});

apply(50);

// Teclado: setas/Home/End só movem; Enter/Espaço entram se estiver numa borda
handle.addEventListener("keydown", (e) => {
  const step = 5;
  let newPos = pos;

  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    newPos = Math.max(0, pos - step);
  } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    newPos = Math.min(100, pos + step);
  } else if (e.key === "Home") {
    newPos = 0;
  } else if (e.key === "End") {
    newPos = 100;
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    commit(REDIRECT_MS_KEYBOARD);
    return;
  } else {
    return;
  }

  e.preventDefault();
  if (newPos !== pos) {
    firstUse();
    apply(newPos);
  }
});

// Ao voltar pelo histórico (bfcache), limpa o overlay e recentraliza o halter
window.addEventListener("pageshow", (e) => {
  if (e.persisted) cancelRedirect();
});
