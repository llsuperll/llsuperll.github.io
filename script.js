// === Счётчики по бокам ===
const counterLeft = document.getElementById('counter-left');
const counterRight = document.getElementById('counter-right');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

const pad = (n) => String(n).padStart(2, '0');

// Обновление счётчиков при скролле
function updateCounters() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? scrollTop / docHeight : 0;

  // Левый счётчик — общий прогресс 00..99
  const leftVal = Math.min(99, Math.floor(progress * 100));
  counterLeft.textContent = pad(leftVal);

  // Правый счётчик — номер активной секции
  let activeIndex = 0;
  sections.forEach((sec, i) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2) {
      activeIndex = i;
    }
  });
  counterRight.textContent = pad(activeIndex);
}

window.addEventListener('scroll', updateCounters);
window.addEventListener('load', updateCounters);

// === Появление секций при скролле ===
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Анимация прогресс-баров внутри секции skills
        if (entry.target.id === 'skills') {
          entry.target.querySelectorAll('.skill-bar').forEach((bar) => {
            bar.style.width = bar.dataset.width;
          });
        }
      }
    });
  },
  { threshold: 0.15 }
);

sections.forEach((sec) => {
  if (sec.id !== 'home') observer.observe(sec);
});

// === Активная ссылка в навбаре ===
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((sec) => navObserver.observe(sec));

// === Matrix-эффект на фоне ===
(function matrixBackground() {
  const canvas = document.getElementById('matrix-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Набор символов: 0 и 1 (можно добавить катакану, как в оригинале)
  const chars = '01';
  const fontSize = 16;
  let columns = 0;
  let drops = [];   // y-позиция "капли" для каждого столбца

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(1).map(() => Math.random() * -100);
  }

  function draw() {
    // Полупрозрачная заливка — создаёт эффект затухания хвоста
    ctx.fillStyle = 'rgba(10, 14, 10, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
    ctx.textBaseline = 'top';

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Яркий "головной" символ
      ctx.fillStyle = '#bbf7d0'; // светло-зелёный
      ctx.fillText(char, x, y);

      // Всё остальное — обычный зелёный
      ctx.fillStyle = '#22c55e';

      // Рисуем символ чуть выше — он будет частью шлейфа
      const prevChar = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(prevChar, x, y - fontSize);

      // Двигаем каплю вниз
      drops[i]++;

      // Случайный сброс наверх
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
    }
  }

  // Анимация через requestAnimationFrame с ограничением ~30 FPS
  let lastTime = 0;
  const fps = 30;
  const interval = 1000 / fps;

  function loop(time) {
    requestAnimationFrame(loop);
    if (time - lastTime < interval) return;
    lastTime = time;
    draw();
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(loop);
})();