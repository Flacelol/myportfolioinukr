// Portfolio Website JavaScript

// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation Toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Theme Toggle Functionality
if (themeToggle) {
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update theme toggle icon
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation Link Highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const correspondingNavLink = document.querySelector(`a[href="#${sectionId}"]`);

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (correspondingNavLink) {
                correspondingNavLink.classList.add('active');
            }
        }
    });
}

// Navbar Background on Scroll
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
            ? 'rgba(15, 23, 42, 0.98)' 
            : 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark' 
            ? 'rgba(15, 23, 42, 0.95)' 
            : 'rgba(255, 255, 255, 0.95)';
    }
}

// Scroll Event Listeners
window.addEventListener('scroll', () => {
    updateActiveNavLink();
    updateNavbarBackground();
});

// Initialize EmailJS
(function() {
    emailjs.init('mQ7rD4M2WEAjG89N_');
})();

// Contact Form Handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Будь ласка, заповніть всі поля.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Будь ласка, введіть дійсну адресу електронної пошти.', 'error');
            return;
        }
        
        // Send email using EmailJS
        showNotification('Надсилання повідомлення...', 'info');
        
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        };
        
        emailjs.send('service_bbmu5rn', 'template_obnpoks', templateParams)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('Повідомлення успішно надіслано! Я зв\'яжуся з вами найближчим часом.', 'success');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('FAILED...', error);
                showNotification('Не вдалося надіслати повідомлення. Спробуйте ще раз пізніше.', 'error');
            });
    });
}

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    closeButton.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            removeNotification(notification);
        }
    }, 5000);
}

function getNotificationColor(type) {
    switch (type) {
        case 'success': return '#10b981';
        case 'error': return '#ef4444';
        case 'warning': return '#f59e0b';
        default: return '#3b82f6';
    }
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation (excluding about-content to let CSS animations work)
const animateElements = document.querySelectorAll('.portfolio-item, .contact-item');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Enhanced typing effect for hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Add blinking cursor after typing is complete
            element.innerHTML = text;
        }
    }
    
    type();
}

// Particle system for hero background
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.6), rgba(245, 158, 11, 0.4));
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            z-index: 0;
        `;
        hero.appendChild(particle);
    }
}

// Add floating particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 150);
        }, 1000);
    }
});

// Enhanced portfolio item hover effects
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach((item, index) => {
    // Add staggered animation delay
    item.style.animationDelay = `${index * 0.1}s`;
    
    item.addEventListener('mouseenter', () => {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.3), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 2;
        `;
        item.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    });
});

// Add ripple effect animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 300px;
            height: 300px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Smooth reveal animation for sections
function revealSection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}

const sectionObserver = new IntersectionObserver(revealSection, {
    threshold: 0.15
});

const sections = document.querySelectorAll('section:not(.about)');
sections.forEach(section => {
    section.classList.add('section-hidden');
    sectionObserver.observe(section);
});

