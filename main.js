// main.js
// this file handles all interactive elements + animations across my portfolio
// includes:
// - card swipe interaction (about page)
// - back to top button (scroll interaction)
// - typewriter animation (homepage)
// - slideshow (glazing guide)
// - image lightbox (project pages)
// - project filtering (projects page)




console.log("main.js loaded");


// Card stack swipe (about.html)
// learnt this from stack overflow + mdn and adapted it
// https://stackoverflow.com/questions/15935318/dragging-an-element-across-the-screen


(function setupCardStack() {
  var stack = document.getElementById("cardStack");
  if (!stack) return;

  var cards = Array.from(stack.querySelectorAll(".photo-card"));

  // used chatgpt to debug issues with this interaction 

  // sets stacked layout using transform (rotate + translate)
  function updateStack() {
    cards.forEach(function (card, i) {
      var fromTop = cards.length - 1 - i;
      card.style.zIndex = String(i + 1);
      card.style.transition = "transform 0.3s ease";
      if (fromTop === 0) {
        card.style.transform = "rotate(0deg) translate(0px, 0px)";
      } else if (fromTop === 1) {
        card.style.transform = "rotate(-3deg) translate(-6px, 8px)";
      } else if (fromTop === 2) {
        card.style.transform = "rotate(2deg) translate(4px, 16px)";
      } else if (fromTop === 3) {
        card.style.transform = "rotate(-1.5deg) translate(-3px, 24px)";
      } else {
        card.style.transform = "rotate(1deg) translate(2px, 32px)";
      }
    });
  }

  updateStack();

  var startX = 0, startY = 0, moveX = 0, moveY = 0;
  var dragging = false;
  var activeCard = null;

  function getTopCard() {
    return cards[cards.length - 1];
  }

  // start dragging
  stack.addEventListener("mousedown", function (e) {
    activeCard = getTopCard();
    if (!activeCard) return;
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    activeCard.style.transition = "none";
    stack.classList.add("is-dragging");
  });


  stack.addEventListener("touchstart", function (e) {
    activeCard = getTopCard();
    if (!activeCard) return;
    dragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    activeCard.style.transition = "none";
    stack.classList.add("is-dragging");
  }, { passive: true });

  // move card
  window.addEventListener("mousemove", function (e) {
    if (!dragging || !activeCard) return;
    moveX = e.clientX - startX;
    moveY = e.clientY - startY;
    var rotate = moveX * 0.07;
    activeCard.style.transform = "translate(" + moveX + "px, " + moveY + "px) rotate(" + rotate + "deg)";
  });

  window.addEventListener("touchmove", function (e) {
    if (!dragging || !activeCard) return;
    if (e.cancelable) e.preventDefault();
    moveX = e.touches[0].clientX - startX;
    moveY = e.touches[0].clientY - startY;
    var rotate = moveX * 0.07;
    activeCard.style.transform = "translate(" + moveX + "px, " + moveY + "px) rotate(" + rotate + "deg)";
  }, { passive: false });

  window.addEventListener("mouseup", onDragEnd);
  window.addEventListener("touchend", onDragEnd);

  function onDragEnd() {
    if (!dragging || !activeCard) return;
    dragging = false;
    stack.classList.remove("is-dragging");

    
     // if dragged enough ->  swipe away
    if (Math.abs(moveX) > 80) {
      var dir = moveX > 0 ? 1 : -1;
      var savedY = moveY;
      var card = activeCard;
      card.style.transition = "transform 0.35s ease, opacity 0.35s ease";
      card.style.opacity = "0";
      card.style.transform = "translate(" + (dir * 700) + "px, " + savedY + "px) rotate(" + (dir * 25) + "deg)";

      setTimeout(function () {
        card.style.transition = "none";
        card.style.opacity = "1";
        card.style.transform = "";
        cards.pop();
        cards.unshift(card);
        updateStack();
      }, 360);
    } else {
        // snap back if not enough movement
      activeCard.style.transition = "transform 0.25s ease";
      activeCard.style.transform = "rotate(0deg) translate(0px, 0px)";
    }

    moveX = 0;
    moveY = 0;
    activeCard = null;
  }
})();

