/* GeSSTionamos SAS — Cartilla del trabajo realizado
   Motor del libro: paginación, índice, teclado y gestos. Sin dependencias. */
(function () {
  'use strict';

  var book   = document.getElementById('book');
  var pages  = [].slice.call(book.querySelectorAll('.page'));
  var total  = pages.length;

  var btnPrev = document.getElementById('btnPrev');
  var btnNext = document.getElementById('btnNext');
  var btnToc  = document.getElementById('btnToc');
  var toc     = document.getElementById('toc');
  var tocList = document.getElementById('tocList');
  var tocClose= document.getElementById('tocClose');
  var barNow  = document.getElementById('barNow');
  var barAll  = document.getElementById('barAll');
  var barTitle= document.getElementById('barTitle');
  var fill    = document.getElementById('fill');

  var current = 0;

  /* ---------- Numeración automática ---------- */
  pages.forEach(function (p, i) {
    var ix = p.querySelector('.page__ix');
    if (ix) ix.textContent = String(i + 1).padStart(2, '0');
  });

  /* ---------- Índice ---------- */
  var lastPart = null;
  pages.forEach(function (p, i) {
    var part  = p.getAttribute('data-part')  || '';
    var title = p.getAttribute('data-title') || ('Página ' + (i + 1));

    if (part && part !== lastPart) {
      var h = document.createElement('li');
      h.className = 'toc__part';
      h.textContent = part;
      tocList.appendChild(h);
      lastPart = part;
    }
    var li = document.createElement('li');
    var a  = document.createElement('a');
    a.href = '#p' + (i + 1);
    a.innerHTML = '<span class="n">' + String(i + 1).padStart(2, '0') + '</span><span></span>';
    a.lastChild.textContent = title;
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      go(i);
      closeToc();
    });
    li.appendChild(a);
    tocList.appendChild(li);
  });
  var tocLinks = [].slice.call(tocList.querySelectorAll('a'));

  barAll.textContent = total;

  /* ---------- Navegación ---------- */
  function go(n, silent) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === current && pages[n].classList.contains('is-current')) return;

    pages.forEach(function (p, i) {
      p.classList.toggle('is-current', i === n);
      p.classList.toggle('is-prev', i < n);
      p.setAttribute('aria-hidden', i === n ? 'false' : 'true');
    });

    current = n;
    var body = pages[n].querySelector('.page__body');
    if (body) body.scrollTop = 0;

    barNow.textContent = n + 1;
    barTitle.textContent = pages[n].getAttribute('data-title') || '';
    fill.style.width = ((n + 1) / total * 100).toFixed(2) + '%';
    btnPrev.disabled = (n === 0);
    btnNext.disabled = (n === total - 1);

    tocLinks.forEach(function (a, i) { a.classList.toggle('is-active', i === n); });
    requestAnimationFrame(function () { hint(pages[n]); });

    if (!silent) {
      try { history.replaceState(null, '', '#p' + (n + 1)); } catch (e) {}
    }
    document.title = (pages[n].getAttribute('data-title') || 'Cartilla') +
                     ' — GeSSTionamos SAS';
  }

  btnPrev.addEventListener('click', function () { go(current - 1); });
  btnNext.addEventListener('click', function () { go(current + 1); });

  /* ---------- Índice: abrir y cerrar ---------- */
  function openToc()  { toc.classList.add('is-open');  document.body.style.overflow = 'hidden'; }
  function closeToc() { toc.classList.remove('is-open'); document.body.style.overflow = ''; }
  btnToc.addEventListener('click', openToc);
  tocClose.addEventListener('click', closeToc);
  toc.addEventListener('click', function (ev) { if (ev.target === toc) closeToc(); });

  /* ---------- Teclado ---------- */
  document.addEventListener('keydown', function (ev) {
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    var tag = (ev.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    switch (ev.key) {
      case 'ArrowRight': case 'PageDown': case ' ':
        ev.preventDefault(); go(current + 1); break;
      case 'ArrowLeft': case 'PageUp':
        ev.preventDefault(); go(current - 1); break;
      case 'Home':
        ev.preventDefault(); go(0); break;
      case 'End':
        ev.preventDefault(); go(total - 1); break;
      case 'Escape':
        closeToc(); break;
    }
  });

  /* ---------- Gestos ---------- */
  var tx = 0, ty = 0, moved = false;
  book.addEventListener('touchstart', function (ev) {
    if (ev.touches.length !== 1) return;
    tx = ev.touches[0].clientX;
    ty = ev.touches[0].clientY;
    moved = false;
  }, { passive: true });

  book.addEventListener('touchend', function (ev) {
    if (moved) return;
    var t = ev.changedTouches[0];
    var dx = t.clientX - tx;
    var dy = t.clientY - ty;
    if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    go(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  book.addEventListener('touchmove', function (ev) {
    var t = ev.touches[0];
    // si el dedo va mayormente en vertical, es scroll de la página: no es swipe
    if (Math.abs(t.clientY - ty) > Math.abs(t.clientX - tx)) moved = true;
  }, { passive: true });

  /* ---------- Pista de continuación cuando la página desborda ---------- */
  function hint(page) {
    var body = page.querySelector('.page__body');
    if (!body) return;
    var more = body.scrollHeight - body.clientHeight - body.scrollTop > 24;
    page.classList.toggle('has-more', more);
  }
  pages.forEach(function (p) {
    var body = p.querySelector('.page__body');
    if (body) body.addEventListener('scroll', function () { hint(p); }, { passive: true });
  });
  window.addEventListener('resize', function () { hint(pages[current]); });

  /* ---------- Página inicial desde la URL ---------- */
  function fromHash() {
    var m = /^#p(\d+)$/.exec(location.hash || '');
    return m ? (parseInt(m[1], 10) - 1) : 0;
  }
  window.addEventListener('hashchange', function () { go(fromHash(), true); });

  go(fromHash(), true);
})();
