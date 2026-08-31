/* =========================================================
   AKSHETICS — PORTFOLIO JAVASCRIPT
========================================================= */


/* =========================================================
   HAMBURGER NAVIGATION
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

function setMenu(open) {
  if (!menuToggle || !mobileNav) return;

  menuToggle.classList.toggle("active", open);
  mobileNav.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);

  menuToggle.setAttribute("aria-expanded", String(open));
  mobileNav.setAttribute("aria-hidden", String(!open));
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.contains("open");
    setMenu(!isOpen);
  });
}

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", () => {
    setMenu(false);
  });
});


/* =========================================================
   REEL VIDEO AUTOPLAY / AUTO PAUSE
========================================================= */

const reelCards = Array.from(
  document.querySelectorAll(".reel-card")
);

const reelVideos = Array.from(
  document.querySelectorAll(".reel-video")
);


/*
   Prepare every preview video.
   They stay muted so mobile browsers allow autoplay.
*/

reelVideos.forEach(video => {
  video.muted = true;
  video.defaultMuted = true;

  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.preload = "auto";
});


/*
   Pause every other reel.
*/

function pauseOtherVideos(activeVideo) {
  reelVideos.forEach(video => {
    if (video !== activeVideo) {
      video.pause();
    }
  });
}


/*
   Play a preview video.
*/

function playPreview(video) {
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;

  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      /*
         Browser may temporarily reject autoplay.
         The video remains available for user interaction.
      */
    });
  }
}


/*
   Intersection Observer
   Reel starts when at least 25% is visible.
*/

if ("IntersectionObserver" in window) {

  const reelObserver = new IntersectionObserver(
    entries => {

      entries.forEach(entry => {

        const video = entry.target;

        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.25
        ) {

          pauseOtherVideos(video);

          /*
             Make sure the video has loaded enough data.
          */

          if (video.readyState >= 2) {

            playPreview(video);

          } else {

            video.addEventListener(
              "canplay",
              () => playPreview(video),
              { once: true }
            );

            video.load();
          }

        } else {

          video.pause();
        }

      });

    },
    {
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }
  );


  reelVideos.forEach(video => {
    reelObserver.observe(video);
  });

} else {

  /*
     Fallback for older browsers.
  */

  reelVideos.forEach(video => {
    playPreview(video);
  });

}


/* =========================================================
   FULL REEL VIEWER
========================================================= */

const modal = document.querySelector(".reel-modal");
const modalVideo = document.querySelector("#modalVideo");
const modalTitle = document.querySelector("#modalTitle");
const modalNumber = document.querySelector("#modalNumber");
const modalClose = document.querySelector(".modal-close");
const modalBackdrop = document.querySelector(".modal-backdrop");


/*
   Open full reel.
*/

function openReel(card) {

  if (!modal || !modalVideo || !card) {
    return;
  }

  const preview = card.querySelector(".reel-video");

  if (!preview) {
    return;
  }


  /*
     Stop all preview videos.
  */

  reelVideos.forEach(video => {
    video.pause();
  });


  /*
     Get the exact video URL.
  */

  const source =
    preview.currentSrc ||
    preview.getAttribute("src");


  if (!source) {
    return;
  }


  /*
     Reset modal video.
  */

  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();


  /*
     Put selected reel into modal.
  */

  modalVideo.src = source;

  modalVideo.controls = true;
  modalVideo.playsInline = true;

  /*
     Full reel is NOT muted.
  */

  modalVideo.muted = false;
  modalVideo.defaultMuted = false;


  /*
     Set title and number.
  */

  if (modalTitle) {
    modalTitle.textContent =
      card.dataset.title || "";
  }

  if (modalNumber) {
    modalNumber.textContent =
      card.dataset.index || "";
  }


  /*
     Show modal.
  */

  modal.classList.add("open");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );


  /*
     Load and play full reel.
  */

  modalVideo.load();

  const startFullVideo = () => {

    modalVideo.muted = false;

    const playPromise =
      modalVideo.play();

    if (playPromise !== undefined) {

      playPromise.catch(() => {
        /*
           Some mobile browsers require
           an additional user tap for sound.
           Controls remain available.
        */
      });

    }

  };


  if (modalVideo.readyState >= 2) {

    startFullVideo();

  } else {

    modalVideo.addEventListener(
      "canplay",
      startFullVideo,
      { once: true }
    );

  }

}


/* =========================================================
   CLOSE FULL REEL
========================================================= */

function closeReel() {

  if (!modal || !modalVideo) {
    return;
  }


  modalVideo.pause();

  modalVideo.removeAttribute("src");

  modalVideo.load();


  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


/* =========================================================
   CLICK REEL CARD
========================================================= */

reelCards.forEach(card => {

  card.addEventListener(
    "click",
    event => {

      /*
         If sound hint was clicked,
         its own handler handles it.
      */

      if (
        event.target.closest(".sound-hint")
      ) {
        return;
      }

      openReel(card);

    }
  );

});


/* =========================================================
   SOUND / FULLSCREEN BUTTON
========================================================= */

document
  .querySelectorAll(".sound-hint")
  .forEach(button => {

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();
        event.stopPropagation();

        const card =
          button.closest(".reel-card");

        openReel(card);

      }
    );

  });


/* =========================================================
   CLOSE BUTTON
========================================================= */

if (modalClose) {

  modalClose.addEventListener(
    "click",
    closeReel
  );

}


/* =========================================================
   CLICK BACKDROP TO CLOSE
========================================================= */

if (modalBackdrop) {

  modalBackdrop.addEventListener(
    "click",
    closeReel
  );

}


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") {
      return;
    }


    if (
      modal &&
      modal.classList.contains("open")
    ) {

      closeReel();

    } else if (
      mobileNav &&
      mobileNav.classList.contains("open")
    ) {

      setMenu(false);

    }

 }
);


/* =========================================================
   KEEP PREVIEW VIDEOS MUTED
========================================================= */

reelVideos.forEach(video => {

  video.addEventListener(
    "volumechange",
    () => {

      if (!video.paused) {
        video.muted = true;
      }

    }
  );

});


/* =========================================================
   END
========================================================= */
