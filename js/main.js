(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Navbar: scrolled state ---------- */
  const nav = document.getElementById("nav");
  const waFloat = document.getElementById("waFloat");
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);
    // Floating WhatsApp button shows once the visitor scrolls past the hero
    waFloat?.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Active nav link ---------- */
  const links = document.querySelectorAll(".nav__link");
  const sections = [...links]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) =>
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- WhatsApp "Let's Talk" ---------- */
  // Put your number here: country code + number, digits only (e.g. "923001234567")
  const WHATSAPP_NUMBER = "923145371313";
  const WHATSAPP_MESSAGE =
    "Hi Hanzala! I came across your portfolio and I'd like to discuss a project with you.";

  if (WHATSAPP_NUMBER) {
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    document.querySelectorAll("[data-whatsapp]").forEach((a) => (a.href = waLink));
  } else {
    // No number yet — fall back to scrolling to the contact section
    document.querySelectorAll("[data-whatsapp]").forEach((a) => a.removeAttribute("target"));
  }

  /* ---------- Email links ---------- */
  // mailto: does nothing on computers without an email app set up, so on
  // desktop open Gmail's compose window instead. Phones keep mailto:, which
  // opens their mail app reliably.
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  if (!isTouch) {
    document.querySelectorAll("a[data-email]").forEach((a) => {
      const mailto = new URL(a.getAttribute("href"));
      const gmail = new URL("https://mail.google.com/mail/");
      gmail.searchParams.set("view", "cm");
      gmail.searchParams.set("fs", "1");
      gmail.searchParams.set("to", mailto.pathname);
      if (mailto.searchParams.get("subject")) gmail.searchParams.set("su", mailto.searchParams.get("subject"));
      if (mailto.searchParams.get("body")) gmail.searchParams.set("body", mailto.searchParams.get("body"));
      a.href = gmail.toString();
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ---------- Cursor trail dot + background grid ---------- */
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (finePointer && !reduceMotion) {
    const dot = document.querySelector(".cursor-dot");
    const grid = document.querySelector(".bg-grid");
    const spot = document.querySelector(".bg-grid--spot");
    const root = document.documentElement;

    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const dotPos = { ...mouse };
    const gridPos = { x: 0, y: 0 };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.classList.add("is-active");
    });
    document.addEventListener("mouseleave", () => dot.classList.remove("is-active"));

    const hoverables = "a, button";
    document.addEventListener("mouseover", (e) => {
      dot.classList.toggle("is-hover", !!e.target.closest(hoverables));
    });

    const tick = () => {
      // Dot trails a little behind the normal cursor
      dotPos.x += (mouse.x - dotPos.x) * 0.15;
      dotPos.y += (mouse.y - dotPos.y) * 0.15;
      dot.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;

      // Grid drifts slightly opposite to the mouse
      const targetX = (mouse.x / innerWidth - 0.5) * -24;
      const targetY = (mouse.y / innerHeight - 0.5) * -24;
      gridPos.x += (targetX - gridPos.x) * 0.06;
      gridPos.y += (targetY - gridPos.y) * 0.06;
      const t = `translate3d(${gridPos.x}px, ${gridPos.y}px, 0)`;
      grid.style.transform = t;
      spot.style.transform = t;

      // Brighter grid follows the mouse (offset by the grid's -60px inset and drift)
      root.style.setProperty("--mx", `${mouse.x + 60 - gridPos.x}px`);
      root.style.setProperty("--my", `${mouse.y + 60 - gridPos.y}px`);

      requestAnimationFrame(tick);
    };
    tick();
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll(".reveal");
  const useGsap = window.gsap && window.ScrollTrigger && !reduceMotion;

  if (useGsap) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("gsap");

    const done = (els) =>
      [].concat(els).forEach((el) => {
        el.classList.add("is-visible");
        gsap.set(el, { clearProps: "opacity,visibility,transform" });
      });

    // Hero intro timeline
    const heroItems = gsap.utils.toArray(".hero .reveal");
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".hero__media", { autoAlpha: 0, scale: 1.08, duration: 1.6, ease: "power2.out", clearProps: "all" })
      .from(".nav", { yPercent: -100, autoAlpha: 0, duration: 0.7, clearProps: "all" }, 0.2)
      .fromTo(heroItems, { y: 36, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1, onComplete: () => done(heroItems) }, 0.4);

    // Everything else reveals in staggered batches on scroll
    const rest = gsap.utils.toArray(".reveal").filter((el) => !el.closest(".hero"));
    gsap.set(rest, { y: 40, autoAlpha: 0 });
    ScrollTrigger.batch(rest, {
      start: "top 88%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: "power3.out",
          onComplete: () => done(batch),
        }),
    });

    // Watermark headings drift sideways while scrolling
    gsap.utils.toArray(".watermark").forEach((wm) => {
      gsap.fromTo(wm, { xPercent: -6 }, {
        xPercent: 6, ease: "none",
        scrollTrigger: { trigger: wm, start: "top bottom", end: "bottom top", scrub: 1 },
      });
    });

    // Subtle parallax on the hero portrait
    gsap.to(".hero__media img", {
      yPercent: 10, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
  } else if (reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // Stagger siblings that reveal together
          const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
          el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 90}ms`;
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Stats count-up ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const target = Number(el.dataset.count);
    if (reduceMotion) { el.textContent = target; return; }
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => countObserver.observe(c));

  /* ---------- Project filters ---------- */
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");
  const FADE_MS = reduceMotion ? 0 : 300;

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter;
      filters.forEach((b) => {
        const active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-selected", String(active));
      });

      projects.forEach((p) => {
        p.style.transitionDelay = "0ms";
        p.classList.add("is-hiding");
      });
      setTimeout(() => {
        projects.forEach((p) => {
          const show = cat === "all" || p.dataset.category === cat;
          p.classList.toggle("is-hidden", !show);
          p.classList.add("is-visible");
        });
        requestAnimationFrame(() =>
          requestAnimationFrame(() => projects.forEach((p) => p.classList.remove("is-hiding")))
        );
        // Page height changed — let scroll animations re-measure
        if (window.ScrollTrigger) ScrollTrigger.refresh();
      }, FADE_MS);
    });
  });

  /* ---------- Hero typing effect ---------- */
  const typed = document.getElementById("typed");
  const roles = ["Software Developer", "Full-Stack Engineer", "SaaS Builder", "Frontend Specialist"];
  if (typed && !reduceMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    const type = () => {
      const word = roles[roleIndex];
      charIndex += deleting ? -1 : 1;
      typed.textContent = word.slice(0, charIndex);

      let delay = deleting ? 45 : 85;
      if (!deleting && charIndex === word.length) {
        delay = 2200; // pause on the full word
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
      }
      setTimeout(type, delay);
    };
    setTimeout(type, 3200);
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
