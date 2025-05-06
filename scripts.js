<script type="text/javascript">
  document.addEventListener('DOMContentLoaded', function() {
    // Fade-in posts on scroll
    const posts = document.querySelectorAll('.post-fade-in');
    function checkVisibility() {
      posts.forEach(post => {
        const rect = post.getBoundingClientRect();
        if(rect.top < window.innerHeight - 100) {
          post.classList.add('visible');
        }
      });
    }
    checkVisibility();
    window.addEventListener('scroll', checkVisibility);

    // Hamburger menu popup toggle
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const menuPopup = document.getElementById('menu-popup');
    const menuCloseBtn = document.getElementById('menu-close-btn');

    menuToggleBtn.addEventListener('click', function() {
      menuPopup.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    menuCloseBtn.addEventListener('click', function() {
      menuPopup.classList.remove('active');
      document.body.style.overflow = '';
    });
    menuPopup.addEventListener('click', function(e) {
      if(e.target === menuPopup) {
        menuPopup.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Load More functionality
    const loadMoreBtn = document.getElementById('load-more-btn');
    if(loadMoreBtn) {
      loadMoreBtn.addEventListener('click', function() {
        const nextPageUrl = loadMoreBtn.getAttribute('data-next-page-url');
        if(nextPageUrl) {
          fetch(nextPageUrl)
            .then(response => response.text())
            .then(html => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(html, 'text/html');
              const newPosts = doc.querySelectorAll('article.post-fade-in');
              const mainSection = document.querySelector('b\\:section#main') || document.querySelector('main b\\:section#main');
              if(mainSection && newPosts.length > 0) {
                newPosts.forEach(post => {
                  post.classList.add('visible');
                  mainSection.appendChild(post);
                });
                const newLoadMoreBtn = doc.getElementById('load-more-btn');
                if(newLoadMoreBtn && newLoadMoreBtn.getAttribute('data-next-page-url')) {
                  loadMoreBtn.setAttribute('data-next-page-url', newLoadMoreBtn.getAttribute('data-next-page-url'));
                } else {
                  loadMoreBtn.style.display = 'none';
                }
              } else {
                loadMoreBtn.style.display = 'none';
              }
            })
            .catch(() => {
              loadMoreBtn.style.display = 'none';
            });
        } else {
          loadMoreBtn.style.display = 'none';
        }
      });
    }

    // Cookie consent popup with blur
    const cookieConsentOverlay = document.getElementById('cookie-consent-overlay');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');

    function setCookie(name, value, days) {
      const d = new Date();
      d.setTime(d.getTime() + (days*24*60*60*1000));
      const expires = "expires="+ d.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    }
    function getCookie(name) {
      const cname = name + "=";
      const decodedCookie = decodeURIComponent(document.cookie);
      const ca = decodedCookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
          return c.substring(cname.length, c.length);
        }
      }
      return "";
    }
    if(!getCookie('rxbl_cookie_consent')) {
      cookieConsentOverlay.classList.add('show');
      document.body.classList.add('blurred');
    }
    cookieAcceptBtn.addEventListener('click', function() {
      setCookie('rxbl_cookie_consent', 'accepted', 365);
      cookieConsentOverlay.classList.remove('show');
      document.body.classList.remove('blurred');
    });
  });
</script>