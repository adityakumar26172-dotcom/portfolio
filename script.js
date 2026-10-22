/* ===== 1. EDIT YOUR CONTACT DETAILS HERE =====
   Leave a value as "" to show a placeholder. Only https:// links are accepted for profiles. */
const CONTACTS = {
  kumar:  { email: "adityakumar26172@gmail.com", phone: "9835246096", linkedin: "https://www.linkedin.com/in/aditya-kumar-a4b643400",  freelancer: "https://www.freelancer.in/u/AdityaKM911", github: "https://github.com/adityakumar26172-dotcom" },
  bhagat: { email: "", phone: "", linkedin: "", instagram: "", freelancer: "", github: "" },
  ansari: { email: "", phone: "", linkedin: "", instagram: "", freelancer: "", github: "" }
};
const FIELDS = [
  ["email", "Email", "Enter email address"],
  ["phone", "Phone", "Enter phone number"],
  ["linkedin", "LinkedIn", "Enter LinkedIn URL"],
  ["instagram", "Instagram", "Enter Instagram URL"],
  ["freelancer", "Freelancer", "Enter Freelancer URL"],
  ["github", "GitHub", "Enter GitHub URL"]
];

/* ===== 2. Build the contact lists ===== */
function buildContacts() {
  document.querySelectorAll("[data-contacts]").forEach(list => {
    const person = CONTACTS[list.dataset.contacts] || {};
    FIELDS.forEach(([key, label, hint]) => {
      const value = (person[key] || "").trim();
      const li = document.createElement("li");
      const name = document.createElement("span");
      name.className = "c-label";
      name.textContent = label;
      li.appendChild(name);

      let href = "";
      if (key === "email" && value.includes("@")) href = "mailto:" + value;
      else if (key === "phone" && value) href = "tel:" + value.replace(/[^+\d]/g, "");
      else if (/^https:\/\//i.test(value)) href = value;   // blocks javascript: and other unsafe links

      if (href) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = value;
        if (href.startsWith("https")) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
        li.appendChild(a);
      } else {
        const ph = document.createElement("span");
        ph.className = "c-empty";
        ph.textContent = "[" + hint + "]";
        li.appendChild(ph);
      }
      list.appendChild(li);
    });
  });
}

/* ===== 3. Mobile menu ===== */
const header = document.querySelector(".site-header");
const menuBtn = document.querySelector(".menu-btn");
function setMenu(open) {
  header.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menuBtn.addEventListener("click", () => setMenu(!header.classList.contains("open")));
document.querySelectorAll("#nav a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && header.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
});

/* ===== 4. Header background on scroll ===== */
function onScroll() { header.classList.toggle("scrolled", window.scrollY > 40); }
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ===== 5. Highlight the current page in the menu ===== */
const navLinks = document.querySelectorAll("#nav a[data-page]");
navLinks.forEach(a => a.classList.toggle("active", a.dataset.page === document.body.dataset.page));

/* ===== 5b. Dropdown menus (click or tap the arrow; hover also works on desktop) ===== */
const dropdowns = document.querySelectorAll(".dd");
dropdowns.forEach(dd => {
  const t = dd.querySelector(".dd-toggle");
  t.addEventListener("click", e => {
    e.stopPropagation();
    const open = !dd.classList.contains("open");
    dropdowns.forEach(o => { o.classList.remove("open"); o.querySelector(".dd-toggle").setAttribute("aria-expanded", false); });
    dd.classList.toggle("open", open);
    t.setAttribute("aria-expanded", open);
  });
});
document.addEventListener("click", () => dropdowns.forEach(o => { o.classList.remove("open"); o.querySelector(".dd-toggle").setAttribute("aria-expanded", false); }));
document.addEventListener("keydown", e => { if (e.key === "Escape") dropdowns.forEach(o => o.classList.remove("open")); });

/* ===== 6. Empty state: shows if you delete every project ===== */
const grid = document.getElementById("project-grid");
if (grid && grid.children.length === 0) {
  grid.hidden = true;
  document.getElementById("empty-state").hidden = false;
}

/* ===== 7. Missing photo? Remove it so the placeholder shows instead ===== */
document.querySelectorAll(".photo").forEach(img => {
  const hide = () => img.remove();
  img.addEventListener("error", hide);
  if (img.complete && img.naturalWidth === 0) hide();
});

/* ===== 8. Animations: each group below gets its own style, played when it scrolls into view =====
   Styles: left, right, up, zoom, rotate, flip, blur, middle (opens from the centre), wipe, drop. */
const PLAN = [
  [".big, .huge", "wipe"], [".page-hero .label, .tiles .label", "blur"], [".intro", "blur"],
  [".two-col article", i => (i % 2 ? "right" : "left")],
  [".member .profile", "left"], [".member.flip .profile", "right"],
  [".portrait, .hero-portraits .ph", "middle"], [".skill-group", "flip"],
  [".project", "rotate"], [".shot", "zoom"], [".tile", i => (i % 2 ? "right" : "left")],
  [".closing .lead, .closing .btn, .intro-band .btn, .work .btn, .cta .btn", "up"],
  [".card", i => ["left", "up", "right"][i % 3]], [".card .ph", "middle"], [".work-card", "rotate"], [".closing-links > div", "drop"]
];
/* Clipped styles (wipe, middle, drop) hide the element completely, so the browser would never see it
   "enter the screen". For those we watch the parent element instead and reveal the children together. */
