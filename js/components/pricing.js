import { select, selectAll } from '../utils.js';

export class Pricing {
    constructor(pricingData) {
        this.data = pricingData;
        this.grid = select('#pricing-grid');
        this.toggleContainer = select('.pricing-toggle-container');
        this.currentPlanType = 'personal'; // Default plan type

        if (!this.grid || !this.toggleContainer) return;

        this.init();
    }

    init() {
        this.render();
        this.setupToggle();
    }

    setupToggle() {
        this.toggleContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const planType = e.target.dataset.planType;
                if (planType === this.currentPlanType) return;

                selectAll('.plan-toggle-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentPlanType = planType;
                this.render();
            }
        });
    }

    render() {
        // Add a fade-out effect before rendering new cards
        this.grid.classList.add('fading-out');
        
        setTimeout(() => {
            const plansToRender = this.data[this.currentPlanType];
            const html = plansToRender.map(plan => this.createCardHTML(plan)).join('');
            this.grid.innerHTML = html;
            this.grid.classList.remove('fading-out');
        }, 300); // Match this timeout with the CSS transition duration
    }

    createCardHTML(plan) {
        const popularClass = plan.popular ? 'popular' : '';
        const badgeHTML = plan.popular ? `<div class="popular-badge">Best Value</div>` : '';

        return `
            <div class="pricing-card ${popularClass}" data-aos="fade-up">
                ${badgeHTML}
                <div class="pricing-card-header">
                    <h3 class="plan-name">${plan.name}</h3>
                    <p class="plan-description">${plan.description}</p>
                </div>
                <div class="price-section">
                    <span class="price-currency">$</span>
                    <span class="price-amount">${plan.price}</span>
                    <span class="price-billing">/ ${plan.billing}</span>
                </div>
                <ul class="features-list">
                    ${plan.features.map(f => `<li><i class="bi bi-check"></i> ${f}</li>`).join('')}
                </ul>
                <div class="ratings-section">
                    ${this.createRatingHTML('Performance', plan.ratings.Performance)}
                    ${this.createRatingHTML('Support', plan.ratings.Support)}
                    ${this.createRatingHTML('Devices', plan.ratings.Devices)}
                </div>
                <a href="auth.html" class="btn btn-primary choose-plan-btn" data-plan-id="${plan.id}">Get Started</a>
            </div>
        `;
    }

    createRatingHTML(feature, rating) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            starsHTML += `<i class="bi ${i <= rating ? 'bi-star-fill' : 'bi-star'}"></i>`;
        }

        return `
            <div class="rating-item">
                <span class="rating-label">${feature}</span>
                <div class="rating-stars">${starsHTML}</div>
            </div>
        `;
    }
}
