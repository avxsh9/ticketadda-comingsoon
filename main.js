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

    // Observe all animated elements
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Email subscription handler
function handleEmailSubmission(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const submitBtn = document.getElementById('submit-btn');
    const email = emailInput.value.trim();
    
    if (!email || isLoading) return;
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    isLoading = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        isLoading = false;
        isSubmitted = true;
        
        submitBtn.textContent = 'Sent!';
        emailInput.value = '';
        
        showMessage('Thank you! We\'ll notify you when we launch.', 'success');
        
        setTimeout(() => {
            submitBtn.textContent = 'Notify Me';
            submitBtn.disabled = false;
            isSubmitted = false;
        }, 2000);
    }, 1000);
}

// Show message function
function showMessage(text, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
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
    
    // Animate in
    setTimeout(() => {
        message.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        message.style.transform = 'translateX(100%)';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Social media click handlers
function openSocial(platform) {
    const urls = {
        linkedin: 'https://linkedin.com/company/ticketadda',
        instagram: 'https://instagram.com/ticketadda',
        twitter: 'https://twitter.com/ticketadda'
    };
    
    if (urls[platform]) {
        window.open(urls[platform], '_blank');
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Add form event listener
    const form = document.getElementById('email-form');
    if (form) {
        form.addEventListener('submit', handleEmailSubmission);
    }
    
    // Add social media event listeners
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            openSocial(platform);
        });
    });
    
    // Add input focus effects
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#007AFF';
            this.parentElement.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.1)';
        });
        
        emailInput.addEventListener('blur', function() {
            this.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            this.parentElement.style.boxShadow = 'none';
        });
    }
});
