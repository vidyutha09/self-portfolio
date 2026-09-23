/**
 * Vidyutha S.P - Portfolio Interactivity & Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation & Scroll Spy ---
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Handle sticky header style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightCurrentSection();
  });

  // Highlight active navigation link based on scroll position
  function highlightCurrentSection() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // Mobile Menu Toggle
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    // Close mobile menu on clicking any link
    const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // --- Toast Notification Utility ---
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message, duration = 3200) {
    if (!toast) return;
    if (toastTimer) clearTimeout(toastTimer);

    toastMsg.textContent = message;
    toast.classList.add('show');

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // --- Copy Email to Clipboard ---
  const copyBtn = document.getElementById('btn-copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'vidyutha09@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(() => {
          showToast('Email copied to clipboard: ' + email);
        }).catch(() => {
          fallbackCopyText(email);
        });
      } else {
        fallbackCopyText(email);
      }
    });
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('Email copied to clipboard: ' + text);
    } catch (err) {
      showToast('Contact: ' + text);
    }
    document.body.removeChild(textArea);
  }

  // --- Project Modal Data & Interaction ---
  const projectDetails = {
    'legal-metrology': {
      title: 'Legal Metrology Packaged Commodities Compliance Scanner',
      tag: 'AI Concept & Systems',
      status: 'Concept & Architecture',
      overview: 'An AI-driven compliance concept designed to verify packaged commodities against statutory regulations (e.g. Legal Metrology Rules, 2011) automatically.',
      details: [
        {
          heading: 'Problem Statement',
          text: 'Consumer goods sold in India are required by law to display clear declarations including Maximum Retail Price (MRP), net quantity, manufacturing date, manufacturer information, and consumer grievance contacts. Manual compliance checks across thousands of retail items are slow and error-prone.'
        },
        {
          heading: 'System Architecture & Concept',
          text: 'The concept utilizes high-resolution image capture of packaging labels, feeds the image into an Optical Character Recognition (OCR) pipeline, cleans and tokenizes the text, and runs it through a deterministic Rules Engine and NLP parser to confirm all required compliance fields are present and valid.'
        },
        {
          heading: 'Technologies Explored',
          text: 'Python, Optical Character Recognition (OCR) concepts, Regex Rule-Based Parsing, Computer Vision fundamentals, and structured JSON output generation.'
        },
        {
          heading: 'Current Status',
          text: 'Architecture design, rule taxonomy definition, and prototyping the OCR extraction flow.'
        }
      ]
    },
    'muscle-munch': {
      title: 'Muscle Munch — High-Protein Indian Snack Concept',
      tag: 'Product Design & Nutrition',
      status: 'Concept & Prototyping',
      overview: 'A nutrition-focused consumer product concept created to deliver accessible, high-protein snacks tailored to Indian dietary habits and palate preferences.',
      details: [
        {
          heading: 'Vision & Opportunity',
          text: 'A significant portion of Indian diets lacks sufficient daily protein. Existing fitness snacks in the market are either heavily imported, expensive, or overly Westernized in taste. Muscle Munch bridges this gap by merging authentic regional culinary profiles with scientifically sound macronutrient ratios.'
        },
        {
          heading: 'Concept Development',
          text: 'Researched indigenous protein sources (roasted pulses, seed blends, natural isolates) to create balanced snack formulations. Designed visual packaging identity, brand system, and nutritional clarity labels using design tools.'
        },
        {
          heading: 'Skills & Tools Applied',
          text: 'Nutritional analysis, consumer requirement mapping, visual branding, Figma, and Canva.'
        },
        {
          heading: 'Current Status',
          text: 'Macro breakdown modeling, flavor profile ideation, and initial visual prototypes.'
        }
      ]
    },
    'coming-soon': {
      title: 'Next Projects — In The Workshop',
      tag: 'Continuous Development',
      status: 'Active Learning & Building',
      overview: 'As a 2nd-year CSE student, I continuously write code and explore new paradigms. Here is what is currently on my workbench:',
      details: [
        {
          heading: '1. Data Structures & Algorithm Visualizer',
          text: 'An interactive web tool to visualize tree traversals, graph algorithms (BFS/DFS, Dijkstra), and sorting steps in real time.'
        },
        {
          heading: '2. Lightweight Student Productivity Utility',
          text: 'A clean command-line or web utility to track semester study schedules, course deadlines, and academic resources.'
        },
        {
          heading: '3. Machine Learning Explorations',
          text: 'Hands-on practice implementations of classification models, linear regression, and basic neural network concepts using Python.'
        }
      ]
    }
  };

  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalTag = document.getElementById('modal-tag');
  const modalStatus = document.getElementById('modal-status');
  const modalContent = document.getElementById('modal-content');

  function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalTag.textContent = data.tag;
    modalStatus.textContent = data.status;

    let html = `<p style="font-size: 1.02rem; color: #e2e8f0; margin-bottom: 20px; line-height: 1.6;">${data.overview}</p>`;

    data.details.forEach(item => {
      html += `
        <div style="margin-bottom: 18px;">
          <h4 class="modal-section-title">${item.heading}</h4>
          <p style="font-size: 0.92rem; color: #94a3b8; line-height: 1.65;">${item.text}</p>
        </div>
      `;
    });

    modalContent.innerHTML = html;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach modal trigger listeners
  const detailButtons = document.querySelectorAll('[data-project-id]');
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project-id');
      openProjectModal(id);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // --- Contact Form Submission Handler ---
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value.trim() || 'Portfolio Inquiry';
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in your name, email, and message.');
        return;
      }

      // Compose mailto link so user can send immediately
      const mailtoUrl = `mailto:vidyutha09@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent("Sender: " + name + " (" + email + ")\n\n" + message)}`;
      
      showToast('Opening email client to send message to Vidyutha...');
      
      setTimeout(() => {
        window.location.href = mailtoUrl;
        contactForm.reset();
      }, 700);
    });
  }

  // --- Smooth Back to Top Button ---
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
