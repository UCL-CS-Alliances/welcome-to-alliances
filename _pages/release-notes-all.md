---
title: All release notes
permalink: /release-notes/all/
layout: page
---

## Change log

<ul class="releases">
  {% assign rel = site.releases | sort: "date" | reverse %}
  {% for r in rel %}
    <li>
      <a href="{{ r.url | relative_url }}">
        Version {{ r.version }}: Released on {{ r.date | date: "%-d %B %Y" }} as a {{ r.status }} version
      </a>
    </li>
  {% endfor %}
</ul>
