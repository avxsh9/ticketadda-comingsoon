// ===============================
// Global Variables
// ===============================
let isLoading = false;
let countdownInterval;

const SERVICE_ID = "service_mkonnv9";
const TEMPLATE_ID = "template_a6rw28w";
const PUBLIC_KEY = "kAZQ9dMKCEOt54Z8l";
// Set launch date to January 1, 2026, 00:00:00
const launchDate = new Date('January 1, 2026 00:00:00').getTime();

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
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach(el => {
        // Initial state handled by CSS, observer adds 'visible' class
        observer.observe(el);
    });
}

// ===============================
// Show popup messages
// ===============================
function showMessage(text, type) {
    const messageContainer = document.getElementById("messageContainer");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    // Hide any currently visible messages
    successMessage.classList.remove("show");
    errorMessage.classList.remove("show");

    let targetMessage;
    if (type === "success") {
        targetMessage = successMessage;
    } else {
        targetMessage = errorMessage;
    }

    targetMessage.textContent = text;
    targetMessage.classList.add("show");

    setTimeout(() => {
        targetMessage.classList.remove("show");
    }, 4000); // Message visible for 4 seconds
}

// ===============================
// Handle email submission (SIRF EK BAAR EMAIL SEND HOGA)
// ===============================
function handleEmailSubmission(e) {
    e.preventDefault();

    const emailInput = document.getElementById("emailInput");
    const submitBtn = document.getElementById("submitBtn");
    const email = emailInput.value.trim();

    if (!email || isLoading) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address", "error");
        return;
    }

    isLoading = true;
    submitBtn.classList.add("loading"); // Add loading class for spinner
    submitBtn.disabled = true;

    // Sirf ek baar email send karne ka code
    emailjs.send(SERVICE_ID, TEMPLATE_ID, { user_email: email }, PUBLIC_KEY)
        .then(() => {
            isLoading = false;
            submitBtn.classList.remove("loading");
            submitBtn.querySelector(".btn-text").textContent = "Sent!"; // Update text
            emailInput.value = "";
            showMessage("Thanks! You'll get a confirmation email shortly.", "success");

            setTimeout(() => {
                submitBtn.querySelector(".btn-text").textContent = "Notify Me"; // Reset text
                submitBtn.disabled = false;
            }, 2000);
        })
        .catch((err) => {
            console.error("EmailJS error:", err);
            isLoading = false;
            submitBtn.classList.remove("loading");
            submitBtn.querySelector(".btn-text").textContent = "Notify Me"; // Reset text
            submitBtn.disabled = false;
            showMessage("Error sending email. Please try again.", "error");
        });
}

// ===============================
// Handle social clicks (now in footer)
// ===============================
function openSocial(url) {
    window.open(url, "_blank");
}

// ===============================
// Countdown Timer Logic
// ===============================
function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
            if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        } else {
            // If countdown is over
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            clearInterval(countdownInterval);
            // Optionally, update launch badge or show a "Launched!" message
            const launchBadge = document.querySelector('.launch-badge span');
            if (launchBadge) launchBadge.textContent = '🎉 We are LIVE!';
        }
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

// ===============================
// Primary CTA Button Scroll
// ===============================
function setupPrimaryCtaScroll() {
    const primaryCtaBtn = document.getElementById('primaryCtaBtn');
    const emailSubscriptionSection = document.getElementById('emailSubscriptionSection');

    if (primaryCtaBtn && emailSubscriptionSection) {
        primaryCtaBtn.addEventListener('click', (e) => {
            e.preventDefault();
            emailSubscriptionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Optionally focus the email input after scrolling
            setTimeout(() => {
                const emailInput = document.getElementById('emailInput');
                if (emailInput) emailInput.focus();
            }, 600); // Adjust timeout to match scroll duration
        });
    }
}

// ===============================
// Initialize everything when the page loads
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    initAnimations();
    initCountdown();
    setupPrimaryCtaScroll();

    const form = document.getElementById("emailForm");
    if (form) form.addEventListener("submit", handleEmailSubmission);

    // Event listeners for social links in the footer
    document.querySelectorAll(".social-links a").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            openSocial(this.href);
        });
    });
});
