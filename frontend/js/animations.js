/* ─── animations.js ─── GSAP + Scroll + Tilt + Typewriter ─── */
(function () {
  /* Wait for GSAP + ScrollTrigger */
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ══ TYPEWRITER ══ */
  const el = document.getElementById('typewriter');
  if (el) {
    const words = [
      'Building the Future with Code.',
      'MERN Stack Architect.',
      'Full Stack Developer.',
      '3D Web Enthusiast.',
      'Open Source Contributor.',
    ];
    let wi = 0, ci = 0, deleting = false;
    function type() {
      const word = words[wi];
      if (!deleting) {
        el.textContent = word.slice(0, ci++);
        if (ci > word.length) { deleting = true; setTimeout(type, 1800); return; }
      } else {
        el.textContent = word.slice(0, ci--);
        if (ci < 0) { deleting = false; wi = (wi + 1) % words.length; ci = 0; }
      }
      setTimeout(type, deleting ? 40 : 80);
    }
    setTimeout(type, 1600);
  }

  /* ══ FLOATING TAGS SHOW ══ */
  setTimeout(() => {
    document.querySelectorAll('.float-tag').forEach(t => { t.style.opacity = '1'; });
  }, 2000);

  /* ══ STAT COUNTERS ══ */
  function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const step = target / 50;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, 30);
    });
  }

  /* ══ SECTION EYEBROW REVEAL ══ */
  document.querySelectorAll('.section-eyebrow').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 85%',
      onEnter: () => el.classList.add('visible'),
    });
  });

  /* ══ SECTION TITLE — CHARACTER SPLIT ANIMATION ══ */
  document.querySelectorAll('.section-title.split-text').forEach(title => {
    const lines = title.innerHTML.split('<br>');
    title.innerHTML = lines.map(line =>
      `<div class="title-line-wrap" style="overflow:hidden"><div class="title-line">${line}</div></div>`
    ).join('');
    const titleLines = title.querySelectorAll('.title-line');
    gsap.fromTo(titleLines,
      { y: '100%', skewX: 6 },
      {
        y: '0%', skewX: 0, duration: 1.2, stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: title, start: 'top 80%' }
      }
    );
  });

  /* ══ ABOUT SECTION ══ */
  ScrollTrigger.create({
    trigger: '#about', start: 'top 70%',
    onEnter: () => {
      gsap.fromTo('.about-intro', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' });
      gsap.fromTo('.about-text p', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'expo.out' });
      gsap.fromTo('.about-tags span', { opacity: 0, y: 20, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.07, delay: 0.4, ease: 'back.out(1.5)' });
      gsap.fromTo('.about-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.8, ease: 'expo.out' });
    }
  });

  /* ══ SKILLS ══ */
  ScrollTrigger.create({
    trigger: '#skills', start: 'top 60%',
    onEnter: () => {
      gsap.fromTo('.skill-card',
        { opacity: 0, y: 60, rotateX: -20 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' }
      );
      setTimeout(() => {
        document.querySelectorAll('.skill-bar').forEach(bar => {
          bar.style.width = bar.dataset.w + '%';
        });
      }, 400);
    }
  });

  /* ══ PROJECTS ══ */
  document.querySelectorAll('.project-card').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card, start: 'top 85%',
      onEnter: () => {
        gsap.to(card, { opacity: 1, y: 0, duration: 1, delay: i * 0.1, ease: 'expo.out' });
        card.classList.add('visible');
      }
    });
  });

  /* ══ CONTACT ══ */
  ScrollTrigger.create({
    trigger: '#contact', start: 'top 70%',
    onEnter: () => {
      gsap.fromTo('.contact-info', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1, ease: 'expo.out' });
      gsap.fromTo('.contact-form', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1, delay: 0.2, ease: 'expo.out' });
      animateCounters();
    }
  });

  /* ══ HERO STATS ══ */
  ScrollTrigger.create({
    trigger: '#hero', start: 'top top',
    onEnter: () => setTimeout(animateCounters, 1500),
  });

  /* ══ MAGNETIC TILT EFFECT ON PROJECT CARDS ══ */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -10;
      const rotY = ((x - cx) / cx) * 10;
      card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;

      /* Shine follow */
      const shine = card.querySelector('.project-shine');
      if (shine) {
        shine.style.backgroundImage = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 60%)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  /* ══ SKILL CARD TILT ══ */
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2, cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -12;
      const rotY = ((x - cx) / cx) * 12;
      card.querySelector('.skill-card-inner').style.transform =
        `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.skill-card-inner').style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });

  /* ══ NAVBAR SCROLL ══ */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  /* ══ SMOOTH ANCHOR ══ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      gsap.to(window, { scrollTo: { y: target, offsetY: 70 }, duration: 1.2, ease: 'expo.inOut' });
    });
  });

  /* ══ HAMBURGER ══ */
  const ham = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (ham) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      navLinks && navLinks.classList.toggle('mobile-open');
    });
  }

  /* ══ CONTACT FORM ══ */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-send');
      btn.querySelector('.btn-send-text').textContent = 'Sending...';
      const body = {
        name:    form.querySelector('#name').value,
        email:   form.querySelector('#email').value,
        message: form.querySelector('#message').value,
      };
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (res.ok) {
          status.textContent = '✓ Message sent! I\'ll get back to you soon.';
          status.className = 'form-status success';
          form.reset();
        } else {
          throw new Error(data.message || 'Server error');
        }
      } catch (err) {
        status.textContent = '✗ Something went wrong. Email me directly.';
        status.className = 'form-status error';
      }
      btn.querySelector('.btn-send-text').textContent = 'Send Message';
    });
  }

  /* ══ GSAP SCROLL SMOOTH ══ */
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }

})();
