initCustomCursor();

// Custom cursor functionality
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    // Check if we're not on mobile
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    if (isMobile) {
        cursorDot.style.display = 'none';
        cursorOutline.style.display = 'none';
        return;
    }
    
    document.addEventListener('mousemove', function(e) {
        // Position the dot directly at cursor position
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        
        // Position the outline with a slight delay for a trailing effect
        setTimeout(() => {
            cursorOutline.style.left = `${e.clientX}px`;
            cursorOutline.style.top = `${e.clientY}px`;
        }, 80);
    });
    
    // Add special effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, .tool-card, .stat-card, .vpn-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.borderColor = 'rgba(15, 255, 179, 0.8)';
            cursorDot.style.opacity = '0.5';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.borderColor = 'rgba(15, 255, 179, 0.5)';
            cursorDot.style.opacity = '1';
        });
    });
    
    // Add click effect
    document.addEventListener('mousedown', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // Add magnetic effect to buttons
    const buttons = document.querySelectorAll('.validate-btn, .vpn-toggle-btn, .add-user-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / 10;
            const moveY = (y - centerY) / 10;
            
            this.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize phishing detector functionality
    initPhishingDetector();
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

// Initialize phishing detector functionality
function initPhishingDetector() {
    const contentInput = document.getElementById('contentInput');
    const checkBtn = document.getElementById('checkBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultContainer = document.getElementById('result');

    // Clear button functionality
    clearBtn.addEventListener('click', function() {
        contentInput.value = '';
        resultContainer.style.display = 'none';
        contentInput.focus();
    });

    checkBtn.addEventListener('click', async function() {
        const content = contentInput.value.trim();
        
        if (!content) {
            // Show a more elegant error message
            showResult('error', 'Please enter a URL or email content to analyze');
            return;
        }

        // Show loading state
        checkBtn.disabled = true;
        checkBtn.querySelector('.loading-spinner').style.display = 'inline-block';
        resultContainer.style.display = 'none';

        try {
            const response = await fetch('/phishing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content })
            });

            const data = await response.json();
            
            // Display result
            if (data === 'safe') {
                showResult('safe', 'This content appears to be safe!');
            } else {
                showResult('danger', 'Warning: This content may be malicious!');
            }

        } catch (error) {
            showResult('error', 'An error occurred during analysis. Please try again.');
            console.error(error);
        } finally {
            // Reset button state
            checkBtn.disabled = false;
            checkBtn.querySelector('.loading-spinner').style.display = 'none';
        }
    });

    // Function to show results with appropriate styling and icons
    function showResult(type, message) {
        resultContainer.style.display = 'block';
        resultContainer.className = 'result-container';
        
        let icon = '';
        
        switch(type) {
            case 'safe':
                resultContainer.classList.add('safe');
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'danger':
                resultContainer.classList.add('danger');
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'error':
                resultContainer.classList.add('danger');
                icon = '<i class="fas fa-times-circle"></i>';
                break;
        }
        
        resultContainer.innerHTML = `${icon} ${message}`;
    }

    // Add keyboard shortcut for checking (Ctrl+Enter or Cmd+Enter)
    contentInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            checkBtn.click();
        }
    });
}

// Logout function
function logout() {
    // Add your logout logic here
    window.location.href = '/logout';
}