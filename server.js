import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

// reCAPTCHA configuration
const RECAPTCHA_SECRET = "6LdAENErAAAAAK84S40CIQYddKSH0ed6cm9Etp_4";

// Handle form submission
app.post('/submit.php', async (req, res) => {
    try {
        // Get form data
        const { email, 'g-recaptcha-response': recaptchaResponse } = req.body;
        const remoteip = req.ip || req.connection.remoteAddress;

        // Basic validation
        if (!email) {
            return res.status(400).send("Email address is required");
        }

        if (!recaptchaResponse) {
            return res.status(400).send("reCAPTCHA verification is required");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send("Invalid email address format");
        }

        // Verify reCAPTCHA
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
        const verifyData = new URLSearchParams({
            secret: RECAPTCHA_SECRET,
            response: recaptchaResponse,
            remoteip: remoteip
        });

        const verifyResponse = await fetch(verifyUrl, {
            method: 'POST',
            body: verifyData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const captchaResult = await verifyResponse.json();

        if (!captchaResult.success) {
            const errorCodes = captchaResult['error-codes'] || ['unknown-error'];
            let errorMessage = "reCAPTCHA verification failed";
            
            if (errorCodes.includes('timeout-or-duplicate')) {
                errorMessage = "reCAPTCHA timeout. Please try again.";
            } else if (errorCodes.includes('invalid-input-response')) {
                errorMessage = "Invalid reCAPTCHA response. Please try again.";
            }
            
            return res.status(400).send(errorMessage);
        }

        // Check for duplicate emails
        const emailFile = 'subscribers.txt';
        if (fs.existsSync(emailFile)) {
            const existingEmails = fs.readFileSync(emailFile, 'utf8');
            if (existingEmails.includes(email)) {
                return res.send("Email already exists in our system. You're already subscribed!");
            }
        }

        // Save email to file
        const timestamp = new Date().toISOString();
        const subscriberData = {
            email: email,
            timestamp: timestamp,
            ip: remoteip,
            userAgent: req.get('User-Agent') || 'unknown',
            captchaScore: captchaResult.score || 1.0
        };

        const line = JSON.stringify(subscriberData) + '\n';
        
        try {
            fs.appendFileSync(emailFile, line);
            console.log(`New subscriber: ${email} at ${timestamp}`);
            res.send(`Captcha Passed! Form submitted successfully for ${email}`);
        } catch (writeError) {
            console.error('Failed to save subscription:', writeError);
            res.status(500).send("Failed to save subscription. Please try again.");
        }

    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).send("A system error occurred. Please try again later.");
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Open your browser and navigate to the URL above');
});