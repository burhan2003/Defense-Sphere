document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize logs functionality
    initLogsFeature();
});

// CUSTOM CURSOR 
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

// Initialize logs functionality
function initLogsFeature() {
    const totalLogsElement = document.getElementById('totalLogs');
    const lastUpdatedElement = document.getElementById('lastUpdated');
    const activeUsersElement = document.getElementById('activeUsers');
    const logTableBody = document.getElementById('logTableBody');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageElement = document.getElementById('currentPage');
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchInput');
    const emptyState = document.getElementById('emptyState');
    const loadingState = document.getElementById('loadingState');

    let currentPage = 1;
    const logsPerPage = 10;
    let logs = [];
    let filteredLogs = [];
    let isLoading = true;
    
    async function fetchLogs() {
        try {
            isLoading = true;
            updateUI();
            
            const response = await fetch('/logs/data');
            if (!response.ok) {
                throw new Error('Failed to fetch logs');
            }
            
            logs = await response.json();
            filteredLogs = [...logs];
            
            isLoading = false;
            updateUI();
            updateInfoPanel();
        } catch (error) {
            console.error('Error fetching logs:', error);
            isLoading = false;
            updateUI();
        }
    }

    function updateUI() {
        if (isLoading) {
            loadingState.style.display = 'flex';
            emptyState.style.display = 'none';
            logTableBody.innerHTML = '';
            return;
        }
        
        loadingState.style.display = 'none';
        
        if (filteredLogs.length === 0) {
            emptyState.style.display = 'flex';
            logTableBody.innerHTML = '';
        } else {
            emptyState.style.display = 'none';
            renderLogs();
        }
    }

    function updateInfoPanel() {
        totalLogsElement.textContent = logs.length;
        lastUpdatedElement.textContent = new Date().toLocaleString();
        activeUsersElement.textContent = Math.floor(Math.random() * 100) + 1; // Simulated active users
    }

    function renderLogs() {
        const startIndex = (currentPage - 1) * logsPerPage;
        const endIndex = startIndex + logsPerPage;
        const pageData = filteredLogs.slice(startIndex, endIndex);

        logTableBody.innerHTML = '';
        
        pageData.forEach((log, index) => {
            const row = document.createElement('tr');
            
            // Add animation delay based on index
            row.style.animation = `fadeIn 0.3s ease forwards ${index * 0.05}s`;
            row.style.opacity = '0';
            
            row.innerHTML = `
                <td>${log.timestamp}</td>
                <td>${log.activity}</td>
            `;
            logTableBody.appendChild(row);
        });

        currentPageElement.textContent = `Page ${currentPage} of ${Math.ceil(filteredLogs.length / logsPerPage) || 1}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = endIndex >= filteredLogs.length;
    }

    function filterLogs() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            filteredLogs = [...logs];
        } else {
            filteredLogs = logs.filter(log => 
                log.timestamp.toLowerCase().includes(searchTerm) || 
                log.activity.toLowerCase().includes(searchTerm)
            );
        }
        
        currentPage = 1;
        updateUI();
    }

    // Event Listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderLogs();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if ((currentPage * logsPerPage) < filteredLogs.length) {
            currentPage++;
            renderLogs();
        }
    });
    
    refreshBtn.addEventListener('click', () => {
        refreshBtn.querySelector('i').style.transform = 'rotate(360deg)';
        setTimeout(() => {
            refreshBtn.querySelector('i').style.transform = '';
        }, 500);
        fetchLogs();
    });
    
    searchInput.addEventListener('input', filterLogs);

    // Initial fetch
    fetchLogs();

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Simulated real-time updates
    setInterval(updateInfoPanel, 5000);
}