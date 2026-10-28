(function () {
  const S = window.SITE, $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const LANG_COLORS = {
    Python: "#3572A5", Swift: "#F05138", JavaScript: "#d4b830", TypeScript: "#3178c6", Java: "#b07219",
    "C++": "#f34b7d", C: "#555555", HTML: "#e34c26", CSS: "#563d7c", "Jupyter Notebook": "#DA5B0B",
  };

  /* ---------- static content ---------- */
  $("role").textContent = S.role;
  $("headline").textContent = S.headline;
  $("intro").textContent = S.intro;
  $("yr").textContent = new Date().getFullYear();
  $("bio").innerHTML = S.bio.map((p) => `<p>${esc(p)}</p>`).join("");
  $("facts").innerHTML = S.facts.filter(([, v]) => v).map(([k, v]) =>
    `<div class="fact"><span class="k">${esc(k)}</span><span class="v${/open to/i.test(v) ? " ok" : ""}">${esc(v)}</span></div>`).join("");
  if (S.certifications && S.certifications.length) {
    $("certs").hidden = false;
    $("certList").innerHTML = S.certifications.map((c) => {
      const earned = /earned/i.test(c.status);
      const inner = `
        <div class="cert-top"><span class="cert-status${earned ? " earned" : ""}">${esc(c.status)}</span>${c.date ? `<span class="cert-date">${esc(c.date)}</span>` : ""}</div>
        <h3>${esc(c.name)}</h3><div class="cert-issuer">${esc(c.issuer)}</div>`;
      return c.link
        ? `<a class="cert" href="${esc(c.link)}" target="_blank" rel="noopener">${inner}</a>`
        : `<div class="cert">${inner}</div>`;
    }).join("");
  }

  $("skillCols").innerHTML = Object.entries(S.skills).map(([group, items]) =>
    `<div class="skill-col"><h3>${esc(group)}</h3><ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");

  const avatar = $("avatar");
  avatar.src = S.avatar || `https://github.com/${S.github}.png?size=320`;
  avatar.onerror = () => avatar.remove();

  if (S.resume) { $("resumeBtn").href = S.resume; $("resumeBtn").hidden = false; }

  $("emailBtn").href = `mailto:${S.email}`;
  $("emailBtn").textContent = S.email;
  $("copyBtn").onclick = async () => {
    try { await navigator.clipboard.writeText(S.email); } catch (e) { return; }
    $("copied").classList.add("show");
    setTimeout(() => $("copied").classList.remove("show"), 1800);
  };
  $("socials").innerHTML = [
    [`https://github.com/${S.github}`, "GitHub"],
    [S.linkedin, "LinkedIn"],
    [`mailto:${S.email}`, "Email"],
  ].filter(([u]) => u).map(([u, t]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${t} ↗</a>`).join("");

  /* ---------- featured ---------- */
  const stack = (steps) => steps.map((l, i) =>
    (i ? '<div class="arrow"></div>' : "") + `<div class="layer">${esc(l)}</div>`).join("");

  function media(p) {
    if (p.diagram && p.diagram.lanes) {
      return `<div class="feat-media"><div class="arch">
        <div class="lanes">${p.diagram.lanes.map((lane) =>
          `<div class="lane"><div class="lane-title">${esc(lane.title)}</div><div class="diagram">${stack(lane.steps)}</div></div>`).join("")}
        </div>
        ${p.diagram.footer ? `<div class="arch-footer">${esc(p.diagram.footer)}</div>` : ""}
      </div></div>`;
    }
    if (p.diagram) {
      return `<div class="feat-media"><div class="diagram">${stack(p.diagram)}</div></div>`;
    }
    if (!p.images || !p.images.length) return "";
    const imgs = p.images.map((src) =>
      `<img class="shot" src="${esc(src)}" alt="${esc(p.title)} screenshot" loading="lazy">`).join("");
    return p.phone
      ? `<div class="feat-media"><div class="phones">${imgs}</div></div>`
      : `<div class="feat-media wide">${imgs}</div>`;
  }

  $("featured").innerHTML = window.FEATURED.map((p) => `
    <article class="feat reveal">
      ${media(p)}
      <div class="feat-body">
        <div class="feat-kicker">${esc(p.tagline)}${p.status ? `<span class="status">${esc(p.status)}</span>` : ""}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        ${p.highlights ? `<ul>${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
        <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <div class="feat-links">
          ${p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">Live ↗</a>` : ""}
          ${p.repo
            ? `<a href="https://github.com/${S.github}/${esc(p.repo)}" target="_blank" rel="noopener">View code ↗</a>
               <span class="stars" data-stars="${esc(p.repo)}"></span>`
            : `<span class="private">Private repository</span>`}
        </div>
      </div>
    </article>`).join("");

  /* ---------- lightbox ---------- */
  const lb = $("lightbox");
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("shot")) { lb.querySelector("img").src = e.target.src; lb.classList.add("open"); }
  });
  lb.onclick = () => lb.classList.remove("open");
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") lb.classList.remove("open"); });

  /* ---------- GitHub repos ---------- */
  let repos = [], lang = "All";
  const featuredRepos = new Set(window.FEATURED.map((p) => p.repo).filter(Boolean));
  const hidden = new Set(window.HIDE_REPOS || []);
  const isCourse = (r) => window.COURSEWORK && window.COURSEWORK.test(r.name);

  function visible() {
    return repos.filter((r) => $("showCourse").checked || !isCourse(r));
  }

  function renderFilters() {
    const counts = {};
    visible().forEach((r) => { const l = r.language || "Other"; counts[l] = (counts[l] || 0) + 1; });
    const langs = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    if (lang !== "All" && !counts[lang]) lang = "All";
    $("filters").innerHTML = ["All", ...langs].map((l) =>
      `<button class="chip${l === lang ? " on" : ""}" data-lang="${esc(l)}">${esc(l)}<span class="n">${l === "All" ? visible().length : counts[l]}</span></button>`).join("");
  }

  function renderRepos() {
    const list = visible().filter((r) => lang === "All" || (r.language || "Other") === lang);
    $("repos").innerHTML = list.length ? list.map((r) => `
      <a class="repo" href="${esc(r.html_url)}" target="_blank" rel="noopener">
        <div class="repo-top"><h4>${esc(r.name.replace(/[-_]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2"))}</h4>${isCourse(r) ? '<span class="badge">Coursework</span>' : ""}</div>
        ${r.description ? `<p>${esc(r.description)}</p>` : '<div style="flex:1"></div>'}
        <div class="repo-meta">
          ${r.language ? `<span><span class="ldot" style="background:${LANG_COLORS[r.language] || "var(--muted)"}"></span>${esc(r.language)}</span>` : ""}
          ${r.stargazers_count ? `<span>★ ${r.stargazers_count}</span>` : ""}
          <span>Updated ${new Date(r.pushed_at || r.updated_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
        </div>
      </a>`).join("") : '<div class="empty">No repositories match this filter.</div>';
  }

  $("filters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    lang = b.dataset.lang; renderFilters(); renderRepos();
  });
  $("showCourse").onchange = () => { renderFilters(); renderRepos(); };

  fetch(`https://api.github.com/users/${S.github}/repos?per_page=100&sort=pushed`)
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((all) => {
      all.forEach((r) => {
        const el = document.querySelector(`[data-stars="${CSS.escape(r.name)}"]`);
        if (el && r.stargazers_count) el.textContent = `★ ${r.stargazers_count}`;
      });
      repos = all.filter((r) => !r.fork && !featuredRepos.has(r.name) && !hidden.has(r.name));
      renderFilters(); renderRepos();
    })
    .catch(() => {
      $("repos").innerHTML = `<div class="empty">Couldn't reach GitHub right now. <a href="https://github.com/${esc(S.github)}" target="_blank" rel="noopener">See all repositories ↗</a></div>`;
    });

  /* ---------- visitor counter (AWS: API Gateway → Lambda → DynamoDB) ---------- */
  if (S.counterApi) {
    fetch(S.counterApi, { method: "POST" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { $("visitCount").textContent = Number(d.count).toLocaleString(); $("visits").hidden = false; })
      .catch(() => {});
  }

  /* ---------- theme ---------- */
  const root = document.documentElement;
  $("themeBtn").onclick = () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  };

  /* ---------- nav state + reveal ---------- */
  const nav = $("nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });

  const links = [...document.querySelectorAll(".nav-links a")];
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  ["about", "work", "more", "contact"].forEach((id) => spy.observe($(id)));

  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
