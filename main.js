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

/* === Language / i18n === */
(function () {
  var HTML_KEYS = { hero_title_html: true, svc_learn_html: true };

  var translations = {
    en: {
      nav_services: 'Services',
      nav_clients: 'Clients',
      nav_about: 'About',
      nav_contact: 'Contact Us',
      hero_badge: '\uD83C\uDDE8\uD83C\uDDE6 Canadian Innovation',
      hero_title_html: 'Software Built for<br /><span class="gradient-text">Tomorrow\'s Leaders</span>',
      hero_subtitle: 'We craft intelligent, cloud-native software that puts AI to work for your business \u2014 so you can focus on what matters most.',
      hero_cta_1: 'Start a Project',
      hero_cta_2: 'Explore Services',
      hero_stat1_num: 'AI-First',
      hero_stat1_label: 'Approach',
      hero_stat2_num: 'Cloud',
      hero_stat2_label: 'Native',
      hero_stat3_num: 'Secure',
      hero_stat3_label: 'By Design',
      services_tag: 'What We Do',
      services_title: 'End-to-End Software Solutions',
      services_desc: 'From idea to production \u2014 we deliver modern software powered by the latest in AI and cloud technology.',
      svc1_title: 'AI Integration',
      svc1_desc: 'Embed intelligent automation, natural language processing, and predictive analytics directly into your products and workflows.',
      svc_learn_html: 'Learn more <span aria-hidden="true">\u2192</span>',
      svc2_title: 'Cloud Architecture',
      svc2_desc: 'Scalable, resilient, cost-efficient cloud infrastructure designed to grow with your business \u2014 on AWS, GCP, or Azure.',
      svc3_title: 'Secure by Design',
      svc3_desc: 'Security is never an afterthought. We build with compliance, encryption, and zero-trust principles from day one.',
      svc4_title: 'Custom Software',
      svc4_desc: 'Bespoke applications tailored to your exact needs \u2014 web, mobile, APIs, and enterprise platforms.',
      svc5_title: 'DevOps & CI/CD',
      svc5_desc: 'Continuous delivery pipelines, automated testing, and infrastructure-as-code so your teams ship with confidence.',
      svc6_title: 'Data & Analytics',
      svc6_desc: 'Transform raw data into business intelligence with modern data pipelines, dashboards, and AI-driven insights.',
      proof_tag: 'Trusted By',
      proof_title: 'Clients Who Build With Us',
      proof_desc: 'From startups to enterprise \u2014 our partners trust us to deliver intelligent, production-ready software.',
      proof_stat1: 'Projects Delivered',
      proof_stat2: 'Client Satisfaction',
      proof_stat3: 'Enterprise Clients',
      proof_stat4: 'Industry Experience',
      about_tag: 'Who We Are',
      about_title: 'Innovation is in Our DNA',
      about_p1: 'LDC Software is a Canadian software company on a mission to help organizations thrive in the age of AI. We believe the most powerful competitive advantage today is the ability to build and deploy intelligent software \u2014 fast.',
      about_p2: "Our team lives at the intersection of engineering excellence and practical AI. We don't just implement trends \u2014 we apply AI where it creates real, measurable value for our clients.",
      about_li1: 'Based in Canada, serving clients globally',
      about_li2: 'AI-powered tools embedded in our own development process',
      about_li3: 'Cloud-first, security-first philosophy',
      about_li4: 'Transparent, collaborative, results-driven',
      cat_title: 'Our Chief Morale Officer',
      cat_desc: 'Every great team needs a mascot. Ours just happens to prefer keyboards over meetings.',
      contact_tag: 'Get In Touch',
      contact_title: 'Ready to Build Something Great?',
      contact_desc: "Whether you have a clear vision or just a problem that needs solving, we'd love to hear from you. Let's figure out how AI and modern software can move your business forward.",
      form_name: 'Your Name',
      form_email: 'Email Address',
      form_service: 'Service Interested In',
      form_message: 'Tell Us About Your Project',
      form_submit: 'Send Message'
    },
    fr: {
      nav_services: 'Services',
      nav_clients: 'Clients',
      nav_about: '\u00C0 propos',
      nav_contact: 'Nous contacter',
      hero_badge: '\uD83C\uDDE8\uD83C\uDDE6 Innovation canadienne',
      hero_title_html: 'Logiciels con\u00E7us pour<br /><span class="gradient-text">Les Leaders de Demain</span>',
      hero_subtitle: "Nous cr\u00E9ons des logiciels intelligents, natifs cloud, qui mettent l'IA au service de votre entreprise \u2014 pour que vous puissiez vous concentrer sur l'essentiel.",
      hero_cta_1: 'D\u00E9marrer un projet',
      hero_cta_2: 'D\u00E9couvrir nos services',
      hero_stat1_num: "IA d'abord",
      hero_stat1_label: 'Approche',
      hero_stat2_num: 'Cloud',
      hero_stat2_label: 'Natif',
      hero_stat3_num: 'S\u00E9curis\u00E9',
      hero_stat3_label: 'Par conception',
      services_tag: 'Ce que nous faisons',
      services_title: 'Solutions logicielles de bout en bout',
      services_desc: "De l'id\u00E9e \u00E0 la production \u2014 nous livrons des logiciels modernes propuls\u00E9s par les derni\u00E8res technologies IA et cloud.",
      svc1_title: 'Int\u00E9gration IA',
      svc1_desc: "Int\u00E9grez l'automatisation intelligente, le traitement du langage naturel et l'analyse pr\u00E9dictive directement dans vos produits et processus.",
      svc_learn_html: 'En savoir plus <span aria-hidden="true">\u2192</span>',
      svc2_title: 'Architecture Cloud',
      svc2_desc: "Infrastructure cloud \u00E9volutive, r\u00E9siliente et \u00E9conomique con\u00E7ue pour grandir avec votre entreprise \u2014 sur AWS, GCP ou Azure.",
      svc3_title: 'S\u00E9curit\u00E9 par conception',
      svc3_desc: "La s\u00E9curit\u00E9 n'est jamais une r\u00E9flexion secondaire. Nous construisons avec conformit\u00E9, chiffrement et principes z\u00E9ro confiance d\u00E8s le premier jour.",
      svc4_title: 'Logiciels sur mesure',
      svc4_desc: "Applications personnalis\u00E9es adapt\u00E9es \u00E0 vos besoins pr\u00E9cis \u2014 web, mobile, APIs et plateformes d'entreprise.",
      svc5_title: 'DevOps et CI/CD',
      svc5_desc: "Pipelines de livraison continue, tests automatis\u00E9s et infrastructure-as-code pour que vos \u00E9quipes livrent en toute confiance.",
      svc6_title: 'Donn\u00E9es et analytique',
      svc6_desc: "Transformez les donn\u00E9es brutes en intelligence d'affaires gr\u00E2ce aux pipelines de donn\u00E9es modernes, tableaux de bord et analyses IA.",
      proof_tag: 'Ils nous font confiance',
      proof_title: 'Les clients qui construisent avec nous',
      proof_desc: "Des startups aux grandes entreprises \u2014 nos partenaires nous font confiance pour livrer des logiciels intelligents pr\u00EAts pour la production.",
      proof_stat1: 'Projets livr\u00E9s',
      proof_stat2: 'Satisfaction client',
      proof_stat3: 'Clients entreprises',
      proof_stat4: 'Exp\u00E9rience sectorielle',
      about_tag: 'Qui nous sommes',
      about_title: "L'innovation est dans notre ADN",
      about_p1: "LDC Software est une entreprise logicielle canadienne avec la mission d'aider les organisations \u00E0 prosp\u00E9rer \u00E0 l'\u00E8re de l'IA. Nous croyons que l'avantage concurrentiel le plus puissant aujourd'hui est la capacit\u00E9 \u00E0 construire et d\u00E9ployer des logiciels intelligents \u2014 rapidement.",
      about_p2: "Notre \u00E9quipe vit \u00E0 l'intersection de l'excellence en ing\u00E9nierie et de l'IA pratique. Nous n'impl\u00E9mentons pas simplement des tendances \u2014 nous appliquons l'IA l\u00E0 o\u00F9 elle cr\u00E9e une valeur r\u00E9elle et mesurable pour nos clients.",
      about_li1: 'Bas\u00E9s au Canada, au service de clients dans le monde entier',
      about_li2: "Outils aliment\u00E9s par l'IA int\u00E9gr\u00E9s dans notre propre processus de d\u00E9veloppement",
      about_li3: "Philosophie cloud d'abord, s\u00E9curit\u00E9 d'abord",
      about_li4: 'Transparent, collaboratif, ax\u00E9 sur les r\u00E9sultats',
      cat_title: 'Notre Directrice du Moral',
      cat_desc: "Chaque grande \u00E9quipe a besoin d'une mascotte. La n\u00F4tre pr\u00E9f\u00E8re simplement les claviers aux r\u00E9unions.",
      contact_tag: 'Contactez-nous',
      contact_title: 'Pr\u00EAt \u00E0 construire quelque chose de grand\u00A0?',
      contact_desc: "Que vous ayez une vision claire ou simplement un probl\u00E8me \u00E0 r\u00E9soudre, nous serions ravis de vous entendre. D\u00E9couvrons ensemble comment l'IA et les logiciels modernes peuvent faire avancer votre entreprise.",
      form_name: 'Votre nom',
      form_email: 'Adresse e-mail',
      form_service: 'Service qui vous int\u00E9resse',
      form_message: 'Parlez-nous de votre projet',
      form_submit: 'Envoyer le message'
    }
  };

  function applyTranslations(lang) {
    var t = translations[lang] || translations.en;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!(key in t)) return;
      if (HTML_KEYS[key]) {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    });
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-checked', active ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = this.getAttribute('data-lang');
      try { localStorage.setItem('ldc_lang', lang); } catch (e) {}
      applyTranslations(lang);
    });
  });

  // Apply saved or browser-preferred language on load
  var saved;
  try { saved = localStorage.getItem('ldc_lang'); } catch (e) {}
  var preferred = saved || (navigator.language && navigator.language.startsWith('fr') ? 'fr' : 'en');
  if (translations[preferred] && preferred !== 'en') {
    applyTranslations(preferred);
  }
})();
