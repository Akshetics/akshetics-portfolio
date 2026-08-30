// AKSHETICS portfolio — dependency-free interactions.

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/akshetics/",
  youtube: "https://youtube.com/@akshetics"
};

document.querySelectorAll("[data-social]").forEach((link) => {
  const key = link.dataset.social;
  link.href = SOCIAL_LINKS[key] || "#";

  if (link.href !== "#" && link.href !== window.location.href + "#") {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});


// ─────────────────────────────────────────────
// MOBILE NAVIGATION
// ─────────────────────────────────────────────

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}


// ─────────────────────────────────────────────
// SCROLL REVEAL
// ─────────────────────────────────────────────

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12
  }
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));


// ─────────────────────────────────────────────
// VIDEO AUTOPLAY SYSTEM
// ─────────────────────────────────────────────
// Videos automatically play muted when visible.
// They pause when they leave the viewport.

const videos = document.querySelectorAll(
  ".scroll-video, .hero .portfolio-video"
);

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const video = entry.target;

      if (entry.isIntersecting) {
        video.muted = true;
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");

        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  },
  {
    threshold: 0.55,
    rootMargin: "80px 0px 80px 0px"
  }
);

videos.forEach((video) => {
  video.muted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");

  videoObserver.observe(video);

  const placeholder =
    video.parentElement?.querySelector(".video-placeholder");

  video.addEventListener("loadeddata", () => {
    if (placeholder) {
      placeholder.hidden = true;
    }
  });

  video.addEventListener("error", () => {
    if (placeholder) {
      placeholder.hidden = false;
    }
  });
});


// ─────────────────────────────────────────────
// KEEP INLINE PREVIEWS MUTED
// ─────────────────────────────────────────────

document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("volumechange", () => {
    // The large modal player is allowed to have sound.
    if (
      !video.closest(".video-modal") &&
      !video.muted
    ) {
      video.muted = true;
    }
  });
});


// ─────────────────────────────────────────────
// VIDEO MODAL
// ─────────────────────────────────────────────
// Clicking a portfolio reel opens a larger player.
// The modal video can play with sound and controls.

const modal = document.getElementById("video-modal");
const modalVideo = document.getElementById("modal-video");
const modalLabel = document.getElementById("modal-video-label");
const modalClose = document.querySelector(".video-modal-close");


// Close modal
function closeVideoModal() {
  if (!modal || !modalVideo) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();

  document.body.classList.remove("video-modal-open");
}


// Open modal when a reel is clicked
document.querySelectorAll(".video-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const sourceVideo = trigger.querySelector
