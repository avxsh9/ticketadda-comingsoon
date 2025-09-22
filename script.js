// ===============================
// Global Variables
// ===============================
let isLoading = false;
let countdownInterval;

const SERVICE_ID = "service_mkonnv9";
const TEMPLATE_ID = "template_a6rw28w";
const PUBLIC_KEY = "kAZQ9dMKCEOt54Z8l";
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
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        observer.observe(el);
    });
}

// ===============================
// Show popup messages
// ===============================
function showMessage(text, type) {
    const existingMessage = document.querySelector(".message");
    if (existingMessage) existingMessage.remove();

    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        color: #fff;
        font-weight: bold;
        border-radius: 6px;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        ${type === "success" ? "background: #10b981;" : "background: #ef4444;"}
    `;
    document.body.appendChild(message);

    setTimeout(() => message.style.transform = "translateX(0)", 100);
    setTimeout(() => {
        message.style.transform = "translateX(100%)";
        setTimeout(() => message.remove(), 300);
    }, 3000);
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
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Sirf ek baar email send karne ka code
    emailjs.send(SERVICE_ID, TEMPLATE_ID, { user_email: email }, PUBLIC_KEY)
        .then(() => {
            isLoading = false;
            submitBtn.textContent = "Sent!";
            emailInput.value = "";
            showMessage("Thanks! You'll get a confirmation email shortly.", "success");

            setTimeout(() => {
                submitBtn.textContent = "Notify Me";
                submitBtn.disabled = false;
            }, 2000);
        })
        .catch((err) => {
            console.log("EmailJS error:", err);
            isLoading = false;
            submitBtn.textContent = "Notify Me";
            submitBtn.disabled = false;
            showMessage("Error sending email. Try again.", "error");
        });
}

// ===============================
// Handle social clicks
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
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            clearInterval(countdownInterval);
        }
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}


// ===============================
// Initialize everything when the page loads
// ===============================
document.addEventListener("DOMContentLoaded", function() {
    initAnimations();
    initCountdown(); // Timer ko chalu karein

    const form = document.getElementById("emailForm");
    if (form) form.addEventListener("submit", handleEmailSubmission);

    document.querySelectorAll(".social-link").forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            openSocial(this.href);
        });
    });
});
