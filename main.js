// Email subscription functionality
let isSubmitted = false;
let isLoading = false;

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
    
    emailjs.send('service_s1wnsp8', 'template_vjnh88v', { user_email: email }, 'nRRLaf6LXw6OLVSgZ')

    .then(() => {
        isLoading = false;
        isSubmitted = true;
        submitBtn.textContent = 'Sent!';
        emailInput.value = '';
        showMessage("Thanks for reaching out! We'll notify you when we launch.", 'success');
        
        setTimeout(() => {
            submitBtn.textContent = 'Notify Me';
            submitBtn.disabled = false;
            isSubmitted = false;
        }, 2000);
    })
    .catch((err) => {
        console.log(err);
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
