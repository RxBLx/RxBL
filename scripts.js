// Partikel Bergerak
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 50;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = 'rgba(138, 43, 226, 0.5)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });

  resizeCanvas();
  initParticles();
  animate();
});

// Fade-In Saat Scroll
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
  });

  elements.forEach(element => {
    observer.observe(element);
  });
});

// Toggle Hamburger Menu
document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const hamburgerBox = document.querySelector('.hamburger-box');

  hamburgerMenu.addEventListener('click', () => {
    hamburgerBox.style.display = hamburgerBox.style.display === 'block' ? 'none' : 'block';
  });

  // Close Hamburger Menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!hamburgerBox.contains(event.target) && !hamburgerMenu.contains(event.target)) {
      hamburgerBox.style.display = 'none';
    }
  });
});

// Modal Pop-up
document.addEventListener('DOMContentLoaded', () => {
  const popupLinks = document.querySelectorAll('.popup-link');
  const modals = document.querySelectorAll('.modal');
  const closeButtons = document.querySelectorAll('.close');

  popupLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetModal = document.getElementById(link.dataset.popup + '-modal');
      targetModal.style.display = 'flex';
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      modals.forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });

  // Close Modal when clicking outside
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
});

// Pop-Up Subscribe
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.createElement('div');
  popup.classList.add('subscribe-popup');
  popup.innerHTML = `
    <span class="close-popup">&times;</span>
    <h2>Subscribe to Our Channel!</h2>
    <p>Don't miss out on our latest videos. Click below to subscribe:</p>
    <a href="https://www.youtube.com/your-channel" target="_blank">Subscribe Now</a>
  `;

  document.body.appendChild(popup);

  let popupTimeout;

  function showPopup() {
    popup.classList.add('active');
  }

  function hidePopup() {
    popup.classList.remove('active');
  }

  // Show popup every 10 minutes
  function schedulePopup() {
    popupTimeout = setTimeout(() => {
      showPopup();
      schedulePopup(); // Schedule the next popup
    }, 10 * 60 * 1000); // 10 minutes in milliseconds
  }

  // Close popup when clicking the close button
  popup.querySelector('.close-popup').addEventListener('click', () => {
    hidePopup();
  });

  // Start the popup timer
  schedulePopup();

  // Optionally, hide the popup if clicked outside
  popup.addEventListener('click', (event) => {
    if (event.target === popup) {
      hidePopup();
    }
  });
});