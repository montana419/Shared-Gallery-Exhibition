// DOM Element References
const wall = document.getElementById('wall');
const room = document.getElementById('room');
const frames = document.querySelectorAll('.frame');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const closeBtn = document.getElementById('closeBtn');

// State Management via requestAnimationFrame for performance
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

// 1. Horizontal Walking along Wall (Scroll Driven)
function handleScroll() {
  const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollMax <= 0) return;

  const scrollFraction = window.scrollY / scrollMax;
  const walkDistance = -scrollFraction * 3400; // Adjust total length as needed
  
  wall.style.transform = `translateX(${walkDistance}px)`;
}

window.addEventListener('scroll', handleScroll, { passive: true });

// 2. Mouse-Look Mechanics with Smooth Interpolation (LERP)
window.addEventListener('mousemove', (e) => {
  // Normalize cursor coordinates from -0.5 to 0.5
  targetX = (e.clientX / window.innerWidth) - 0.5;
  targetY = (e.clientY / window.innerHeight) - 0.5;
});

function updateCameraTilt() {
  // Linear interpolation for silky smooth rotation transitions
  currentX += (targetX - currentX) * 0.08;
  currentY += (targetY - currentY) * 0.08;

  const rotateY = currentX * 18; // Max Y-rotation in degrees
  const rotateX = -currentY * 12; // Max X-rotation in degrees

  if (room) {
    room.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  }

  requestAnimationFrame(updateCameraTilt);
}
requestAnimationFrame(updateCameraTilt);

// 3. Hover & Click Interactivity for Artwork Frames
frames.forEach(frame => {
  // Background focus state on hover
  frame.addEventListener('mouseenter', () => wall.classList.add('has-hover'));
  frame.addEventListener('mouseleave', () => wall.classList.remove('has-hover'));

  // "Walk Up To Picture" Animation Sequence on Click
  frame.addEventListener('click', () => {
    const img = frame.querySelector('img');
    const title = frame.getAttribute('data-title') || 'Untitled Artwork';

    if (!img) return;

    // Step 1: Trigger camera walk-up animation
    frame.classList.add('stepping-in');

    // Step 2: Display Lightbox
    setTimeout(() => {
      lightboxImg.src = img.src;
      lightboxImg.alt = title;
      lightboxTitle.textContent = title;
      lightbox.classList.add('active');

      // Step 3: Reset step-in class behind overlay
      setTimeout(() => {
        frame.classList.remove('stepping-in');
      }, 300);
    }, 450);
  });
});

// 4. Lightbox Dismissal Handlers
function closeLightbox() {
  lightbox.classList.remove('active');
}

if (closeBtn) {
  closeBtn.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

// Keyboard shortcut (ESC key) to dismiss lightbox
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});