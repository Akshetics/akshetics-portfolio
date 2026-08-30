/* ═══════════════════════════════════════
   AKSHETICS — JS
   Vanilla. No dependencies.
══════════════════════════════════════ */

(function () {
  "use strict";

  /* ────────────────────────────────────
     MOBILE NAVIGATION
  ──────────────────────────────────── */

  const hamburger  = document.getElementById("hamburger");
  const navMenu    = document.getElementById("nav-menu");
  const navOverlay = document.getElementById("nav-overlay");

  function openNav() {
    navMenu.classList.add("is-open");
    hamburger.classList.add("is-open");
    navOverlay.classList.add("is-visible");
    document.body.classList.add("nav-open");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    navMenu.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    navOverlay.classList.remove("is-visible");
    document.body.classList.remove("nav-open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      if (navMenu.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    navOverlay.addEventListener("click", closeNav);

    navMenu.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("is-open")) {
        closeNav();
      }
    });
  }


  /* ────────────────────────────────────
     SCROLL REVEAL
  ──────────────────────────────────── */

  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.10, rootMargin: "0px 0px -30px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }


  /* ────────────────────────────────────
     REEL BACKGROUND VIDEO AUTOPLAY
     Plays muted in cards. Pauses off-screen.
  ──────────────────────────────────── */

  var bgVideos = document.querySelectorAll(".reel-bg");

  function tryPlay(video) {
    video.muted = true;
    var p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {});
    }
  }

  if ("IntersectionObserver" in window) {
    var videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            tryPlay(v);
            /* Hide placeholder once playing */
            var ph = v.parentElement && v.parentElement.querySelector(".reel-placeholder");
            if (ph) {
              v.addEventListener("playing", function hidePh() {
                ph.style.opacity = "0";
                ph.style.pointerEvents = "none";
                v.removeEventListener("playing", hidePh);
              });
            }
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.3 }
    );

    bgVideos.forEach(function (v) {
      v.muted = true;
      videoObserver.observe(v);
    });

  } else {
    bgVideos.forEach(function (v) {
      tryPlay(v);
    });
  }


  /* ────────────────────────────────────
     REEL MODAL
  ──────────────────────────────────── */

  var modal       = document.getElementById("reel-modal");
  var modalVideo  = document.getElementById("modal-video");
  var modalTitle  = document.getElementById("modal-title");
  var modalClose  = document.getElementById("modal-close");
  var modalBg     = document.getElementById("modal-backdrop");

  function openModal(src, title) {
    if (!modal || !modalVideo) return;

    modalVideo.src = src;
    modalVideo.muted = false;
    if (modalTitle) modalTitle.textContent = title || "";

    modal.hidden = false;
    document.body.classList.add("nav-open"); /* prevent body scroll */

    /* Attempt to play */
    var p = modalVideo.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {});
    }
  }

  function closeModal() {
    if (!modal || !modalVideo) return;

    modalVideo.pause();
    modalVideo.src = "";
    modal.hidden = true;
    document.body.classList.remove("nav-open");
  }

  /* Attach open to every reel card */
  document.querySelectorAll(".reel-card").forEach(function (card) {
    function handleOpen() {
      var src   = card.getAttribute("data-src");
      var title = card.getAttribute("data-title");
      if (src) openModal(src, title);
    }

    card.addEventListener("click", handleOpen);

    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpen();
      }
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBg)    modalBg.addEventListener("click", closeModal);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.hidden) {
      closeModal();
    }
  });


  /* ────────────────────────────────────
     BRAND CARD FLOAT ANIMATION
  ──────────────────────────────────── */

  var brandCard = document.getElementById("brand-card");
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (brandCard && !prefersReducedMotion) {
    var rafId = null;
    var startT = null;

    function floatCard(t) {
      if (!startT) startT = t;
      var elapsed = (t - startT) / 1000;
      var dy = Math.sin(elapsed * 0.9) * 4;
      brandCard.style.transform = "rotate(2deg) translateY(" + dy + "px)";
      rafId = requestAnimationFrame(floatCard);
    }

    rafId = requestAnimationFrame(floatCard);

    window.addEventListener("beforeunload", function () {
      if (rafId) cancelAnimationFrame(rafId);
    });
  }


  /* ────────────────────────────────────
     MARQUEE PAUSE ON HOVER
  ──────────────────────────────────── */

  var marqueeInner = document.querySelector(".marquee-inner");

  if (marqueeInner) {
    marqueeInner.addEventListener("mouseenter", function () {
      marqueeInner.style.animationPlayState = "paused";
    });
    marqueeInner.addEventListener("mouseleave", function () {
      marqueeInner.style.animationPlayState = "running";
    });
  }


  /* ────────────────────────────────────
     SMOOTH SCROLL FOR INTERNAL LINKS
  ──────────────────────────────────── */

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href").slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

})();
