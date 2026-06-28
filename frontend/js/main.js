/* ─── main.js ─── App init, misc glue ─── */
(function () {

  /* Mobile nav styles injected dynamically */
  const style = document.createElement('style');
  style.textContent = `
    .nav-links.mobile-open {
      display: flex !important;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(4,5,10,0.98);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2.5rem;
      z-index: 999;
      backdrop-filter: blur(20px);
    }
    .nav-links.mobile-open li a {
      font-size: 2rem !important;
      color: var(--txt-1) !important;
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    .title-line-wrap { overflow: hidden; display: block; }
    .skills-universe { min-height: 60px; }
  `;
  document.head.appendChild(style);

  /* Intersection observer for misc fade-ins */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'none';
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  /* Active nav highlight */
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 150) current = s.id;
    });
    navAs.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--lime)' : '';
    });
  }, { passive: true });

  /* Page cursor visibility */
  document.addEventListener('mouseleave', () => {
    document.querySelector('.cursor-dot').style.opacity = '0';
    document.querySelector('.cursor-ring').style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    document.querySelector('.cursor-dot').style.opacity = '1';
    document.querySelector('.cursor-ring').style.opacity = '1';
  });

  console.log('%c⚡ Pradeep Portfolio — Built with Three.js + GSAP + MERN', 'color:#b8ff3c;font-size:14px;font-weight:bold;');
})();
