document.addEventListener('DOMContentLoaded', function() {
    // Initialize custom cursor
    initCustomCursor();
    
    // Set current date
    setCurrentDate();
    
    // Initialize validator tabs
    initValidatorTabs();
    
    // Initialize sidebar toggle
    initSidebarToggle();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Fetch dashboard data
    fetchDashboardData();
    
    // Set user location
    // const locationData = {
    //     query: "106.213.84.222",
    //     country: "India",
    //     regionName: "Maharashtra",
    //     city: "Pune"
    // };
    
    // setUserLocation(locationData);
    
    //! STILL DEBUGGING
    toggleVPN(0)

    // Populate active users list
    populateActiveUsers();
    
    // Start real-time updates
    updateUserStatus();
    
    // Add event listener to copy button
    initCopyButton();

    // Initialize notifications
    initNotifications();

    // Add notification sound
    loadNotificationSound();
});

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
    const interactiveElements = document.querySelectorAll('a, button, input, select, .tool-card, .stat-card, .vpn-card, .notification-item');
    
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

// Set current date
function setCurrentDate() {
    const dateDisplay = document.getElementById('current-date');
    if (!dateDisplay) return;
    
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

// Initialize validator tabs
function initValidatorTabs() {
    const tabs = document.querySelectorAll('.validator-tab');
    const sections = document.querySelectorAll('.validator-section');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabIndex = this.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active section
            sections.forEach(s => s.classList.remove('active'));
            sections[tabIndex].classList.add('active');
        });
    });
}

// Initialize sidebar toggle
function initSidebarToggle() {
    const toggleButton = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.active-users-sidebar');
    const closeButton = document.querySelector('.close-sidebar');
    
    if (!toggleButton || !sidebar || !closeButton) return;
    
    // Check localStorage for saved state
    const sidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
    if (!sidebarHidden) {
        sidebar.classList.remove('hidden');
        toggleButton.classList.add('active');
    }
    
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        this.classList.toggle('active');
        
        // Save state to localStorage
        localStorage.setItem('sidebarHidden', sidebar.classList.contains('hidden'));
    });
    
    closeButton.addEventListener('click', function() {
        sidebar.classList.add('hidden');
        toggleButton.classList.remove('active');
        localStorage.setItem('sidebarHidden', 'true');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const clickedOutsideSidebar = !sidebar.contains(event.target);
        const clickedOutsideToggle = !toggleButton.contains(event.target);
        const isSidebarVisible = !sidebar.classList.contains('hidden');
        
        if (clickedOutsideSidebar && clickedOutsideToggle && isSidebarVisible) {
            sidebar.classList.add('hidden');
            toggleButton.classList.remove('active');
            localStorage.setItem('sidebarHidden', 'true');
        }
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

// Initialize copy button
function initCopyButton() {
    const copyBtn = document.getElementById('copy-id-btn');
    if (!copyBtn) return;
    
    copyBtn.addEventListener('click', async function() {
        const userId = document.getElementById('userid').textContent;
        
        try {
            await navigator.clipboard.writeText(userId);
            
            // Show notification
            const notification = document.getElementById('copyNotification');
            notification.textContent = 'UserID copied successfully!';
            notification.classList.add('show');
            
            // Hide notification after delay
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });
}

// Fetch dashboard data
async function fetchDashboardData() {
    // Simulating an API call to fetch dashboard data
    // In a real-world scenario, you would make an actual API request here
    const dashboardData = {
        ip: "106.213.84.222",
        todaysUsers: 670,
        newClients: 809
    };
    
    // Update the HTML with the fetched data
    document.getElementById('todays-users').textContent = dashboardData.todaysUsers.toLocaleString();
    document.getElementById('new-clients').textContent = dashboardData.newClients.toLocaleString();
    
    // Add animation to numbers
    animateNumbers('todays-users', dashboardData.todaysUsers);
    animateNumbers('new-clients', dashboardData.newClients);
}

// Animate numbers
function animateNumbers(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let startValue = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = Math.floor(easeOutQuart * finalValue);
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Set user location
function setUserLocation(data) {
    // Simulate data fetching
    setTimeout(() => {
        // Update with actual data
        document.getElementById('ip').textContent = data.query;
        document.getElementById('user-country').textContent = data.country;
        document.getElementById('user-region').textContent = data.regionName + ', ' + data.city;
    }, 200); // Simulate a delay for fetching data
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        });
        if (response.ok) {
            window.location.href = '/login';
        } else {
            console.error('Failed to logout:', response.statusText);
        }
    } catch (error) {
        console.error('Failed to logout:', error);
    }
}

// Toggle VPN function
async function toggleVPN(v) {
    const vpnElement = document.getElementById('vpn');
    
    // Set loading state
    document.getElementById('ip').textContent = 'Loading...';
    document.getElementById('user-country').textContent = 'Loading...';
    document.getElementById('user-region').textContent = 'Loading...';

    vpnElement.textContent = 'Connecting...';
    vpnElement.style.color = '#FFA500'; // Orange color for connecting state

    // Add loading dots animation
    let dots = 0;
    const loadingInterval = setInterval(() => {
        vpnElement.textContent = 'Connecting' + '.'.repeat(dots);
        dots = (dots + 1) % 4;
    }, 500);

    try {
        const response = await fetch('/vpn', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(v),
        });
        const data = await response.json();

        clearInterval(loadingInterval);
        vpnElement.textContent = 'Connected';
        vpnElement.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');

        setUserLocation(data); // Update user location if needed

        if (v === 1){
            startUptime(); 
        }
    } catch (error) {
        clearInterval(loadingInterval);
        console.error('Error toggling VPN:', error);
        vpnElement.textContent = 'Not Connected'; // Reset to original state
    }
}

