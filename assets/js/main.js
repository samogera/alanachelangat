/* Alana Chelangat · site behaviour
   - sticky header + full-screen mobile menu
   - video pop-up player (YouTube, Facebook, Instagram)
   - media kit bio tabs + copy button
   - contact form: emails Alana (copy to her parent) through FormSubmit, with an email-app fallback
   Everything degrades gracefully: without JavaScript every link still opens the original page. */
(function () {
  'use strict';
  var EMAIL = 'alanachelangat@gmail.com';
  var PARENT_CC = ['chemruto', 'gmail.com'].join('@');
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL;

  /* ---------- Header + mobile menu ---------- */
  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toggle && menu) {
    var label = toggle.querySelector('.label');
    var desktop = window.matchMedia('(min-width: 1081px)');
    var setMenu = function (open, returnFocus) {
      root.classList.toggle('menu-open', open);
      root.classList.toggle('menu-lock', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (label) label.textContent = open ? 'Close' : 'Menu';
      if ('inert' in menu) menu.inert = !open;
      if (open) { var first = menu.querySelector('a'); if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 60); }
      else if (returnFocus) toggle.focus();
    };
    setMenu(false);
    toggle.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false, true);
    });
    var onBp = function () { if (desktop.matches && root.classList.contains('menu-open')) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onBp); else if (desktop.addListener) desktop.addListener(onBp);
  }

  /* ---------- Footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  document.querySelectorAll('[data-to-top]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var main = document.getElementById('main');
      if (main) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
    });
  });

  /* ---------- Phone sliders (dots under each swipeable row) ---------- */
  document.querySelectorAll('[data-slider]').forEach(function (track) {
    var slides = Array.prototype.slice.call(track.children);
    if (slides.length < 2) return;
    var dots = document.createElement('div');
    dots.className = 'slider-dots';
    dots.setAttribute('role', 'group');
    dots.setAttribute('aria-label', 'Choose a slide');
    slides.forEach(function (slide, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show item ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () {
        var pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
        track.scrollTo({ left: slide.offsetLeft - track.offsetLeft - pad, behavior: 'smooth' });
      });
      dots.appendChild(b);
    });
    track.insertAdjacentElement('afterend', dots);
    var buttons = dots.querySelectorAll('button');
    var update = function () {
      var max = track.scrollWidth - track.clientWidth;
      var active = 0;
      if (max > 0 && track.scrollLeft >= max - 4) active = slides.length - 1;
      else {
        var best = Infinity;
        slides.forEach(function (s, i) {
          var d = Math.abs(s.offsetLeft - track.offsetLeft - (parseFloat(getComputedStyle(track).paddingLeft) || 0) - track.scrollLeft);
          if (d < best) { best = d; active = i; }
        });
      }
      buttons.forEach(function (b, i) { b.setAttribute('aria-current', i === active ? 'true' : 'false'); });
    };
    var raf = 0;
    track.addEventListener('scroll', function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* ---------- Video pop-up ---------- */
  var modal = document.getElementById('video-modal');
  function embedUrl(type, src) {
    if (type === 'youtube') return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(src) + '?autoplay=1&rel=0&modestbranding=1';
    if (type === 'facebook') return 'https://www.facebook.com/plugins/video.php?href=' + encodeURIComponent(src) + '&show_text=false&autoplay=true&width=1280';
    if (type === 'instagram') return src.replace(/\/?$/, '/') + 'embed';
    return src;
  }
  if (modal && typeof modal.showModal === 'function') {
    var frameBox = modal.querySelector('.frame');
    var titleEl = modal.querySelector('[data-video-title]');
    var openEl = modal.querySelector('[data-video-open]');
    var closeBtn = modal.querySelector('.close');
    document.querySelectorAll('[data-embed]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        var type = trigger.getAttribute('data-embed');
        var src = trigger.getAttribute('data-src');
        var iframe = document.createElement('iframe');
        iframe.src = embedUrl(type, src);
        iframe.title = trigger.getAttribute('data-title') || 'Video';
        iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write';
        iframe.allowFullscreen = true;
        iframe.loading = 'eager';
        frameBox.innerHTML = '';
        frameBox.appendChild(iframe);
        modal.classList.toggle('portrait', type === 'instagram');
        titleEl.textContent = trigger.getAttribute('data-title') || '';
        openEl.href = trigger.getAttribute('href') || src;
        openEl.textContent = trigger.getAttribute('data-open-label') || 'Open original';
        modal.showModal();
        closeBtn.focus();
      });
    });
    function shut() { frameBox.innerHTML = ''; if (modal.open) modal.close(); }
    closeBtn.addEventListener('click', shut);
    modal.addEventListener('click', function (e) { if (e.target === modal) shut(); });
    modal.addEventListener('close', function () { frameBox.innerHTML = ''; });
  }

  /* ---------- Media kit bio ---------- */
  var bioBox = document.querySelector('[data-bio]');
  if (bioBox) {
    var bios = {
      short: bioBox.querySelector('template[data-bio-short]').innerHTML.trim(),
      long: bioBox.querySelector('template[data-bio-long]').innerHTML.trim()
    };
    var textEl = bioBox.querySelector('.bio-text');
    var countEl = bioBox.querySelector('[data-bio-count]');
    var copyBtn = bioBox.querySelector('[data-copy]');
    var copyLabel = copyBtn.querySelector('span');
    var current = 'short';
    function decode(html) { var t = document.createElement('textarea'); t.innerHTML = html; return t.value; }
    function show(which) {
      current = which;
      var txt = decode(bios[which]);
      textEl.textContent = txt;
      countEl.textContent = txt.split(/\s+/).filter(Boolean).length + ' words';
      bioBox.querySelectorAll('[role="tab"]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-tab') === which ? 'true' : 'false'); });
      copyLabel.textContent = 'Copy bio';
    }
    bioBox.querySelectorAll('[role="tab"]').forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-tab')); }); });
    copyBtn.addEventListener('click', function () {
      var txt = textEl.textContent;
      function done() { copyLabel.textContent = 'Copied'; setTimeout(function () { copyLabel.textContent = 'Copy bio'; }, 2200); }
      function fallback() {
        var range = document.createRange(); range.selectNodeContents(textEl);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        try { document.execCommand('copy'); done(); } catch (err) { copyLabel.textContent = 'Press Ctrl+C to copy'; }
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, fallback);
      else fallback();
    });
    show('short');
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var doneBox = document.getElementById('form-done');
    var sendBtn = form.querySelector('button[type="submit"]');
    var sendLabel = form.querySelector('[data-send-label]');
    var errorEl = form.querySelector('[data-form-error]');
    var sentMsg = doneBox.querySelector('[data-done-sent]');
    var mailtoMsg = doneBox.querySelector('[data-done-mailto]');
    var doneEmail = doneBox.querySelector('[data-done-email]');

    var showDone = function (how, email) {
      sentMsg.hidden = how !== 'sent';
      mailtoMsg.hidden = how !== 'mailto';
      if (doneEmail && email) doneEmail.textContent = email;
      form.hidden = true;
      doneBox.hidden = false;
      doneBox.querySelector('h2').focus();
    };
    var busy = function (on) {
      form.setAttribute('aria-busy', on ? 'true' : 'false');
      sendBtn.disabled = on;
      sendLabel.textContent = on ? 'Sending…' : 'Send request';
    };
    var openMailto = function (subject, lines) {
      window.location.href = 'mailto:' + EMAIL + '?cc=' + encodeURIComponent(PARENT_CC) +
        '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorEl.hidden = true;
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var val = function (k) { return String(d.get(k) || '').trim(); };
      var type = val('type') || 'Request';
      var subject = type + ' for Alana Chelangat' + (val('organisation') ? ' (' + val('organisation') + ')' : '');
      if (val('_honey')) { showDone('sent'); return; } /* a bot filled the hidden field */

      var lines = [
        'Name: ' + val('name'),
        'Email: ' + val('email'),
        'Organisation: ' + val('organisation'),
        'Request: ' + type,
        'Event date and location: ' + val('when'),
        '',
        val('message')
      ];
      var payload = {
        'Name': val('name'),
        'email': val('email'),
        'Organisation': val('organisation') || '—',
        'Request': type,
        'Event date and location': val('when') || '—',
        'Message': val('message'),
        _subject: subject,
        _cc: PARENT_CC,
        _replyto: val('email'),
        _template: 'table',
        _captcha: 'false',
        _autoresponse: 'Thank you for contacting Alana Chelangat. Your request has been received and will be reviewed by her parent. We will reply as soon as we can.'
      };

      busy(true);
      var ctrl = 'AbortController' in window ? new AbortController() : null;
      var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 20000);
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: ctrl ? ctrl.signal : undefined
      })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, data: j }; }); })
        .then(function (res) {
          if (res.ok && String(res.data.success) === 'true') { showDone('sent', val('email')); return; }
          throw new Error((res.data && res.data.message) || 'Send failed');
        })
        .catch(function () {
          /* Could not send automatically: open the visitor's email app instead, with her parent copied in. */
          openMailto(subject, lines);
          showDone('mailto');
        })
        .then(function () { clearTimeout(timer); busy(false); });
    });
    var again = document.querySelector('[data-form-again]');
    if (again) again.addEventListener('click', function () { form.reset(); form.hidden = false; doneBox.hidden = true; var first = document.getElementById('c-name'); if (first) first.focus(); });
  }
})();
