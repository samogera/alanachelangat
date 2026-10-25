/* Alana Chelangat · site behaviour
   - sticky header shadow + mobile menu
   - video pop-up player (YouTube, Facebook, Instagram)
   - media kit bio tabs + copy button
   - contact form (opens the visitor's email app with the message ready to send)
   Everything degrades gracefully: without JavaScript every link still opens the original page. */
(function () {
  'use strict';
  var EMAIL = 'alanachelangat@gmail.com';

  /* ---------- Header ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

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
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var type = d.get('type') || 'Request';
      var org = d.get('organisation') ? ' (' + d.get('organisation') + ')' : '';
      var subject = type + ' for Alana Chelangat' + org;
      var body = [
        'Name: ' + (d.get('name') || ''),
        'Email: ' + (d.get('email') || ''),
        'Organisation: ' + (d.get('organisation') || ''),
        'Request: ' + type,
        'Event date and location: ' + (d.get('when') || ''),
        '',
        d.get('message') || ''
      ].join('\n');
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      form.hidden = true;
      doneBox.hidden = false;
      doneBox.querySelector('h2').focus();
    });
    var again = document.querySelector('[data-form-again]');
    if (again) again.addEventListener('click', function () { form.reset(); form.hidden = false; doneBox.hidden = true; form.querySelector('input').focus(); });
  }
})();
