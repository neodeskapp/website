/* The docs' behaviour in the browser: search, copy buttons, the "On this page"
   marker and the menu on small screens. The pages read fine without it. */
(function () {
  var doc = document;
  var $ = function (sel, el) { return (el || doc).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(sel)); };
  var escapeHtml = function (s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  /* ---- Copy buttons ---- */
  function copyText(text, done) {
    function fallback() {
      var ta = doc.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      doc.body.appendChild(ta);
      ta.select();
      try { if (doc.execCommand('copy')) done(); } catch (e) { /* nothing more to try */ }
      doc.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }
  doc.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.copy');
    if (!btn) return;
    copyText($('code', btn.parentNode).textContent, function () {
      btn.textContent = 'Copied';
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
    });
  });

  /* ---- A screenshot opens in the theme it is shown in ---- */
  var dark = window.matchMedia('(prefers-color-scheme: dark)');
  doc.addEventListener('click', function (e) {
    var shot = e.target.closest && e.target.closest('a.shot');
    if (shot && dark.matches && shot.dataset.dark) shot.href = shot.dataset.dark;
  });

  /* ---- Menu on small screens ---- */
  var menu = $('.menu-button');
  function setMenu(open) {
    doc.documentElement.classList.toggle('menu-open', open);
    if (menu) {
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.textContent = open ? 'Close' : 'Menu';
    }
  }
  if (menu) menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });

  /* ---- Keep the current page visible in a long sidebar ---- */
  var here = $('.sidebar li a[aria-current="page"]');
  var side = $('.sidebar');
  if (here && side && side.scrollHeight > side.clientHeight) {
    side.scrollTop = here.offsetTop - side.clientHeight / 2;
  }

  /* ---- "On this page": mark the section being read ---- */
  var tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[decodeURIComponent(a.hash.slice(1))] = a; });
    var headings = Object.keys(byId).map(function (id) { return doc.getElementById(id); }).filter(Boolean);
    var mark = function () {
      var line = 100;
      var current = headings[0];
      headings.forEach(function (h) { if (h.getBoundingClientRect().top <= line) current = h; });
      // At the end of the page the last heading may never reach the line
      if (window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 4) current = headings[headings.length - 1];
      tocLinks.forEach(function (a) { a.classList.toggle('active', current && a === byId[current.id]); });
    };
    var queued = false;
    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; mark(); });
    }, { passive: true });
    mark();
  }

  /* ---- Search ---- */
  var dialog = $('dialog.search');
  if (!dialog || !dialog.showModal) return;
  var input = $('#search-input');
  var list = $('#search-results');
  var status = $('.search-status');
  var index = null;
  var pages = null;
  var selected = -1;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  if (isMac) $$('.search-button kbd').forEach(function (k) { k.textContent = '⌘K'; });

  function load() {
    if (index) return Promise.resolve();
    return fetch('/docs/search.json').then(function (r) { return r.json(); }).then(function (entries) {
      index = entries;
      // Everything a page says, to require that all the words of a search occur on it
      pages = {};
      entries.forEach(function (e) {
        var page = e.u.split('#')[0];
        pages[page] = (pages[page] || '') + ' ' + [e.t, e.h || '', e.d || '', e.x].join(' ').toLowerCase();
      });
    });
  }

  function words(text) { return (text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) || []).filter(function (w) { return w.length > 1; }); }
  function has(text, term) { return text.toLowerCase().indexOf(term) !== -1; }
  function all(text, terms) { return terms.every(function (t) { return has(text, t); }); }
  function any(text, terms) { return terms.some(function (t) { return has(text, t); }); }
  function hits(text, terms) {
    var lower = text.toLowerCase();
    var n = 0;
    terms.forEach(function (t) {
      var i = 0;
      while ((i = lower.indexOf(t, i)) !== -1) { n++; i += t.length; }
    });
    return n;
  }

  function excerpt(text, terms) {
    var max = 150;
    var lower = text.toLowerCase();
    var pos = -1;
    terms.forEach(function (t) {
      var i = lower.indexOf(t);
      if (i !== -1 && (pos === -1 || i < pos)) pos = i;
    });
    var start = pos === -1 ? 0 : Math.max(0, pos - 60);
    var end = Math.min(text.length, start + max);
    if (start > 0) { var s = text.indexOf(' ', start); if (s !== -1 && s < start + 15) start = s + 1; }
    if (end < text.length) { var l = text.lastIndexOf(' ', end); if (l > end - 15) end = l; }
    var out = escapeHtml((start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : ''));
    terms.slice().sort(function (a, b) { return b.length - a.length; }).forEach(function (t) {
      out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![^<]*>)', 'gi'), '<mark>$1</mark>');
    });
    return out;
  }

  function search(query) {
    var q = query.trim().toLowerCase();
    var terms = words(q);
    if (!terms.length) return [];
    var results = [];
    index.forEach(function (e) {
      if (!all(pages[e.u.split('#')[0]], terms)) return;
      var score = 0;
      if (!e.h) {
        if (all(e.t, terms)) score += 100;
        else if (any(e.t, terms)) score += 40 * terms.filter(function (t) { return has(e.t, t); }).length;
        if (has(e.t, q)) score += 50;
        if (has(e.x, q)) score += 10;
        if (all(e.d || '', terms)) score += 30;
        else if (any(e.d || '', terms)) score += 10;
        score += Math.min(hits(pages[e.u], terms), 20);
        var fromDescription = all(e.d || '', terms) || !any(e.x, terms);
        results.push({ e: e, score: score, text: fromDescription ? escapeHtml(e.d || e.x.slice(0, 150)) : excerpt(e.x, terms) });
      } else {
        var both = e.h + ' ' + e.x;
        if (!any(both, terms)) return;
        if (all(e.h, terms)) score += 60;
        else if (any(e.h, terms)) score += 25;
        if (has(e.h, q)) score += 30;
        if (all(e.x, terms)) score += 15;
        score += Math.min(hits(both, terms), 10);
        if (score > 10) results.push({ e: e, score: score, text: excerpt(e.x, terms) });
      }
    });
    results.sort(function (a, b) { return b.score - a.score; });
    return results.slice(0, 12);
  }

  function select(i) {
    var items = $$('li', list);
    selected = items.length ? (i + items.length) % items.length : -1;
    items.forEach(function (li, n) { li.setAttribute('aria-selected', n === selected ? 'true' : 'false'); });
    if (selected >= 0) {
      items[selected].scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', items[selected].id);
    } else input.removeAttribute('aria-activedescendant');
  }

  function render() {
    var q = input.value;
    if (!q.trim()) {
      list.innerHTML = '';
      status.textContent = 'Type to search every page and section.';
      status.hidden = false;
      selected = -1;
      return;
    }
    var results = search(q);
    list.innerHTML = results.map(function (r, i) {
      var e = r.e;
      return '<li role="option" id="result-' + i + '" aria-selected="false"><a href="' + escapeHtml(e.u) + '">' +
        '<span class="result-title"><span>' + escapeHtml(e.t) + (e.h ? ' <span class="result-heading">/ ' + escapeHtml(e.h) + '</span>' : '') +
        '</span><small>' + escapeHtml(e.s) + '</small></span>' +
        '<p class="result-text">' + r.text + '</p></a></li>';
    }).join('');
    status.hidden = results.length > 0;
    status.textContent = results.length ? results.length + ' results' : 'Nothing found for "' + q.trim() + '". Try fewer or other words.';
    select(results.length ? 0 : -1);
  }

  function open() {
    setMenu(false);
    if (!dialog.open) dialog.showModal();
    input.select();
    load().then(render, function () { status.textContent = 'The search index could not be loaded.'; });
  }

  $$('.search-button').forEach(function (b) { b.addEventListener('click', open); });
  $('.search-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  input.addEventListener('input', function () { if (index) render(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); select(selected + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); select(selected - 1); }
    else if (e.key === 'Enter') {
      var link = $('li[aria-selected="true"] a', list);
      if (link) { e.preventDefault(); link.click(); }
    }
  });
  list.addEventListener('click', function (e) {
    // A result on this page only moves to its heading, so close the dialog too
    if (e.target.closest('a')) dialog.close();
  });
  doc.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey) && !e.altKey) { e.preventDefault(); open(); }
    else if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); open(); }
  });
})();
