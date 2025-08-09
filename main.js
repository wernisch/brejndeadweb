const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

document.getElementById('y').textContent = new Date().getFullYear();

const c = document.getElementById('cursor');
const d = document.getElementById('cursorDot');
let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
const follow = () => { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; c.style.transform = `translate(${cx}px, ${cy}px)`; d.style.transform = `translate(${tx}px, ${ty}px)`; requestAnimationFrame(follow); };
addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
follow();

document.querySelectorAll('.magnet').forEach(m => {
    const strength = 18;
    m.addEventListener('mousemove', (e) => {
        const r = m.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - .5) * strength;
        const y = ((e.clientY - r.top) / r.height - .5) * strength;
        m.style.transform = `translate(${x}px, ${y}px)`;
    });
    m.addEventListener('mouseleave', () => m.style.transform = 'translate(0,0)');
});

document.querySelectorAll('.tilt').forEach(el => {
    const maxTilt = 8;
    el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        const rx = clamp(-py * maxTilt, -maxTilt, maxTilt);
        const ry = clamp(px * maxTilt, -maxTilt, maxTilt);
        el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = 'rotateX(0) rotateY(0)');
});

const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
        if (ent.isIntersecting) {
            ent.target.animate([
                { opacity: 0, transform: 'translateY(12px)' },
                { opacity: 1, transform: 'translateY(0)' }
            ], { duration: 520, easing: 'cubic-bezier(.2,.7,0,1)', fill: 'forwards' });
            io.unobserve(ent.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

function echoForm() {
    const echo = document.getElementById('formEcho');
    echo.style.display = 'block';
    echo.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'ease-out', fill: 'forwards' });
}

const spark = document.createElement('canvas');
spark.width = innerWidth; spark.height = innerHeight; spark.style.cssText = 'position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.35;';
document.body.appendChild(spark);
const ctx = spark.getContext('2d');
let pts = Array.from({ length: 70 }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() * 1.2 + .2), vy: (Math.random() * .2 + .05), life: Math.random() * 120 + 60 }));
function draw() {
    ctx.clearRect(0, 0, spark.width, spark.height);
    pts.forEach(p => {
        p.x += p.vx; p.y -= p.vy; p.life -= 1; if (p.x > spark.width + 20) { p.x = -20; p.y = Math.random() * spark.height; p.life = Math.random() * 120 + 60 }
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,122,0,.6)';
        ctx.fill();
    });
    requestAnimationFrame(draw);
}
draw();
addEventListener('resize', () => { spark.width = innerWidth; spark.height = innerHeight });

if (matchMedia('(prefers-reduced-motion: reduce)').matches) { pts = []; }

const ENDPOINT = 'https://raw.githubusercontent.com/wernisch/mati-games-stats/refs/heads/main/public/games.json';
const statsGrid = document.getElementById('statsGrid');
const statsStatus = document.getElementById('statsStatus');

const DEFAULT_EXCLUDE = [7072328729, 7424382390, 7334543566, 7168683817, 5049176019];
const qsExclude = new URLSearchParams(location.search).get('exclude');
const qsIds = qsExclude ? qsExclude.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !Number.isNaN(n)) : [];
const attrIds = (document.getElementById('stats')?.dataset?.exclude || '')
    .split(',').map(s => parseInt(s.trim(), 10)).filter(n => !Number.isNaN(n));
const EXCLUDE_SET = new Set([...DEFAULT_EXCLUDE, ...qsIds, ...attrIds]);

const nfmt = n => (typeof n === 'number' ? n.toLocaleString('en-US') : n);

async function fetchStats() {
    if (!statsGrid) return;
    statsStatus.textContent = 'Fetching…';
    try {
        const res = await fetch(ENDPOINT, { cache: 'no-store' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        renderStats(Array.isArray(data?.games) ? data.games : []);
        statsStatus.textContent = 'Updated ' + new Date().toLocaleTimeString();
    } catch (e) {
        console.error('Live stats error:', e);
        statsStatus.textContent = 'Failed to load';
    }
}

function renderStats(games) {
    if (!games || !games.length) { statsGrid.innerHTML = '<p>No data.</p>'; return; }
    const filtered = games.filter(g => !EXCLUDE_SET.has(g.id));
    if (!filtered.length) { statsGrid.innerHTML = '<p>All games excluded.</p>'; return; }
    statsGrid.innerHTML = filtered.map(g => `
         <article class="stat">
           <img alt="${g.name} icon" src="${g.icon}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'80\\' height=\\'80\\'><rect width=\\'100%\\' height=\\'100%\\' fill=\\'#111\\'/><text x=\\'50%\\' y=\\'54%\\' dominant-baseline=\\'middle\\' text-anchor=\\'middle\\' fill=\\'#666\\' font-size=\\'12\\' font-family=\\'monospace\\'>no image</text></svg>'">
           <div>
             <h4>${g.name}</h4>
             <div class="kpi">
               <span>Playing: ${nfmt(g.playing)}</span>
               <span>Visits: ${nfmt(g.visits)}</span>
               <span>Likes: ${nfmt(g.likeRatio)}%</span>
             </div>
             <div class="kpi" style="margin-top:6px;color:#aaa">
               <span>ID: ${g.id}</span>
               <span>Place: ${g.rootPlaceId}</span>
             </div>
           </div>
         </article>
         `).join('');
}

fetchStats();
setInterval(fetchStats, 60000);