// Show popup function
function showPopup() {
    const popup = document.getElementById('vpn-popup');
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 7000);
}

// Validator functions
function validateEmail() {
    const emailInput = document.getElementById('emailInput');
    const resultDiv = document.getElementById('emailResult');
    
    if (!emailInput.value.trim()) {
        resultDiv.innerHTML = `<span style="color: #ef4444">✗ Please enter an email address</span>`;
        return;
    }
    
    // Change button text to "Validating..."
    const validateBtn = emailInput.nextElementSibling;
    validateBtn.textContent = "Validating...";
    validateBtn.disabled = true;
    
    // Add loading animation
    resultDiv.innerHTML = `<span style="color: #0fffb3">Validating...</span>`;
    
    // Simulate API call
    setTimeout(() => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);
        
        if (isValid) {
            resultDiv.innerHTML = `<span style="color: #10b981">✓ Valid email address</span>`;
        } else {
            resultDiv.innerHTML = `<span style="color: #ef4444">✗ Invalid email address</span>`;
        }
        
        // Reset button text after validation
        validateBtn.textContent = "Validate";
        validateBtn.disabled = false;
        
        // Clear input and result after 20 seconds
        setTimeout(() => {
            emailInput.value = '';
            resultDiv.innerHTML = '';
        }, 20000);
    }, 1000);
}

function validatePhone() {
    const country = document.getElementById('countryCode').value;
    const phoneInput = document.getElementById('phoneInput');
    const resultDiv = document.getElementById('phoneResult');
    
    if (!phoneInput.value.trim()) {
        resultDiv.innerHTML = `<span style="color: #ef4444">✗ Please enter a phone number</span>`;
        return;
    }
    
    // Change button text to "Validating..."
    const validateBtn = phoneInput.nextElementSibling;
    validateBtn.textContent = "Validating...";
    validateBtn.disabled = true;
    
    // Add loading animation
    resultDiv.innerHTML = `<span style="color: #0fffb3">Validating...</span>`;
    
    // Simulate API call
    setTimeout(() => {
        const isValid = /^\d{10}$/.test(phoneInput.value.replace(/\D/g, ''));
        
        if (isValid) {
            resultDiv.innerHTML = `<span style="color: #10b981">✓ Valid Phone Number</span>`;
        } else {
            resultDiv.innerHTML = `<span style="color: #ef4444">✗ Invalid Phone Number</span>`;
        }
        
        // Reset button text after validation
        validateBtn.textContent = "Validate";
        validateBtn.disabled = false;
        
        // Clear input and result after 20 seconds
        setTimeout(() => {
            phoneInput.value = '';
            resultDiv.innerHTML = '';
        }, 20000);
    }, 1000);
}

