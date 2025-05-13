document.addEventListener("DOMContentLoaded", () => {
  // Initialize background effects
  initBackgroundEffects()

  // Page transition logic
  const links = document.querySelectorAll(".transition-link")

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault() // Prevent default link behavior
      const targetUrl = this.getAttribute("href") // Get the target URL

      // Fade out the current page
      gsap.to("body", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          window.location.href = targetUrl // Navigate to the new page
        },
      })
    })
  })
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

gsap.registerPlugin(ScrollTrigger)

// Animate the welcome section
gsap.from(".welcome", {
  scrollTrigger: {
    trigger: ".welcome",
    start: "top 80%", // Start animation when the top of the section is 80% from the top of the viewport
    toggleActions: "play none none reverse", // Play on enter, reverse on leave
  },
  opacity: 0,
  y: -80, // Move down 50px
  duration: 1,
})

// Animate the support topics section
gsap.from(".support-topics", {
  scrollTrigger: {
    trigger: ".support-topics",
    start: "top 80%", // Start animation when the top of the section is 80% from the top of the viewport
    toggleActions: "play none none reverse", // Play on enter, reverse on leave
  },
  opacity: 0,
  y: 80, // Move down 50px
  duration: 1,
})
document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)

  // Hero section animation
  gsap.from(".hero h1, .hero p", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2,
  })
  // Scam alert animation
  gsap.from(".scam-content", {
    scrollTrigger: {
      trigger: ".scam-alert",
      start: "top 80%",
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power2.out",
  })

  // FAQ section animation
  gsap.from(".faq-item", {
    scrollTrigger: {
      trigger: ".faq",
      start: "top 80%",
    },
    opacity: 0,
    y: 30,
    stagger: 0.2,
    duration: 0.8,
    ease: "power2.out",
  })
})

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger)


  // Initialize header scroll effect
  initHeaderScroll()

  // Initialize mobile menu
  initMobileMenu()

  // Initialize smooth scrolling
  initSmoothScroll()

  // Initialize FAQ accordion
  initFaqAccordion()

  // Initialize GSAP animations
  initGSAPAnimations()

  // Initialize page transitions
  initPageTransitions()
})


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

// FAQ accordion functionality
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const header = item.querySelector(".faq-header")

    header.addEventListener("click", () => {
      // Close all other items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active")
        }
      })

      // Toggle current item
      item.classList.toggle("active")
    })
  })

  // Open the first FAQ item by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add("active")
  }
}

// GSAP animations
function initGSAPAnimations() {
  // Ensure GSAP is loaded
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return

  // Hero section animation
  gsap.from(".hero-content", {
    duration: 1.5,
    opacity: 0,
    y: 50,
    ease: "power3.out",
  })

  // Animate sections on scroll
  const sections = document.querySelectorAll(
    ".welcome-section, .topics-section, .scam-alert-section, .faq-section, .help-section",
  )

  sections.forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    })
  })

  // Animate topic cards
  const topicCards = document.querySelectorAll(".topic-card")

  topicCards.forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: index * 0.2,
      scrollTrigger: {
        trigger: ".topics-grid",
        start: "top 80%",
      },
    })
  })

  // Animate FAQ items
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item, index) => {
    gsap.from(item, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: index * 0.2,
      scrollTrigger: {
        trigger: ".faq-grid",
        start: "top 80%",
      },
    })
  })
}

// Page transitions
function initPageTransitions() {
  const links = document.querySelectorAll(".transition-link")

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetUrl = this.getAttribute("href")

      gsap.to("body", {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          window.location.href = targetUrl
        },
      })
    })
  })
}
