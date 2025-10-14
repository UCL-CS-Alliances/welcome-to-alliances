// assets/js/auth.js
(function () {
  function getSession() {
    try { return JSON.parse(localStorage.getItem('alliances_session') || 'null'); }
    catch (e) { return null; }
  }
  function isSignedIn() {
    const s = getSession();
    return !!(s && s.member_id);
  }
  function signOut() {
    localStorage.removeItem('alliances_session');
  }
  function redirectToSignIn(nextHref) {
    const base = (window.ALLIANCES_ROUTES && window.ALLIANCES_ROUTES.signin) || '/sign-in/';
    try {
      const url = new URL(base, window.location.origin);
      if (nextHref) url.searchParams.set('next', nextHref);
      window.location.href = url.toString();
    } catch {
      window.location.href = base + (nextHref ? ('?next=' + encodeURIComponent(nextHref)) : '');
    }
  }

  // Expose
  window.Auth = { getSession, isSignedIn, signOut, redirectToSignIn };

  // Guards
  document.addEventListener('DOMContentLoaded', function () {
    // Page-level guard
    if (window.REQUIRE_AUTH && !isSignedIn()) {
      redirectToSignIn(window.location.pathname + window.location.search);
      return;
    }

    // Link-level guard
    document.querySelectorAll('a[data-require-auth="true"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (!isSignedIn()) {
          e.preventDefault();
          const href = a.getAttribute('href');
          redirectToSignIn(href);
        }
      });
    });
  });
}());
