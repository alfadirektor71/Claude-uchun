// ===== MAIN LANDING PAGE JAVASCRIPT =====

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    if (!hamburger?.contains(e.target) && !navMenu?.contains(e.target)) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar?.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar?.classList.contains('scroll-down')) {
        navbar?.classList.remove('scroll-up');
        navbar?.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar?.classList.contains('scroll-down')) {
        navbar?.classList.remove('scroll-down');
        navbar?.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Animate stats on scroll
const statsSection = document.querySelector('.stats');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;
        const duration = 2000;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                stat.textContent = formatNumber(Math.floor(current));
            }
        }, stepTime);
    });
    
    statsAnimated = true;
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            
            // Animate stats when stats section is visible
            if (entry.target.classList.contains('stats')) {
                animateStats();
            }
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('scroll-animate');
    sectionObserver.observe(section);
});

// Contact form handler
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !subject || !message) {
        alert('Iltimos, barcha maydonlarni to\'ldiring');
        return;
    }
    
    // In a real application, send this to a server
    console.log('Contact form submitted:', { name, email, subject, message });
    
    alert('Xabaringiz yuborildi! Tez orada siz bilan bog\'lanamiz.');
    this.reset();
});

// Service card hover effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Price card hover effect
document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.03)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Testimonial slider (simple version)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

function showTestimonial(index) {
    testimonials.forEach((card, i) => {
        if (i === index) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        } else {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
        }
    });
}

// Auto-rotate testimonials
if (testimonials.length > 0) {
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
}

// Floating animation for hero cards
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.5}s`;
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroIllustration = document.querySelector('.hero-illustration');
    
    if (heroIllustration) {
        heroIllustration.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.001})`;
        heroIllustration.style.opacity = 1 - scrolled * 0.001;
    }
});

// Lazy loading images (if needed)
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Copy to clipboard for promo code
document.querySelectorAll('.promo-code')?.forEach(code => {
    code.addEventListener('click', function() {
        const text = this.textContent;
        navigator.clipboard.writeText(text).then(() => {
            alert(`Promo kod nusxalandi: ${text}`);
        });
    });
});

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Check if user is logged in and update navbar
window.addEventListener('DOMContentLoaded', function() {
    const user = userManager.getCurrentUser();
    const navButtons = document.querySelector('.nav-buttons');
    
    if (user && navButtons) {
        navButtons.innerHTML = `
            <a href="dashboard.html" class="btn btn-primary">
                <i class="fas fa-tachometer-alt"></i>
                Dashboard
            </a>
        `;
    }
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// FAQ accordion (if exists)
document.querySelectorAll('.faq-question')?.forEach(question => {
    question.addEventListener('click', function() {
        const parent = this.parentElement;
        const answer = parent.querySelector('.faq-answer');
        
        parent.classList.toggle('active');
        
        if (parent.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = '0';
        }
    });
});

// Newsletter form
document.getElementById('newsletterForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    if (email) {
        alert('Obunangiz uchun rahmat! Tez orada sizga xat yuboramiz.');
        this.reset();
    }
});

console.log('Main.js loaded successfully');
