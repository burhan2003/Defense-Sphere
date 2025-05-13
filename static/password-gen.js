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
    // DOM Elements
    const passwordDisplay = document.getElementById('passwordDisplay');
    const strengthIndicator = document.getElementById('strengthIndicator');
    const strengthMeter = document.getElementById('strengthMeter');
    const generateBtn = document.getElementById('generateBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const copyBtn = document.getElementById('copyBtn');
    const generateQrBtn = document.getElementById('generateQrBtn');
    const closeModal = document.getElementById('closeModal');
    const qrModal = document.getElementById('qrModal');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    // Password options
    const passwordLength = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    const upperOption = document.getElementById('upperOption');
    const lowerOption = document.getElementById('lowerOption');
    const numberOption = document.getElementById('numberOption');
    const symbolOption = document.getElementById('symbolOption');
    const symbols = document.getElementById('symbols');
    const wordOption = document.getElementById('wordOption');
    const addWord = document.getElementById('addWord');

    // Update length value display
    passwordLength.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Toggle word input based on checkbox
    wordOption.addEventListener('change', function() {
        addWord.disabled = !this.checked;
        if (this.checked) {
            addWord.focus();
        }
    });

    // Assess password strength
    function assessPasswordStrength(password) {
        const length = password.length;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        const varietyCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChars].filter(Boolean).length;

        if (length >= 14 && varietyCount === 4) return 'Very Strong';
        if (length >= 12 && varietyCount >= 3) return 'Strong';
        if (length >= 8 && varietyCount >= 2) return 'Good';
        if (length >= 6 && varietyCount >= 1) return 'Weak';
        return 'Very Weak';
    }

    // Update password strength indicator
    function updatePasswordStrength() {
        const password = passwordDisplay.value;
        if (password === '') {
            strengthIndicator.textContent = '';
            strengthIndicator.className = 'strength-label';
            strengthMeter.className = 'strength-meter';
            return;
        }

        const strength = assessPasswordStrength(password);
        strengthIndicator.textContent = strength;
        
        // Update classes for styling
        strengthIndicator.className = 'strength-label strength-' + strength.toLowerCase().replace(' ', '-');
        strengthMeter.className = 'strength-meter meter-' + strength.toLowerCase().replace(' ', '-');
    }

    // Show notification
    function showNotification(message) {
        notificationText.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Copy password to clipboard
    function copyPassword() {
        const password = passwordDisplay.value;
        if (password) {
            navigator.clipboard.writeText(password).then(() => {
                showNotification('Password copied to clipboard');
            }).catch(err => {
                console.error('Failed to copy password: ', err);
                showNotification('Failed to copy password');
            });
        }
    }
    
    // Generate QR code
    function generateQRCode() {
        const password = passwordDisplay.value;
        if (!password) {
            showNotification('Please generate a password first');
            return;
        }

        // Clear previous QR code
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';

        // Generate new QR code
        new QRCode(qrContainer, {
            text: password,
            width: 200,
            height: 200,
            colorDark: "#0fffb3",
            colorLight: "#000000",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Show modal
        qrModal.classList.add('show');
    }

    // Generate password
    function generatePassword() {
        let chars = '';
        let password = '';

        const length = parseInt(passwordLength.value);

        if (upperOption.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (lowerOption.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
        if (numberOption.checked) chars += '0123456789';
        if (symbolOption.checked) chars += symbols.value;

        // Ensure at least one character type is selected
        if (chars === '') {
            showNotification('Please select at least one character type');
            return;
        }

        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        if (wordOption.checked && addWord.value) {
            const word = addWord.value;
            const position = Math.floor(Math.random() * (password.length + 1));
            password = password.slice(0, position) + word + password.slice(position);
        }

        passwordDisplay.value = password;
        updatePasswordStrength();
    }

    // Event listeners
    generateBtn.addEventListener('click', generatePassword);
    refreshBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyPassword);
    generateQrBtn.addEventListener('click', generateQRCode);
    closeModal.addEventListener('click', () => qrModal.classList.remove('show'));
    
    // Close modal when clicking outside
    qrModal.addEventListener('click', function(e) {
        if (e.target === qrModal) {
            qrModal.classList.remove('show');
        }
    });

    // Update strength when password is changed
    passwordDisplay.addEventListener('input', updatePasswordStrength);

    // Initialize
    generatePassword();
});