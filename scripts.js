// Tombol Copy
document.querySelectorAll('.btn-copy').forEach(button => {
  button.addEventListener('click', () => {
    const codeBlock = button.closest('.post-syntax-highlight').querySelector('code');
    navigator.clipboard.writeText(codeBlock.textContent).then(() => {
      alert('Code copied to clipboard!');
    });
  });
});

// Tombol Raw
document.querySelectorAll('.btn-raw').forEach(button => {
  button.addEventListener('click', () => {
    const codeBlock = button.closest('.post-syntax-highlight').querySelector('code');
    window.open(`data:text/plain;charset=utf-8,${encodeURIComponent(codeBlock.textContent)}`, '_blank');
  });
});

// Pop-up Subscribe
let popupShown = false;
setInterval(() => {
  if (!popupShown) {
    document.querySelector('.popup').classList.add('active');
    popupShown = true;
  }
}, 600000); // 10 menit

document.querySelector('.popup .close').addEventListener('click', () => {
  document.querySelector('.popup').classList.remove('active');
  popupShown = false;
});

// Thumbnail Otomatis
document.addEventListener("DOMContentLoaded", function () {
  const postBody = document.querySelector(".post-description");
  const firstImage = postBody.querySelector("img");
  if (firstImage) {
    const thumbnail = document.querySelector(".post-thumbnail img");
    thumbnail.src = firstImage.src;
  }
});