//
// Create the "Back to Top" button
// learnt from: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
//
const button = document.createElement("button");
button.innerText = "↑ Top";
button.id = "backToTop";
document.body.appendChild(button);



// Show the button only when scrolling down
window.addEventListener("scroll", () => {
  button.style.display = window.scrollY > 300 ? "block" : "none";
});

// Smooth scroll to top when clicked
button.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


//
// Typewriter Effect ONLY on index.html (homepage)

//
const nameEl = document.querySelector(".intro-text h2");


const isHome =
  !window.location.pathname.endsWith("about.html") &&
  !window.location.pathname.endsWith("projects.html") &&
  !window.location.pathname.endsWith("styleGuide.html");

//
// Looping typewriter tagline on index.html
//
const taglineEl = document.querySelector(".intro-text .tagline");

if (isHome && taglineEl) {
  const roles = [
    "Front-End Developer",
    "UX Designer",
    "Creative Coder",
    "SIAT Student @ SFU"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 60;
  const pauseAfterType = 1800;
  const pauseAfterDelete = 400;

  function typeLoop() {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      taglineEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeLoop, pauseAfterType);
        return;
      }
      setTimeout(typeLoop, typeSpeed);
    } else {
      taglineEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeLoop, pauseAfterDelete);
        return;
      }
      setTimeout(typeLoop, deleteSpeed);
    }
  }

  typeLoop();
}


//
// Simple slideshow for Glazing Guide project slides
// expects images: images/slides1.png ... images/slides21.png
//
const slideImg = document.getElementById("gg-slide-image");

if (slideImg) {
  const totalSlides = 21; 
  let currentSlide = 1;

  const counterEl = document.getElementById("gg-slide-counter");
  const prevBtn = document.getElementById("gg-slide-prev");
  const nextBtn = document.getElementById("gg-slide-next");

  function updateSlide() {
    slideImg.src = `images/slide${currentSlide}.png`;
    slideImg.alt = `Glazing Guide presentation slide ${currentSlide}`;
    if (counterEl) {
      counterEl.textContent = `Slide ${currentSlide} of ${totalSlides}`;
    }
  }

  prevBtn.addEventListener("click", () => {
    currentSlide = currentSlide === 1 ? totalSlides : currentSlide - 1;
    updateSlide();
  });

  nextBtn.addEventListener("click", () => {
    currentSlide = currentSlide === totalSlides ? 1 : currentSlide + 1;
    updateSlide();
  });
}

//
// click-to-zoom lightbox for project detail images
// learnt from w3schools modal images
// https://www.w3schools.com/howto/howto_css_modal_images.asp
//
(function setupLightbox() {
  // only run on pages that have project detail layout
  const projectDetail = document.querySelector(".project-detail");
  if (!projectDetail) return;

  // only target the process images (clean + predictable)
  // (avoids the glazing slideshow image and other special imgs)
  const imgs = projectDetail.querySelectorAll(".pd-grid img");
  if (!imgs.length) return;

  // create overlay once
  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Image preview");

  const overlayImg = document.createElement("img");
  overlayImg.alt = "";

  const closeBtn = document.createElement("button");
  closeBtn.className = "lightbox-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close image");
  closeBtn.textContent = "×";

  overlay.appendChild(closeBtn);
  overlay.appendChild(overlayImg);
  document.body.appendChild(overlay);

  function openLightbox(img) {
    overlayImg.src = img.src;
    overlayImg.alt = img.alt || "Expanded image";
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden"; // prevents background scrolling
  }

  function closeLightbox() {
    overlay.classList.remove("is-open");
    overlayImg.src = "";
    document.body.style.overflow = "";
  }

  // open on click
  imgs.forEach((img) => {
    img.addEventListener("click", () => openLightbox(img));
    img.style.cursor = "zoom-in";
  });

  // close logic
  closeBtn.addEventListener("click", closeLightbox);

  // click outside image closes
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // esc key closes
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) {
      closeLightbox();
    }
  });
})();


//
// Project filter buttons (projects.html)
// learnt from w3schools filter elements
// https://www.w3schools.com/howto/howto_js_filter_elements.asp
//
const filterBtns = document.querySelectorAll('.filter-btn');

if (filterBtns.length) {
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const categories = card.dataset.category;
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}