function validateIBAN() {
    const ibanInput = document.getElementById('ibanInput');
    const resultDiv = document.getElementById('ibanResult');
    
    if (!ibanInput.value.trim()) {
        resultDiv.innerHTML = `<span style="color: #ef4444">✗ Please enter an IBAN</span>`;
        return;
    }
    
    // Change button text to "Validating..."
    const validateBtn = ibanInput.nextElementSibling;
    validateBtn.textContent = "Validating...";
    validateBtn.disabled = true;
    
    // Add loading animation
    resultDiv.innerHTML = `<span style="color: #0fffb3">Validating...</span>`;
    
    // Simulate API call
    setTimeout(() => {
        // Simple validation - in real world this would be more complex
        const isValid = ibanInput.value.length > 15;
        
        if (isValid) {
            resultDiv.innerHTML = `<span style="color: #10b981">✓ Valid IBAN</span>`;
        } else {
            resultDiv.innerHTML = `<span style="color: #ef4444">✗ Invalid IBAN</span>`;
        }
        
        // Reset button text after validation
        validateBtn.textContent = "Validate";
        validateBtn.disabled = false;
        
        // Clear input and result after 20 seconds
        setTimeout(() => {
            ibanInput.value = '';
            resultDiv.innerHTML = '';
        }, 20000);
    }, 1000);
}

let uptimeInterval;
let seconds = 0;

function formatUptime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startUptime() {
    seconds = 0;
    document.getElementById('uptime').textContent = `Uptime: 00:00:00`;
    uptimeInterval = setInterval(() => {
        seconds++;
        document.getElementById('uptime').textContent = `Uptime: ${formatUptime(seconds)}`;
    }, 1000);
}

function stopUptime() {
    clearInterval(uptimeInterval);
    seconds = 0;
    document.getElementById('uptime').textContent = `Uptime: 00:00:00`;
}

// Active users functionality
async function populateActiveUsers() {
    // Show loading state
    const usersList = document.getElementById('activeUsersList');
    if (!usersList) return;
    
    usersList.innerHTML = `
        <div class="loading-users">
            <div class="loading-spinner"></div>
            <p>Loading users...</p>
        </div>
    `;
    
    try {
        // Fetch data from the endpoint
        const response = await fetch('/admin-dashboard/active-ips');
        const data = await response.json();

        usersList.innerHTML = '';

        // Filter and count online employees
        const onlineEmployees = Object.entries(data)
            .filter(([ip, status]) => typeof status === 'boolean' && status)
            .map(([ip]) => ip);

        const offlineEmployees = Object.entries(data)
            .filter(([ip, status]) => typeof status === 'boolean' && !status)
            .map(([ip]) => ip);

        // Update active count
        const activeCount = document.querySelector('.active-count');
        activeCount.textContent = `${onlineEmployees.length} Online`;

        // Create user items for online employees
        onlineEmployees.forEach(ip => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar">
                        <img src="/static/images/avatar/anonymous.png" alt="Employee">
                        <span class="status-indicator status-active"></span>
                    </div>
                    <div class="user-details">
                        <span class="user-name">Employee</span>
                        <span class="user-role">Online</span>
                    </div>
                </div>
                <span class="last-active">Just now</span>
            `;
            usersList.appendChild(userItem);
        });

        // Create user items for offline employees
        offlineEmployees.forEach(ip => {
            const userItem = document.createElement('div');
            userItem.className = 'user-item';
            userItem.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar">
                        <img src="/static/images/avatar/anonymous.png" alt="Employee">
                        <span class="status-indicator status-offline"></span>
                    </div>
                    <div class="user-details">
                        <span class="user-name">Employee</span>
                        <span class="user-role">Offline</span>
                    </div>
                </div>
                <span class="last-active">Offline</span>
            `;
            usersList.appendChild(userItem);
        });
    } catch (error) {
        console.error('Failed to fetch active users:', error);
        usersList.innerHTML = '<p>Error loading users. Please try again later.</p>';
    }
}

