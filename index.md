---
title: "Home"
layout: default
---
<section class="home-intro">
  <h1>{{ site.data.site.tagline }}</h1>
  <p>{{ site.data.site.mission }}</p>
</section>

<section class="home-pathways">
  <h2>Collaboration pathways</h2>
  <p>
  Explore ways you can begin collaborateing within the innovation ecosystem of UCL Computer Science.
  </p>
  <div class="grid">
    {% assign paths = site.pathways | sort: "weight" %}
    {% for p in paths %}
      <div class="card">
        <h3><a href="{{ p.url | relative_url }}">{{ p.title }}</a></h3>
        {% if p.description %}<p>{{ p.description }}</p>{% endif %}

        {% comment %} Service spotlight: services tagged with this pathway and spotlight: true {% endcomment %}
{% assign _svcs_sorted = site.services | sort: "title" %}
{% assign has_spot = false %}
{% for s in _svcs_sorted %}
  {% if s.spotlight and s.pathways and s.pathways contains p.slug %}
    {% unless has_spot %}
      {% assign has_spot = true %}
      <div class="spotlight">
        <h4 class="spotlight-title">Service spotlight</h4>
        <ul>
    {% endunless %}
          <li><a href="{{ s.url | relative_url }}">{{ s.title }}</a></li>
  {% endif %}
{% endfor %}
{% if has_spot %}
        </ul>
      </div>
{% endif %}
      </div>
    {% endfor %}
  </div>
</section>

<section class="home-news">
  <h2>News</h2>
  <ul class="news-list">
    {% assign news = site.posts | where_exp: "post", "post.tags contains 'news'" | sort: "date" | reverse %}
    {% for post in news limit:5 %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <time datetime="{{ post.date | date_to_xmlschema }}"> · {{ post.date | date: "%-d %B %Y" }}</time>
      </li>
    {% endfor %}
  </ul>
</section>
