// Monitor.js
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
async function update_data(){
    const dataResponse = await fetch('/FI-Monitor/data');
    const data = await dataResponse.json();
    return data;
}

async function add_files(){
    const inputField = document.getElementById('filePathInput')
    const file = inputField.value;
    
    if (!file.trim()) {
        showPopup("Please enter a valid file path", "error");
        return;
    }
    
    inputField.value = null;
    await fetch(`/FI-Monitor?task=add&file=${encodeURIComponent(file)}`);
    
    // Create and show popup
    showPopup("File Added Successfully", "success");
    
    // Refresh the file list
    getFiles();
}

function showPopup(message, type = "success") {
    const popup = document.createElement('div');
    popup.className = 'popup';
    
    if (type === "error") {
        popup.style.borderLeftColor = "var(--status-busy)";
    }
    
    popup.textContent = message;
    document.body.appendChild(popup);
    
    // Remove popup after 3 seconds
    setTimeout(() => {
        popup.style.opacity = "0";
        popup.style.transform = "translateX(100%)";
        setTimeout(() => popup.remove(), 300);
    }, 3000);
}

//function for pause/resume button
async function toggleState(button, count) {
    const data = await update_data()
    const [file, properties] = Object.entries(data)[count]

    if (properties.pause == 1) {
        button.textContent = "Resume";
        button.className = "resume-button";
        fetch(`/FI-Monitor?task=resume&file=${encodeURIComponent(file)}`);
    } else {
        button.textContent = "Pause";
        button.className = "pause-button";
        fetch(`/FI-Monitor?task=pause&file=${encodeURIComponent(file)}`);
    }
}

// Function to get files
async function getFiles() {
    const files = await update_data();
    const fileList = document.querySelector('.file-list');
    fileList.innerHTML = '';
    
    // Update file count
    const fileCount = document.getElementById('fileCount');
    const fileEntries = Object.entries(files);
    fileCount.textContent = fileEntries.length;
    
    if (fileEntries.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
            <p>No files are currently being monitored.</p>
            <p>Add files using the input field above.</p>
        `;
        fileList.appendChild(emptyState);
        return;
    }
    
    let count = 0;
    for (const [file, properties] of fileEntries) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        let alertBgColor, alertTextColor, alertValue;
        if (properties.alert === 0) {
            alertBgColor = 'rgba(16, 185, 129, 0.1)';
            alertTextColor = 'var(--status-online)';
            alertValue = 'All good';
        } else {
            alertBgColor = 'rgba(239, 68, 68, 0.1)';
            alertTextColor = 'var(--status-busy)';
            alertValue = 'Alert';
        }

        const buttonClass = properties.pause === 1 ? "resume-button" : "pause-button";
        const buttonText = properties.pause === 1 ? "Resume" : "Pause";

        fileItem.innerHTML = `
        <span class="file-name">
            <i class="fas fa-file-code" style="color: var(--accent-color);"></i>
            ${file}
            <i class="fas fa-external-link-alt" 
               onclick="window.location.href='/FI-Monitor?file=${encodeURIComponent(file)}&action=open'" 
               style="cursor: pointer; color: var(--accent-color); margin-left: 8px; font-size: 0.875rem;"></i>
        </span>
        <span class="alert-count" style="background-color: ${alertBgColor}; color: ${alertTextColor};">${alertValue}</span>
        <div class="action-buttons">
            <button class="${buttonClass}" onclick="toggleState(this, ${count})">${buttonText}</button>
            <button class="clear-button" onclick="clearFile('${encodeURIComponent(file)}')">Clear</button>
            <button class="remove-button" onclick="removeFile('${encodeURIComponent(file)}')">Remove</button>
        </div>`;
        
        fileList.appendChild(fileItem);
        count++;
    }
}

function clearFile(file) {
    fetch(`/FI-Monitor?task=clear&file=${file}`);
    showPopup("File alerts cleared");
    setTimeout(getFiles, 500);
}

function removeFile(file) {
    fetch(`/FI-Monitor?task=remove&file=${file}`);
    showPopup("File removed from monitoring");
    setTimeout(getFiles, 500);
}

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    getFiles();
    
    // Add keypress event for the input field
    const inputField = document.getElementById('filePathInput');
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            add_files();
        }
    });
    
    // Add CSS for button styles
    const style = document.createElement('style');
    style.textContent = `
        .pause-button { 
            background-color: var(--status-away); 
            color: var(--primary-bg);
        }
        .resume-button { 
            background-color: var(--status-online); 
            color: var(--primary-bg);
        }
        .clear-button { 
            background-color: var(--card-3); 
            color: var(--text-primary);
        }
        .remove-button { 
            background-color: var(--status-busy); 
            color: var(--text-primary);
        }
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            text-align: center;
            color: var(--text-muted);
        }
    `;
    document.head.appendChild(style);
});
