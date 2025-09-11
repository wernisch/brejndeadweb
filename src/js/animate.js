const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') })
}, { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

const prog = document.createElement('div');
prog.className = 'progress-bar';
document.body.appendChild(prog);
const onScroll = () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    prog.style.width = pct + '%';
};
document.addEventListener('scroll', onScroll, { passive: true }); onScroll();

const parallaxEls = document.querySelectorAll('.parallax');
window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - .5);
    const y = (e.clientY / window.innerHeight - .5);
    parallaxEls.forEach(el => {
        const depth = parseFloat(el.dataset.depth || '20'); // px
        el.style.transform = `translate(${-x * depth}px, ${-y * depth}px)`;
    });
});

document.querySelectorAll('.tilt').forEach(card => {
  card.style.willChange = 'transform';
  card.style.transformStyle = 'preserve-3d';

  const max = 10;
  const ease = 0.12;
  const scaleOnHover = 1.02;

  let glare = card.querySelector('.tilt-glare');
  if (!glare) {
    glare = document.createElement('div');
    glare.className = 'tilt-glare';
    Object.assign(glare.style, {
      position:'absolute', inset:'0', pointerEvents:'none',
      background:'radial-gradient(closest-side, rgba(255,255,255,.25), rgba(255,255,255,0) 60%)',
      opacity:'0', transition:'opacity .2s ease'
    });
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    card.appendChild(glare);
  }

  let hover = false;
  let targetRX = 0, targetRY = 0;
  let currRX = 0, currRY = 0;
  let rafId = null;

  const animate = () => {
    currRX += (targetRX - currRX) * ease;
    currRY += (targetRY - currRY) * ease;

    card.style.transform =
      `perspective(900px) rotateX(${currRY}deg) rotateY(${currRX}deg) scale(${hover ? scaleOnHover : 1})`;

    if (hover || Math.abs(targetRX - currRX) > 0.02 || Math.abs(targetRY - currRY) > 0.02) {
      rafId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const onMove = (e) => {
    const b = card.getBoundingClientRect();
    const x = e.clientX - b.left;
    const y = e.clientY - b.top;
    const px = (x / b.width  - 0.5) * 2;
    const py = (y / b.height - 0.5) * 2;

    targetRX =  px * max;
    targetRY = -py * max;

    glare.style.opacity = '1';
    glare.style.background = `radial-gradient(200px 200px at ${x}px ${y}px,
                           rgba(255,255,255,.25), rgba(255,255,255,0) 60%)`;

    if (!rafId) rafId = requestAnimationFrame(animate);
  };

  const onEnter = () => { hover = true; if (!rafId) rafId = requestAnimationFrame(animate); };
  const onLeave = () => {
    hover = false;
    targetRX = 0; targetRY = 0;
    glare.style.opacity = '0';
    if (!rafId) rafId = requestAnimationFrame(animate);
  };

  card.addEventListener('mouseenter', onEnter);
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);
});



function countUp(el, to) {
    const dur = 1200, start = performance.now(), from = parseFloat(el.textContent) || 0;
    const fmt = new Intl.NumberFormat();
    const step = (t) => {
        const p = Math.min(1, (t - start) / dur);
        el.textContent = fmt.format(Math.floor(from + (to - from) * p));
        if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('[data-count-to]').forEach(n => {
                countUp(n, parseFloat(n.dataset.countTo));
                n.removeAttribute('data-count-to');
            });
            statsObserver.unobserve(e.target);
        }
    });
}, { threshold: .3 });
document.querySelectorAll('#stats, #projects').forEach(s => statsObserver.observe(s));
