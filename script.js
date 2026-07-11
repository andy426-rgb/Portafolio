/**
 * Leonardo Palomino - Portfolio Interactions (Simple, Elegant, Fresh)
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- SECTION 1: THEME SWITCHER (Sol / Luna) ---
  const themeToggleBtn = document.getElementById('theme-switcher-btn');
  const body = document.body;

  // Retrieve saved theme preference or default to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    
    // Save state
    const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);

    // Minor feedback animation for toggle button
    themeToggleBtn.style.transform = 'scale(0.9)';
    setTimeout(() => {
      themeToggleBtn.style.transform = 'scale(1)';
    }, 150);
  });


  // --- SECTION 2: SMOOTH SCROLL & ACTIVE LINK HIGHLIGHTER ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Highlight active link based on scroll position
  const activeLinkHandler = () => {
    let currentId = 'hero';
    const scrollPosition = window.scrollY + 200; // offset for navbar height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === currentId) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activeLinkHandler);
  // Run once on load
  activeLinkHandler();


  // --- SECTION 3: SCROLL REVEAL ANIMATIONS (IntersectionObserver) ---
  // Elements to reveal
  const revealSelectors = [
    '.hero-content',
    '.hero-image-wrapper',
    '.section-header',
    '.project-card',
    '.skills-category-card',
    '.timeline-item',
    '.about-image-wrapper',
    '.about-content',
    '.contact-card'
  ];

  // Combine elements
  const revealElements = [];
  revealSelectors.forEach(selector => {
    const elList = document.querySelectorAll(selector);
    elList.forEach(el => revealElements.push(el));
  });

  // Set initial styles for reveal elements
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1), transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
  });

  // Setup observer
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        // Stop observing once revealed
        observer.unobserve(el);
      }
    });
  }, {
    root: null, // viewport
    threshold: 0.1, // trigger when 10% is visible
    rootMargin: '0px 0px -40px 0px' // offset slightly before element enters screen
  });

  // Start observing
  revealElements.forEach(el => {
    revealObserver.observe(el);
  });


  // --- SECTION 4: INTERACTIVE SKILL TAG EFFECTS ---
  const skillItems = document.querySelectorAll('.skill-item');
  
  skillItems.forEach(item => {
    const color = item.style.getPropertyValue('--skill-color');
    
    item.addEventListener('mouseenter', () => {
      // Soft glow effect based on technological brand color
      item.style.boxShadow = `0 4px 20px -2px ${hexToRgbA(color, 0.25)}`;
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.boxShadow = 'none';
    });
  });

  // Helper function to convert Hex to RGBA for transparent glows
  function hexToRgbA(hex, alpha = 1) {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x' + c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
    }
    // Fallback to theme accent if hex is not valid (like raw names/rgba)
    return `rgba(16, 185, 129, ${alpha})`;
  }

  // --- SECTION 5: CV MODAL LOGIC ---
  const cvBtn = document.getElementById('hero-cv-btn');
  const cvModal = document.getElementById('cv-modal');
  const cvCloseBtn = document.getElementById('cv-close-btn');
  const cvModalOverlay = document.getElementById('cv-modal-overlay');
  const cvPrintBtn = document.getElementById('cv-print-btn');

  if (cvBtn && cvModal && cvCloseBtn) {
    const openModal = (e) => {
      if (e) e.preventDefault();
      cvModal.classList.add('active');
      cvModal.setAttribute('aria-hidden', 'false');
      body.classList.add('modal-open');
    };

    const closeModal = () => {
      cvModal.classList.remove('active');
      cvModal.setAttribute('aria-hidden', 'true');
      body.classList.remove('modal-open');
    };

    cvBtn.addEventListener('click', openModal);
    cvCloseBtn.addEventListener('click', closeModal);
    if (cvModalOverlay) {
      cvModalOverlay.addEventListener('click', closeModal);
    }

    // Escape key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && cvModal.classList.contains('active')) {
        closeModal();
      }
    });

    // Print button triggers browser print
    if (cvPrintBtn) {
      cvPrintBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }
});
