import { select, selectAll } from '../utils.js';

/**
 * Manages the FAQ section, including dynamic rendering and accordion functionality.
 */
export class FAQ {
    constructor(faqData) {
        this.data = faqData;
        this.container = select('#faq-accordion');
        
        if (!this.container) return;

        this.init();
    }

    init() {
        this.render();
        this.addEventListeners();
        this.openDefaultItem();
    }

    /**
     * Renders the FAQ items into the container from the data file.
     */
    render() {
        // We add the 'data-aos' attributes directly here for the animations
        const html = this.data.map((item, index) => `
            <div class="faq-item" data-aos="fade-up" data-aos-delay="${100 + index * 50}">
                <button class="faq-question">
                    <span>${item.question}</span>
                    <i class="bi bi-plus-lg"></i>
                </button>
                <div class="faq-answer">
                    <p>${item.answer}</p>
                </div>
            </div>
        `).join('');
        this.container.innerHTML = html;
    }

    /**
     * Adds a single event listener to the container to handle all clicks (event delegation).
     */
    addEventListeners() {
        this.container.addEventListener('click', (e) => {
            const questionBtn = e.target.closest('.faq-question');
            if (!questionBtn) return; // Exit if the click was not on a question button

            const faqItem = questionBtn.parentElement;
            this.toggleItem(faqItem);
        });
    }

    /**
     * Toggles a single FAQ item open or closed.
     * @param {Element} itemToToggle - The .faq-item element to be toggled.
     */
    toggleItem(itemToToggle) {
        const wasActive = itemToToggle.classList.contains('active');

        // First, close all currently active items
        selectAll('.faq-item.active').forEach(activeItem => {
            if (activeItem !== itemToToggle) {
                this.closeItem(activeItem);
            }
        });

        // Then, toggle the clicked item
        if (wasActive) {
            this.closeItem(itemToToggle);
        } else {
            this.openItem(itemToToggle);
        }
    }

    openItem(item) {
        item.classList.add('active');
        const answer = select('.faq-answer', item);
        const icon = select('.faq-question i', item);
        // Set max-height to the element's scroll height to create the expand animation
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.classList.replace('bi-plus-lg', 'bi-dash-lg');
    }
    
    closeItem(item) {
        item.classList.remove('active');
        const answer = select('.faq-answer', item);
        const icon = select('.faq-question i', item);
        // Collapse the element by setting max-height to 0
        answer.style.maxHeight = '0px';
        icon.classList.replace('bi-dash-lg', 'bi-plus-lg');
    }

    /**
     * Finds and opens the FAQ item marked as 'openByDefault' in the data.
     */
    openDefaultItem() {
        const defaultItemIndex = this.data.findIndex(item => item.openByDefault);
        if (defaultItemIndex !== -1) {
            const defaultFaqItem = this.container.children[defaultItemIndex];
            if (defaultFaqItem) {
                // Use a small timeout to ensure the initial render is complete
                // and scrollHeight calculations are correct.
                setTimeout(() => {
                    this.openItem(defaultFaqItem);
                }, 300);
            }
        }
    }
}
