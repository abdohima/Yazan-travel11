// enhancements.js - small accessibility and lazy helpers
document.documentElement.classList.add('js-enabled');

// fade-in reveal
document.addEventListener('scroll', () => {
  document.querySelectorAll('.fade-in').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('visible');
  });
});

// lazy images helper (if any)
