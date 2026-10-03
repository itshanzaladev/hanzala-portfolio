/* =========================================================
   PROJECTS — add a new project by copying one object below.

   {
     title:    "Project name",
     category: "webapp" | "saas" | "website" | "dashboard" | "mobile",
     type:     "Label shown under the title",
     year:     "2026",
     image:    "assets/projects/your-screenshot.jpg",   // ~1200x840 works best
     url:      "https://your-live-link.com",            // or "#" if not live yet
     live:     true,                                     // shows the "Live" badge
     featured: true,                                     // big full-width card (use for 1 project)
     description: "One or two sentences about what it does.",
     stack:    ["React", "Node.js"],
   }

   Projects marked `template: true` are placeholders — replace them
   with your real work as you build it.
   ========================================================= */

const CATEGORIES = {
  webapp: "Web Apps",
  saas: "SaaS",
  website: "Websites",
  dashboard: "Dashboards",
  mobile: "Mobile",
};

const PROJECTS = [
  {
    title: "Motion Orthopedic",
    category: "webapp",
    type: "Clinic Web App · Healthcare",
    year: "2026",
    image: "assets/projects/motion-orthopedic.jpg",
    url: "https://motionorthopedic.vercel.app",
    live: true,
    featured: true,
    description:
      "A bilingual (English / اردو) website for a physiotherapy clinic in Wah Cantt. Patients browse 20+ treatment services, read reviews and request appointments that are routed to the clinic on WhatsApp — for clinic visits or home sessions.",
    highlights: [
      "English ↔ Urdu language switch with RTL support",
      "WhatsApp-based appointment request flow",
      "Service catalogue, reviews, location & FAQs",
      "Fully responsive, deployed on Vercel",
    ],
    stack: ["React", "Vite", "Responsive UI", "i18n", "Vercel"],
  },
  {
    title: "Launchpad SaaS",
    category: "saas",
    type: "SaaS Platform · Template",
    year: "2026",
    image: "assets/projects/launchpad-saas.svg",
    url: "#",
    template: true,
    description: "Subscription SaaS starter with auth, pricing tiers and a user dashboard.",
    stack: ["Next.js", "Stripe", "PostgreSQL"],
  },
  {
    title: "FinTrack Dashboard",
    category: "dashboard",
    type: "Analytics Dashboard · Template",
    year: "2026",
    image: "assets/projects/fintrack-dashboard.svg",
    url: "#",
    template: true,
    description: "Finance tracking dashboard with charts, budgets and real-time data.",
    stack: ["React", "Node.js", "MongoDB"],
  },
  {
    title: "Nova Agency",
    category: "website",
    type: "Agency Website · Template",
    year: "2025",
    image: "assets/projects/nova-agency.svg",
    url: "#",
    template: true,
    description: "Bold, animated agency website with case studies and a CMS-driven blog.",
    stack: ["Next.js", "GSAP", "Tailwind"],
  },
  {
    title: "FitPulse",
    category: "mobile",
    type: "Fitness App UI · Template",
    year: "2025",
    image: "assets/projects/fitpulse-mobile.svg",
    url: "#",
    template: true,
    description: "Workout tracking app — activity rings, progress stats and plans.",
    stack: ["React Native", "Firebase"],
  },
  {
    title: "Bloom Store",
    category: "webapp",
    type: "E-commerce Web App · Template",
    year: "2025",
    image: "assets/projects/bloom-landing.svg",
    url: "#",
    template: true,
    description: "Skincare storefront with cart, checkout and an admin panel for orders.",
    stack: ["React", "Express", "Stripe"],
  },
];

/* ---------- Render ---------- */
(() => {
  const grid = document.getElementById("workGrid");
  const filterBar = document.getElementById("workFilters");
  if (!grid || !filterBar) return;

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // Only show filter tabs for categories that actually have projects
  const used = Object.keys(CATEGORIES).filter((key) => PROJECTS.some((p) => p.category === key));
  filterBar.innerHTML = [
    `<button class="filter active" data-filter="all" role="tab" aria-selected="true">All</button>`,
    ...used.map(
      (key) => `<button class="filter" data-filter="${key}" role="tab" aria-selected="false">${CATEGORIES[key]}</button>`
    ),
  ].join("");

  grid.innerHTML = PROJECTS.map((p) => {
    const hasLink = p.url && p.url !== "#";
    const linkAttrs = hasLink ? `href="${esc(p.url)}" target="_blank" rel="noopener"` : `href="#" aria-disabled="true"`;
    const cta = hasLink ? "Visit Live Site" : "Coming Soon";
    const badge = p.live
      ? `<span class="project__badge project__badge--live"><i></i>Live</span>`
      : p.template
      ? `<span class="project__badge">Template</span>`
      : "";
    const tags = (p.stack || []).map((t) => `<li>${esc(t)}</li>`).join("");
    const highlights = p.featured && p.highlights
      ? `<ul class="project__highlights">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
      : "";
    const button = p.featured && hasLink
      ? `<a ${linkAttrs} class="btn btn--primary project__btn">${cta}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></a>`
      : "";

    return `
      <article class="project reveal${p.featured ? " project--featured" : ""}" data-category="${esc(p.category)}">
        <a ${linkAttrs} class="project__thumb">
          <img src="${esc(p.image)}" alt="${esc(p.title)} — ${esc(p.type)}" loading="lazy" />
          ${badge}
          <span class="project__overlay">${cta} <b>→</b></span>
        </a>
        <div class="project__body">
          <div class="project__info">
            <div>
              <h3>${esc(p.title)}</h3>
              <p>${esc(p.type)}</p>
            </div>
            <span class="project__year">${esc(p.year)}</span>
          </div>
          <p class="project__desc">${esc(p.description)}</p>
          ${highlights}
          <ul class="tags">${tags}</ul>
          ${button}
        </div>
      </article>`;
  }).join("");

  grid.querySelectorAll('a[aria-disabled="true"]').forEach((a) =>
    a.addEventListener("click", (e) => e.preventDefault())
  );
})();
