/* ═══════════════════════════════════════
   AKSHETICS — JavaScript
   Vanilla JS — No dependencies
═══════════════════════════════════════ */

(function () {
  "use strict";


  /* ═══════════════════════════════════════
     ELEMENTS
  ═══════════════════════════════════════ */

  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navOverlay = document.getElementById("nav-overlay");
  const navClose = document.getElementById("nav-close");

  const modal = document.getElementById("reel-modal");
  const modalVideo = document.getElementById("modal-video");
  const modalTitle = document.getElementById("modal-title");
  const modalClose = document.getElementById("modal-close");
  const modalBackdrop = document.getElementById("modal-backdrop");

  const brandCard = document.getElementById("brand-card");


  /* ═══════════════════════════════════════
     SCROLL LOCK
  ═══════════════════════════════════════ */

  function updateScrollLock() {
    const menuOpen =
      navMenu && navMenu.classList.contains("is-open");

    const modalOpen =
      modal && !modal.hidden;

    const shouldLock = menuOpen || modalOpen;

    document.body.classList.toggle(
      "nav-open",
      shouldLock
    );

    document.documentElement.classList.toggle(
      "nav-open",
      shouldLock
    );
  }


  /* ═══════════════════════════════════════
     MOBILE NAVIGATION
  ═══════════════════════════════════════ */

  function openNav() {
    if (!navMenu || !hamburger) return;

    navMenu.classList.add("is-open");
    hamburger.classList.add("is-open");

    if (navOverlay) {
      navOverlay.classList.add("is-visible");
    }

    hamburger.setAttribute(
      "aria-expanded",
      "true"
    );

    hamburger.setAttribute(
      "aria-label",
      "Close menu"
    );

    updateScrollLock();
  }


  function closeNav() {
    if (!navMenu || !hamburger) return;

    navMenu.classList.remove("is-open");
    hamburger.classList.remove("is-open");

    if (navOverlay) {
      navOverlay.classList.remove("is-visible");
    }

    hamburger.setAttribute(
      "aria-expanded",
      "false"
    );

    hamburger.setAttribute(
      "aria-label",
      "Open menu"
    );

    updateScrollLock();
  }


  if (hamburger && navMenu) {

    hamburger.addEventListener(
      "click",
      function () {

        if (
          navMenu.classList.contains(
            "is-open"
          )
        ) {
          closeNav();
        } else {
          openNav();
        }

      }
    );


    if (navOverlay) {
      navOverlay.addEventListener(
        "click",
        closeNav
      );
    }


    if (navClose) {
      navClose.addEventListener(
        "click",
        closeNav
      );
    }


    navMenu
      .querySelectorAll(".nav-link")
      .forEach(function (link) {

        link.addEventListener(
          "click",
          closeNav
        );

      });


    document.addEventListener(
      "keydown",
      function (event) {

        if (
          event.key === "Escape" &&
          navMenu.classList.contains("is-open")
        ) {
          closeNav();
        }

      }
    );

  }


  /* ═══════════════════════════════════════
     SCROLL REVEAL
  ═══════════════════════════════════════ */

  const revealElements =
    document.querySelectorAll(".reveal");


  if (
    "IntersectionObserver" in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        function (entries, observer) {

          entries.forEach(
            function (entry) {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              entry.target.classList.add(
                "is-visible"
              );


              observer.unobserve(
                entry.target
              );

            }
          );

        },
        {
          threshold: 0.10,
          rootMargin:
            "0px 0px -30px 0px"
        }
      );


    revealElements.forEach(
      function (element) {

        revealObserver.observe(
          element
        );

      }
    );

  } else {

    revealElements.forEach(
      function (element) {

        element.classList.add(
          "is-visible"
        );

      }
    );

  }


  /* ═══════════════════════════════════════
     REEL BACKGROUND VIDEO
     
     - Muted autoplay
     - Plays when visible
     - Pauses when off-screen
  ═══════════════════════════════════════ */

  const backgroundVideos =
    document.querySelectorAll(".reel-bg");


  function tryPlay(video) {

    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const playPromise =
      video.play();


    if (
      playPromise &&
      typeof playPromise.catch === "function"
    ) {

      playPromise.catch(
        function () {
          /* Autoplay can be blocked
             by the browser. */
        }
      );

    }

  }


  function hidePlaceholder(video) {

    if (!video || !video.parentElement) {
      return;
    }


    const placeholder =
      video.parentElement.querySelector(
        ".reel-placeholder"
      );


    if (!placeholder) {
      return;
    }


    placeholder.style.opacity = "0";
    placeholder.style.pointerEvents =
      "none";

  }


  function showPlaceholder(video) {

    if (!video || !video.parentElement) {
      return;
    }


    const placeholder =
      video.parentElement.querySelector(
        ".reel-placeholder"
      );


    if (!placeholder) {
      return;
    }


    placeholder.style.opacity = "1";
    placeholder.style.pointerEvents =
      "auto";

  }


  if (
    "IntersectionObserver" in window
  ) {

    const videoObserver =
      new IntersectionObserver(
        function (entries) {

          entries.forEach(
            function (entry) {

              const video =
                entry.target;


              if (
                entry.isIntersecting
              ) {

                tryPlay(video);


                video.addEventListener(
                  "playing",
                  function onPlaying() {

                    hidePlaceholder(
                      video
                    );

                    video.removeEventListener(
                      "playing",
                      onPlaying
                    );

                  }
                );

              } else {

                video.pause();

              }

            }
          );

        },
        {
          threshold: 0.30
        }
      );


    backgroundVideos.forEach(
      function (video) {

        video.muted = true;
        video.playsInline = true;

        videoObserver.observe(
          video
        );

      }
    );

  } else {

    backgroundVideos.forEach(
      function (video) {

        tryPlay(video);

      }
    );

  }


  /* ═══════════════════════════════════════
     REEL MODAL
  ═══════════════════════════════════════ */

  function openModal(
    source,
    title
  ) {

    if (
      !modal ||
      !modalVideo
    ) {
      return;
    }


    if (!source) {
      return;
    }


    /* Stop currently playing card
       videos before opening modal. */

    backgroundVideos.forEach(
      function (video) {
        video.pause();
      }
    );


    modalVideo.pause();

    modalVideo.src = source;

    modalVideo.load();


    /*
      Modal video has sound enabled.
      The browser will still decide whether
      autoplay is allowed.
    */

    modalVideo.muted = false;


    if (modalTitle) {

      modalTitle.textContent =
        title || "";

    }


    modal.hidden = false;


    updateScrollLock();


    const playPromise =
      modalVideo.play();


    if (
      playPromise &&
      typeof playPromise.catch === "function"
    ) {

      playPromise.catch(
        function () {
          /* User can press play manually
             if autoplay is blocked. */
        }
      );

    }

  }


  function closeModal() {

    if (
      !modal ||
      !modalVideo
    ) {
      return;
    }


    modalVideo.pause();

    modalVideo.removeAttribute(
      "src"
    );

    modalVideo.load();


    modal.hidden = true;


    if (modalTitle) {
      modalTitle.textContent = "";
    }


    updateScrollLock();

  }


  /* ═══════════════════════════════════════
     REEL CARD CLICK
  ═══════════════════════════════════════ */

  const reelCards =
    document.querySelectorAll(
      ".reel-card"
    );


  reelCards.forEach(
    function (card) {

      function handleOpen() {

        const source =
          card.getAttribute(
            "data-src"
          );


        const title =
          card.getAttribute(
            "data-title"
          );


        if (source) {

          openModal(
            source,
            title
          );

        }

      }


      card.addEventListener(
        "click",
        handleOpen
      );


      card.addEventListener(
        "keydown",
        function (event) {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            handleOpen();

          }

        }
      );

    }
  );


  /* ═══════════════════════════════════════
     MODAL CLOSE BUTTON
  ═══════════════════════════════════════ */

  if (modalClose) {

    modalClose.addEventListener(
      "click",
      closeModal
    );

  }


  if (modalBackdrop) {

    modalBackdrop.addEventListener(
      "click",
      closeModal
    );

  }


  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape" &&
        modal &&
        !modal.hidden
      ) {

        closeModal();

      }

    }
  );


  /* ═══════════════════════════════════════
     BRAND CARD FLOAT ANIMATION
  ═══════════════════════════════════════ */

  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (
    brandCard &&
    !prefersReducedMotion
  ) {

    let animationFrame = null;
    let startTime = null;


    function floatCard(timestamp) {

      if (!startTime) {
        startTime = timestamp;
      }


      const elapsed =
        (timestamp - startTime) /
        1000;


      const verticalMovement =
        Math.sin(
          elapsed * 0.9
        ) * 4;


      brandCard.style.transform =
        "rotate(2deg) translateY(" +
        verticalMovement +
        "px)";


      animationFrame =
        requestAnimationFrame(
          floatCard
        );

    }


    animationFrame =
      requestAnimationFrame(
        floatCard
      );


    window.addEventListener(
      "beforeunload",
      function () {

        if (animationFrame) {

          cancelAnimationFrame(
            animationFrame
          );

        }

      }
    );

  }


  /* ═══════════════════════════════════════
     MARQUEE PAUSE ON HOVER
  ═══════════════════════════════════════ */

  const marquee =
    document.querySelector(
      ".marquee-inner"
    );


  if (marquee) {

    marquee.addEventListener(
      "mouseenter",
      function () {

        marquee.style.animationPlayState =
          "paused";

      }
    );


    marquee.addEventListener(
      "mouseleave",
      function () {

        marquee.style.animationPlayState =
          "running";

      }
    );

  }


  /* ═══════════════════════════════════════
     SMOOTH INTERNAL SCROLL
  ═══════════════════════════════════════ */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(
      function (link) {

        link.addEventListener(
          "click",
          function (event) {

            const href =
              link.getAttribute(
                "href"
              );


            if (
              !href ||
              href === "#"
            ) {
              return;
            }


            const targetId =
              href.substring(1);


            const target =
              document.getElementById(
                targetId
              );


            if (!target) {
              return;
            }


            event.preventDefault();


            /*
              Close mobile navigation
              before scrolling.
            */

            if (
              navMenu &&
              navMenu.classList.contains(
                "is-open"
              )
            ) {

              closeNav();

            }


            target.scrollIntoView(
              {
                behavior: "smooth",
                block: "start"
              }
            );

          }
        );

      }
    );


  /* ═══════════════════════════════════════
     INITIAL STATE
  ═══════════════════════════════════════ */

  if (modal) {
    modal.hidden = true;
  }


  if (hamburger) {

    hamburger.setAttribute(
      "aria-expanded",
      "false"
    );

    hamburger.setAttribute(
      "aria-label",
      "Open menu"
    );

  }


})();
