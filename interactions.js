(() => {
  if (window.__shahmatInteractions) return;
  window.__shahmatInteractions = true;

  const resetTrainerCarousel = () => {
    const carousel = document.querySelector("[data-reset-scroll]");
    if (!carousel) return;
    carousel.scrollLeft = 0;
    carousel.scrollTo({ left: 0, behavior: "auto" });
  };

  const scheduleTrainerReset = () => {
    requestAnimationFrame(() => requestAnimationFrame(resetTrainerCarousel));
  };

  scheduleTrainerReset();
  window.addEventListener("load", scheduleTrainerReset);
  window.addEventListener("pageshow", scheduleTrainerReset);
  document.fonts?.ready.then(scheduleTrainerReset);

  const closeMenu = (menu) => {
    const toggle = menu.querySelector("[data-menu-toggle]");
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Открыть меню");
  };

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-menu-toggle]");
    if (toggle) {
      const menu = toggle.closest("[data-mobile-menu]");
      const open = !menu.classList.contains("open");
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
      return;
    }

    const menuLink = event.target.closest("[data-mobile-menu] nav a");
    if (menuLink) closeMenu(menuLink.closest("[data-mobile-menu]"));

    const galleryButton = event.target.closest("[data-gallery-button]");
    if (galleryButton) openGallery(galleryButton);

    if (event.target.closest("[data-lightbox-close]")) closeLightbox();
    if (event.target.closest("[data-lightbox-prev]")) stepLightbox(-1);
    if (event.target.closest("[data-lightbox-next]")) stepLightbox(1);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-trial-form]");
    if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;

    const template = form.querySelector("[data-form-success-template]");
    form.replaceWith(template.content.cloneNode(true));
  });

  document.addEventListener("keydown", (event) => {
    if (!document.querySelector("[data-active-lightbox]")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
  });

  let activeButtons = [];
  let activeIndex = 0;

  function openGallery(button) {
    const gallery = button.closest("[data-gallery]");
    activeButtons = [...gallery.querySelectorAll("[data-gallery-button]")];
    activeIndex = activeButtons.indexOf(button);

    const template = document.querySelector("#gallery-lightbox-template");
    const fragment = template.content.cloneNode(true);
    const lightbox = fragment.querySelector(".lightbox");
    lightbox.dataset.activeLightbox = "";
    document.body.append(fragment);
    document.body.style.overflow = "hidden";
    renderLightbox();
    lightbox.querySelector("[data-lightbox-close]").focus();
  }

  function renderLightbox() {
    const lightbox = document.querySelector("[data-active-lightbox]");
    const source = activeButtons[activeIndex].querySelector("img");
    const image = lightbox.querySelector("[data-lightbox-image]");
    const caption = lightbox.querySelector("[data-lightbox-caption]");
    image.src = source.currentSrc || source.src;
    image.alt = source.alt;
    caption.textContent = source.alt;
  }

  function stepLightbox(direction) {
    if (!activeButtons.length) return;
    activeIndex = (activeIndex + direction + activeButtons.length) % activeButtons.length;
    renderLightbox();
  }

  function closeLightbox() {
    const lightbox = document.querySelector("[data-active-lightbox]");
    if (!lightbox) return;
    lightbox.remove();
    document.body.style.overflow = "";
    activeButtons[activeIndex]?.focus();
  }
})();
