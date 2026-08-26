// AKSHETICS portfolio — simple, dependency-free interactions.

const SOCIAL_LINKS = {
  instagram: "#", // Replace with your Instagram URL
  youtube: "#",   // Replace with your YouTube URL
};

document.querySelectorAll("[data-social]").forEach((link) => {
  const key = link.dataset.social;
  link.href = SOCIAL_LINKS[key] || "#";
  if (link.href !== "#" && link.href !== window.location.href + "#") {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});

// Mobile navigation
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

// Reveal sections on scroll.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Video autoplay system.
// Videos stay muted and play only while sufficiently visible.
const videos = document.querySelectorAll(".scroll-video, .hero .portfolio-video");

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.muted = true;
      video.setAttribute("muted", "");
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.55, rootMargin: "80px 0px 80px 0px" });

videos.forEach((video) => {
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

// Make sure every video remains silent even if browser state changes.
document.querySelectorAll("video").forEach((video) => {
  video.muted = true;
  video.addEventListener("volumechange", () => {
    if (!video.muted) video.muted = true;
  });
});
