// Sample initial rules
let firewallRules = [];

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


// Fetch rules from the backend
async function fetchFirewallRules() {
    try {
        const response = await fetch('/firewall/show-rules');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        firewallRules = data;
        renderRules(firewallRules);

        document.getElementById('firewallCount').textContent = firewallRules.length; 
        document.getElementById('policyCount').textContent = Math.floor(Math.random() * 100) + 1;
        document.getElementById('userCount').textContent = Math.floor(Math.random() * 100) + 1;
    } catch (error) {
        console.error('Error fetching firewall rules:', error);
    }
}

// Initialize table
async function initializeTable() {
    await fetchFirewallRules();
}

// Render rules in table
function renderRules(rules) {
    const tableBody = document.getElementById('rulesTableBody');
    tableBody.innerHTML = '';

    const rulesArray = Array.isArray(rules) ? rules : [rules];

    rulesArray.forEach(rule => {
        const row = document.createElement('tr');
        const ruleName = rule["Rule Name"] ? rule["Rule Name"].replace(/\[ICEBOX\]\s*/, '') : 'N/A'; // Strip "ICEBOX" prefix

        row.innerHTML = `
            <td>
                <span class="status-badge status-${rule.Action}">
                    ${rule.Action}
                </span>
            </td>
            <td>${ruleName}</td>
            <td>${rule.Direction === "In" ? 'Incoming' : 'Outgoing'}</td>

            <td>${rule.LocalIP === "Any" ? '?' : rule.LocalIP}:${rule.LocalPort === "Any" ? '?' : rule.LocalPort}</td>
            <td>${rule.RemoteIP === "Any" ? '?' : rule.RemoteIP}:${rule.RemotePort === "Any" ? '?' : rule.RemotePort}</td>
            <td>${rule.Protocol ? rule.Protocol.toUpperCase() : 'N/A'}</td>
            <td>
                <button class="action-btn" onclick="deleteRule('${ruleName}')" style="display: flex; justify-content: center; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#FF0000" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Filter rules
function filterRules() {
    const searchText = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    const filteredRules = firewallRules.filter(rule => {
        const matchesSearch = rule["Rule Name"].toLowerCase().includes(searchText);
        const matchesStatus = statusFilter === 'all' || 
            (statusFilter === 'enabled' && rule.Enabled === "Yes") ||
            (statusFilter === 'disabled' && rule.Enabled === "No");
        return matchesSearch && matchesStatus;
    });

    renderRules(filteredRules);
}

// Toggle rule status
function toggleRule(id) {
    const rule = firewallRules.find(r => r.id === id);
    if (rule) {
        rule.Enabled = rule.Enabled === "Yes" ? "No" : "Yes"; // Toggle the Enabled status
        renderRules(firewallRules); // Re-render the rules
    }
}

// Delete rule
async function deleteRule(ruleName) {
    if (confirm('Are you sure you want to delete this rule?')) {
        // firewallRules = firewallRules.filter(rule => rule.id !== id); // Remove the rule
        const response = await fetch('/firewall/delete-rule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ruleName),
        });
        renderRules(firewallRules); // Re-render the rules
    }
    location.reload()
}

// Show add rule modal
function showAddRuleModal() {
    document.getElementById('addRuleModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('addRuleModal').style.display = 'none';
}

// Add new rule
document.getElementById('addRuleForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevent the default form submission

    // Collect input data and send it to the server
    const newRule = {
        ruleName: document.getElementById('ruleName').value,
        direction: document.getElementById('direction').value,
        action: document.getElementById('action').value,
        localIpAddress: document.getElementById('localIpAddress').value,
        localPort: parseInt(document.getElementById('localPort').value),
        remoteIpAddress: document.getElementById('remoteIpAddress').value,
        remotePort: parseInt(document.getElementById('remotePort').value),
        protocol: document.getElementById('protocol').value,
    };

    try {
        // Send POST request to /firewall/create-rule
        const response = await fetch('/firewall/create-rule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRule),
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            console.error('Network response was not ok:', response.statusText);
            return; // Exit if the response is not ok
        }

        const responseData = await response.json(); // Parse the JSON response

        // Handle the response based on the specified conditions
        if (responseData === 0) {
            location.reload();
        } else if (responseData === 2) {
            // Show error message for administrator privileges
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Administrator privileges required.';
            errorMessage.style.color = 'red';
            document.querySelector('.main-content').appendChild(errorMessage);
            // Remove the error message after 5 seconds
            setTimeout(() => {
                errorMessage.remove();
            }, 5000);
        } else if (typeof responseData === 'string') {
            alert(responseData.split('\n')[0]); // Show the first line of the string value
        }
    } catch (error) {
        console.error('Error creating rule:', error);
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addRuleModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize the table when the page loads
document.addEventListener('DOMContentLoaded', initializeTable);

// Initialize the table when the page loads
// document.addEventListener('DOMContentLoaded', initializeTable);