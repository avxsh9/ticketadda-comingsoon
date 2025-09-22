// ===============================
// Premium Landing Page with reCAPTCHA
// ===============================

let isLoading = false;
let countdownInterval;
let recaptchaWidget;

// Launch date (30 days from now)
const launchDate = new Date();
launchDate.setDate(launchDate.getDate() + 30);

// ===============================
// Initialize everything
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initCountdown();
    initRecaptcha();
    initEmailForm();
    initSocialLinks();
});

// ===============================
// Smooth fade-in animations
// ===============================
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach((el, index) => {
        // Stagger animations
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// ===============================
// Countdown timer
// ===============================
function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        } else {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
        }
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 60000); // Update every minute
}

// ===============================
// Initialize invisible reCAPTCHA
// ===============================
function initRecaptcha() {
    window.onRecaptchaLoad = function() {
        if (typeof grecaptcha !== 'undefined') {
            try {
                recaptchaWidget = grecaptcha.render('recaptcha-container', {
                    'sitekey': '6LdTGdErAAAAACKRx6BiNY6nHM3wjFABi9v5TCNp', // Your site key
                    'size': 'invisible',
                    'callback': onRecaptchaSuccess,
                    'error-callback': onRecaptchaError,
                    'expired-callback': onRecaptchaExpired
                });
            } catch (error) {
                console.error('reCAPTCHA initialization error:', error);
            }
        }
    };

    if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
        onRecaptchaLoad();
    }
}


// ===============================
// reCAPTCHA callbacks
// ===============================
function onRecaptchaSuccess(token) {
    submitFormWithCaptcha(token);
}

function onRecaptchaError() {
    showMessage('reCAPTCHA error occurred. Please try again.', 'error');
    resetForm();
}

function onRecaptchaExpired() {
    showMessage('reCAPTCHA expired. Please try again.', 'error');
    resetForm();
}

// ===============================
// Email form handling
// ===============================
function initEmailForm() {
    const form = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const submitBtn = document.getElementById('submitBtn');

    if (!form || !emailInput || !submitBtn) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleEmailSubmission();
    });

    // Real-time email validation
    emailInput.addEventListener('input', function() {
        clearMessages();
        validateEmailInput(this.value);
    });

    // Enter key handling
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleEmailSubmission();
        }
    });
}

// ===============================
// Handle email submission
// ===============================
function handleEmailSubmission() {
    if (isLoading) return;

    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();

    // Validate email
    if (!email) {
        showMessage('Please enter your email address', 'error');
        emailInput.focus();
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        emailInput.focus();
        return;
    }

    // Show loading state
    setLoadingState(true);

    // Execute reCAPTCHA
    try {
        grecaptcha.execute(recaptchaWidget);
    } catch (error) {
        showMessage('reCAPTCHA not loaded. Please refresh the page.', 'error');
        setLoadingState(false);
    }
}

// ===============================
// Submit form with captcha token
// ===============================
function submitFormWithCaptcha(captchaToken) {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('g-recaptcha-response', captchaToken);

    fetch('verify.php', {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => response.text())
    .then(data => {
        setLoadingState(false);

        if (data.includes('successfully') || data.includes('Captcha Passed')) {
            showMessage('🎉 Success! You\'ll be notified when we launch.', 'success');
            resetForm();
        } else if (data.includes('already exists') || data.includes('already subscribed')) {
            showMessage('You\'re already on our list! Thanks for your interest.', 'error');
            resetForm();
        } else {
            throw new Error(data);
        }
    })
    .catch(error => {
        console.error('Submission error:', error);
        setLoadingState(false);
        showMessage('Something went wrong. Please try again.', 'error');

        // Reset reCAPTCHA on error
        try {
            grecaptcha.reset(recaptchaWidget);
        } catch (e) {
            console.log('reCAPTCHA reset error:', e);
        }
    });
}

// ===============================
// Form utilities
// ===============================
function setLoadingState(loading) {
    isLoading = loading;
    const submitBtn = document.getElementById('submitBtn');

    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function resetForm() {
    const emailInput = document.getElementById('emailInput');
    emailInput.value = '';
    setLoadingState(false);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateEmailInput(email) {
    const emailInput = document.getElementById('emailInput');

    if (email && !isValidEmail(email)) {
        emailInput.style.borderColor = 'rgba(255, 69, 58, 0.5)';
    } else {
        emailInput.style.borderColor = '';
    }
}

// ===============================
// Message handling
// ===============================
function showMessage(text, type) {
    clearMessages();

    const messageEl = document.getElementById(type === 'success' ? 'successMessage' : 'errorMessage');
    if (!messageEl) return;

    messageEl.textContent = text;
    messageEl.classList.add('show');

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 5000);
}

function clearMessages() {
    const successEl = document.getElementById('successMessage');
    const errorEl = document.getElementById('errorMessage');

    if (successEl) successEl.classList.remove('show');
    if (errorEl) errorEl.classList.remove('show');
}

// ===============================
// Social links
// ===============================
function initSocialLinks() {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const social = this.dataset.social;
            let url = '#';

            switch (social) {
                case 'twitter':
                    url = 'https://twitter.com/yourhandle';
                    break;
                case 'facebook':
                    url = 'https://facebook.com/yourpage';
                    break;
                case 'instagram':
                    url = 'https://instagram.com/yourhandle';
                    break;
                case 'linkedin':
                    url = 'https://linkedin.com/company/yourcompany';
                    break;
            }

            if (url !== '#') {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
    });
}

// ===============================
// Cleanup on page unload
// ===============================
window.addEventListener('beforeunload', function() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
});

// ===============================
// Error handling for reCAPTCHA
// ===============================
window.addEventListener('error', function(e) {
    if (e.message && e.message.includes('recaptcha')) {
        console.log('reCAPTCHA loading issue detected');
    }
});