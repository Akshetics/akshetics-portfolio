document.addEventListener('DOMContentLoaded', () => {
  const cardVideos = document.querySelectorAll('.video-card video');

  // Autoplay muted when in view, pause when out of view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.6 });

  cardVideos.forEach((video) => observer.observe(video));

  // Fullscreen modal with sound on click
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const closeBtn = document.getElementById('modalClose');

  document.querySelectorAll('.video-card').forEach((card) => {
    card.addEventListener('click', () => {
      const src = card.querySelector('video').getAttribute('src');
      cardVideos.forEach((v) => v.pause());
      modalVideo.src = src;
      modal.classList.add('active');
      modalVideo.muted = false;
      modalVideo.currentTime = 0;
      modalVideo.play().catch(() => {});
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();
  }

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
});
