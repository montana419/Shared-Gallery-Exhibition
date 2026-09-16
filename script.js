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
  
  if (wall) {
    wall.style.transform = `translateX(${walkDistance}px)`;
  }
}

window.addEventListener('scroll', handleScroll, { passive: true });

// 2. Mouse-Look Mechanics with Smooth Interpolation (LERP)
window.addEventListener('mousemove', (e) => {
  targetX = (e.clientX / window.innerWidth) - 0.5;
  targetY = (e.clientY / window.innerHeight) - 0.5;
});

function updateCameraTilt() {
  currentX += (targetX - currentX) * 0.08;
  currentY += (targetY - currentY) * 0.08;

  const rotateY = currentX * 18;
  const rotateX = -currentY * 12;

  if (room) {
    room.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  }

  requestAnimationFrame(updateCameraTilt);
}
requestAnimationFrame(updateCameraTilt);

// 3. Hover & Click Interactivity for Artwork Frames
frames.forEach(frame => {
  frame.addEventListener('mouseenter', () => wall && wall.classList.add('has-hover'));
  frame.addEventListener('mouseleave', () => wall && wall.classList.remove('has-hover'));

  frame.addEventListener('click', () => {
    const img = frame.querySelector('img');
    const title = frame.getAttribute('data-title') || 'Untitled Artwork';

    if (!img) return;

    frame.classList.add('stepping-in');

    setTimeout(() => {
      if (lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = title;
      }
      if (lightboxTitle) {
        lightboxTitle.textContent = title;
      }
      if (lightbox) {
        lightbox.classList.add('active');
      }

      setTimeout(() => {
        frame.classList.remove('stepping-in');
      }, 300);
    }, 450);
  });
});

// 4. Lightbox Dismissal Handlers
function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

if (closeBtn) {
  closeBtn.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});