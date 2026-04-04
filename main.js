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

/* === Team Grid (Data-Driven) === */
(function () {
  var teamGrid = document.getElementById('team-grid');
  if (!teamGrid) return;

  var teamMembers = [
    {
      name: 'Cedric Dupont',
      initials: 'CD',
      role: 'Founder & CEO',
      bio: 'Visionary leader with 15+ years in software engineering. Passionate about leveraging AI to transform businesses.',
      socials: { linkedin: '#', github: '#' }
    },
    {
      name: 'Maya Chen',
      initials: 'MC',
      role: 'VP of Engineering',
      bio: 'Full-stack architect specializing in cloud-native systems and distributed computing at scale.',
      socials: { linkedin: '#', github: '#' }
    },
    {
      name: 'Liam O\'Brien',
      initials: 'LO',
      role: 'Lead AI Engineer',
      bio: 'Machine learning expert focused on NLP and predictive analytics. Former research scientist at a top AI lab.',
      socials: { linkedin: '#', github: '#' }
    },
    {
      name: 'Priya Sharma',
      initials: 'PS',
      role: 'Head of Security',
      bio: 'Cybersecurity specialist with deep expertise in zero-trust architecture, SOC 2, and ISO 27001 compliance.',
      socials: { linkedin: '#' }
    },
    {
      name: 'Alex Rivera',
      initials: 'AR',
      role: 'Senior Cloud Architect',
      bio: 'AWS and GCP certified architect. Designs resilient, cost-efficient infrastructure for high-traffic applications.',
      socials: { linkedin: '#', github: '#' }
    },
    {
      name: 'Sophie Tremblay',
      initials: 'ST',
      role: 'UX/UI Lead',
      bio: 'User experience designer who bridges the gap between beautiful interfaces and intuitive functionality.',
      socials: { linkedin: '#' }
    }
  ];

  teamMembers.forEach(function (member) {
    var card = document.createElement('div');
    card.className = 'team-card reveal-on-scroll';
    card.setAttribute('tabindex', '0');

    var socialsHtml = '';
    if (member.socials) {
      socialsHtml = '<div class="team-socials">';
      if (member.socials.linkedin) {
        socialsHtml += '<a href="' + member.socials.linkedin + '" class="team-social-link" aria-label="' + member.name + ' LinkedIn">LinkedIn</a>';
      }
      if (member.socials.github) {
        socialsHtml += '<a href="' + member.socials.github + '" class="team-social-link" aria-label="' + member.name + ' GitHub">GitHub</a>';
      }
      socialsHtml += '</div>';
    }

    card.innerHTML =
      '<div class="team-avatar" aria-hidden="true">' + member.initials + '</div>' +
      '<p class="team-name">' + member.name + '</p>' +
      '<p class="team-role">' + member.role + '</p>' +
      '<p class="team-bio">' + member.bio + '</p>' +
      socialsHtml;

    teamGrid.appendChild(card);
  });
})();

/* === Scroll Reveal Animation === */
(function () {
  var elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(function (el) { observer.observe(el); });
})();
