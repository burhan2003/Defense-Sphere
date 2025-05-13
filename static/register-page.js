document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('strengthIndicator');

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

    function updatePasswordStrength() {
        const password = passwordInput.value;
        if (password === '') {
            strengthIndicator.textContent = '';
            strengthIndicator.className = 'strength-indicator';
        } else {
            const strength = assessPasswordStrength(password);
            strengthIndicator.textContent = strength;
            strengthIndicator.className = 'strength-indicator ' + strength.toLowerCase().replace(' ', '-');
        }
    }

    // Add event listener for password input
    passwordInput.addEventListener('input', updatePasswordStrength);

    async function handleSubmit(event) {
        event.preventDefault();
        showCameraPanel();
    }

    function showCameraPanel() {
        const cameraPanel = document.getElementById('camera-panel');
        const video = document.getElementById('video');
        const canvas = document.getElementById('canvas');
        const captureBtn = document.getElementById('capture-btn');
        const cancelBtn = document.getElementById('cancel-camera-btn');
        
        // Show the camera panel
        cameraPanel.style.display = 'flex';
        video.style.display = 'block';
        canvas.style.display = 'none';

        // Access the webcam
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
            })
            .catch(err => {
                console.error('Error accessing camera:', err);
                alert('Unable to access camera. Please make sure you have granted camera permissions.');
                cameraPanel.style.display = 'none';
            });

        // Handle capture button click
        captureBtn.onclick = async () => {
            // Set canvas size to match video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame on the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            try {
                // Convert canvas to blob and save as reference.jpg
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.95));
                const formData = new FormData();
                formData.append('image', blob, 'reference.jpg');
                
                // Send image to server
                const response = await fetch('/save-reference-image', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to save image');
                }

                // Stop the video stream
                const stream = video.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());

                // Hide the camera panel
                cameraPanel.style.display = 'none';
                
                // Call submitRegistration after capturing the image
                await submitRegistration(); 
            } catch (error) {
                console.error('Error saving image:', error);
            }
        };

        // Handle cancel button click
        cancelBtn.onclick = () => {
            const stream = video.srcObject;
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
            cameraPanel.style.display = 'none';
        };
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
                        background: #fff3f3; padding: 15px 25px; border: 1px solid #ffcdd2; 
                        border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); z-index: 1000;">
                <p style="color: #d32f2f; margin: 0; font-size: 14px;">${message}</p>
            </div>
        `;
        document.body.appendChild(errorDiv);

        // Remove the error message after 5 seconds
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 5000);
    }

    function showPopup(userId) {
        const popup = document.createElement('div');
        popup.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #0f172a;
             padding: 20px; border: 1px solid #ccc; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 1000; border-radius: 10px;">
                <h2>Registration Successful</h2>
                <p>Your account has been created. Please copy your User ID for future reference.</p>
                <p style="font-size: 24px; margin: 20px 0; text-align: center; letter-spacing: 2px; font-weight: bold;">${userId}</p>
                <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                    <button id="copyButton" style="flex: 1; padding: 10px 20px; border: none; background-color: #0fffb3; color: #0f172a; border-radius: 5px; cursor: pointer; margin-right: 10px; font-weight: 600;">Copy User ID</button>
                    <button id="closeButton" style="flex: 1; padding: 10px 20px; border: 2px solid #0fffb3; background-color: transparent; color: #0fffb3; border-radius: 5px; cursor: pointer; font-weight: 600;">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('copyButton').addEventListener('click', function() {
            const copyButton = document.getElementById('copyButton');
            navigator.clipboard.writeText(userId).then(function() {
                copyButton.textContent = 'Copied';
            }).catch(function(err) {
                console.error('Failed to copy: ', err);
            });
        });

        document.getElementById('closeButton').addEventListener('click', function() {
            document.body.removeChild(popup);
            window.location.href = '/login';
        });
    }

    async function submitRegistration() {
        // Get and disable the button        
        const registerBtn = document.getElementById('register-btn');
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating your account...';
        registerBtn.style.opacity = '0.7';
        registerBtn.style.cursor = 'not-allowed';

        try {

            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                // body: JSON.stringify(data)
                body: new URLSearchParams(data)
            });

            // Fetch user data after registration
            const response = await fetch("/register/data");
            const userData = await response.json();

            if (userData.userID === -1) {
                showError("This user already exists. Please login.");
            } else {
                showPopup(userData.userID);
            }
        } catch (error) {
            console.error('Registration error:', error);
            showError("An error occurred during registration. Please try again. " + 
                     "Check the console for more details.");
        } finally {
            // Always re-enable the button
            registerBtn.disabled = false;
            registerBtn.textContent = 'Create Your Account';
            registerBtn.style.opacity = '1';
            registerBtn.style.cursor = 'pointer';
        }
    }

    form.addEventListener('submit', handleSubmit);

    // Add password toggle functionality
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const input = this.closest('.password-group').querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Add this after the DOMContentLoaded event listener starts
    const togglePasswordContainer = document.querySelector('.toggle-password-container');
    if (togglePasswordContainer) {
        togglePasswordContainer.style.position = 'absolute';
        togglePasswordContainer.style.right = '12px';
        togglePasswordContainer.style.top = '35%';
        togglePasswordContainer.style.transform = 'translateY(-50%)';
        togglePasswordContainer.style.zIndex = '2';
        togglePasswordContainer.style.display = 'flex';
        togglePasswordContainer.style.alignItems = 'center';
        togglePasswordContainer.style.justifyContent = 'center';
        togglePasswordContainer.style.height = '100%';
        togglePasswordContainer.style.pointerEvents = 'auto';
    }

    // Also add this to ensure the input field has proper padding
    if (passwordInput) {
        passwordInput.style.paddingRight = '45px';
    }
});

