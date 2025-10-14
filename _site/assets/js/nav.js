(function () {
  const menus = document.querySelectorAll('.nav-item.has-submenu');

  function closeAll(exceptId) {
    menus.forEach(li => {
      const btn = li.querySelector('.menu-button');
      const panel = li.querySelector('.menu-panel');
      if (!btn || !panel) return;
      const keepOpen = exceptId && panel.id === exceptId;
      panel.hidden = !keepOpen;
      btn.setAttribute('aria-expanded', keepOpen ? 'true' : 'false');
    });
  }

  function getItems(panel) {
    return Array.from(panel.querySelectorAll('[role="menuitem"]:not(.disabled)'));
  }

  function moveFocus(items, currentIndex, delta) {
    if (!items.length) return;
    const len = items.length;
    const next = (currentIndex + delta + len) % len;
    items[next].focus();
  }

  menus.forEach(li => {
    const btn = li.querySelector('.menu-button');
    const panel = li.querySelector('.menu-panel');
    if (!btn || !panel) return;

    // Open/close by click
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      closeAll(open ? null : panel.id);
      if (!open) {
        panel.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        const items = getItems(panel);
        if (items[0]) items[0].focus();
      }
    });

    // Keyboard on button
    btn.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key === 'ArrowDown' || key === 'Enter' || key === ' ') {
        e.preventDefault();
        closeAll(panel.id);
        panel.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        const items = getItems(panel);
        if (items[0]) items[0].focus();
      } else if (key === 'ArrowUp') {
        e.preventDefault();
        closeAll(panel.id);
        panel.hidden = false;
        btn.setAttribute('aria-expanded', 'true');
        const items = getItems(panel);
        if (items.length) items[items.length - 1].focus();
      } else if (key === 'Escape') {
        closeAll(null);
        btn.focus();
      }
    });

    // Keyboard within panel
    panel.addEventListener('keydown', (e) => {
      const items = getItems(panel);
      const currentIndex = items.indexOf(document.activeElement);
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault(); moveFocus(items, currentIndex, +1); break;
        case 'ArrowUp':
          e.preventDefault(); moveFocus(items, currentIndex, -1); break;
        case 'Home':
          e.preventDefault(); if (items[0]) items[0].focus(); break;
        case 'End':
          e.preventDefault(); if (items[items.length - 1]) items[items.length - 1].focus(); break;
        case 'Escape':
          e.preventDefault(); closeAll(null); btn.focus(); break;
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    const isMenu = e.target.closest('.nav-item.has-submenu');
    if (!isMenu) closeAll(null);
  });

  // Close on Escape globally
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll(null);
  });
}());

// --- Account Sign in/out toggle ---
function getSession() {
  try { return JSON.parse(localStorage.getItem('alliances_session') || 'null'); }
  catch (e) { return null; }
}
(function toggleAccount() {
  const link = document.getElementById('account-action');
  if (!link) return;
  const session = getSession();
  if (session && session.member_id) {
    link.textContent = 'Sign out';
    link.setAttribute('href', '#');
    link.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('alliances_session');   // <-- the one-liner
      // Optionally close the menu:
      const btn = document.getElementById('btn-account');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      const panel = document.getElementById('menu-account');
      if (panel) panel.hidden = true;
      // Redirect somewhere sensible:
      window.location.href = "{{ '/sign-in/' | relative_url }}";
    }, { once: true });
  } else {
    link.textContent = 'Sign in';
    link.setAttribute('href', "{{ '/sign-in/' | relative_url }}");
  }
}());

// assets/js/nav.js  (append near the end or keep inside your init block)
(function () {
  function getSession() {
    try { return JSON.parse(localStorage.getItem('alliances_session') || 'null'); }
    catch (e) { return null; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const link = document.getElementById('account-action');
    if (!link) return;

    const routes = window.ALLIANCES_ROUTES || {};
    const session = getSession();
    if (session && session.member_id) {
      link.textContent = 'Sign out';
      link.setAttribute('href', '#');
      link.addEventListener('click', function (e) {
        e.preventDefault();
        window.Auth && window.Auth.signOut();
        // Close menu if present
        const btn = document.getElementById('btn-account');
        const panel = document.getElementById('menu-account');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.hidden = true;
        // Back to sign-in
        window.location.href = routes.signin || '/sign-in/';
      }, { once: true });
    } else {
      link.textContent = 'Sign in';
      link.setAttribute('href', routes.signin || '/sign-in/');
    }
  });
}());
