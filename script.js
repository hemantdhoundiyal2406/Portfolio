document.addEventListener('DOMContentLoaded', () => {
    // 1. Typewriter Animation
    const typewriterEl = document.getElementById('typewriter');
    const words = ["Frontend Developer", "Shopify Theme Expert", "Responsive UI Builder"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Speed up deleting
        } else {
            typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }
    
    if (typewriterEl) {
        setTimeout(type, 1000);
    }

    // 2. Mobile Menu Navigation
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 3. Card mouse spotlight glow tracking
    const cards = document.querySelectorAll('.card-glow');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 4. Header shrinking on scroll
    const header = document.querySelector('header.header');
    
    function checkScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header-shrunk');
        } else {
            header.classList.remove('header-shrunk');
        }
    }
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(checkScroll);
    });
    checkScroll(); // Run once in case user loads page scrolled down

    // 5. Contact Form Submission Handling & Modal Dialog
    const contactForm = document.getElementById('portfolio-contact-form');
    const successDialog = document.getElementById('success-dialog');
    const closeDialogBtn = document.getElementById('close-dialog');

    if (contactForm && successDialog && closeDialogBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Values
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            if (name && email && subject && message) {
                // Construct a beautifully formatted WhatsApp text message
                const text = `*New Message from Portfolio*\n\n` +
                             `*Name:* ${name}\n` +
                             `*Email:* ${email}\n` +
                             `*Subject:* ${subject}\n\n` +
                             `*Message:*\n${message}`;
                
                // Encode the text and generate click-to-chat link
                const whatsappUrl = `https://wa.me/919354998283?text=${encodeURIComponent(text)}`;
                
                // Open WhatsApp in a new tab
                window.open(whatsappUrl, '_blank');
                
                // Show success modal feedback on screen
                successDialog.showModal();
                contactForm.reset();
            }
        });

        closeDialogBtn.addEventListener('click', () => {
            successDialog.close();
        });

        // Close on clicking backdrop
        successDialog.addEventListener('click', (e) => {
            const rect = successDialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                successDialog.close();
            }
        });
    }

    // 6. IntersectionObserver Fallback for Scroll-Driven Animations
    // (Only triggers if native CSS scroll-driven timelines are NOT supported)
    const supportsScrollDriven = CSS.supports('(animation-timeline: view()) and (animation-range: entry)');
    
    if (!supportsScrollDriven && window.IntersectionObserver) {
        const revealElements = document.querySelectorAll(
            '.about-info, .about-timeline, .skills-group, .project-card, .contact-details, .contact-form-container, .section-header'
        );

        // Instantly prepare elements to be hidden/faded
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target); // Trigger only once
                }
            });
        }, {
            root: null, // viewport
            rootMargin: '0px 0px -10% 0px', // Trigger slightly before fully entering
            threshold: 0.1
        });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }
});
