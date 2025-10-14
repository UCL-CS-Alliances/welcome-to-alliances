---
title: Member Dashboard
permalink: /dashboard/
slug: dashboard
require_auth: true
---

<section id="dashboard" class="stack" style="--stack-gap:1rem">
  <p id="hello"></p>

  <nav aria-label="Secondary" class="cluster">
    <a class="pill" aria-disabled="true" tabindex="-1" href="#" title="Inactive for demo">Edit profile</a>
    <a class="pill" aria-disabled="true" tabindex="-1" href="#" title="Inactive for demo">Download invoice</a>
  </nav>

  <div id="membership" class="stack" style="--stack-gap:.25rem"></div>

  <section class="stack" style="--stack-gap:.5rem">
    <h2>Benefits</h2>
    <p class="small">Legend: ✅ redeemed · 🟡 available · 🔒 not included in your tier</p>
    <ul id="benefits-list" class="list-plain stack"></ul>
  </section>

  <noscript>
    <p class="small">This demo requires JavaScript.</p>
  </noscript>
</section>

### Learn more about Friends of UCL Computer Science benefits

All **Silver, Gold, and Platinum** members receive a set of core operational benefits that support seamless collaboration, regardless of engagement track, e.g. research, innovation, or workforce development. These benefits are not always listed per tier but apply universally:

* A dedicated account manager from the Strategic Alliances Team
* Eligibility for future digital account tools (e.g. innovation portal, project dashboards)
* Priority access to showcase events and departmental initiatives

The following benefits serve as cross-cutting enablers of visibility and community engagement:

* Company logo and case study featured on the departmental website
* Invitation to the UCL Computer Science Annual Industry Dinner
* Visibility at the student project showcase
* Recognition as a strategic industry partner through departmental communications
* Access to co-branded sponsorship opportunities for flagship events

<script>
(function () {
  function getSession() {
    try { return JSON.parse(localStorage.getItem('alliances_session') || 'null'); }
    catch (e) { return null; }
  }

  document.addEventListener('DOMContentLoaded', function () {
    // If auth guard didn’t already redirect (because you’re signed in), carry on.
    const session = getSession();
    if (!session || !session.member_id) return; // guard will handle redirect on protected pages

    const data = window.ALLIANCES_DATA || {};
    const members = Array.isArray(data.members) ? data.members : [];
    const benefits = Array.isArray(data.benefits) ? data.benefits : [];

    // Bail gracefully if data is missing
    if (!members.length || !benefits.length) {
      console.warn('ALLIANCES_DATA not populated on dashboard.');
      return;
    }

    const member = members.find(m => m.id === session.member_id);
    if (!member) {
      // Session stale? Sign out and send to sign in.
      if (window.Auth) { window.Auth.signOut(); window.Auth.redirectToSignIn(); }
      return;
    }

    // Greeting
    const hello = document.getElementById('hello');
    if (hello) {
      hello.textContent = `Hello ${member.company.contact_first}, welcome back to your UCL Computer Science Alliances dashboard.`;
    }

    // Membership panel
    const rank = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
    const tier = (member.membership && member.membership.tier) || 'bronze';
    const expiry = (member.membership && member.membership.expiry) || '';
    const manager =
  (member.membership &&
   typeof member.membership.manager === 'string' &&
   member.membership.manager.trim().length)
    ? member.membership.manager.trim()
    : 'Marco Piccionello';
    const membership = document.getElementById('membership');
    if (membership) {
      membership.innerHTML = `
        <h2>Membership</h2>
        <p><strong>Level:</strong> ${tier.charAt(0).toUpperCase() + tier.slice(1)}</p>
        <p><strong>Expires:</strong> ${expiry}</p>
        <p><strong>Account manager:</strong> ${manager}</p>
      `;
    }

    // Superseded benefits (optional, per earlier note)
    const superseded = new Set();
    benefits.forEach(b => {
      const need = rank[b.tier_min] || 1;
      if (b.supersedes && (rank[tier] || 1) >= need) {
        (Array.isArray(b.supersedes) ? b.supersedes : [b.supersedes]).forEach(id => superseded.add(id));
      }
    });

    const myRank = rank[tier] || 1;
    const redeemed = new Set(member.redeemed_benefits || []);
    const list = document.getElementById('benefits-list');
    if (!list) return;

    list.innerHTML = '';
    benefits
      .filter(b => !superseded.has(b.id))
      .forEach(b => {
// ...inside benefitsEffective.forEach(b => { ... }) or benefits.forEach(b => { ... })
const needed = rank[b.tier_min] || 1;
let symbol = '🔒', aria = 'Not included in your tier';
if (myRank >= needed) {
  if (redeemed.has(b.id)) { symbol = '✅'; aria = 'Already redeemed'; }
  else { symbol = '🟡'; aria = 'Available to redeem'; }
}

const li = document.createElement('li');
li.innerHTML = `
  <div class="tile benefit" style="padding:.5rem .75rem">
    <span class="benefit-state" role="img" aria-label="${aria}">${symbol}</span>
    <strong>${b.description}</strong>
  </div>
`;
list.appendChild(li);
      });
  });
}());
</script>
