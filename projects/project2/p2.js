const burger = document.getElementById('burger-btn');
const sidepanel = document.getElementById('sidepanel');
if (burger && sidepanel) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    sidepanel.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!sidepanel.contains(e.target) && !burger.contains(e.target)) {
      burger.classList.remove('open');
      sidepanel.classList.remove('open');
    }
  });
}

const cursor = document.getElementById('cursor');

// Track mouse movement
window.addEventListener('DOMContentLoaded', () => {
document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});
});

// Add spin effect on click
//document.addEventListener('click', () => {
//  cursor.classList.add('spin');
//  setTimeout(() => cursor.classList.remove('spin'), 500); // match animation duration
//});