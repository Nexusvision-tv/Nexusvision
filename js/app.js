import { onReady } from './utils.js';
import { initializeAnimations } from './components/animations.js';
import { Header } from './components/header.js';
import { Pricing } from './components/pricing.js';
import { FAQ } from './components/faq.js';
import { ExitIntent } from './components/exitIntent.js';
import { ProofNotifications } from './components/proofNotifications.js';

/**
 * The main App class that controls the entire application.
 * It fetches initial data and initializes all components.
 */
class App {
    constructor() {
        this.init();
    }

    async init() {
        try {
            // Wait for the DOM to be ready before doing anything
            await new Promise(resolve => onReady(resolve));
            
            // Fetch the main data for the application
           // L'CODE L'SAHIH L'NIHA2I
const data = await this.fetchData('data.json');
            
            // Initialize all components with the data they need
            this.initComponents(data);
            
            // Initialize global animations
            initializeAnimations();
            
            console.log("NexusVision App Initialized Successfully.");

        } catch (error) {
            console.error("Failed to initialize the application:", error);
            // Optionally, display a user-friendly error message on the page
            document.body.innerHTML = `<div style="color: white; text-align: center; padding-top: 50px;"><h1>Error</h1><p>Could not load application data. Please try again later.</p></div>`;
        }
    }

    /**
     * Fetches data from a given URL.
     * @param {string} url - The URL of the data file (e.g., 'data.json').
     * @returns {Promise<Object>} - A promise that resolves to the JSON data.
     */
    async fetchData(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * Initializes all the different parts (components) of the application.
     * @param {Object} data - The fetched application data.
     */
    initComponents(data) {
        // Each component is responsible for a specific part of the page.
        new Header(data.navLinks);
        new Pricing(data.pricingPlans);
        new FAQ(data.faq);
        new ExitIntent();
        new ProofNotifications();
        // Add other components here as the app grows
    }
}

// Create a new instance of the App to start everything.
new App();