function filterUsers(searchTerm) {
    const userSearchInput = document.getElementById('userSearchInput');
    if (!userSearchInput) return;
    
    userSearchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const userItems = document.querySelectorAll('.user-item');
        let matchCount = 0;
        
        userItems.forEach(item => {
            const userName = item.dataset.userName?.toLowerCase() || '';
            const userRole = item.querySelector('.user-role')?.textContent.toLowerCase() || '';
            
            if (userName.includes(searchTerm) || userRole.includes(searchTerm)) {
                item.style.display = 'flex';
                matchCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show no results message if no matches
        const usersList = document.getElementById('activeUsersList');
        const noResultsEl = usersList.querySelector('.no-results');
        
        if (matchCount === 0 && !noResultsEl) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.style.textAlign = 'center';
            noResults.style.padding = '20px';
            noResults.style.color = 'var(--text-secondary)';
            noResults.textContent = 'No users found matching your search';
            usersList.appendChild(noResults);
        } else if (matchCount > 0 && noResultsEl) {
            noResultsEl.remove();
        }
    });
}

// Add real-time status updates
function updateUserStatus() {
    // This function would typically be called with real-time data from your backend
    // For now, we'll simulate updates every 30 seconds
    setInterval(() => {
        const userItems = document.querySelectorAll('.user-item');
        if (userItems.length === 0) return;
        
        // Randomly update a user's status
        const randomIndex = Math.floor(Math.random() * userItems.length);
        const randomUser = userItems[randomIndex];
        const statusIndicator = randomUser.querySelector('.status-indicator');
        const lastActive = randomUser.querySelector('.last-active');
        
        // Get current status
        const currentStatus = randomUser.dataset.userStatus || 'offline';
        
        // Generate a new random status
        const statuses = ['active', 'away', 'busy', 'offline'];
        let newStatus;
        
        // Higher chance to become active if currently offline
        if (currentStatus === 'offline') {
            newStatus = Math.random() > 0.7 ? 'active' : currentStatus;
        } 
        // Higher chance to go offline if currently active
        else if (currentStatus === 'active') {
            newStatus = Math.random() > 0.8 ? 'offline' : (Math.random() > 0.5 ? 'away' : currentStatus);
        }
        // Random status for others
        else {
            newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        }
        
        // Update the status
        randomUser.dataset.userStatus = newStatus;
        statusIndicator.className = `status-indicator status-${newStatus}`;
        
        // Update last active text
        if (newStatus === 'active') {
            lastActive.textContent = 'Just now';
            lastActive.setAttribute('data-tooltip', 'Last active Just now');
        } else if (newStatus === 'offline') {
            lastActive.textContent = 'Offline';
            lastActive.setAttribute('data-tooltip', 'User is offline');
        } else {
            const minutes = Math.floor(Math.random() * 20) + 1;
            lastActive.textContent = `${minutes}m ago`;
            lastActive.setAttribute('data-tooltip', `Last active ${minutes}m ago`);
        }
        
        // Update active count
        const activeCount = document.querySelector('.active-count');
        const onlineCount = document.querySelectorAll('.status-active').length;
        activeCount.textContent = `${onlineCount} Online`;
    }, 30000);
}

// Add hover effects to cards
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle animation to icon
            const icon = this.querySelector('.tool-icon');
            icon.style.transform = 'scale(1.1)';
            
            // Show arrow
            const arrow = this.querySelector('.tool-arrow');
            arrow.style.opacity = '1';
            arrow.style.transform = 'translateX(0)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset icon
            const icon = this.querySelector('.tool-icon');
            icon.style.transform = '';
            
            // Hide arrow
            const arrow = this.querySelector('.tool-arrow');
            arrow.style.opacity = '0';
            arrow.style.transform = 'translateX(10px)';
        });
    });
    
    // Add hover effects to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create a radial gradient that follows the cursor
            this.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(15, 255, 179, 0.1), transparent 80%), var(--card-bg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'var(--card-bg)';
        });
    });
});

// Add event listener for VPN card
document.addEventListener('DOMContentLoaded', function() {
    const vpnCard = document.querySelector('.stat-card[onclick="toggleVPN(0)"]');
    if (vpnCard) {
        vpnCard.addEventListener('click', () => toggleVPN(0));
    }
});

// --- Enhanced Notification System ---

// Global variables for notifications
let lastNotificationIds = [];
let notificationPanelOpen = false;
let notificationSound;

// Load notification sound
function loadNotificationSound() {
    notificationSound = new Audio();
    notificationSound.src = '/static/sounds/notification.mp3';
    notificationSound.load();
}

