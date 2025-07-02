import { select } from '../utils.js';

/**
 * Manages the exit-intent modal functionality.
 * It detects when a user is about to leave the page and shows a special offer.
 */
export class ExitIntent {
    constructor() {
        this.modal = select('#exitIntentModal');
        if (!this.modal) return;

        // --- CONDITIONS TO PREVENT THE MODAL FROM SHOWING ---
        // 1. Don't run on mobile devices (exit intent is not reliable)
        if (window.innerWidth < 768) {
            return;
        }
        // 2. Don't run if it has already been shown in this session
        if (sessionStorage.getItem('exitIntentShown')) {
            return;
        }

        // If all conditions pass, initialize the component.
        this.init();
    }

    init() {
        this.renderModalContent();
        // Give the user a few seconds on the page before activating the listener
        // to avoid triggering it accidentally on page load.
        setTimeout(() => {
            document.body.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        }, 5000); // 5-second delay
    }

    /**
     * Injects the HTML content into the modal container.
     */
    renderModalContent() {
        this.modal.innerHTML = `
            <div class="modal-content">
                <div class="icon-container">
                    <i class="bi bi-gift-fill"></i>
                </div>
                <h3>Wait! Don't Go...</h3>
                <p>As a thank you for visiting, here's an <span class="highlight">EXCLUSIVE 20% DISCOUNT</span> on your first year.</p>
                <a href="#plans" class="btn btn-special" id="claimExitOfferBtn">Claim My 20% Discount</a>
                <a href="#" class="decline-link" id="declineExitOfferBtn">No thanks, I'll pay full price</a>
            </div>
        `;

        // Add event listeners to the new buttons
        select('#claimExitOfferBtn', this.modal).addEventListener('click', () => this.hide());
        select('#declineExitOfferBtn', this.modal).addEventListener('click', (e) => {
            e.preventDefault();
            this.hide();
        });
    }
    
    /**
     * The main event handler that checks if the mouse is leaving the viewport.
     * @param {MouseEvent} e - The mouse event object.
     */
    handleMouseLeave(e) {
        // Trigger if the mouse cursor is near the top of the viewport
        if (e.clientY <= 10) {
            this.show();
            // IMPORTANT: Remove the listener after triggering to ensure it only shows once
            document.body.removeEventListener('mouseleave', this.handleMouseLeave);
        }
    }
    
    /**
     * Displays the modal with a fade-in effect.
     */
    show() {
        // Double-check it's not already visible or hasn't been shown
        if (this.modal.classList.contains('visible') || sessionStorage.getItem('exitIntentShown')) {
            return;
        }

        sessionStorage.setItem('exitIntentShown', 'true');
        this.modal.classList.add('visible');
        document.body.classList.add('modal-open');
    }

    /**
     * Hides the modal.
     */
    hide() {
        this.modal.classList.remove('visible');
        document.body.classList.remove('modal-open');
    }
}
