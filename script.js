class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0; this.mouseY = 0;
        this.init(); this.animate(); this.addEventListeners();
    }
    init() { this.resize(); this.createParticles(); }
    resize() { this.canvas.width = window.innerWidth; this.canvas.height = window.innerHeight; }
    createParticles() {
        const count = Math.min(150, Math.floor(window.innerWidth / 10));
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width, y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1, speedX: (Math.random() - 0.5) * 0.5, speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2, hue: Math.random() * 60 + 40
            });
        }
    }
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => { this.mouseX = e.clientX; this.mouseY = e.clientY; });
    }
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => {
            p.x += p.speedX; p.y += p.speedY;
            const dx = this.mouseX - p.x, dy = this.mouseY - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 150) { const a = Math.atan2(dy, dx); p.x -= Math.cos(a) * 0.5; p.y -= Math.sin(a) * 0.5; }
            if (p.x < 0) p.x = this.canvas.width; if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height; if (p.y > this.canvas.height) p.y = 0;
            this.ctx.beginPath(); this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`; this.ctx.fill();
            this.ctx.shadowBlur = 20; this.ctx.shadowColor = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`;
        });
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x, dy = p1.y - p2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 100) {
                    this.ctx.beginPath(); this.ctx.moveTo(p1.x, p1.y); this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(197, 169, 97, ${0.1 * (1 - dist / 100)})`;
                    this.ctx.lineWidth = 0.5; this.ctx.stroke();
                }
            });
        });
        requestAnimationFrame(() => this.animate());
    }
}

class NavigationScroll {
    constructor() { this.navigation = document.getElementById('navigation'); this.init(); }
    init() { window.addEventListener('scroll', () => this.handleScroll()); }
    handleScroll() {
        const scroll = window.pageYOffset;
        this.navigation.classList.toggle('scrolled', scroll > 100);
    }
}

class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal-text, .reveal-image, .reveal-left, .reveal-right');
        this.observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
        }, { rootMargin: '-100px', threshold: 0.1 });
        this.elements.forEach(el => this.observer.observe(el));
    }
}

class CinematicModal {
    constructor() {
        this.overlay = document.getElementById('modalOverlay');
        this.content = document.getElementById('modalContent');
        this.closeBtn = document.getElementById('modalClose');
        this.cards = document.querySelectorAll('.residence-card');
        this.data = {
            canopy: { title: 'Forest Canopy Villa', desc: 'Suspended among ancient treetops with floor-to-ceiling glass walls.', features: ['Panoramic forest views', 'Private terrace', 'Rainfall shower', 'Handcrafted furniture'], price: 'From $2,500/night' },
            emerald: { title: 'Emerald Pool Residence', desc: 'Infinity pool merges with the forest horizon.', features: ['25m infinity pool', 'Garden access', 'Outdoor dining', 'Smart home'], price: 'From $3,200/night' },
            moonlight: { title: 'Moonlight Pavilion', desc: 'Glass ceiling transforms your bedroom into an observatory.', features: ['Retractable glass ceiling', 'Observatory deck', 'Heated floors', 'Butler service'], price: 'From $4,000/night' }
        };
        this.init();
    }
    init() {
        this.cards.forEach(card => card.addEventListener('click', () => this.open(card.dataset.residence)));
        this.closeBtn.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', e => { if (e.target === this.overlay) this.close(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); });
    }
    open(type) {
        const d = this.data[type];
        this.content.innerHTML = `<div class="modal-hero"></div><div class="modal-body"><div class="modal-info"><h2>${d.title}</h2><p>${d.desc}</p><ul class="modal-features">${d.features.map(f => `<li>${f}</li>`).join('')}</ul><div class="modal-price">${d.price}</div><button class="btn-primary" onclick="document.getElementById('reservation').scrollIntoView({behavior:'smooth'});window.modal.close()">Reserve This Residence</button></div></div>`;
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    close() { this.overlay.classList.remove('active'); document.body.style.overflow = ''; }
}

class SmoothScroll {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
}

class ReservationForm {
    constructor() {
        this.form = document.getElementById('reservationForm');
        if (this.form) this.form.addEventListener('submit', e => this.submit(e));
    }
    submit(e) {
        e.preventDefault();
        const btn = this.form.querySelector('.btn-submit');
        const orig = btn.textContent;
        btn.textContent = 'Processing...'; btn.disabled = true;
        setTimeout(() => { btn.textContent = 'Request Sent!'; btn.style.background = '#27ae60';
            setTimeout(() => { btn.textContent = orig; btn.disabled = false; btn.style.background = ''; this.form.reset(); }, 2000);
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem(); new NavigationScroll(); new ScrollReveal(); new SmoothScroll(); new ReservationForm();
    window.modal = new CinematicModal();
    
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) exploreBtn.addEventListener('click', () => document.getElementById('residences').scrollIntoView({behavior:'smooth'}));
    
    ['heroReserveBtn', 'reserveBtn'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', () => document.getElementById('reservation').scrollIntoView({behavior:'smooth'}));
    });
});
