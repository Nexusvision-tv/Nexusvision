const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    stripeCustomerId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple documents to have a null value for this field
    },
    subscription: {
        id: String,
        status: String, // e.g., 'active', 'canceled', 'past_due'
        planId: String, // The Stripe Price ID
        current_period_end: Date
    }
}, {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;
