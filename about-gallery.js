const gallery = document.querySelector('.about-gallery');
const track = gallery.querySelector('.about-gallery-track');
const controls = gallery.querySelector('.about-gallery-controls');
const toggle = controls.querySelector('[data-play]');
const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
let playing = !motion.matches;

function updateButton() {
  toggle.textContent = playing ? '暂停' : '播放';
}

function step(direction) {
  const end = track.scrollWidth - track.clientWidth;
  if (end <= 0) return;

  const positions = Array.from(track.children, item => item.offsetLeft - track.firstElementChild.offsetLeft);
  const current = track.scrollLeft;
  const next = direction > 0
    ? (current >= end - 2 ? 0 : positions.find(position => position > current + 2) ?? end)
    : (current <= 2 ? end : positions.findLast(position => position < current - 2) ?? 0);
  track.scrollTo({ left: Math.min(end, next), behavior: motion.matches ? 'instant' : 'smooth' });
}

controls.hidden = false;
updateButton();
toggle.addEventListener('click', () => {
  playing = !playing;
  updateButton();
});
controls.querySelectorAll('[data-step]').forEach(button => {
  button.addEventListener('click', () => step(Number(button.dataset.step)));
});
motion.addEventListener('change', () => {
  playing = !motion.matches;
  updateButton();
});
window.setInterval(() => {
  if (playing && !document.hidden && !gallery.matches(':hover, :focus-within')) step(1);
}, 3500);
