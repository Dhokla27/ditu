const birthday = new Date("2026-05-24T00:00:00+01:00");
const photoCount = 24;
const gallery = document.querySelector("#gallery");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector("img");
const closeLightbox = lightbox.querySelector(".lightbox-close");
const canvas = document.querySelector(".confetti");
const ctx = canvas.getContext("2d");

const pad = (value) => String(value).padStart(2, "0");

function updateCountdown() {
  const now = new Date();
  const diff = birthday - now;

  if (diff <= 0) {
    document.querySelector("#days").textContent = "20";
    document.querySelector("#hours").textContent = "00";
    document.querySelector("#minutes").textContent = "00";
    document.querySelector("#seconds").textContent = "00";
    return;
  }

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  document.querySelector("#days").textContent = pad(days);
  document.querySelector("#hours").textContent = pad(hours);
  document.querySelector("#minutes").textContent = pad(minutes);
  document.querySelector("#seconds").textContent = pad(remainingSeconds);
}

function buildGallery() {
  for (let index = 1; index <= photoCount; index += 1) {
    const number = pad(index);
    const button = document.createElement("button");
    const image = document.createElement("img");

    image.src = `assets/photos/photo-${number}.jpg`;
    image.alt = `Memory ${index} with Dita`;
    image.loading = index > 6 ? "lazy" : "eager";

    button.type = "button";
    button.setAttribute("aria-label", `Open memory ${index}`);
    button.append(image);
    button.addEventListener("click", () => openPhoto(image.src, image.alt));
    gallery.append(button);
  }
}

function openPhoto(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePhoto() {
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

closeLightbox.addEventListener("click", closePhoto);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closePhoto();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePhoto();
});

let pieces = [];

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function burstConfetti(amount = 120) {
  const colors = ["#d94f79", "#ffd4bd", "#fff0a8", "#ffffff", "#f7a6b8"];
  pieces = Array.from({ length: amount }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight * 0.55,
    size: Math.random() * 7 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 10,
    vy: Math.random() * -9 - 4,
    gravity: Math.random() * 0.18 + 0.12,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.22,
    life: Math.random() * 70 + 80,
  }));
}

function drawConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  pieces = pieces.filter((piece) => piece.life > 0);
  pieces.forEach((piece) => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += piece.gravity;
    piece.rotation += piece.spin;
    piece.life -= 1;

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.58);
    ctx.restore();
  });

  requestAnimationFrame(drawConfetti);
}

document.querySelector("#celebrateButton").addEventListener("click", () => burstConfetti(160));
window.addEventListener("resize", resizeCanvas);

buildGallery();
updateCountdown();
setInterval(updateCountdown, 1000);
resizeCanvas();
drawConfetti();

setTimeout(() => burstConfetti(90), 700);
