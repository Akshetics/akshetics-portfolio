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

  menuToggle.setAttribute(
    "aria-expanded",
    String(open)
  );

  mobileNav.setAttribute(
    "aria-hidden",
    String(!open)
  );
}


/* Open / close menu */

if (menuToggle) {

  menuToggle.addEventListener("click", () => {

    const isOpen =
      mobileNav.classList.contains("open");

    setMenu(!isOpen);

  });

}


/* Close menu when navigation link is clicked */

document
  .querySelectorAll(".mobile-nav a")
  .forEach(link => {

    link.addEventListener("click", () => {

      setMenu(false);

    });

  });



/* =========================================================
   REEL VIDEO AUTOPLAY / AUTO PAUSE
========================================================= */

const reelCards = [
  ...document.querySelectorAll(".reel-card")
];

const reelVideos = [
  ...document.querySelectorAll(".reel-video")
];


/*
   Videos automatically play when they become
   sufficiently visible on screen.

   They automatically pause when they leave
   the visible area.
*/

const videoObserver =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        const video = entry.target;


        /* Video visible */

        if (
          entry.isIntersecting &&
          entry.intersectionRatio >= 0.45
        ) {

          /*
             Pause every other reel.
             This prevents multiple videos
             from playing simultaneously.
          */

          reelVideos.forEach(otherVideo => {

            if (otherVideo !== video) {

              otherVideo.pause();

            }

          });


          /*
             Always keep preview videos muted.
          */

          video.muted = true;


          /*
             Attempt autoplay.
             Browser may reject autoplay,
             which is normal.
          */

          video
            .play()
            .catch(() => {});

        }


        /* Video no longer visible */

        else {

          video.pause();

        }

      });

    },

    {
      threshold: [
        0,
        0.45,
        0.7
      ]
    }

  );


/*
   Observe every reel video.
*/

reelVideos.forEach(video => {

  videoObserver.observe(video);

});



/* =========================================================
   FULL REEL VIEWER
========================================================= */

const modal =
  document.querySelector(".reel-modal");

const modalVideo =
  document.querySelector("#modalVideo");

const modalTitle =
  document.querySelector("#modalTitle");

const modalNumber =
  document.querySelector("#modalNumber");

const modalClose =
  document.querySelector(".modal-close");

const modal
