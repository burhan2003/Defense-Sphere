document.addEventListener("DOMContentLoaded", () => {
  const signInBtn = document.getElementById("sign-in-btn")
  const forgotPasswordLink = document.getElementById("forgot-password")
  const createAccountLink = document.getElementById("create-account")
  const form = document.getElementById("login-form")
  const facialRecognitionOverlay = document.getElementById("facial-recognition-overlay")
  const faceAnimation = document.getElementById("face-animation")
  const checkmarkAnimation = document.getElementById("checkmark-animation")
  const scanStatus = document.querySelector(".scan-status")
  const scanText = document.getElementById("scan-text")

  // Function to create and animate data points
  function createDataPoints() {
    const dataPointsContainer = document.createElement("div")
    dataPointsContainer.className = "data-points"
    faceAnimation.appendChild(dataPointsContainer)

    // Create 20 random data points
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const dataPoint = document.createElement("div")
        dataPoint.className = "data-point"
        dataPoint.style.left = `${Math.random() * 100}%`
        dataPoint.style.top = `${Math.random() * 100}%`
        dataPointsContainer.appendChild(dataPoint)

        // Remove data point after animation completes
        setTimeout(() => {
          dataPoint.remove()
        }, 1000)
      }, i * 300)
    }
  }

  // Function to transition from face to checkmark
  function transitionToCheckmark() {
    // Update scan status text
    scanText.textContent = "Authentication Successful"
    scanStatus.classList.add("success")

    // Add fade out class to face animation
    faceAnimation.classList.add("fade-out")

    // After face fades out, show checkmark
    setTimeout(() => {
      faceAnimation.style.display = "none"
      checkmarkAnimation.style.display = "block"
      checkmarkAnimation.classList.add("fade-in")

      // After checkmark animation completes, redirect
      setTimeout(() => {
        facialRecognitionOverlay.classList.remove("active")

        // Reset for next time
        setTimeout(() => {
          faceAnimation.classList.remove("fade-out")
          faceAnimation.style.display = "block"
          checkmarkAnimation.classList.remove("fade-in")
          checkmarkAnimation.style.display = "none"
          scanStatus.classList.remove("success")
          scanText.textContent = "Facial Recognition in Progress"

          // Remove any data points that might still be there
          const dataPointsContainer = document.querySelector(".data-points")
          if (dataPointsContainer) {
            dataPointsContainer.remove()
          }
        }, 500)
      }, 2000)
    }, 500)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    // Show facial recognition overlay
    facialRecognitionOverlay.classList.add("active")

    // Start data points animation
    createDataPoints()

    // Disable the sign-in button
    signInBtn.disabled = true
    signInBtn.textContent = "Verifying..."

    const formData = new FormData(form)

    // Prepare the data to be sent to the /login endpoint
    const data = {}
    formData.forEach((value, key) => {
      data[key] = value
    })

    // Send POST request to /login
    await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    })

    // Simulate facial recognition process (3 seconds)
    setTimeout(async () => {
      await fetch("/login/data")
        .then((response) => response.json())
        .then((data) => {
          if (data.response === 0) {
            // Transition to checkmark
            transitionToCheckmark()

            // Show success message
            showMessage("Login successful", "success")

            // Redirect after checkmark animation completes
            setTimeout(() => {
              if (data.isAdmin === true) {
                window.location.href = "/admin-dashboard"
              } else {
                window.location.href = "/dashboard"
              }
            }, 3000) // Increased to allow for full animation
          } else {
            // Hide facial recognition overlay
            facialRecognitionOverlay.classList.remove("active")
            showMessage("Invalid credentials", "error")
            // Reset button
            signInBtn.disabled = false
            signInBtn.textContent = "Sign In"
          }
        })
        .catch((error) => {
          // Hide facial recognition overlay
          facialRecognitionOverlay.classList.remove("active")

          console.error("Error:", error)
          showMessage("An error occurred during login", "error")

          // Reset button
          signInBtn.disabled = false
          signInBtn.textContent = "Sign In"
        })
    }, 3000)

    return true
  }

  function showMessage(message, type) {
    const messageDiv = document.createElement("div")
    const backgroundColor = type === "success" ? "#e8f5e9" : "#fff3f3"
    const borderColor = type === "success" ? "#a5d6a7" : "#ffcdd2"
    const textColor = type === "success" ? "#2e7d32" : "#d32f2f"

    messageDiv.innerHTML = `
            <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
                        background: ${backgroundColor}; padding: 15px 25px; 
                        border: 1px solid ${borderColor}; 
                        border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); 
                        z-index: 1000;">
                <p style="color: ${textColor}; margin: 0; font-size: 14px;">${message}</p>
            </div>
        `
    document.body.appendChild(messageDiv)

    // Remove the message after 3 seconds
    setTimeout(() => {
      document.body.removeChild(messageDiv)
    }, 3000)
  }

  createAccountLink.addEventListener("click", (event) => {
    event.preventDefault()
    window.location.href = "/register"
  })

  form.addEventListener("submit", handleSubmit)

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
    togglePasswordContainer.style.top = '50%';
    togglePasswordContainer.style.transform = 'translateY(-50%)';
    togglePasswordContainer.style.zIndex = '1';
    togglePasswordContainer.style.display = 'flex';
    togglePasswordContainer.style.alignItems = 'center';
    togglePasswordContainer.style.justifyContent = 'center';
  }
})

