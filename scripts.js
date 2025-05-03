// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // Fade-In Animation
    const fadeInElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    fadeInElements.forEach((el) => observer.observe(el));
});

// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Prism.js for Syntax Highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }

    // Tombol Copy
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const codeBlock = button.closest('.box-syntax').querySelector('code');
            const textToCopy = codeBlock.textContent;

            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('Code copied to clipboard!');
            }).catch((err) => {
                console.error('Failed to copy text: ', err);
            });
        });
    });

    // Tombol Raw
    const rawButtons = document.querySelectorAll('.btn-raw');
    rawButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const codeBlock = button.closest('.box-syntax').querySelector('code');
            const rawWindow = window.open('', '_blank');
            rawWindow.document.write('<pre>' + codeBlock.textContent + '</pre>');
            rawWindow.document.close();
        });
    });
});