// AKSHETICS portfolio — dependency-free interactions.

/* ── Social links ──────────────────────────────── */
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/akshetics/",
  youtube:   "https://youtube.com/@akshetics"
};

document.querySelectorAll("[data-social]").forEach((link) => {
  const key = link.dataset.social;
  link.href = SOCIAL_LINKS[key] || "#";
  if (link.href !== "#" && link.href !== window.location.href + "#") {
    link.target = "_blank";
    link.rel    = "noopener noreferrer";
  }
});

/* ── Mobile navigation ─────────────────────────── */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks   = document.querySelector(".nav-links");

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

/* ── Scroll reveal ─────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ── Video autoplay system ─────────────────────────────────────────────────
   scroll-video elements play muted/looped while in the viewport,
   pause when they leave. Placeholder hides when video loads successfully.
   ─────────────────────────────────────────────────────────────────────── */
const scrollVideos = document.querySelectorAll(".scroll-video");

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target;
    const card  = video.closest(".reel-card");

    if (entry.isIntersecting) {
      video.muted = true;
      video.setAttribute("muted", "");
      video.play().catch(() => {});
      if (card) card.classList.add("is-playing");
    } else {
      video.pause();
      if (card) card.classList.remove("is-playing");
    }
  });
}, { threshold: 0.35, rootMargin: "60px 0px 60px 0px" });

scrollVideos.forEach((video) => {
  video.muted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  videoObserver.observe(video);

  const placeholder = video.parentElement?.querySelector(".video-placeholder");
  video.addEventListener("loadeddata", () => {
    if (placeholder) placeholder.hidden = true;
  });
  video.addEventListener("error", () => {
    if (placeholder) placeholder.hidden = false;
  });
});

/* enforce mute on all scroll videos (not modal) so browsers can't unmute */
document.querySelectorAll(".scroll-video").forEach((video) => {
  video.addEventListener("volumechange", () => {
    if (!video.muted) video.muted = true;
  });
});

/* ── Video modal ────────────────────────────────────────────────────────────
   Click any reel-card → open full-screen modal with audio + full controls.
   Scroll videos pause while modal is open; resume on close.
   ─────────────────────────────────────────────────────────────────────── */
const modal       = document.getElementById("videoModal");
const modalVideo  = document.getElementById("modalVideo");
const modalClose  = document.getElementById("modalClose");
const modalBack   = document.getElementById("modalBackdrop");

let lastActiveScrollVideo = null; // so we can resume it on close

function openModal(src) {
  if (!modal || !modalVideo) return;

  // pause all scroll videos
  scrollVideos.forEach((v) => {
    if (!v.paused) {
      lastActiveScrollVideo = v;
      v.pause();
    }
  });

  // load & play modal video with audio
  modalVideo.src    = src;
  modalVideo.muted  = false;
  modalVideo.volume = 0.9;
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
  modalVideo.play().catch(() => {
    // autoplay with sound may be blocked; controls let user press play
  });
}

function closeModal() {
  if (!modal || !modalVideo) return;
  modal.classList.remove("is-open");
  modalVideo.pause();
  modalVideo.src = "";
  document.body.style.overflow = "";

  // resume whichever scroll video was last playing
  if (lastActiveScrollVideo) {
    lastActiveScrollVideo.muted = true;
    lastActiveScrollVideo.play().catch(() => {});
    lastActiveScrollVideo = null;
  }
}

// attach click to every reel-card
document.querySelectorAll(".reel-card[data-video]").forEach((card) => {
  card.addEventListener("click", () => {
    const src = card.dataset.video;
    if (src) openModal(src);
  });
});

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalBack)  modalBack.addEventListener("click", closeModal);

// keyboard: Escape closes modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});
