document.addEventListener('DOMContentLoaded', () => {

  // --- HEADER SCROLL & ACTIVE LINK ---
  const header = document.querySelector('.main-header');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.main-nav a[data-section]');
  const sections = document.querySelectorAll<HTMLElement>('section');

  const headerScrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (!entry.isIntersecting) {
              header?.classList.add('scrolled');
          } else {
              header?.classList.remove('scrolled');
          }
      });
  }, { threshold: 0.1, rootMargin: '-100px 0px 0px 0px' });
  
  if (document.querySelector('#hero')) {
      headerScrollObserver.observe(document.querySelector('#hero')!);
  }

  const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const sectionId = entry.target.id;
              navLinks.forEach(link => {
                  link.classList.toggle('active', link.dataset.section === sectionId);
              });
          }
      });
  }, { threshold: 0.5 });

  sections.forEach(section => {
      sectionObserver.observe(section);
  });

  // --- HAMBURGER MENU ---
  const hamburger = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('.main-nav');
  const body = document.body;

  if (hamburger && nav) {
      hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('is-active');
          nav.classList.toggle('is-open');
          body.classList.toggle('nav-open');
      });

      // Close menu when a link is clicked
      nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
             if (nav.classList.contains('is-open')) {
                hamburger.classList.remove('is-active');
                nav.classList.remove('is-open');
                body.classList.remove('nav-open');
             }
        });
      });
  }

  // --- SMOOTH SCROLLING FOR NAV LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // --- SCROLL-TRIGGERED ANIMATIONS ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  animatedElements.forEach(el => {
    scrollObserver.observe(el);
  });

  // --- PARALLAX EFFECTS ---
    const heroText = document.querySelector<HTMLElement>('.hero-text');
    const aboutImageContainer = document.querySelector<HTMLElement>('.about-image-container');

    const handleScrollParallax = () => {
        const scrollY = window.scrollY;
        
        if (heroText && scrollY < window.innerHeight) {
            heroText.style.transform = `translateY(${scrollY * 0.4}px)`;
        }

        if (aboutImageContainer) {
            const rect = aboutImageContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (rect.top < windowHeight && rect.bottom >= 0) {
                 const speed = -0.15;
                 const movement = (rect.top - windowHeight / 2) * speed;
                 // Don't apply parallax if the element is being tilted by the mouse
                 if (!aboutImageContainer.style.transform.includes('perspective')) {
                    aboutImageContainer.style.transform = `translateY(${movement}px)`;
                 }
            }
        }
    };
    
    window.addEventListener('scroll', handleScrollParallax);
    handleScrollParallax(); // Initial call


    // --- INTERACTIVE FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector<HTMLButtonElement>('.faq-question');
        const answer = item.querySelector<HTMLElement>('.faq-answer');

        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                // Close all other items
                faqItems.forEach(i => {
                    if (i !== item) {
                        i.classList.remove('is-open');
                        i.querySelector<HTMLButtonElement>('.faq-question')?.setAttribute('aria-expanded', 'false');
                        const ans = i.querySelector<HTMLElement>('.faq-answer');
                        if(ans) ans.style.maxHeight = null;
                    }
                });
                
                // Toggle the clicked item
                if (!isOpen) {
                    item.classList.add('is-open');
                    question.setAttribute('aria-expanded', 'true');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    item.classList.remove('is-open');
                    question.setAttribute('aria-expanded', 'false');
                    answer.style.maxHeight = null;
                }
            });
        }
    });

    // --- CUSTOM CURSOR TRAILER ---
    const cursorDot = document.querySelector<HTMLElement>('.cursor-dot');
    const cursorTrailer = document.querySelector<HTMLElement>('.cursor-trailer');
    
    let dotX = 0, dotY = 0;
    let trailerX = 0, trailerY = 0;

    window.addEventListener('mousemove', (e) => {
        dotX = e.clientX;
        dotY = e.clientY;
    });

    const animateCursor = () => {
        // Lerp for smoother trailer movement
        const lerp = (start, end, t) => {
            return start * (1 - t) + end * t;
        }

        trailerX = lerp(trailerX, dotX, 0.2);
        trailerY = lerp(trailerY, dotY, 0.2);
        
        if (cursorDot && cursorTrailer) {
            cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
            cursorTrailer.style.transform = `translate(${trailerX - cursorTrailer.clientWidth / 2}px, ${trailerY - cursorTrailer.clientHeight / 2}px)`;
        }
        requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .service-card, .comparison-slider, .team-card, .about-image-container');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });

    // --- 3D TILT EFFECT ---
    const tiltElements = document.querySelectorAll<HTMLElement>('.team-card, .about-image-container');
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotateX = (y / rect.height - 0.5) * -20; // -10 to 10 deg
            const rotateY = (x / rect.width - 0.5) * 20;   // -10 to 10 deg

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        element.addEventListener('mouseenter', () => {
            // Transitions are now handled purely by CSS
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- BEFORE & AFTER COMPARISON SLIDER ---
    const sliders = document.querySelectorAll<HTMLElement>('.comparison-slider');
    sliders.forEach(slider => {
        const handle = slider.querySelector<HTMLElement>('.slider-handle');
        const afterImageWrapper = slider.querySelector<HTMLElement>('.image-after-wrapper');
        let isDragging = false;

        const startDrag = (e) => {
            e.preventDefault();
            isDragging = true;
            slider.classList.add('is-dragging');
        };

        const stopDrag = () => {
            isDragging = false;
            slider.classList.remove('is-dragging');
        };

        const onDrag = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const rect = slider.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let x = clientX - rect.left;
            
            // Clamp the value between 0 and the slider's width
            x = Math.max(0, Math.min(x, rect.width));
            
            const percent = (x / rect.width) * 100;
            
            if (handle && afterImageWrapper) {
                handle.style.left = `${percent}%`;
                afterImageWrapper.style.clipPath = `inset(0 0 0 ${percent}%)`;
                slider.setAttribute('aria-valuenow', Math.round(percent).toString());
            }
        };

        handle?.addEventListener('mousedown', startDrag);
        handle?.addEventListener('touchstart', startDrag, { passive: false });

        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('touchend', stopDrag);
        
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('touchmove', onDrag, { passive: false });
    });
});