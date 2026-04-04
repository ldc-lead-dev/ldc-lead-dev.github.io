/* === Navigation: Hamburger Menu, Active Section, Scroll Effects === */
(function () {
  var nav = document.getElementById('main-nav');
  var hamburger = document.getElementById('nav-hamburger');
  var menu = document.getElementById('nav-menu');
  var logoHome = document.getElementById('logo-home');
  var navLinks = document.querySelectorAll('.nav-link[data-section]');
  if (!nav || !hamburger || !menu) return;

  // Create overlay element
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  overlay.id = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu on link click (mobile)
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Logo scroll-to-top
  logoHome.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    closeMenu();
  });

  // Nav scrolled state
  var lastScrollY = 0;
  function updateNavScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
    lastScrollY = window.scrollY;
  }

  // Active section highlighting
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute('data-section');
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: link });
  });

  function updateActiveSection() {
    var scrollPos = window.scrollY + 120;
    var activeId = null;

    for (var i = sections.length - 1; i >= 0; i--) {
      if (sections[i].el.offsetTop <= scrollPos) {
        activeId = sections[i].id;
        break;
      }
    }

    navLinks.forEach(function (link) {
      if (link.getAttribute('data-section') === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Throttled scroll handler
  var scrollTicking = false;
  window.addEventListener('scroll', function () {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        updateNavScroll();
        updateActiveSection();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  updateNavScroll();
  updateActiveSection();
})();

/* === Footer Newsletter Signup === */
(function () {
  var form = document.querySelector('.footer-newsletter');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = form.querySelector('.footer-email-input');
    var btn = form.querySelector('.footer-subscribe-btn');
    if (!input.value) return;

    btn.textContent = 'Sent!';
    btn.style.background = '#22c55e';
    input.value = '';

    setTimeout(function () {
      btn.textContent = 'Subscribe';
      btn.style.background = '';
    }, 2500);
  });
})();

/* === Contact Form Validation & Submission === */
(function () {
  var form = document.getElementById('contact-form');
  var successEl = document.getElementById('contact-success');
  var submitBtn = document.getElementById('contact-submit');
  if (!form) return;

  // Floating label fix for select
  var serviceSelect = document.getElementById('contact-service');
  if (serviceSelect) {
    serviceSelect.addEventListener('change', function () {
      if (this.value) {
        this.classList.add('has-value');
      } else {
        this.classList.remove('has-value');
      }
    });
  }

  var validators = {
    name: function (val) {
      if (!val.trim()) return 'Name is required.';
      if (val.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: function (val) {
      if (!val.trim()) return 'Email is required.';
      // Simple but effective email regex
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())) return 'Please enter a valid email address.';
      return '';
    },
    service: function (val) {
      if (!val) return 'Please select a service.';
      return '';
    },
    message: function (val) {
      if (!val.trim()) return 'Message is required.';
      if (val.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    }
  };

  function validateField(name) {
    var input = form.querySelector('[name="' + name + '"]');
    if (!input) return true;
    var field = input.closest('.form-field');
    var errorEl = document.getElementById('contact-' + name + '-error');
    var error = validators[name](input.value);

    if (error) {
      field.classList.add('has-error');
      if (errorEl) errorEl.textContent = error;
      return false;
    } else {
      field.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  // Real-time inline validation on blur
  ['name', 'email', 'service', 'message'].forEach(function (fieldName) {
    var input = form.querySelector('[name="' + fieldName + '"]');
    if (!input) return;

    input.addEventListener('blur', function () {
      // Only validate on blur if user has interacted
      if (input.value || input.dataset.touched) {
        input.dataset.touched = 'true';
        validateField(fieldName);
      }
    });

    // Clear error on input
    input.addEventListener('input', function () {
      input.dataset.touched = 'true';
      var field = input.closest('.form-field');
      if (field.classList.contains('has-error')) {
        validateField(fieldName);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Honeypot check
    var hp = form.querySelector('[name="website"]');
    if (hp && hp.value) return;

    // Mark all fields as touched
    ['name', 'email', 'service', 'message'].forEach(function (f) {
      var input = form.querySelector('[name="' + f + '"]');
      if (input) input.dataset.touched = 'true';
    });

    // Validate all fields
    var valid = true;
    ['name', 'email', 'service', 'message'].forEach(function (f) {
      if (!validateField(f)) valid = false;
    });

    if (!valid) {
      // Focus first error
      var firstError = form.querySelector('.has-error input, .has-error textarea, .has-error select');
      if (firstError) firstError.focus();
      return;
    }

    // Show loading state
    submitBtn.classList.add('loading');

    // Simulate submission (replace with real API call)
    setTimeout(function () {
      submitBtn.classList.remove('loading');
      form.hidden = true;
      successEl.hidden = false;
    }, 1500);
  });
})();

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
