document.addEventListener('DOMContentLoaded', () => {

  // ===== PRELOADER =====
  const preloader = document.querySelector('.preloader');

  function startHeroAnimations() {
    // Staggered text reveal
    const targets = document.querySelectorAll('.hero-text-target');
    targets.forEach(el => {
      const delay = parseFloat(el.getAttribute('data-delay')) || 1;
      const time = 0.2 + (delay - 1) * 0.18;
      el.style.animationDelay = time + 's';
      el.classList.add('revealed');
    });

    // Hero image reveal
    const heroImg = document.getElementById('heroImage');
    if (heroImg) {
      setTimeout(() => heroImg.classList.add('revealed'), 400);
    }
  }

  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'visible';
      startHeroAnimations();
    }, 1800);
    document.body.style.overflow = 'hidden';
  } else {
    startHeroAnimations();
  }

  // ===== CUSTOM CURSOR =====
  const cursor = document.querySelector('.cursor');
  const cursorFollower = document.querySelector('.cursor-follower');

  if (cursor && cursorFollower && window.innerWidth > 768) {
    cursor.style.display = 'block';
    cursorFollower.style.display = 'block';

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, .btn, .service-card, .testimonial-card, .team-card, .mv-card, .service-detailed-card, .about-feature-item, .contact-info-item');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorFollower.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorFollower.classList.remove('cursor-hover');
      });
    });
  }

  // ===== MOBILE HAMBURGER =====
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ===== NAVBAR SCROLL EFFECT =====
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===== FLOATING PARTICLES (Hero) =====
  const particlesContainer = document.querySelector('.particles-container');
  if (particlesContainer) {
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 5 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 25 + 15) + 's';
      particle.style.animationDelay = (Math.random() * 25) + 's';
      particle.style.opacity = Math.random() * 0.2 + 0.05;
      particlesContainer.appendChild(particle);
    }
  }

  // ===== PARALLAX ON SCROLL =====
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (scrollY - rect.top + window.innerHeight) * speed;
        el.style.transform = `translateY(${offset * 0.3}px)`;
      }
    });
  });

  // ===== SCROLL-TRIGGERED ANIMATIONS (Intersection Observer) =====
  const animateElements = document.querySelectorAll(
    '.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale'
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add stagger delay for children
        const parent = entry.target.closest('[data-stagger]');
        if (parent) {
          const children = parent.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-in-scale');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('visible');
              observer.unobserve(child);
            }, index * 100);
          });
        } else {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // ===== COUNTER ANIMATION =====
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    if (!target) return;
    const duration = 2000;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current >= target) {
        el.textContent = target;
        return;
      }
      el.textContent = current;
      requestAnimationFrame(updateCounter);
    };

    updateCounter();
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('[data-count]');
        counters.forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  const counterSection = document.querySelector('[data-counter-section]');
  if (counterSection) {
    counterObserver.observe(counterSection);
  }

  // Also trigger on page load for hero stats
  const heroCounterSection = document.querySelector('[data-hero-counters]');
  if (heroCounterSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('[data-count]');
          counters.forEach(animateCounter);
          heroObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    heroObserver.observe(heroCounterSection);
  }

  // ===== MARQUEE DUPLICATION =====
  const clientsTrack = document.querySelector('.clients-track');
  if (clientsTrack) {
    const clone = clientsTrack.innerHTML;
    clientsTrack.innerHTML += clone;
  }

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const firstName = document.getElementById('firstName')?.value.trim();
      const lastName = document.getElementById('lastName')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();

      if (!firstName || !lastName || !email || !message) {
        // Shake animation on empty fields
        contactForm.style.animation = 'shake 0.5s ease';
        setTimeout(() => { contactForm.style.animation = ''; }, 500);
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = 'Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== SHAKE KEYFRAMES (inject if not exists) =====
  if (!document.querySelector('#shake-style')) {
    const style = document.createElement('style');
    style.id = 'shake-style';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);
  }

});