// Initialize notifications
function initNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationPanel = document.getElementById('notification-panel');
    const notificationBadge = document.querySelector('.notification-badge');
    const closeBtn = document.getElementById('close-notifications');

    if (!notificationBtn || !notificationPanel || !closeBtn) return;

    notificationPanel.classList.remove('show');
    let notificationPanelOpen = false;

    notificationBtn.addEventListener('click', function () {
        notificationPanel.classList.toggle('show');
        notificationPanelOpen = notificationPanel.classList.contains('show');
        if (notificationPanelOpen) fetchAndRenderNotifications();
    });

    closeBtn.addEventListener('click', function () {
        notificationPanel.classList.remove('show');
        notificationPanelOpen = false;
    });

    document.addEventListener('click', function(event) {
        if (notificationPanelOpen && 
            !notificationPanel.contains(event.target) && 
            !notificationBtn.contains(event.target)) {
            notificationPanel.classList.remove('show');
            notificationPanelOpen = false;
        }
    });

    // Fetch every 1 second
    setInterval(async () => {
        const notifications = await fetchAndRenderNotifications();
        showNotificationBadge(notifications);
    }, 1000);

    fetchAndRenderNotifications().then(showNotificationBadge);
}

// Check if there are new notifications
function isNewNotification(notifications) {
    if (!notifications || !notifications.length) return false;
    
    const ids = notifications.map(n => n.id);
    const newNotifications = notifications.filter(n => !n.read && !lastNotificationIds.includes(n.id));
    lastNotificationIds = ids;
    
    return newNotifications.length > 0;
}

// Play notification sound
function playNotificationSound() {
    if (notificationSound && typeof notificationSound.play === 'function') {
        notificationSound.currentTime = 0;
        notificationSound.play().catch(err => {
            console.log('Error playing notification sound:', err);
        });
    }
}

// Mark all notifications as read
async function markAllAsRead() {
    try {
        const response = await fetch('/notifications/mark-all-read', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            // Update UI to reflect all notifications as read
            const notificationItems = document.querySelectorAll('.notification-item');
            notificationItems.forEach(item => {
                item.classList.add('read');
            });
            
            // Update badge
            const notificationBadge = document.querySelector('.notification-badge');
            notificationBadge.style.display = 'none';
            notificationBadge.textContent = '';
        }
    } catch (error) {
        console.error('Failed to mark notifications as read:', error);
    }
}

// Fetch and render notifications
async function fetchAndRenderNotifications() {
    const notificationList = document.getElementById('notification-list');
    if (!notificationList) return [];

    try {
        const response = await fetch('/notifications/data?action=display');
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const notifications = await response.json(); // Expecting: ["text1", "text2", ...]

        notificationList.innerHTML = '';
        if (!Array.isArray(notifications) || notifications.length === 0) {
            notificationList.innerHTML = `<div class="no-notifications">No notifications</div>`;
        } else {
            notifications.forEach((text, idx) => {
                const notificationItem = document.createElement('div');
                notificationItem.className = 'notification-item notification-info';
                notificationItem.innerHTML = `
                    <div class="notification-message">${text}</div>
                `;
                notificationList.appendChild(notificationItem);
            });
        }
        // For badge logic, treat all as unread
        return notifications;
    } catch (error) {
        notificationList.innerHTML = `<div class="no-notifications">Failed to load notifications</div>`;
        return [];
    }
}

// Show notification badge
function showNotificationBadge(notifications) {
    const notificationBadge = document.querySelector('.notification-badge');
    if (!notificationBadge) return;
    
    const count = notifications.length;
    if (count > 0) {
        notificationBadge.textContent = count > 99 ? '99+' : count;
        notificationBadge.style.display = 'flex';
    } else {
        notificationBadge.style.display = 'none';
        notificationBadge.textContent = '';
    }
}

// Add a new notification (can be called from other parts of the app)
function addNotification(notification) {
    if (!notification || !notification.message) return;
    
    // Create a new notification object
    const newNotification = {
        id: Date.now().toString(),
        type: notification.type || 'info',
        message: notification.message,
        time: 'Just now',
        details: notification.details || null,
        read: false
    };
    
    // Add to our notifications array
    const notifications = window._notifications || [];
    notifications.unshift(newNotification);
    window._notifications = notifications;
    
    // Update UI
    fetchAndRenderNotifications();
    showNotificationBadge(notifications);
    
    // Play sound if panel is not open
    if (!notificationPanelOpen) {
        playNotificationSound();
    }
    
    return newNotification.id;
}