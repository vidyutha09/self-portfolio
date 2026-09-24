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
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const honeyInput = document.getElementById('form-honey');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('btn-submit-contact');

    // Email validation regex (standard RFC 5322 compliant pattern)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Helper: Clear inline errors when user types
    const clearError = (input, errorElement) => {
      input.classList.remove('invalid');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    };

    nameInput.addEventListener('input', () => clearError(nameInput, nameError));
    emailInput.addEventListener('input', () => clearError(emailInput, emailError));
    messageInput.addEventListener('input', () => clearError(messageInput, messageError));

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous status
      formStatus.style.display = 'none';
      formStatus.className = 'form-status-alert';
      formStatus.innerHTML = '';

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      const honey = honeyInput ? honeyInput.value : '';

      let hasError = false;

      // Validate Name
      if (!name) {
        nameInput.classList.add('invalid');
        nameError.textContent = 'Please enter your name.';
        nameError.style.display = 'block';
        hasError = true;
      } else if (name.length < 2) {
        nameInput.classList.add('invalid');
        nameError.textContent = 'Name must be at least 2 characters.';
        nameError.style.display = 'block';
        hasError = true;
      }

      // Validate Email
      if (!email) {
        emailInput.classList.add('invalid');
        emailError.textContent = 'Please enter your email address.';
        emailError.style.display = 'block';
        hasError = true;
      } else if (!emailRegex.test(email)) {
        emailInput.classList.add('invalid');
        emailError.textContent = 'Please enter a valid email address (e.g. name@example.com).';
        emailError.style.display = 'block';
        hasError = true;
      }

      // Validate Message
      if (!message) {
        messageInput.classList.add('invalid');
        messageError.textContent = 'Please enter a message.';
        messageError.style.display = 'block';
        hasError = true;
      } else if (message.length < 5) {
        messageInput.classList.add('invalid');
        messageError.textContent = 'Message is too short (at least 5 characters).';
        messageError.style.display = 'block';
        hasError = true;
      }

      // If invalid, focus on the first invalid field
      if (hasError) {
        if (!name) nameInput.focus();
        else if (!email || !emailRegex.test(email)) emailInput.focus();
        else messageInput.focus();
        return;
      }

      // Honeypot spam trap
      if (honey) {
        formStatus.className = 'form-status-alert success';
        formStatus.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <span>Thanks for reaching out! Your message has been sent successfully. I'll get back to you soon.</span>
        `;
        formStatus.style.display = 'flex';
        contactForm.reset();
        return;
      }

      // Set button to loading state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="btn-spinner" aria-hidden="true"></span>
        <span>Sending Message...</span>
      `;

      try {
        let responseSuccess = false;
        const payload = {
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Message from ${name}`
        };

        // Try primary Vercel Serverless Function first (/api/contact)
        try {
          const apiResponse = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (apiResponse.ok) {
            const result = await apiResponse.json();
            if (result.success !== false) {
              responseSuccess = true;
            }
          } else if (apiResponse.status === 404) {
            // If /api/contact is not hosted (e.g. static local preview), fallback below
            responseSuccess = false;
          } else {
            const errData = await apiResponse.json().catch(() => ({}));
            throw new Error(errData.message || 'Server responded with an error.');
          }
        } catch (apiErr) {
          // If network failed or /api/contact is unavailable, fallback to FormSubmit endpoint
          console.warn('API route unavailable or errored, attempting direct form fallback...', apiErr);
          responseSuccess = false;
        }

        // Direct Service Fallback (handles static preview or if serverless function is not active)
        if (!responseSuccess) {
          const serviceResponse = await fetch('https://formsubmit.co/ajax/vidyutha09@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          const serviceData = await serviceResponse.json().catch(() => ({}));
          if (serviceResponse.ok && serviceData.success !== 'false') {
            responseSuccess = true;
          } else {
            throw new Error(serviceData.message || 'Failed to submit form.');
          }
        }

        if (responseSuccess) {
          // Show required success message
          const successText = "Thanks for reaching out! Your message has been sent successfully. I'll get back to you soon.";
          formStatus.className = 'form-status-alert success';
          formStatus.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>${successText}</span>
          `;
          formStatus.style.display = 'flex';
          showToast(successText, 5000);
          contactForm.reset();
        } else {
          throw new Error('Could not verify submission.');
        }

      } catch (err) {
        console.error('Contact submission error:', err);
        formStatus.className = 'form-status-alert error';
        formStatus.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>Oops! We couldn't send your message right now. Please try again or email me directly at <a href="mailto:vidyutha09@gmail.com" style="text-decoration: underline; color: #fff;">vidyutha09@gmail.com</a>.</span>
        `;
        formStatus.style.display = 'flex';
        showToast('Submission failed. Please check your connection.', 4500);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
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
