// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const menuOverlay = document.querySelector('.menu-overlay');

if (hamburger && menuOverlay) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    menuOverlay.classList.toggle('active');
  });

  // Close menu when clicking outside
  window.addEventListener('click', function(e) {
    if (!document.querySelector('.menu-overlay').contains(e.target) &&
        !document.querySelector('.hamburger').contains(e.target)) {
      hamburger.classList.remove('active');
      menuOverlay.classList.remove('active');
    }
  });
}

// Fade In Animation on Load
window.addEventListener('load', () => {
  const elements = document.querySelectorAll('.fade-in');
  elements.forEach(el => {
    el.style.opacity = '1';
  });
});

// Copy Code Function
function copyCode(button) {
  const pre = button.closest('.code-box').querySelector('pre');
  const range = document.createRange();
  range.selectNodeContents(pre);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  try {
    document.execCommand('copy');
    button.textContent = 'Tersalin!';
    setTimeout(() => {
      button.textContent = 'Salin Kode';
    }, 2000);
  } catch (err) {
    alert('Gagal menyalin teks');
  }

  sel.removeAllRanges();
}

// Modal for About / Privacy
function openModal(title, content) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h3>${title}</h3>
      <p>${content}</p>
    </div>
  `;
  document.body.appendChild(modal);

  // Close on click outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
