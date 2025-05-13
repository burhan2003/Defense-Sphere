document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
});

// Initialize mobile menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (!menuToggle || !sidebar) return;
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const clickedOutsideSidebar = !sidebar.contains(event.target);
        const clickedOutsideToggle = !menuToggle.contains(event.target);
        const isSidebarActive = sidebar.classList.contains('active');
        
        if (clickedOutsideSidebar && clickedOutsideToggle && isSidebarActive) {
            sidebar.classList.remove('active');
        }
    });
}

// Logout function
function logout() {
    // Add your logout logic here
    window.location.href = '/logout';
}