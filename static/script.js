document.addEventListener("DOMContentLoaded", () => {
  // Initialize background effects
  initBackgroundEffects()

  // Initialize header scroll effect
  initHeaderScroll()

  // Initialize feature tabs
  initFeatureTabs()

  // Initialize mobile menu
  initMobileMenu()

  // Initialize smooth scrolling
  initSmoothScroll()

  // Initialize animations
  initAnimations()

  // Initialize email form
  initEmailForm()
})

// Background effects initialization
function initBackgroundEffects() {
  // Create background container if it doesn't exist
  if (!document.querySelector(".background-animation")) {
    const backgroundContainer = document.createElement("div")
    backgroundContainer.className = "background-animation"

    const digitalGrid = document.createElement("div")
    digitalGrid.className = "digital-grid"

    const particlesContainer = document.createElement("div")
    particlesContainer.className = "particles-container"

    const binaryRainContainer = document.createElement("div")
    binaryRainContainer.className = "binary-rain-container"

    backgroundContainer.appendChild(digitalGrid)
    backgroundContainer.appendChild(particlesContainer)
    backgroundContainer.appendChild(binaryRainContainer)

    document.body.insertBefore(backgroundContainer, document.body.firstChild)
  }

  // Initialize particles
  initParticles()

  // Initialize glowing orbs
  initGlowOrbs()

  // Initialize binary rain
  initBinaryRain()

  // Add scan line
  const scanLine = document.createElement("div")
  scanLine.className = "scan-line"
  document.querySelector(".background-animation").appendChild(scanLine)
}

// Create particles
function initParticles() {
  const container = document.querySelector(".particles-container")
  const particleCount = window.innerWidth < 768 ? 30 : 60

  for (let i = 0; i < particleCount; i++) {
    const size = Math.random() * 4 + 1
    const particle = document.createElement("div")
    particle.className = "particle"
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${Math.random() * 100}%`
    particle.style.top = `${Math.random() * 100}%`
    particle.style.opacity = `${Math.random() * 0.5 + 0.1}`

    // Set animation properties
    const duration = Math.random() * 50 + 30
    particle.style.animation = `floatParticle ${duration}s linear infinite`
    container.appendChild(particle)
  }
}

// Create glowing orbs
function initGlowOrbs() {
  const container = document.querySelector(".background-animation")
  const orbCount = window.innerWidth < 768 ? 2 : 4

  for (let i = 0; i < orbCount; i++) {
    const orb = document.createElement("div")
    orb.className = "glow-orb"

    // Random size between 150px and 300px
    const size = Math.random() * 150 + 150
    orb.style.width = `${size}px`
    orb.style.height = `${size}px`

    // Random position
    orb.style.left = `${Math.random() * 100}%`
    orb.style.top = `${Math.random() * 100}%`

    // Animation
    const duration = Math.random() * 60 + 60
    orb.style.transition = `transform ${duration}s ease-in-out, left ${duration}s ease-in-out, top ${duration}s ease-in-out`

    container.appendChild(orb)

    // Move orbs slowly
    setInterval(() => {
      orb.style.left = `${Math.random() * 100}%`
      orb.style.top = `${Math.random() * 100}%`
    }, duration * 1000)
  }
}

// Create binary rain effect
function initBinaryRain() {
  const container = document.querySelector(".binary-rain-container")
  const columnCount = Math.floor(window.innerWidth / 20)

  for (let i = 0; i < columnCount; i++) {
    const column = document.createElement("div")
    column.className = "binary-column"

    // Generate binary content
    let binaryString = ""
    const length = Math.floor(Math.random() * 20) + 10
    for (let j = 0; j < length; j++) {
      binaryString += Math.random() > 0.5 ? "1" : "0"
    }
    column.textContent = binaryString

    // Position and animation
    column.style.left = `${i * 20}px`
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 10

    column.style.animation = `binaryRain ${duration}s linear ${delay}s infinite`
    container.appendChild(column)
  }
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.getElementById("main-header")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })
}

// Feature tabs functionality
function initFeatureTabs() {
  const tabs = document.querySelectorAll(".feature-tab")
  const details = document.querySelectorAll(".feature-detail")

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const feature = tab.getAttribute("data-feature")

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"))
      tab.classList.add("active")

      // Update active detail
      details.forEach((d) => d.classList.remove("active"))
      document.getElementById(feature).classList.add("active")
    })
  })
}

// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.querySelector(".mobile-menu-toggle")
  const navLinks = document.querySelector(".nav-links")

  if (!menuToggle || !navLinks) return

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active")
    menuToggle.classList.toggle("active")
  })
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: "smooth",
        })
      }
    })
  })
}

// Email form submission
function initEmailForm() {
  const emailForm = document.getElementById("email-form")

  if (!emailForm) return

  emailForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const emailInput = emailForm.querySelector('input[type="email"]')
    const submitButton = emailForm.querySelector('button[type="submit"]')

    if (!emailInput || !submitButton) return

    // Disable form elements during submission
    emailInput.disabled = true
    submitButton.disabled = true
    submitButton.textContent = "Sending..."

    // Simulate form submission
    setTimeout(() => {
      // Show success message
      emailForm.innerHTML = `
                <div style="color: var(--accent-color); font-weight: 500; font-size: 1.1rem;">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 8px;">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Thank you! We'll be in touch soon.
                </div>
            `
    }, 1500)
  })
}
