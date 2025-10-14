---
title: Sign in
permalink: /sign-in/
layout: default
---

<section class="stack" style="--stack-gap:1rem">
  <h1>Sign in</h1>
  <p class="small">Demo only: credentials are embedded in the page for prototype purposes.</p>

  <form id="signin-form" class="stack" style="--stack-gap:.75rem" novalidate>
    <div>
      <label for="email"><strong>Email</strong></label><br>
      <input id="email" name="email" type="email" autocomplete="username" required class="input" />
    </div>
    <div>
      <label for="password"><strong>Password</strong></label><br>
      <input id="password" name="password" type="password" autocomplete="current-password" required class="input" />
    </div>
    <button class="btn btn--primary" type="submit">Sign in</button>
  </form>

  <div id="signin-msg" role="status" aria-live="polite"></div>

  <noscript>
    <p class="small">This demo requires JavaScript.</p>
  </noscript>
</section>

<script>
  // Embed data for the client-side demo
  window.ALLIANCES_DATA = {
    members: {{ site.data.members | jsonify }},
    benefits: {{ site.data.benefits | jsonify }}
  };
</script>

<script>
(function () {
  const form = document.getElementById('signin-form');
  const msg = document.getElementById('signin-msg');

  function setMsg(text, ok=false) {
    msg.textContent = text;
    msg.style.color = ok ? 'inherit' : 'crimson';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = (document.getElementById('email').value || '').trim().toLowerCase();
    const password = document.getElementById('password').value || '';

    const members = (window.ALLIANCES_DATA && window.ALLIANCES_DATA.members) || [];
    const found = members.find(m =>
      (m.credentials && (m.credentials.email || '').toLowerCase() === email) &&
      (m.credentials.password === password)
    );

    if (!found) {
      setMsg('Incorrect email or password.');
      return;
    }

    // store a minimal session
function getNext() {
  const params = new URLSearchParams(window.location.search);
  return params.get('next') || (window.ALLIANCES_ROUTES && window.ALLIANCES_ROUTES.dashboard) || '/dashboard/';
}

    const session = {
      member_id: found.id,
      email: found.credentials.email,
      signed_in_at: new Date().toISOString()
    };
    try { localStorage.setItem('alliances_session', JSON.stringify(session)); } catch(e) {}
    setMsg('Signed in. Redirecting…', true);


    window.location.href = getNext();
  });
}());
</script>
