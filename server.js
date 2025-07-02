// Load environment variables from .env file
require('dotenv').config();

// Import all necessary packages
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Import local modules
const User = require('./models/User');
const authMiddleware = require('./authMiddleware');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch(err => console.error('MongoDB Connection Error:', err));


// --- MIDDLEWARE CONFIGURATION ---

// CORS Configuration to allow requests only from our frontend
const allowedOrigins = [
    'http://127.0.0.1:5500', // For local development
    process.env.FRONTEND_URL  // For production (e.g., your Netlify URL)
];
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};
app.use(cors(corsOptions));

// Special route for Stripe Webhook - MUST be before express.json()
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            await handleSubscriptionCreation(event.data.object);
            break;
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
            await handleSubscriptionChange(event.data.object);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.json({received: true});
});

// Standard middleware to parse JSON request bodies
app.use(express.json());


// --- API ROUTES ---

// Public Routes (No authentication needed)
app.post('/api/signup', async (req, res) => { /* ... signup logic ... */ });
app.post('/api/login', async (req, res) => { /* ... login logic ... */ });

// Protected Routes (Authentication required)
app.use(authMiddleware); // Apply middleware to all routes below this line

app.post('/api/create-checkout-session', async (req, res) => { /* ... checkout session logic ... */ });
app.get('/api/dashboard', async (req, res) => { /* ... dashboard data logic ... */ });


// --- START THE SERVER ---
app.listen(PORT, () => {
    console.log(`NexusVision server listening at http://localhost:${PORT}`);
});


// --- HELPER FUNCTIONS ---
// (Paste the complete logic for all functions from the previous steps here)
// e.g., handleSubscriptionCreation, handleSubscriptionChange, login logic, signup logic, etc.
