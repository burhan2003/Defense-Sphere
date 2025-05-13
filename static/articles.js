document.addEventListener("DOMContentLoaded", () => {
  // Initialize background effects
  initBackgroundEffects()

  // Remove the custom cursor initialization
  // initCustomCursor()

  // Initialize header scroll effect
  initHeaderScroll()

  // Initialize mobile menu
  initMobileMenu()

  // Fetch news articles
  fetchNews()
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

// Remove or comment out the custom cursor functionality
/*
function initCustomCursor() {
  const cursorDot = document.querySelector(".cursor-dot")
  const cursorOutline = document.querySelector(".cursor-outline")

  if (!cursorDot || !cursorOutline) return

  // Check if we're not on mobile
  const isMobile = window.matchMedia("(max-width: 768px)").matches

  if (isMobile) {
    cursorDot.style.display = "none"
    cursorOutline.style.display = "none"
    return
  }

  document.addEventListener("mousemove", (e) => {
    // Position the dot directly at cursor position
    cursorDot.style.left = `${e.clientX}px`
    cursorDot.style.top = `${e.clientY}px`

    // Position the outline with a slight delay for a trailing effect
    setTimeout(() => {
      cursorOutline.style.left = `${e.clientX}px`
      cursorOutline.style.top = `${e.clientY}px`
    }, 80)
  })

  // Add special effects for interactive elements
  const interactiveElements = document.querySelectorAll("a, button, input, select, .article-card")

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorOutline.style.width = "60px"
      cursorOutline.style.height = "60px"
      cursorOutline.style.borderColor = "rgba(15, 255, 179, 0.8)"
      cursorDot.style.opacity = "0.5"
    })

    el.addEventListener("mouseleave", () => {
      cursorOutline.style.width = "40px"
      cursorOutline.style.height = "40px"
      cursorOutline.style.borderColor = "rgba(15, 255, 179, 0.5)"
      cursorDot.style.opacity = "1"
    })
  })

  // Add click effect
  document.addEventListener("mousedown", () => {
    cursorDot.style.transform = "translate(-50%, -50%) scale(0.5)"
    cursorOutline.style.transform = "translate(-50%, -50%) scale(0.8)"
  })

  document.addEventListener("mouseup", () => {
    cursorDot.style.transform = "translate(-50%, -50%) scale(1)"
    cursorOutline.style.transform = "translate(-50%, -50%) scale(1)"
  })

  // Add magnetic effect to buttons
  const buttons = document.querySelectorAll(".primary-button, .cta-button")

  buttons.forEach((button) => {
    button.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const moveX = (x - centerX) / 10
      const moveY = (y - centerY) / 10

      this.style.transform = `translate(${moveX}px, ${moveY}px)`
    })

    button.addEventListener("mouseleave", function () {
      this.style.transform = ""
    })
  })
}
*/

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

async function fetchNews() {
  try {
    const response = await fetch("/articles/data")
    const data = await response.json()

    if (data.articles && data.articles.length > 0) {
      // Update hero section with the latest article
      updateHeroSection(data.articles[0])

      // Update grid with remaining articles
      updateNewsGrid(data.articles.slice(1))
    }
  } catch (error) {
    console.error("Error fetching news:", error)
    showErrorMessage()
  }
}

function updateHeroSection(article) {
  document.getElementById("hero-title").textContent = article.title
  document.getElementById("hero-description").textContent = article.description
  document.getElementById("hero-date").textContent = formatDate(article.publishedAt)
  document.getElementById("hero-link").href = article.url
}

function updateNewsGrid(articles) {
  const grid = document.getElementById("news-grid")
  grid.innerHTML = "" // Clear loading spinner

  articles.forEach((article) => {
    const articleCard = createArticleCard(article)
    grid.appendChild(articleCard)
  })
}

function createArticleCard(article) {
  const card = document.createElement("article")
  card.className = "article-card"

  card.innerHTML = `
          <img src="${article.urlToImage || "/static/images/article-not-found.jpg"}" 
               alt="${article.title}"
               onerror="this.src='/static/images/article-not-found.jpg'">
          <div class="article-content">
              <span class="article-category" style="color: #afafaf">Cybersecurity News</span>
              <h3 style="color: #c0009c;">${article.title}</h3>
              <p>${article.description || "Click to read more about this story."}</p>
              <a href="${article.url}" class="read-more" target="_blank">Continue Reading</a>
          </div>
      `

  return card
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function showErrorMessage() {
  const grid = document.getElementById("news-grid")
  grid.innerHTML = `
          <div class="error-message">
              <p>Sorry, we couldn't load the latest news. Please try again later.</p>
          </div>
      `
}
