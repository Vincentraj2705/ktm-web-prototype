(function () {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  // Enquiry form submission
  // See README.md for wiring this up to a Google Sheet via Apps Script.
  const SHEET_URL = "REPLACE_WITH_YOUR_GOOGLE_SCRIPT_URL";

  const form = document.getElementById("enquiryForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const status = document.getElementById("enquiryStatus");
      const data = Object.fromEntries(new FormData(form).entries());
      const submitBtn = form.querySelector('button[type="submit"]');

      if (SHEET_URL.startsWith("REPLACE_")) {
        if (status) {
          status.textContent =
            "Enquiry form isn't connected yet — see README.md to wire it up to Google Sheets.";
          status.className = "form-note err";
        }
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (status) {
        status.textContent = "Sending...";
        status.className = "form-note";
      }

      try {
        await fetch(SHEET_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
        if (status) {
          status.textContent = "Thanks — we've received your enquiry and will be in touch shortly.";
          status.className = "form-note ok";
        }
        form.reset();
      } catch (err) {
        if (status) {
          status.textContent = "Something went wrong sending your enquiry. Please call us instead.";
          status.className = "form-note err";
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
