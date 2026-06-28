/* ─── loader.js ─── Animated percentage loader ─── */
(function () {
  const loader  = document.getElementById('loader');
  const percent = document.querySelector('.loader-percent');
  const bar     = document.querySelector('.loader-bar');
  if (!loader) return;

  let p = 0;
  const total = 2200; /* ms */
  const start = performance.now();

  function update(now) {
    p = Math.min(((now - start) / total) * 100, 100);
    if (percent) percent.textContent = Math.floor(p) + '%';
    if (bar) bar.style.setProperty('--w', p + '%');
    if (bar) bar.after; /* trigger repaint */
    /* Update bar width via the ::after pseudo via a CSS custom property trick */
    if (bar) bar.querySelector && null;
    /* Direct inline approach */
    if (bar) {
      const after = bar;
      after.style.cssText = `--bar-w:${p}%`;
      after.style.background = `linear-gradient(90deg, #b8ff3c ${p}%, transparent ${p}%)`;
      /* Actually set the bar fill */
      if (!bar._fill) {
        bar._fill = document.createElement('div');
        bar._fill.style.cssText = 'height:100%;background:linear-gradient(90deg,#b8ff3c,#00f5d4);border-radius:1px;transition:none;';
        bar.appendChild(bar._fill);
      }
      bar._fill.style.width = p + '%';
    }

    if (p < 100) {
      requestAnimationFrame(update);
    } else {
      setTimeout(() => {
        loader.classList.add('hidden');
        /* Reveal floating tags */
        document.querySelectorAll('.float-tag').forEach(t => { t.style.opacity = '1'; });
      }, 400);
    }
  }
  requestAnimationFrame(update);
})();
