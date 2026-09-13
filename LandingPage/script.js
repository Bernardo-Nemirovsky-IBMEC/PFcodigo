const PKZ_URL = "../PKZ/index.html";
const OTO_URL = "../OneToOne/index.html";

const handle = document.getElementById("handle");
const track = document.getElementById("track");
const pkzPanel = document.getElementById("pkz");
const fillL = document.getElementById("fill-l");
const fillR = document.getElementById("fill-r");
const divLine = document.getElementById("div-line");
const arrL = document.getElementById("arr-l");
const arrR = document.getElementById("arr-r");
const redir = document.getElementById("redir");
const rName = document.getElementById("redir-name");

const dragHint = document.getElementById("drag-hint");

const hintPkzBox = document.getElementById("hint-pkz-box");

const btnPkzCta = document.getElementById("btn-pkz-cta");
const btnOtoCta = document.getElementById("btn-oto-cta");

let dragging = false;
let redirected = false;
let hasDragged = false;

function toPercent(clientX) {
  const r = track.getBoundingClientRect();
  return Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100));
}

function apply(p) {
  handle.style.left = p + "%";
  handle.setAttribute("aria-valuenow", Math.round(p));

  const pkzWidth = 100 - p;

  pkzPanel.style.width = pkzWidth + "%";
  divLine.style.left = `calc(${pkzWidth}% - 1px)`;
  fillL.style.width = pkzWidth + "%";
  fillR.style.width = p + "%";

  if (hintPkzBox) {
    hintPkzBox.style.width = pkzWidth + "%";
  }

  arrL.classList.toggle("on", p < 18);
  arrR.classList.toggle("on", p > 82);

  if (redirected) return;
  if (p <= 1) doRedirect("PKZ", "#07111e", "#ffffff", PKZ_URL);
  if (p >= 99) doRedirect("ONE TO ONE", "#38b6ff", "#ffffff", OTO_URL);
}

function doRedirect(name, bg, color, url) {
  redirected = true;
  redir.style.background = bg;
  redir.style.color = color;
  rName.textContent = name;
  redir.classList.add("on");
  setTimeout(() => {
    window.location.href = url;
  }, 900);
}

if (btnPkzCta) {
  btnPkzCta.addEventListener("click", (e) => {
    e.preventDefault();
    doRedirect("PKZ", "#07111e", "#ffffff", PKZ_URL);
  });
}

if (btnOtoCta) {
  btnOtoCta.addEventListener("click", (e) => {
    e.preventDefault();
    doRedirect("ONE TO ONE", "#38b6ff", "#ffffff", OTO_URL);
  });
}

handle.addEventListener("mousedown", (e) => {
  dragging = true;
  if (!hasDragged) {
    hasDragged = true;
    dragHint.style.opacity = "0";
  }
  e.preventDefault();
});

window.addEventListener("mousemove", (e) => {
  if (dragging) apply(toPercent(e.clientX));
});

window.addEventListener("mouseup", () => {
  dragging = false;
});

handle.addEventListener(
  "touchstart",
  (e) => {
    dragging = true;
    if (!hasDragged) {
      hasDragged = true;
      dragHint.style.opacity = "0";
    }
    e.preventDefault();
  },
  { passive: false },
);

window.addEventListener(
  "touchmove",
  (e) => {
    if (dragging) {
      apply(toPercent(e.touches[0].clientX));
      e.preventDefault();
    }
  },
  { passive: false },
);

window.addEventListener("touchend", () => {
  dragging = false;
});

apply(50);

// Keyboard support for slider
handle.addEventListener("keydown", (e) => {
  const current = parseFloat(handle.style.left) || 50;
  let newPos = current;
  const step = 5;

  if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    newPos = Math.max(0, current - step);
    e.preventDefault();
  } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    newPos = Math.min(100, current + step);
    e.preventDefault();
  } else if (e.key === "Home") {
    newPos = 0;
    e.preventDefault();
  } else if (e.key === "End") {
    newPos = 100;
    e.preventDefault();
  }

  if (newPos !== current) {
    apply(newPos);
    handle.setAttribute("aria-valuenow", Math.round(newPos));
  }
});
