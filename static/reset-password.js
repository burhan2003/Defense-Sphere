document.addEventListener("DOMContentLoaded", () => {
    // Get the password input element
    const passwordInput = document.getElementById("password")
    const confirmPasswordInput = document.getElementById("confirm-password")
    const strengthIndicator = document.getElementById("strengthIndicator")
    const strengthBar = document.getElementById("strengthBar")
    const resetForm = document.getElementById("reset-password-form")
    const requirements = document.querySelectorAll(".requirement")
    const toggleButtons = document.querySelectorAll(".toggle-password")
  
    // Toggle password visibility
    toggleButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const input = this.parentElement.querySelector("input")
        const icon = this.querySelector("i")
  
        if (input.type === "password") {
          input.type = "text"
          icon.classList.remove("fa-eye")
          icon.classList.add("fa-eye-slash")
        } else {
          input.type = "password"
          icon.classList.remove("fa-eye-slash")
          icon.classList.add("fa-eye")
        }
      })
    })
  
    // Log password as user types
    passwordInput.addEventListener("input", function () {
      // Add password strength indicator
      const strength = checkPasswordStrength(this.value)
      strengthIndicator.textContent = strength.charAt(0).toUpperCase() + strength.slice(1)
      strengthIndicator.className = "strength-indicator " + strength
      strengthBar.className = "strength-progress " + strength
  
      // Update requirements
      updateRequirements(this.value)
    })
  
    // Log form submission
    resetForm.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Check if passwords match
      if (passwordInput.value !== confirmPasswordInput.value) {
        alert("Passwords do not match!")
        return
      }
  
      // console.log("Reset password form submitted with:", {
      //   password: passwordInput.value,
      // })

      fetch("/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 'password': passwordInput.value }),
      })
      .then((response) => {
          window.location.href = "/login"
      })
    })
  
    // Password strength checker function
    function checkPasswordStrength(password) {
      if (password.length === 0) return "empty"
      if (password.length < 8) return "weak"
  
      let strength = 0
      if (password.match(/[a-z]/)) strength++
      if (password.match(/[A-Z]/)) strength++
      if (password.match(/[0-9]/)) strength++
      if (password.match(/[^a-zA-Z0-9]/)) strength++
  
      if (strength < 2) return "weak"
      if (strength < 3) return "medium"
      return "strong"
    }
  
    // Update password requirements
    function updateRequirements(password) {
      // Check length
      if (password.length >= 8) {
        requirements[0].classList.add("valid")
      } else {
        requirements[0].classList.remove("valid")
      }
  
      // Check uppercase & lowercase
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        requirements[1].classList.add("valid")
      } else {
        requirements[1].classList.remove("valid")
      }
  
      // Check numbers or symbols
      if (password.match(/[0-9]/) || password.match(/[^a-zA-Z0-9]/)) {
        requirements[2].classList.add("valid")
      } else {
        requirements[2].classList.remove("valid")
      }
    }
  })
  
  