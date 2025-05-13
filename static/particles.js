document.addEventListener("DOMContentLoaded", () => {
    const particlesContainer = document.getElementById("particles")
  
    // Create particles
    function createParticles() {
      // Clear existing particles
      particlesContainer.innerHTML = ""
  
      // Number of particles
      const particleCount = 50
  
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.classList.add("particle")
  
        // Random position
        const posX = Math.random() * 100
        const posY = Math.random() * 100
  
        // Random size
        const size = Math.random() * 3 + 1
  
        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1
  
        // Random animation duration
        const duration = Math.random() * 60 + 30
  
        // Random delay
        const delay = Math.random() * 10
  
        // Set styles
        particle.style.left = `${posX}%`
        particle.style.top = `${posY}%`
        particle.style.width = `${size}px`
        particle.style.height = `${size}px`
        particle.style.opacity = opacity
        particle.style.animation = `float ${duration}s linear ${delay}s infinite`
  
        // Add to container
        particlesContainer.appendChild(particle)
      }
    }
  
    // Initialize particles
    createParticles()
  
    // Recreate particles on window resize
    window.addEventListener("resize", createParticles)
  })
  
  