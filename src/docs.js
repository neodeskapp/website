/* The docs' behaviour in the browser: search, copy buttons, the "On this page"
   marker and the sidebar panel on small screens. The pages read fine without it.
   Its words come from the page, in the page's language: data-copied on a copy
   button and the search dialog's data attributes. */
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
    var label = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', label);
    copyText($('code', btn.parentNode).textContent, function () {
      btn.textContent = btn.getAttribute('data-copied') || 'Copied';
      clearTimeout(btn._t);
      btn._t = setTimeout(function () { btn.textContent = label; }, 1600);
    });
  });

  /* ---- "Copy as Markdown": a plain link to the page's .md; a click copies it instead ---- */
  doc.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a.md-link');
    if (!link || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || !window.fetch) return;
    e.preventDefault();
    var label = link.getAttribute('data-label') || link.textContent;
    link.setAttribute('data-label', label);
    fetch(link.href).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (text) {
      copyText(text, function () {
        link.textContent = link.getAttribute('data-copied') || label;
        clearTimeout(link._t);
        link._t = setTimeout(function () { link.textContent = label; }, 1600);
      });
    }).catch(function () { location.href = link.href; });
  });

  /* ---- A screenshot opens in the theme it is shown in ---- */
  var dark = window.matchMedia('(prefers-color-scheme: dark)');
  doc.addEventListener('click', function (e) {
    var shot = e.target.closest && e.target.closest('a.shot');
    if (shot && dark.matches && shot.dataset.dark) shot.href = shot.dataset.dark;
  });

  /* ---- Menu on small screens ---- */
  /* The sidebar opens as a panel under the header, which does not stay at the top,
     so the panel starts where the header ends at that moment. The site menu (a
     <details> in the header) and the panel close each other. */
  var menu = $('.menu-button');
  var siteMenu = $('.top-menu');
  var header = $('header.top');
  function setMenu(open) {
    if (open && header) doc.documentElement.style.setProperty('--panel-top', Math.max(0, header.getBoundingClientRect().bottom) + 'px');
    doc.documentElement.classList.toggle('menu-open', open);
    if (menu) menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && siteMenu) siteMenu.open = false;
  }
  if (menu) menu.addEventListener('click', function () { setMenu(menu.getAttribute('aria-expanded') !== 'true'); });
  if (siteMenu) siteMenu.addEventListener('toggle', function () { if (siteMenu.open) setMenu(false); });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (siteMenu && siteMenu.open) { siteMenu.open = false; $('summary', siteMenu).focus(); }
    if (menu && menu.getAttribute('aria-expanded') === 'true') { setMenu(false); menu.focus(); }
  });

  /* ---- Keep the current page visible in a long sidebar ---- */
  // After the first frame, so reading the sidebar's size does not force a layout of its own
  var here = $('.sidebar li a[aria-current="page"]');
  var side = $('.sidebar');
  if (here && side) requestAnimationFrame(function () {
    if (side.scrollHeight > side.clientHeight) side.scrollTop = here.offsetTop - side.clientHeight / 2;
  });

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
    requestAnimationFrame(mark);
  }

  /* ---- Search ----
     The index (src/search.ts) is loaded the first time search opens, gzipped where the
     browser can unpack it. Results come in groups: pages, sections, commands, settings.
     Without scripts the search button is a link to the list of all pages.
     The field is a combobox and the results a listbox, as in the ARIA pattern: the
     arrow keys move the selection, Enter opens it, and focus stays in the field. The
     line under the results shows the hint or that nothing was found; a hidden status
     says the number of results once the reader stops typing. */
  var dialog = $('dialog.search');
  if (!dialog || !dialog.showModal) return;
  var input = $('#search-input');
  var list = $('#search-results');
  var status = $('.search-status');
  var spoken = $('.search-said');
  var hint = status.textContent;
  var speakTimer = null;
  var said = function (name, fallback) { return dialog.getAttribute('data-' + name) || fallback; };
  var base = said('base', '/');
  var groupNames = said('groups', 'Pages|Sections|Commands|Settings').split('|');
  var items = null;
  var pages = null;
  var settingsOn = {};
  var loading = null;
  var selected = -1;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || '');
  if (isMac) $$('.search-button kbd').forEach(function (k) { k.textContent = '⌘K'; });

  // The same id the build gives a heading, for entries whose id the index leaves out
  function slug(text) { return text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/\s/g, '-'); }

  function prepare(data) {
    pages = data.p.map(function (p) {
      return { title: p[0], section: data.s[p[1]] || '', path: p[2], hay: (p[0] + ' ' + p[3] + ' ' + p[4]).toLowerCase() };
    });
    items = data.p.map(function (p, n) {
      return { kind: 0, page: n, label: p[0], lower: p[0].toLowerCase(), text: p[3], textLower: p[3].toLowerCase(), href: base + p[2] };
    });
    settingsOn = {};
    data.e.forEach(function (e) {
      var page = pages[e[0]];
      if (e[1] === 3) settingsOn[e[0]] = (settingsOn[e[0]] || 0) + 1;
      page.hay += ' ' + (e[2] + ' ' + e[4]).toLowerCase();
      items.push({ kind: e[1], page: e[0], label: e[2], lower: e[2].toLowerCase(), text: e[4], textLower: e[4].toLowerCase(), href: base + page.path + '#' + (e[3] || slug(e[2])) });
    });
  }

  function fetchIndex() {
    var src = said('index', 'search.json');
    var plainJson = function () { return fetch(src).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }); };
    if (!window.DecompressionStream || !window.Response) return plainJson();
    return fetch(src + '.gz').then(function (r) {
      if (!r.ok || !r.body) throw new Error(r.status);
      return new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).json();
    }).catch(plainJson);
  }
  function load() {
    if (!loading) loading = fetchIndex().then(prepare).catch(function (err) { loading = null; throw err; });
    return loading;
  }

  function words(text) { return (text.toLowerCase().match(/[\p{L}\p{N}_]+/gu) || []).filter(function (w) { return w.length > 1; }); }
  function count(text, terms) { return terms.filter(function (t) { return text.indexOf(t) !== -1; }).length; }
  function atStart(text, t) { var i = text.indexOf(t); return i === 0 || (i > 0 && /[^\p{L}\p{N}]/u.test(text[i - 1])); }

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

  // A result's score: the words in its name count most, then in its text. A page found
  // only through the words on it comes last.
  function score(it, terms, phrase) {
    var inLabel = count(it.lower, terms);
    var inText = count(it.textLower, terms);
    if (!inLabel && !inText && it.kind !== 0) return 0;
    var s = inLabel === terms.length ? 100 : 20 * inLabel;
    var bare = it.lower.replace(/^neodesk /, '');
    if (it.lower === phrase || (it.kind === 2 && bare === phrase)) s += 120;
    else if (atStart(it.lower, phrase) && phrase.length > 2) s += 50;
    terms.forEach(function (t) { if (atStart(it.lower, t)) s += 10; });
    s += inText === terms.length ? 20 : 5 * inText;
    // The whole phrase in the text: a flag or a setting named exactly counts most
    if (phrase.length > 3 && it.textLower.indexOf(phrase) !== -1) s += /^--|_/.test(phrase) ? 90 : 25;
    // A setting on a page that lists many settings is on its reference page
    if (it.kind === 3) s += Math.min(10, (settingsOn[it.page] || 0) / 5);
    if (it.kind === 0) s += 30;
    // A page whose title has every word, or the word's stem ("installieren" in
    // "Installation"), is what the reader looks for, before a heading on another page
    if (it.kind === 0 && terms.every(function (t) { return it.lower.indexOf(t) !== -1 || (t.length >= 7 && it.lower.indexOf(t.slice(0, 6)) !== -1); })) s += 120;
    if (it.kind === 3 && /[_-]/.test(phrase)) s += 20;
    if (it.kind === 2 && /^neodesk\b/.test(phrase)) s += 20;
    s += Math.max(0, 20 - it.lower.length / 4);
    return s;
  }

  var PER_GROUP = 8;
  function search(query) {
    var phrase = query.trim().toLowerCase().replace(/\s+/g, ' ');
    var terms = words(phrase);
    if (!terms.length) return [];
    var ok = pages.map(function (p) { return terms.every(function (t) { return p.hay.indexOf(t) !== -1; }); });
    var found = [];
    items.forEach(function (it) {
      if (!ok[it.page]) return;
      var s = score(it, terms, phrase);
      if (s > 0) found.push({ it: it, s: s });
    });
    found.sort(function (a, b) { return b.s - a.s; });
    // Groups in the order of their best result, each with its best few
    var groups = [];
    var byKind = {};
    found.forEach(function (r) {
      var k = r.it.kind;
      if (!byKind[k]) { byKind[k] = []; groups.push(k); }
      if (byKind[k].length < PER_GROUP) byKind[k].push(r);
    });
    return groups.map(function (k) { return { kind: k, results: byKind[k], terms: terms }; });
  }

  function options() { return $$('[role="option"]', list); }
  function select(i) {
    var all = options();
    selected = all.length ? (i + all.length) % all.length : -1;
    all.forEach(function (li, n) { li.setAttribute('aria-selected', n === selected ? 'true' : 'false'); });
    if (selected >= 0) {
      all[selected].scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', all[selected].id);
    } else input.removeAttribute('aria-activedescendant');
  }

  // The status is said once the reader has stopped typing, not on every key
  function speak(text) {
    clearTimeout(speakTimer);
    speakTimer = setTimeout(function () { if (spoken.textContent !== text) spoken.textContent = text; }, 400);
  }

  function render() {
    var q = input.value;
    if (!q.trim()) {
      list.innerHTML = '';
      status.textContent = hint;
      status.hidden = false;
      input.setAttribute('aria-expanded', 'false');
      clearTimeout(speakTimer);
      select(-1);
      return;
    }
    var groups = search(q);
    var n = 0;
    list.innerHTML = groups.map(function (g, gi) {
      var head = '<div class="result-group" id="result-group-' + gi + '">' + escapeHtml(groupNames[g.kind] || '') + '</div>';
      return '<div role="group" aria-labelledby="result-group-' + gi + '">' + head + g.results.map(function (r) {
        var it = r.it;
        var page = pages[it.page];
        var code = it.kind === 2 || it.kind === 3;
        var name = '<span class="result-name' + (code ? ' result-code' : '') + '">' + escapeHtml(it.label) + '</span>';
        var where = it.kind === 0 ? page.section : page.title;
        var text = it.kind === 0 && !count(it.textLower, g.terms) ? escapeHtml(it.text) : excerpt(it.text, g.terms);
        return '<div role="option" id="result-' + (n++) + '" aria-selected="false" data-href="' + escapeHtml(it.href) + '">' +
          '<span class="result-title">' + name + '<small>' + escapeHtml(where) + '</small></span>' +
          (text ? '<span class="result-text">' + text + '</span>' : '') + '</div>';
      }).join('') + '</div>';
    }).join('');
    var nothing = said('nothing', 'Nothing found for "{query}". Try fewer or other words.').replace('{query}', q.trim());
    status.hidden = n > 0;
    status.textContent = n ? '' : nothing;
    input.setAttribute('aria-expanded', n ? 'true' : 'false');
    speak(n ? said('results', '{count} results').replace('{count}', n) : nothing);
    select(n ? 0 : -1);
  }

  // Opens a result: in this tab, or in a new one with Ctrl or Cmd or the middle button
  function go(option, newTab) {
    var href = option && option.getAttribute('data-href');
    if (!href) return;
    if (newTab) { window.open(href, '_blank', 'noopener'); return; }
    // A result on this page only moves to its heading, so close the dialog too
    dialog.close();
    location.href = href;
  }

  function open() {
    setMenu(false);
    if (siteMenu) siteMenu.open = false;
    if (!dialog.open) dialog.showModal();
    input.select();
    load().then(render, function () {
      status.hidden = false;
      status.textContent = said('failed', 'The search index could not be loaded.');
      speak(status.textContent);
    });
  }

  $$('.search-button').forEach(function (b) {
    b.addEventListener('click', function (e) {
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      open();
    });
    // Start loading the index when the reader is about to search
    ['pointerenter', 'focus'].forEach(function (ev) { b.addEventListener(ev, function () { load().catch(function () {}); }, { once: true }); });
  });
  $('.search-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  input.addEventListener('input', function () { if (items) render(); });
  input.addEventListener('keydown', function (e) {
    // Escape closes at once; a search field would first clear itself
    if (e.key === 'Escape') { e.preventDefault(); dialog.close(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); select(selected + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); select(selected - 1); }
    else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); select(0); }
    else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); select(-1); }
    else if (e.key === 'Enter') {
      var option = $('[aria-selected="true"]', list);
      if (option) { e.preventDefault(); go(option, e.ctrlKey || e.metaKey); }
    }
  });
  list.addEventListener('click', function (e) {
    var option = e.target.closest('[role="option"]');
    if (option) go(option, e.ctrlKey || e.metaKey || e.shiftKey);
  });
  list.addEventListener('auxclick', function (e) {
    var option = e.target.closest('[role="option"]');
    if (option && e.button === 1) go(option, true);
  });
  list.addEventListener('mousemove', function (e) {
    var option = e.target.closest('[role="option"]');
    var i = options().indexOf(option);
    if (option && i !== selected) select(i);
  });
  // Only Ctrl+K or Cmd+K: a shortcut of one character would fire on dictated text too
  doc.addEventListener('keydown', function (e) {
    if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey) && !e.altKey) { e.preventDefault(); open(); }
  });
})();
