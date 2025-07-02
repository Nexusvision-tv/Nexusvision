/**
 * A collection of utility functions to simplify common tasks.
 */

/**
 * Executes a callback function once the DOM is fully loaded.
 * @param {Function} callback - The function to execute.
 */
export function onReady(callback) {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}

/**
 * A shorthand for document.querySelector.
 * @param {string} selector - The CSS selector to find.
 * @param {Element} [parent=document] - The parent element to search within.
 * @returns {Element | null} - The first matching element or null.
 */
export function select(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * A shorthand for document.querySelectorAll.
 * @param {string} selector - The CSS selector to find.
 * @param {Element} [parent=document] - The parent element to search within.
 * @returns {NodeListOf<Element>} - A NodeList of all matching elements.
 */
export function selectAll(selector, parent = document) {
    return parent.querySelectorAll(selector);
}
