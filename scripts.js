// Animasi Fade-In saat Scroll
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.post-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, {
    threshold: 0.5
  });

  cards.forEach(card => observer.observe(card));
});
