// Email subscription functionality
let isSubmitted = false;
let isLoading = false;

const SERVICE_ID = "service_mkonnv9";
const TEMPLATE_ID = "template_a6rw28w";
const PUBLIC_KEY = "kAZQ9dMKCEOt54Z8l";


// Smooth scroll and fade-in animations
function initAnimations() {
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

    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Show popup messages
function showMessage(text, type) {
    const existingMessage = document.querySelector('.message');
    if (existingMessage) existingMessage.remove();
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => message.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        message.style.transform = 'translateX(100%)';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Handle email submission
function handleEmailSubmission(e) {
    e.preventDefault();

    const emailInput = document.getElementById('emailInput');
    const submitBtn = document.getElementById('submitBtn');
    const email = emailInput.value.trim();

    if (!email || isLoading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    isLoading = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // 1️⃣ Send email to YOU (admin)
    const adminPromise = emailjs.send(
        'service_mkonnv9',       // new Gmail service ID
        'template_a6rw28w',      // your template ID
        { user_email: email, type: 'admin' },   // template params for admin
        'kAZQ9dMKCEOt54Z8l'      // new public key
    );

    // 2️⃣ Send email to USER (subscriber)
    const userPromise = emailjs.send(
        'service_mkonnv9',
        'template_a6rw28w',      // same template ID, can customize template for user
        { user_email: email, type: 'user' },    // template params for user
        'kAZQ9dMKCEOt54Z8l'
    );
    emailjs.send(SERVICE_ID, TEMPLATE_ID, { user_email: email }, PUBLIC_KEY)

    Promise.all([adminPromise, userPromise])
        .then(() => {
            isLoading = false;
            submitBtn.textContent = 'Sent!';
            emailInput.value = '';
            showMessage("Thanks! You'll get a confirmation email shortly.", 'success');

            setTimeout(() => {
                submitBtn.textContent = 'Notify Me';
                submitBtn.disabled = false;
            }, 2000);
        })
        .catch((err) => {
            console.log("EmailJS error:", err);
            isLoading = false;
            submitBtn.textContent = 'Notify Me';
            submitBtn.disabled = false;
            showMessage('Error sending email. Try again.', 'error');
        });
}




// Handle social clicks
function openSocial(url) {
    window.open(url, '_blank');
}

// Init everything
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    
    const form = document.getElementById('emailForm');
    if (form) form.addEventListener('submit', handleEmailSubmission);
    
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            openSocial(this.href);
        });
    });
});
