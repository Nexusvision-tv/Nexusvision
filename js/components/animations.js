import { selectAll } from '../utils.js';

/**
 * Initializes all global animations and interactive effects for the site.
 */
export function initializeAnimations() {
    // Initialize Animate On Scroll (AOS) library with some default settings.
    AOS.init({
        duration: 800,  // Animation duration in milliseconds
        once: true,     // Whether animation should happen only once - while scrolling down
        offset: 50,     // Offset (in px) from the original trigger point
        delay: 100,     // A small delay for all animations
    });

    // Initialize magnetic buttons effect using GSAP
    setupMagneticButtons();
}

/**
 * Attaches a magnetic effect to all elements with the 'data-magnetic' attribute.
 * The element follows the mouse cursor slightly when hovered over.
 */
function setupMagneticButtons() {
    const magneticElements = selectAll('[data-magnetic]');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', function(e) {
            // Get the position of the element and the cursor
            const pos = this.getBoundingClientRect();
            const x = e.clientX - pos.left - pos.width / 2;
            const y = e.clientY - pos.top - pos.height / 2;

            // Use GSAP to animate the element's position
            gsap.to(this, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.7,
                ease: "power3.out"
            });
        });

        // Add a mouseout event to return the button to its original position
        el.addEventListener('mouseout', function(e) {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: "elastic.out(1, 0.3)" // A bouncy return effect
            });
        });
    });
}
