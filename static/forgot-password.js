document.addEventListener('DOMContentLoaded', function() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const userIdGroup = document.getElementById('user-id-group');
    const usernameGroup = document.getElementById('username-group');
    const resetForm = document.getElementById('reset-form');
    // New elements for facial recognition
    const facialRecognitionOverlay = document.getElementById("facial-recognition-overlay");
    const faceAnimation = document.getElementById("face-animation");
    const checkmarkAnimation = document.getElementById("checkmark-animation");
    const scanStatus = document.getElementById("scan-status");
    const scanText = document.getElementById("scan-text");
    const authenticateBtn = document.getElementById("authenticate-btn");

    // Function to create and animate data points
    function createDataPoints() {
        const dataPointsContainer = document.createElement("div");
        dataPointsContainer.className = "data-points";
        faceAnimation.appendChild(dataPointsContainer);
    
        // Create 20 random data points
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const dataPoint = document.createElement("div");
                dataPoint.className = "data-point";
                dataPoint.style.left = `${Math.random() * 100}%`;
                dataPoint.style.top = `${Math.random() * 100}%`;
                dataPointsContainer.appendChild(dataPoint);
    
                // Remove data point after animation completes
                setTimeout(() => {
                    dataPoint.remove();
                }, 1000);
            }, i * 300);
        }
    }
    
    // Function to transition from face to checkmark
    function transitionToCheckmark() {
        // Update scan status text
        scanText.textContent = "Authentication Successful";
        scanStatus.classList.add("success");
    
        // Add fade out class to face animation
        faceAnimation.classList.add("fade-out");
    
        // After face fades out, show checkmark
        setTimeout(() => {
            faceAnimation.style.display = "none";
            checkmarkAnimation.style.display = "block";
            checkmarkAnimation.classList.add("fade-in");
    
            // After checkmark animation completes, redirect
            setTimeout(() => {
                facialRecognitionOverlay.classList.remove("active");
    
                // Reset for next time
                setTimeout(() => {
                    faceAnimation.classList.remove("fade-out");
                    faceAnimation.style.display = "block";
                    checkmarkAnimation.classList.remove("fade-in");
                    checkmarkAnimation.style.display = "none";
                    scanStatus.classList.remove("success");
                    scanText.textContent = "Facial Recognition in Progress";
    
                    // Remove any data points that might still be there
                    const dataPointsContainer = document.querySelector(".data-points");
                    if (dataPointsContainer) {
                        dataPointsContainer.remove();
                    }
                    
                    // Redirect to reset password page
                    window.location.href = '/reset-password';
                }, 500);
            }, 2000);
        }, 500);
    }

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Show/hide appropriate input
            if (this.dataset.input === 'user-id') {
                userIdGroup.style.display = 'block';
                usernameGroup.style.display = 'none';
                document.getElementById('username').value = ''; // Clear username input
            } else {
                userIdGroup.style.display = 'none';
                usernameGroup.style.display = 'block';
                document.getElementById('user-id').value = ''; // Clear user-id input
            }
        });
    });

    resetForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevents form from submitting normally
        
        const activeInput = document.querySelector('.toggle-btn.active').dataset.input;
        const inputValue = activeInput === 'user-id' 
            ? document.getElementById('user-id').value 
            : document.getElementById('username').value;
        const dataType = activeInput === 'user-id' ? 1 : 2;

        // Disable the authenticate button
        if (authenticateBtn) {
            authenticateBtn.disabled = true;
            authenticateBtn.innerHTML = '<span>Processing...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
        }

        // Show facial recognition overlay
        if (facialRecognitionOverlay) {
            facialRecognitionOverlay.classList.add("active");
            // Start data points animation
            createDataPoints();
        }

        // Prepare the data to be sent to the server
        const data = {
            x1: dataType, // 1 for User ID, 2 for Username
            x2: inputValue // The value entered by the user
        };

        // Send POST request to /forgot-password
        fetch('/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Handle the response from the server here
            
            // Show facial recognition success animation
            if (facialRecognitionOverlay) {
                // Simulate facial recognition process (3 seconds)
                setTimeout(() => {
                    transitionToCheckmark();
                }, 3000);
            } else {
                // If facial recognition is not available, redirect directly
                window.location.href = '/reset-password';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            
            // Hide facial recognition overlay if there's an error
            if (facialRecognitionOverlay) {
                facialRecognitionOverlay.classList.remove("active");
            }
            
            // Re-enable the button
            if (authenticateBtn) {
                authenticateBtn.disabled = false;
                authenticateBtn.innerHTML = '<span>Authenticate</span> <i class="fa-solid fa-arrow-right"></i>';
            }
        });
    });
});