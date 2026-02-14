
// // Check if site is still accessible (only for 2 days from Feb 13, 2026)
// const launchDate = new Date("2026-02-14").getTime(); // Set your launch date
// const now = new Date().getTime();
// const twoDays = 2 * 24 * 60 * 60 * 1000;

// if (now - launchDate > twoDays) {
//   document.body.innerHTML = `
//         <div style="text-align:center; padding:50px; font-family:sans-serif; color:white; background:linear-gradient(135deg,#0f0c29,#302b63,#24243e); min-height:100vh; display:flex; flex-direction:column; justify-content:center;">
//             <h1 style="font-size:3rem; margin-bottom:20px;"><i class="fas fa-clock"></i> Time's Up!</h1>
//             <p style="font-size:1.2rem;">This Valentine's message was only available for 2 days.</p>
//             <p>If you missed it, hit up Desmond <i class="fas fa-smile-wink"></i></p>
//             <a href="/404.html" style="display:inline-block; margin-top:30px; padding:15px 30px; background:#ff4081; color:white; text-decoration:none; border-radius:50px;">Contact Desmond</a>
//         </div>
//     `;
//   throw new Error("Site expired"); // Stop further JS execution
// }

// DOM Elements
const envelope = document.querySelector(".envelope");
const openBtn = document.getElementById("openBtn");
const letterContent = document.getElementById("letterContent");
const scrollProgress = document.getElementById("scrollProgress");
const scrollIndicator = document.querySelector(".scroll-indicator");
const instructions = document.querySelector(".instructions");
// State
let isOpened = false;
let scrollPercent = 0;
 
function cleanName(name) {
  return name
    .replace(/[^a-zA-Z\s]/g, "") // remove symbols
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ") // collapse spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize first letter
}

// Get friend name from URL
function getId() {
  // URL: /friends/winner
  const path = window.location.pathname; // "/friends/winner"
  const parts = path.split("/").filter((p) => p); // ["friends", "winner"]

  if (parts.length >= 2 && parts[0] === "friends") {
    let id = parts[1];

    return id; // "winner"
  }

  return null;
}

// Load friend's message from API
async function loadFriendMessage() {
  const id = getId();
  if (id) {

    try {
      // Fetch from your API
      const response = await fetch(
        `/api/friends/${id}?password=jehovah_hide_123`
      );

      if (!response.ok) {
        throw new Error(`Friend not found: ${id}`);
      }

      const data = await response.json();

      // Update the page
      updatePageWithMessage(data);
    } catch (error) {
      // showErrorMessage(error.message);
    }
  } else {
      window.location.href = "/404.html";
  }
}

// Update page with friend's message
function updatePageWithMessage(data) {
  // Update name (capitalize first letter)
  const displayName = cleanName(data.name)
  document.getElementById("previewName").textContent = displayName;
  document.getElementById("friendName").textContent = displayName;

  // Update message
  document.getElementById("messageText").innerHTML = ` 
        <p>${data.message}</p>
        <p class="poem">
            "In bits and bytes, I code my care,<br>
            A digital hug, just to share.<br>
            Though pixels fade and screens go dark,<br>
            This memory leaves a lasting spark."
        </p>
        <p>Remember: you're awesome. Don't let anyone tell you otherwise.</p>
        <p>With love Desmond</p>
   `;
}

async function openEnvelope() {
  if (isOpened) return;
  const id = getId();
  try {
    const response = await fetch(
      `/api/friends/${id}?password=jehovah_hide_123`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (response.ok) {
    } else {
    }
  } catch (error) {
  }
  isOpened = true;
  envelope.classList.add("open");
  openBtn.style.display = "none";
  instructions.style.display = "none";
  // Show scroll indicator
  document.querySelector(".container").classList.add("letter-open");
  setTimeout(() => {
    letterContent.classList.add("scrolled");
  }, 1500);

  // Add confetti
  createConfetti();
}
// Update scroll progress
function updateScrollProgress() {
  const scrollTop = letterContent.scrollTop;
  const scrollHeight = letterContent.scrollHeight - letterContent.clientHeight;
  scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  scrollProgress.style.width = `${scrollPercent}%`;

  // Hide hint when scrolled enough
  if (scrollPercent > 30) {
    scrollIndicator.querySelector(".scroll-hint").style.opacity = Math.max(
      0,
      1 - (scrollPercent - 30) / 30
    );
  }
}

// Initialize everything
function init() {

  loadFriendMessage();

  // Set up event listeners
  if (openBtn) {
    openBtn.addEventListener("click", openEnvelope);
  }

  if (letterContent) {
    letterContent.addEventListener("scroll", updateScrollProgress);
  }

}

function createConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  if (!canvas) {
    // Create canvas if not present (safety)
    const newCanvas = document.createElement("canvas");
    newCanvas.id = "confettiCanvas";
    newCanvas.style.position = "fixed";
    newCanvas.style.top = "0";
    newCanvas.style.left = "0";
    newCanvas.style.width = "100%";
    newCanvas.style.height = "100%";
    newCanvas.style.pointerEvents = "none";
    newCanvas.style.zIndex = "9999";
    document.body.appendChild(newCanvas);
  }

  const canvasEl = document.getElementById("confettiCanvas");
  const ctx = canvasEl.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  let particles = [];
  let confettiActive = true;
  let animationFrame;

  canvasEl.width = width;
  canvasEl.height = height;

  const colors = ["#ff4081", "#00ff88", "#ffcc00", "#9c27b0", "#2196f3"];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: Math.random() * 5 + 3,
      speedX: Math.random() * 2 - 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    let anyVisible = false;

    particles.forEach((p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      // Check if still on screen
      if (p.y < height + p.size) {
        anyVisible = true;
      }

      // Reset if below screen AND confettiActive is true
      if (p.y > height + p.size) {
        if (confettiActive) {
          p.y = -p.size;
          p.x = Math.random() * width;
        } // else just let it go (no reset)
      }
    });

    if (confettiActive || anyVisible) {
      animationFrame = requestAnimationFrame(draw);
    } else {
      // All particles gone, stop and clear
      ctx.clearRect(0, 0, width, height);
    }
  }

  draw();

  // Stop producing new confetti after 5 seconds
  setTimeout(() => {
    confettiActive = false;
  }, 3000);

  // Update canvas on resize
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvasEl.width = width;
    canvasEl.height = height;
  });
}

// Start when page loads
document.addEventListener("DOMContentLoaded", init);
