/* === Testimonial Carousel === */
(function () {
  const track = document.querySelector('.testimonial-track');
  if (!track) return;

  const slides = track.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let current = 0;
  let autoplayTimer = null;
  let paused = false;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(function () {
      if (!paused) next();
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });
  nextBtn.addEventListener('click', function () { next(); startAutoplay(); });

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); startAutoplay(); });
  });

  // Pause on focus/hover for accessibility
  var carousel = document.querySelector('.testimonial-carousel');
  carousel.addEventListener('mouseenter', function () { paused = true; });
  carousel.addEventListener('mouseleave', function () { paused = false; });
  carousel.addEventListener('focusin', function () { paused = true; });
  carousel.addEventListener('focusout', function () { paused = false; });

  // Keyboard navigation
  carousel.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { prev(); startAutoplay(); }
    if (e.key === 'ArrowRight') { next(); startAutoplay(); }
  });

  startAutoplay();
})();

/* === Count-Up Animation on Scroll === */
(function () {
  var counters = document.querySelectorAll('.proof-stat-number[data-target]');
  if (!counters.length) return;
  var animated = false;

  function animateCounters() {
    if (animated) return;
    animated = true;

    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-target'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease-out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(step);
    });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  var statsSection = document.querySelector('.proof-stats');
  if (statsSection) observer.observe(statsSection);
})();
