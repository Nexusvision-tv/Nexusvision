import { select, selectAll } from './utils.js';

/**
 * Manages the entire authentication page, including form switching,
 * validation, and communication with the backend API.
 */
class AuthPage {
    constructor() {
        this.cacheDOMElements();
        this.setupEventListeners();
        this.setupValidators();
    }

    /**
     * Finds and stores all necessary DOM elements for quick access.
     */
    cacheDOMElements() {
        this.forms = {
            login: select('#loginForm'),
            signup: select('#signupForm')
        };
        this.buttons = {
            showLogin: select('#showLoginBtn'),
            showSignup: select('#showSignupBtn'),
            loginSubmit: select('#loginSubmitBtn'),
            signupSubmit: select('#signupSubmitBtn')
        };
        this.inputs = {
            loginEmail: select('#loginEmail'),
            loginPassword: select('#loginPassword'),
            signupEmail: select('#signupEmail'),
            signupPassword: select('#signupPassword'),
            signupConfirmPassword: select('#signupConfirmPassword')
        };
        this.messages = {
            login: select('#loginMessage'),
            signup: select('#signupMessage')
        };
        this.errors = {
            signupEmail: select('#signupEmailError'),
            signupPassword: select('#signupPasswordError'),
            signupConfirmPassword: select('#signupConfirmPasswordError')
        };
    }

    /**
     * Sets up all the initial event listeners.
     */
    setupEventListeners() {
        this.buttons.showLogin.addEventListener('click', () => this.switchForm('login'));
        this.buttons.showSignup.addEventListener('click', () => this.switchForm('signup'));

        this.forms.login.addEventListener('submit', (e) => this.handleLogin(e));
        this.forms.signup.addEventListener('submit', (e) => this.handleSignup(e));

        // Real-time validation listeners for the signup form
        this.inputs.signupEmail.addEventListener('input', () => this.validateField(this.inputs.signupEmail, this.errors.signupEmail, this.validators.email));
        this.inputs.signupPassword.addEventListener('input', () => {
            this.validateField(this.inputs.signupPassword, this.errors.signupPassword, this.validators.password);
            this.validateField(this.inputs.signupConfirmPassword, this.errors.signupConfirmPassword, this.validators.confirmPassword);
        });
        this.inputs.signupConfirmPassword.addEventListener('input', () => this.validateField(this.inputs.signupConfirmPassword, this.errors.signupConfirmPassword, this.validators.confirmPassword));
    }

    /**
     * Defines the validation functions for the signup form.
     */
    setupValidators() {
        this.validators = {
            email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            password: (val) => val.length >= 8 && /\d/.test(val),
            confirmPassword: (val) => val === this.inputs.signupPassword.value && val.length > 0,
        };
    }

    /**
     * Switches the visible form between login and signup.
     * @param {string} formToShow - 'login' or 'signup'.
     */
    switchForm(formToShow) {
        if (formToShow === 'login') {
            this.forms.login.classList.remove('hidden');
            this.forms.signup.classList.add('hidden');
            this.buttons.showLogin.classList.add('active');
            this.buttons.showSignup.classList.remove('active');
        } else {
            this.forms.signup.classList.remove('hidden');
            this.forms.login.classList.add('hidden');
            this.buttons.showSignup.classList.add('active');
            this.buttons.showLogin.classList.remove('active');
        }
    }

    /**
     * Validates a single form field and shows/hides its error message.
     * @returns {boolean} - True if the field is valid, false otherwise.
     */
    validateField(field, errorEl, validator) {
        const isValid = validator(field.value);
        errorEl.style.display = isValid || field.value.length === 0 ? 'none' : 'block';
        return isValid;
    }

    /**
     * Handles the login form submission.
     */
    async handleLogin(e) {
        e.preventDefault();
        this.toggleButtonLoading(this.buttons.loginSubmit, true);
        this.displayMessage(this.messages.login);

        try {
            const payload = {
                email: this.inputs.loginEmail.value,
                password: this.inputs.loginPassword.value,
            };
            const response = await this.apiCall('login', 'POST', payload);
            
            this.displayMessage(this.messages.login, 'Login successful! Redirecting...', 'success');
            localStorage.setItem('nexus_token', response.token);
            setTimeout(() => window.location.href = 'dashboard.html', 1000);

        } catch (error) {
            this.displayMessage(this.messages.login, error.message, 'error');
            this.toggleButtonLoading(this.buttons.loginSubmit, false);
        }
    }

    /**
     * Handles the signup form submission.
     */
    async handleSignup(e) {
        e.preventDefault();

        const isEmailValid = this.validateField(this.inputs.signupEmail, this.errors.signupEmail, this.validators.email);
        const isPasswordValid = this.validateField(this.inputs.signupPassword, this.errors.signupPassword, this.validators.password);
        const isConfirmValid = this.validateField(this.inputs.signupConfirmPassword, this.errors.signupConfirmPassword, this.validators.confirmPassword);

        if (!isEmailValid || !isPasswordValid || !isConfirmValid) {
            this.displayMessage(this.messages.signup, 'Please fix the errors above.', 'error');
            return;
        }

        this.toggleButtonLoading(this.buttons.signupSubmit, true);
        this.displayMessage(this.messages.signup);

        try {
            const payload = {
                email: this.inputs.signupEmail.value,
                password: this.inputs.signupPassword.value,
            };
            const response = await this.apiCall('signup', 'POST', payload);
            
            this.displayMessage(this.messages.signup, response.message + ' Please log in.', 'success');
            setTimeout(() => {
                this.switchForm('login');
                this.forms.signup.reset();
            }, 2000);

        } catch (error) {
            this.displayMessage(this.messages.signup, error.message, 'error');
        } finally {
            this.toggleButtonLoading(this.buttons.signupSubmit, false);
        }
    }

    /**
     * Makes an API call to the backend.
     * @param {string} endpoint - The API endpoint (e.g., 'login').
     * @param {string} method - The HTTP method (e.g., 'POST').
     * @param {Object} body - The request payload.
     * @returns {Promise<Object>} - The JSON response from the server.
     */
    async apiCall(endpoint, method, body) {
        // IMPORTANT: Replace with your deployed backend URL in a real project
        const API_URL = 'http://localhost:3000/api'; 
        
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'An unknown error occurred.');
        return data;
    }

    /**
     * Displays a message to the user (e.g., success or error).
     * @param {Element} el - The message container element.
     * @param {string} [message=''] - The message to display.
     * @param {string} [type=''] - The type of message ('success' or 'error').
     */
    displayMessage(el, message = '', type = '') {
        el.textContent = message;
        el.className = `form-message ${type}`;
    }

    /**
     * Toggles the loading state of a button.
     * @param {Element} btn - The button element.
     * @param {boolean} isLoading - True to show loader, false to show text.
     */
    toggleButtonLoading(btn, isLoading) {
        btn.disabled = isLoading;
        btn.classList.toggle('loading', isLoading);
    }
}

// Initialize the class once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => new AuthPage());
