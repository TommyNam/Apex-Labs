document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            // 1. Toggles the 'is-open' class on the <nav>
            mainNav.classList.toggle('is-open');

            // 2. Toggles ARIA for accessibility (changes the 'false' to 'true' and vice versa)
            let isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
        });
    }
});