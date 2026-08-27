(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

// Rate badge — fills in from RATES (defined in rates.js, loaded before this file)
if (typeof RATES !== "undefined") {
  const goldEl = document.querySelector(".rate-badge-line.gold");
  const silverEl = document.querySelector(".rate-badge-line.silver");
  if (goldEl) goldEl.textContent = `Gold — ₹${RATES.gold.toLocaleString("en-IN")}/gm`;
  if (silverEl) silverEl.textContent = `Silver — ₹${RATES.silver.toLocaleString("en-IN")}/gm`;
}

  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }
})();
