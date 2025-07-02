import { select } from '../utils.js';

/**
 * Manages the social proof notifications that appear at the bottom-left of the screen.
 * This creates a sense of a busy and trusted service.
 */
export class ProofNotifications {
    constructor() {
        this.container = select('#proof-notifications-container');
        if (!this.container) return;

        // A pool of realistic-looking data to pull from.
        this.locations = ["Los Angeles, CA", "London, UK", "Sydney, AU", "Toronto, CA", "Berlin, DE", "New York, NY", "Paris, FR", "Dubai, UAE", "Dallas, TX", "Singapore", "Madrid, ES", "Amsterdam, NL"];
        this.plans = ["Premium Access", "Standard Access", "Family Premium", "Premium Access"]; // Weight the most popular plan

        // Don't show notifications on mobile for a cleaner experience
        if (window.innerWidth > 768) {
            this.init();
        }
    }

    init() {
        // Start showing notifications after an initial delay to let the user settle in.
        setTimeout(() => {
            this.startNotificationLoop();
        }, 8000); // Wait 8 seconds before the first notification
    }

    /**
     * Creates a loop that shows a notification at random intervals.
     */
    startNotificationLoop() {
        this.showNotification();

        // Schedule the next notification at a random interval to feel more natural and less robotic.
        const nextInterval = (Math.random() * 12 + 8) * 1000; // Between 8 and 20 seconds
        setTimeout(() => this.startNotificationLoop(), nextInterval);
    }

    /**
     * Creates and displays a single notification element.
     */
    showNotification() {
        // Pick random data from our pools
        const randomLocation = this.locations[Math.floor(Math.random() * this.locations.length)];
        const randomPlan = this.plans[Math.floor(Math.random() * this.plans.length)];
        const timeAgo = Math.floor(Math.random() * 10) + 2; // e.g., "5 minutes ago"

        // Create the notification HTML element
        const notificationEl = document.createElement('div');
        notificationEl.className = 'proof-notification';
        notificationEl.innerHTML = `
            <div class="icon">
                <i class="bi bi-patch-check-fill"></i>
            </div>
            <div class="content">
                <p>Someone from <strong>${randomLocation}</strong> just subscribed to the <strong>${randomPlan}</strong>.</p>
                <small>${timeAgo} minutes ago</small>
            </div>
            <button class="close-btn" aria-label="Close notification">×</button>
        `;

        // Add the new notification to the container
        this.container.appendChild(notificationEl);
        
        // Add a click event to the close button to remove the notification immediately
        notificationEl.querySelector('.close-btn').addEventListener('click', () => {
            notificationEl.remove();
        });

        // The notification will be removed automatically by the CSS animation,
        // but we also clean it up from the DOM afterwards just in case.
        setTimeout(() => {
            if (notificationEl) {
                notificationEl.remove();
            }
        }, 5000); // 5 seconds total lifetime (must match the CSS animation duration)
    }
}
