/* ═══════════════════════════════════════
   AKSHETICS PORTFOLIO — SCRIPT
══════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

  /* ─────────────────────────────────────
     MOBILE NAVIGATION
  ───────────────────────────────────── */

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );

    });


    navLinks.querySelectorAll("a").forEach((link) => {

      link.addEventListener("click", () => {

        navLinks.classList.remove("open");

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

        document.body.classList.remove(
          "menu-open"
        );

      });

    });

  }



  /* ─────────────────────────────────────
     REVEAL ANIMATIONS
  ───────────────────────────────────── */

  const revealElements =
    document.querySelectorAll(".reveal");


  if ("IntersectionObserver" in window) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -40px 0px"
        }
      );


    revealElements.forEach((element) => {

      revealObserver.observe(element);

    });

  } else {

    revealElements.forEach((element) => {

      element.classList.add("is-visible");

    });

  }



  /* ─────────────────────────────────────
     PORTFOLIO VIDEO AUTOPLAY
     
     Videos:
     • autoplay
     • muted
     • loop
     • pause when away from viewport
     • play when visible
  ───────────────────────────────────── */

  const videos =
    document.querySelectorAll(
      ".portfolio-video"
    );


  if ("IntersectionObserver" in window) {

    const videoObserver =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            const video = entry.target;

            if (entry.isIntersecting) {

              video.muted = true;

              const playPromise =
                video.play();

              if (
                playPromise &&
                typeof playPromise.catch === "function"
              ) {

                playPromise.catch(() => {});

              }

            } else {

              video.pause();

            }

          });

        },
        {
          threshold: 0.35
        }
      );


    videos.forEach((video) => {

      video.muted = true;

      video.setAttribute(
        "playsinline",
        ""
      );

      video.setAttribute(
        "autoplay",
        ""
      );

      video.setAttribute(
        "loop",
        ""
      );

      videoObserver.observe(video);

    });

  } else {

    videos.forEach((video) => {

      video.muted = true;

      video.play().catch(() => {});

    });

  }



  /* ─────────────────────────────────────
     HIDE VIDEO PLACEHOLDER AFTER LOAD
  ───────────────────────────────────── */

  videos.forEach((video) => {

    const placeholder =
      video.parentElement?.querySelector(
        ".video-placeholder"
      );

    if (!placeholder) return;


    const hidePlaceholder = () => {

      placeholder.style.opacity = "0";
      placeholder.style.pointerEvents = "none";

      setTimeout(() => {

        placeholder.style.display = "none";

      }, 250);

    };


    video.addEventListener(
      "loadeddata",
      hidePlaceholder,
      { once: true }
    );


    video.addEventListener(
      "playing",
      hidePlaceholder,
      { once: true }
    );

  });



  /* ─────────────────────────────────────
     HERO BRAND CARD MOTION
     
     Very subtle movement.
     No aggressive animation.
  ───────────────────────────────────── */

  const heroCard =
    document.querySelector(
      ".hero-brand-panel"
    );


  if (heroCard && !window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches) {

    let animationFrame = null;
    let startTime = null;


    const animateHeroCard = (time) => {

      if (!startTime) {
        startTime = time;
      }

      const elapsed =
        (time - startTime) / 1000;


      const movement =
        Math.sin(elapsed * 0.8) * 3;


      heroCard.style.transform =
        `rotate(2deg) translateY(${movement}px)`;


      animationFrame =
        requestAnimationFrame(
          animateHeroCard
        );

    };


    animationFrame =
      requestAnimationFrame(
        animateHeroCard
      );


    window.addEventListener(
      "beforeunload",
      () => {

        if (animationFrame) {

          cancelAnimationFrame(
            animationFrame
          );

        }

      }
    );

  }



  /* ─────────────────────────────────────
     PLATFORM MARQUEE PAUSE ON HOVER
  ───────────────────────────────────── */

  const platformTrack =
    document.querySelector(
      ".platform-track"
    );


  if (platformTrack) {

    platformTrack.addEventListener(
      "mouseenter",
      () => {

        platformTrack.style.animationPlayState =
          "paused";

      }
    );


    platformTrack.addEventListener(
      "mouseleave",
      () => {

        platformTrack.style.animationPlayState =
          "running";

      }
    );

  }



  /* ─────────────────────────────────────
     SOCIAL LINKS
     
     Put your actual social URLs here.
  ───────────────────────────────────── */

  const socialLinks =
    document.querySelectorAll(
      "[data-social]"
    );


  socialLinks.forEach((link) => {

    const platform =
      link.dataset.social;


    if (platform === "instagram") {

      link.href =
        "https://www.instagram.com/akshetics";

      link.target = "_blank";
      link.rel = "noopener noreferrer";

    }


    if (platform === "youtube") {

      link.href =
        "https://www.youtube.com/@Akshetics";

      link.target = "_blank";
      link.rel = "noopener noreferrer";

    }

  });



  /* ─────────────────────────────────────
     SMOOTH INTERNAL LINKS
  ───────────────────────────────────── */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {

        const targetId =
          link.getAttribute("href").slice(1);

        const targetEl =
          document.getElementById(targetId);

        if (!targetEl) return;

        event.preventDefault();

        targetEl.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      });

    });


});
