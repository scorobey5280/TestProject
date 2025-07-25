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

const bar1 = document.getElementById('bar1');
    const bar1Fill = document.getElementById('bar1-fill');
    const progressPath = document.getElementById('progress-path');
    const percentTrack = document.getElementById('percentTrack');

    // Create 101 percentage values (0% to 100%)
    for (let i = 0; i <= 100; i++) {
      const span = document.createElement('span');
      span.textContent = i + '%';
      percentTrack.appendChild(span);
    }

    let lastScroll = 0;
    let scrollTimeout;
	let pathLength = 0;
	

    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(scrollTop / docHeight, 1);

      // 1. Bar Fill
      bar1Fill.style.height = `${scrollPercent * 100}%`;

      // 2. SVG Path Stroke
      const pathLength = progressPath.getTotalLength();
      progressPath.style.strokeDashoffset = pathLength * (1 - scrollPercent);

      // 3. Rolling Percent
   const nearestPercent = Math.round(scrollPercent * 100);
  percentTrack.style.transform = `translateY(-${nearestPercent * 80}px)`;

      // Show bar1 on scroll
      bar1.classList.add('show');
      lastScroll = Date.now();
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (Date.now() - lastScroll > 300) {
          bar1.classList.remove('show');
        }
      }, 300);
    }

    window.addEventListener('scroll', handleScroll);
    window.onload = () => {
  const pathLength = progressPath.getTotalLength();
  progressPath.style.strokeDasharray = pathLength;
  progressPath.style.strokeDashoffset = pathLength;

  handleScroll(); // Initial scroll position
};