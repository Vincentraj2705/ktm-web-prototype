(function () {
  const cardsEl = document.getElementById("cards");
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");

  const lightbox = document.getElementById("lightbox");
  const lbImageWrap = document.getElementById("lbImageWrap");
  const lbInfo = document.getElementById("lbInfo");
  const lbClose = document.getElementById("lbClose");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentItem = null;
  let currentImgIndex = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;

  function render(list) {
    if (!list.length) {
      cardsEl.innerHTML = '<p style="grid-column:1/-1;color:var(--ink-soft);">No pieces match your search — try a different keyword or article number.</p>';
      return;
    }
    cardsEl.innerHTML = list
      .map(
        (item) => `
        <article class="card" tabindex="0" data-id="${item.id}">
          <img src="${item.images[0]}" alt="${item.name}" loading="lazy">
          <div class="card-body">
            <span class="card-tag">${item.category}</span>
            <div class="card-name">${item.name}</div>
            <div class="card-id">Article ${item.id}</div>
          </div>
        </article>`
      )
      .join("");
  }

  function applyFilters() {
    const q = (searchInput.value || "").trim().toLowerCase();
    const cat = categoryFilter.value;
    const filtered = jewels.filter((item) => {
      const matchesCat = cat === "all" || item.category === cat;
      const haystack = `${item.name} ${item.id} ${item.category}`.toLowerCase();
      const matchesQuery = !q || haystack.includes(q);
      return matchesCat && matchesQuery;
    });
    render(filtered);
  }

  function openLightbox(item) {
    currentItem = item;
    currentImgIndex = 0;
    showImage();
    lbInfo.innerHTML = `<h3>${item.name}</h3><p>Article ${item.id} — ${item.description}</p>`;
    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
    currentItem = null;
  }

  function showImage() {
    if (!currentItem) return;
    const src = currentItem.images[currentImgIndex];
    const multi = currentItem.images.length > 1;
    lbImageWrap.innerHTML = `
      <img src="${src}" alt="${currentItem.name}">
      ${multi ? `<span class="lb-counter">${currentImgIndex + 1} / ${currentItem.images.length}</span>` : ""}
    `;
  }

  function step(delta) {
    if (!currentItem) return;
    const len = currentItem.images.length;
    currentImgIndex = (currentImgIndex + delta + len) % len;
    showImage();
  }

  cardsEl.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const item = jewels.find((j) => j.id === card.dataset.id);
    if (item) openLightbox(item);
  });

  cardsEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".card");
    if (!card) return;
    e.preventDefault();
    const item = jewels.find((j) => j.id === card.dataset.id);
    if (item) openLightbox(item);
  });

  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));

  // Swipe to browse angles on touch devices
  lbImageWrap.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    },
    { passive: true }
  );
  lbImageWrap.addEventListener(
    "touchmove",
    (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    },
    { passive: true }
  );
  lbImageWrap.addEventListener("touchend", () => {
    const SWIPE_THRESHOLD = 40;
    if (touchDeltaX > SWIPE_THRESHOLD) step(-1);
    else if (touchDeltaX < -SWIPE_THRESHOLD) step(1);
    touchStartX = 0;
    touchDeltaX = 0;
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("hidden")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);

  render(jewels);
})();
