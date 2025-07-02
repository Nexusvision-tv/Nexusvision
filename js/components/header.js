import { select, selectAll } from '../utils.js';

/**
 * Manages all functionalities related to the website's header,
 * including navigation, sticky effects, and mobile menu.
 */
export class Header {
    constructor(navLinksData) {
        this.navLinksData = navLinksData;
        this.headerEl = select('.header');
        this.mainNavContainer = select('.main-nav');
        this.mobileNavContainer = select('.mobile-nav');
        this.mobileNavToggle = select('.mobile-nav-toggle');

        if (!this.headerEl) return;

        this.init();
    }

    init() {
        this.populateNav();
        this.setupEventListeners();
    }

    /**
     * Fills the navigation containers with links from the data file.
     */
    populateNav() {
        const linksHtml = this.navLinksData.map(link => 
            `<a href="${link.href}" class="nav-link">${link.text}</a>`
        ).join('');

        this.mainNavContainer.innerHTML = linksHtml;
        // For mobile, we add the same links plus a "Get Started" button
        this.mobileNavContainer.innerHTML = linksHtml + `<a href="auth.html" class="btn btn-primary">Client Login</a>`;
    }

    /**
     * Sets up all necessary event listeners for the header.
     */
    setupEventListeners() {
        // 1. Sticky header effect on scroll
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // 2. Mobile navigation toggle
        this.mobileNavToggle.addEventListener('click', this.toggleMobileNav.bind(this));
        
        // 3. Close mobile nav when a link is clicked
        this.mobileNavContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.closeMobileNav();
            }
        });
    }

    /**
     * Adds/removes the 'scrolled' class to the header based on scroll position.
     */
    handleScroll() {
        if (window.scrollY > 50) {
            this.headerEl.classList.add('scrolled');
        } else {
            this.headerEl.classList.remove('scrolled');
        }
    }

    /**
     * Toggles the active state for the mobile navigation menu.
     */
    toggleMobileNav() {
        this.mobileNavContainer.classList.toggle('active');
        const icon = this.mobileNavToggle.querySelector('i');
        icon.classList.toggle('bi-list');
        icon.classList.toggle('bi-x-lg');
    }

    /**
     * Explicitly closes the mobile navigation menu.
     */
    closeMobileNav() {
        this.mobileNavContainer.classList.remove('active');
        const icon = this.mobileNavToggle.querySelector('i');
        icon.classList.add('bi-list');
        icon.classList.remove('bi-x-lg');
    }
}
