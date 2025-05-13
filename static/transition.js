document.addEventListener('DOMContentLoaded', () => {
    const transitionLinks = document.querySelectorAll('.transition-link');

    transitionLinks.forEach(link => {
        link.addEventListener('click', (e) => handleTransition(e, link.href));
    });

    // Add slide-in class when the page loads
    const pageContainer = document.querySelector('.page-container');
    pageContainer.classList.add('slide-in');

    // Remove the slide-in class after the animation completes
    pageContainer.addEventListener('animationend', () => {
        pageContainer.classList.remove('slide-in');
    });
});

function handleTransition(e, targetUrl) {
    e.preventDefault();
    const container = document.querySelector('.page-container');
    container.classList.add('slide-out');

    container.addEventListener('animationend', () => {
        window.location.href = targetUrl;
    }, { once: true });
}