// Add CSS for section reveal animation
const style = document.createElement('style');
style.textContent = `
    .section-hidden {
        opacity: 0;
        transform: translateY(50px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .section-hidden.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .nav-link.active {
        color: var(--primary-color);
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
        hero.style.transform = `translateY(${rate}px)`;
    }
}

// Add parallax effect on scroll (optional - can be disabled for performance)
// window.addEventListener('scroll', parallaxEffect);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    updateActiveNavLink();
    updateNavbarBackground();
}, 100);

window.removeEventListener('scroll', () => {
    updateActiveNavLink();
    updateNavbarBackground();
});

window.addEventListener('scroll', throttledScrollHandler);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active nav link
    updateActiveNavLink();
    
    // Set initial navbar background
    updateNavbarBackground();
    
    // Create floating particles
    createParticles();
    
    // Add mouse trail effect
    addMouseTrail();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize all animations
    // initAboutAnimations(); // Disabled to let CSS animations work
    initContactAnimations();
    addSparkleStyles();
    
    console.log('Portfolio website initialized successfully!');
});

// Mouse trail effect
function addMouseTrail() {
    const trail = [];
    const trailLength = 10;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.8), rgba(245, 158, 11, 0.6));
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateTrail() {
        let x = mouseX;
        let y = mouseY;
        
        trail.forEach((dot, index) => {
            const nextDot = trail[index + 1] || trail[0];
            
            dot.style.left = x + 'px';
            dot.style.top = y + 'px';
            dot.style.opacity = (trailLength - index) / trailLength * 0.5;
            dot.style.transform = `scale(${(trailLength - index) / trailLength})`;
            
            x += (parseFloat(nextDot.style.left) - x) * 0.3;
            y += (parseFloat(nextDot.style.top) - y) * 0.3;
        });
        
        requestAnimationFrame(animateTrail);
    }
    
    animateTrail();
}

// Enhanced scroll animations
function initScrollAnimations() {
    const elements = document.querySelectorAll('.portfolio-item, .skill-tag, .contact-item');
    
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px) scale(0.9)';
        el.style.transition = `all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 0.1}s`;
    });
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                
                // Special handling for About section
                if (entry.target.classList.contains('about')) {
                    triggerAboutAnimations();
                }
            }
        });
    }, observerOptions);
    
    elements.forEach(el => scrollObserver.observe(el));
    
    // Enhanced About section animations
    function triggerAboutAnimations() {
        const aboutText = document.querySelector('.about-text');
        const skillTags = document.querySelectorAll('.skill-tag');
        const aboutDescriptions = document.querySelectorAll('.about-description');
        
        if (aboutText) {
            aboutText.style.animation = 'none';
            aboutText.offsetHeight; // Trigger reflow
            aboutText.style.animation = 'fadeInUp 1s ease-out forwards';
        }
        
        // Stagger skill tag animations
        skillTags.forEach((tag, index) => {
            tag.style.animation = 'none';
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                tag.style.animation = `skillAppear 0.6s ease-out ${1.3 + index * 0.1}s forwards`;
            }, 100);
        });
        
        // Add floating effect to descriptions
        aboutDescriptions.forEach((desc, index) => {
            setTimeout(() => {
                desc.style.animation = `slideInLeft 1s ease-out forwards, floatText 4s ease-in-out ${2 + index}s infinite`;
            }, 300 + index * 200);
        });
    }
}

// Enhanced scroll animations for About section
function initAboutAnimations() {
    const aboutSection = document.querySelector('.about');
    const aboutText = document.querySelector('.about-text');
    const skillTags = document.querySelectorAll('.skill-tag');
    const aboutDescriptions = document.querySelectorAll('.about-description');
    
    if (!aboutSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger about text animations
                if (aboutText) {
                    aboutText.style.animationPlayState = 'running';
                }
                
                // Stagger skill tag animations
                skillTags.forEach((tag, index) => {
                    setTimeout(() => {
                        tag.style.animationPlayState = 'running';
                        tag.classList.add('animate-in');
                    }, index * 100);
                });
                
                // Add floating effect to descriptions
                aboutDescriptions.forEach((desc, index) => {
                    setTimeout(() => {
                        desc.style.animation = 'floatText 3s ease-in-out infinite';
                        desc.style.animationDelay = `${index * 0.5}s`;
                    }, 500);
                });
            }
        });
    }, {
        threshold: 0.3
    });
    
    observer.observe(aboutSection);
}

// Enhanced contact section animations
function initContactAnimations() {
    const contactSection = document.querySelector('.contact');
    const contactItems = document.querySelectorAll('.contact-item');
    const contactForm = document.querySelector('.contact-form');
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    if (!contactSection) return;
    
    // Create floating particles
    createContactParticles();
    
    // Scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger contact items animation
                contactItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.animationPlayState = 'running';
                        item.classList.add('animate-in');
                    }, index * 200);
                });
                
                // Trigger form animation
                if (contactForm) {
                    setTimeout(() => {
                        contactForm.style.animationPlayState = 'running';
                        contactForm.classList.add('animate-in');
                    }, 400);
                }
            }
        });
    }, {
        threshold: 0.2
    });
    
    observer.observe(contactSection);
    
    // Enhanced form interactions
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            createInputSparkles(this);
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.parentElement.classList.add('has-content');
            } else {
                this.parentElement.classList.remove('has-content');
            }
        });
    });
}

// Create floating particles for contact section
function createContactParticles() {
    const contactSection = document.querySelector('.contact');
    if (!contactSection) return;
    
    const particleCount = 9;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${10 + (i * 10)}%`;
        particle.style.animationDelay = `${-i * 2}s`;
        contactSection.appendChild(particle);
    }
}

// Create sparkle effect on input focus
function createInputSparkles(input) {
    const rect = input.getBoundingClientRect();
    const sparkleCount = 5;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'input-sparkle';
        sparkle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            animation: sparkleFloat 1s ease-out forwards;
        `;
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// Add sparkle animation CSS
function addSparkleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(0);
            }
            50% {
                opacity: 1;
                transform: translateY(-20px) scale(1);
            }
            100% {
                opacity: 0;
                transform: translateY(-40px) scale(0);
            }
        }
        
        .form-group.focused::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
            border-radius: var(--border-radius);
            opacity: 0.1;
            z-index: -1;
            animation: focusGlow 0.3s ease;
        }
        
        @keyframes focusGlow {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 0.1; transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showNotification,
        updateActiveNavLink,
        updateNavbarBackground,
        isValidEmail
    };
}