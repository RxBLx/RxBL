document.addEventListener("DOMContentLoaded", function () {
  const highlights = document.querySelectorAll(".syntax-highlight");

  highlights.forEach(container => {
    const code = container.querySelector("code");
    const pre = container.querySelector("pre");

    // Tombol Copy
    const copyBtn = container.querySelector(".copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(code.textContent).then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => copyBtn.textContent = "Copy", 2000);
        });
      });
    }

    // Tombol Raw
    const rawBtn = container.querySelector(".raw-btn");
    if (rawBtn) {
      let isRaw = false;
      rawBtn.addEventListener("click", () => {
        if (!isRaw) {
          const textarea = document.createElement("textarea");
          textarea.value = code.textContent;
          textarea.style.width = "100%";
          textarea.style.height = "200px";
          textarea.readOnly = true;

          pre.replaceWith(textarea);
          rawBtn.textContent = "View";
          isRaw = true;
        } else {
          const newPre = document.createElement("pre");
          const newCode = document.createElement("code");
          newCode.className = code.className;
          newCode.textContent = pre.nextSibling ? pre.nextSibling.value : "";
          newPre.appendChild(newCode);
          pre.nextSibling.replaceWith(newPre);
          rawBtn.textContent = "Raw";
          isRaw = false;
        }
      });
    }
  });
});