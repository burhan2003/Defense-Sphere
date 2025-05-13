document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display dashboard data
    fetchDashboardData();

    // Create the sales chart
    createSalesChart();
    
    // Add event listener to copy icon
    const copyIcon = document.querySelector('.copy-icon');
    if (copyIcon) {
        copyIcon.addEventListener('click', async function() {
            const userId = document.getElementById('user-name').closest('.welcome-text').querySelector('p:last-of-type').textContent.split(':')[1].trim();
            
            try {
                await navigator.clipboard.writeText(userId);
                
                // Visual feedback for icon
                const originalColor = copyIcon.getAttribute('stroke');
                copyIcon.setAttribute('stroke', '#00ff00');
                
                // Show notification
                const notification = document.getElementById('copyNotification');
                notification.classList.add('show');
                
                // Hide notification and reset icon color after delay
                setTimeout(() => {
                    notification.classList.remove('show');
                    copyIcon.setAttribute('stroke', originalColor);
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    }
});

async function logout() {
    try {
        // const response = await fetch('/logout', { method: 'POST' });
        // const response = await fetch('/logout', );
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            // body: JSON.stringify(postData),
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

async function fetchDashboardData() {
    // Simulating an API call to fetch dashboard data
    // In a real-world scenario, you would make an actual API request here
    let data = await fetch('/dashboard/data')
    .then(response => response.json())
    
    const dashboardData = {
        ip: 0,
        todaysUsers: 670,
        newClients: 809
        //vpnConnection: "Connected"
    };

    // Update the HTML with the fetched data
    // document.getElementById('ip').textContent = `${dashboardData.ip.toLocaleString()}`;
    document.getElementById('todays-users').textContent = dashboardData.todaysUsers.toLocaleString();
    document.getElementById('new-clients').textContent = dashboardData.newClients.toLocaleString();
    // document.getElementById('vpn').textContent = `${dashboardData.vpnConnection.toLocaleString()}`;
}
// Modify the existing toggleVPN function
async function toggleVPN() {
    const vpnElement = document.getElementById('vpn');
    const currentVpnLabel = vpnElement.textContent;
    
    // Don't do anything if already in connecting state
    if (currentVpnLabel === 'Connecting...') return;
    
    let postData;
    if (currentVpnLabel === 'Not Connected') {
        postData = 1;
        vpnElement.textContent = 'Connecting...';
        vpnElement.style.color = '#FFA500'; // Orange color for connecting state
        showPopup();
        
        // Add loading dots animation
        let dots = 0;
        const loadingInterval = setInterval(() => {
            vpnElement.textContent = 'Connecting' + '.'.repeat(dots);
            dots = (dots + 1) % 4;
        }, 500);

        try {
            const response = await fetch('/vpn', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(postData),
            });
            const data = await response.json();
            clearInterval(loadingInterval);
            vpnElement.textContent = 'Connected';
            vpnElement.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
            setUserLocation(data);
            startUptime();
        } catch (error) {
            clearInterval(loadingInterval);
            console.error('Error toggling VPN:', error);
            vpnElement.textContent = currentVpnLabel;
            vpnElement.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        }
    } else {
        postData = 0;
        vpnElement.textContent = 'Not Connected';
        
        try {
            const response = await fetch('/vpn', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(postData),
            });
            const data = await response.json();
            setUserLocation(data);
            stopUptime();
        } catch (error) {
            console.error('Error toggling VPN:', error);
            vpnElement.textContent = currentVpnLabel;
        }
    }
}

// Add this new function to handle the popup
function showPopup() {
    const popup = document.getElementById('vpn-popup');
    popup.classList.add('show');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 7000);
}

// Make sure this event listener is added to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const vpnCard = document.querySelector('.stat-card[onclick="toggleVPN()"]');
    if (vpnCard) {
        vpnCard.addEventListener('click', toggleVPN);
    }
});
// VAlidity function
function switchValidator(index) {
    // Update wrapper position
    const wrapper = document.querySelector('.validator-wrapper');
    wrapper.style.transform = `translateX(-${index * 33.333}%)`;
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

function validateEmail() {
    const emailInput = document.getElementById('emailInput');
    const resultDiv = document.getElementById('emailResult');
    
    // Change button text to "Validating..."
    const validateBtn = emailInput.nextElementSibling; // Assuming the button is the next sibling
    validateBtn.textContent = "Validating...";

    fetch('/dashboard/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: emailInput.value})
    })
    .then(response => response.json())
    .then(data => {
        if (data === 1) {
            resultDiv.innerHTML = `<span style="color: #0fffb3">✓ Valid email address</span>`;
        } else {
            resultDiv.innerHTML = `<span style="color: #ff4d4d">✗ Invalid email address</span>`;
        }
        // Reset button text after validation
        validateBtn.textContent = "Validate";

        // Clear input and result after 20 seconds
        setTimeout(() => {
            emailInput.value = '';
            resultDiv.innerHTML = '';
        }, 20000);
    });
}

function validatePhone() {
    const country = document.getElementById('countryCode').value;
    const phoneInput = document.getElementById('phoneInput');
    const resultDiv = document.getElementById('phoneResult');
    
    // Change button text to "Validating..."
    const validateBtn = phoneInput.nextElementSibling; // Assuming the button is the next sibling
    validateBtn.textContent = "Validating...";

    fetch('/dashboard/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({country: country, phone: phoneInput.value})
    })
    .then(response => response.json())
    .then(data => {
        if (data === 1) {
            resultDiv.innerHTML = `<span style="color: #0fffb3">✓ Valid Phone Number</span>`;
        } else {
            resultDiv.innerHTML = `<span style="color: #ff4d4d">✗ Invalid Phone Number</span>`;
        }
        // Reset button text after validation
        validateBtn.textContent = "Validate";

        // Clear input and result after 20 seconds
        setTimeout(() => {
            phoneInput.value = '';
            resultDiv.innerHTML = '';
        }, 20000);
    });
}

function validateIBAN() {
    const ibanInput = document.getElementById('ibanInput');
    const resultDiv = document.getElementById('ibanResult');
    
    // Change button text to "Validating..."
    const validateBtn = ibanInput.nextElementSibling; // Assuming the button is the next sibling
    validateBtn.textContent = "Validating...";

    fetch('/dashboard/validate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({iban: ibanInput.value.replace(/\s/g, '')})
    })
    .then(response => response.json())
    .then(data => {
        if (data === 1) {
            resultDiv.innerHTML = `<span style="color: #0fffb3">✓ Valid IBAN</span>`;
        } else {
            resultDiv.innerHTML = `<span style="color: #ff4d4d">✗ Invalid IBAN</span>`;
        }
        // Reset button text after validation
        validateBtn.textContent = "Validate";

        // Clear input and result after 20 seconds
        setTimeout(() => {
            ibanInput.value = '';
            resultDiv.innerHTML = '';
        }, 20000);
    });
}

function setUserLocation(data) {
    document.getElementById('ip').textContent = data.query;
    document.getElementById('user-country').textContent = data.country;
    document.getElementById('user-region').textContent = data.regionName + ', ' + data.city;
}

// Call this when the document loads
document.addEventListener('DOMContentLoaded', async function() {
    // setUserLocation(data);
    await fetch('/vpn', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(0),
    })
    .then(response => response.json())
    .then(data => {
        setUserLocation(data);
    })
});

function createSalesChart() {
    const ctx = document.getElementById('sales-chart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales 2021',
                data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
                borderColor: '#64ffda',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ccd6f6'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ccd6f6'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
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