const CLIPPED = ["wipe", "middle", "drop"];
const kids = new Map();
const reveal = list => list.forEach(x => x.classList.add("in"));
const revealer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { reveal([e.target]); revealer.unobserve(e.target); } });
}, { threshold: 0.12 });
const parentRevealer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { reveal(kids.get(e.target)); parentRevealer.unobserve(e.target); } });
}, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
PLAN.forEach(([selector, style]) => {
  document.querySelectorAll(selector).forEach((el, i) => {
    const name = typeof style === "function" ? style(i) : style;
    el.dataset.anim = name;
    el.style.setProperty("--d", (i % 3) * 0.14 + "s");
    if (CLIPPED.includes(name) && el.parentElement) {
      const parent = el.parentElement;
      if (!kids.has(parent)) { kids.set(parent, []); parentRevealer.observe(parent); }
      kids.get(parent).push(el);
    } else revealer.observe(el);
  });
});

/* Hero headline: each line slides up from behind a mask */
document.querySelectorAll(".hero h1").forEach(h => {
  const lines = h.innerHTML.split(/<br\s*\/?>/i);
  h.innerHTML = lines.map((l, i) => `<span class="line"><span style="--i:${i}">${l}</span></span>`).join("");
});

/* Scroll progress bar */
const bar = document.createElement("div");
bar.className = "scroll-bar";
document.body.prepend(bar);
window.addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
}, { passive: true });

/* Fade out before moving to another page */
document.addEventListener("click", e => {
  const a = e.target.closest("a[href]");
  if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || url.pathname === location.pathname || !url.pathname.endsWith(".html")) return;
  e.preventDefault();
  document.body.classList.add("leaving");
  setTimeout(() => { location.href = a.href; }, 350);
});
window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));

/* ===== 9. Hero slider (auto-plays every 5 seconds; pauses on hover or focus) ===== */
(function () {
  const slider = document.querySelector(".slider");
  if (!slider) return;
  const slides = slider.querySelectorAll(".slide");
  const dots = slider.querySelectorAll(".dots button");
  const bar = slider.querySelector(".progress");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DELAY = 5000;
  let current = 0, timer = null;

  function show(n) {
    current = (n + slides.length) % slides.length;
    slides.forEach((s, i) => { s.classList.toggle("active", i === current); s.setAttribute("aria-hidden", i !== current); });
    dots.forEach((d, i) => { d.classList.toggle("active", i === current); d.setAttribute("aria-current", i === current); });
    restart();
  }
  function restart() {
    clearInterval(timer);
    bar.classList.remove("run");
    if (calm) return;                       // no auto-play for people who prefer less motion
    void bar.offsetWidth;                   // restart the progress animation
    bar.classList.add("run");
    timer = setInterval(() => show(current + 1), DELAY);
  }
  function pause() { clearInterval(timer); bar.classList.remove("run"); }

  slider.querySelector(".prev").addEventListener("click", () => show(current - 1));
  slider.querySelector(".next").addEventListener("click", () => show(current + 1));
  dots.forEach((d, i) => d.addEventListener("click", () => show(i)));
  slider.addEventListener("mouseenter", pause);
  slider.addEventListener("mouseleave", restart);
  slider.addEventListener("focusin", pause);
  slider.addEventListener("focusout", restart);
  show(0);
})();

/* ===== 10. "Read more": long text shows 5 lines, then a button opens the rest smoothly =====
   Change the number of lines with --lines in styles.css (try 10 for longer previews). */
const LINES = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--lines")) || 5;
const clampTargets = document.querySelectorAll(
  ".two-col p, .profile > p:not(.label):not(.role), .profile dd, .project > p:not(.tag):not(.small)"
);
clampTargets.forEach(el => {
  const text = document.createElement("span");
  text.className = "clamp-text";
  while (el.firstChild) text.appendChild(el.firstChild);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "more-btn";
  btn.textContent = "Read more";
  btn.setAttribute("aria-expanded", "false");
  btn.addEventListener("click", () => {
    const open = el.classList.toggle("expanded");
    // Animating max-height gives the soft slide; the CSS transition does the work.
    text.style.maxHeight = open ? text.scrollHeight + "px" : el._limit + "px";
    btn.textContent = open ? "Read less" : "Read more";
    btn.setAttribute("aria-expanded", open);
  });
  el.append(text, btn);
});
function measureClamps() {
  clampTargets.forEach(el => { el.querySelector(".clamp-text").style.transition = "none"; });   // no animation while measuring
  clampTargets.forEach(el => {
    const text = el.querySelector(".clamp-text");
    const lh = parseFloat(getComputedStyle(text).lineHeight) || parseFloat(getComputedStyle(text).fontSize) * 1.7;
    el._limit = Math.round(lh * LINES);
    const needsButton = text.scrollHeight > el._limit + 2;
    el.classList.toggle("has-more", needsButton);
    if (el.classList.contains("expanded")) text.style.maxHeight = text.scrollHeight + "px";
    else text.style.maxHeight = needsButton ? el._limit + "px" : "none";
  });
  void document.body.offsetHeight;                                                                  // apply instantly...
  clampTargets.forEach(el => { el.querySelector(".clamp-text").style.transition = ""; });          // ...then bring the animation back
}
(document.fonts ? document.fonts.ready : Promise.resolve()).then(measureClamps);
let clampTimer;
let lastWidth = window.innerWidth;
window.addEventListener("resize", () => {
  if (window.innerWidth === lastWidth) return;   // phones fire resize when the address bar hides; ignore that
  lastWidth = window.innerWidth;
  clearTimeout(clampTimer);
  clampTimer = setTimeout(measureClamps, 150);
});

buildContacts();