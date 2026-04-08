console.log("main.js loaded");

//
// Create the "Back to Top" button
// learnt from: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp
//
const button = document.createElement("button");
button.innerText = "↑ Top";
button.id = "backToTop";
document.body.appendChild(button);

button.style.position = "fixed";
button.style.bottom = "20px";
button.style.right = "20px";
button.style.padding = "25px 15px";
button.style.fontSize = "16px";
button.style.fontFamily = "'Forum', serif";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.background = "#0d0d0c";
button.style.color = "#fff";
button.style.cursor = "pointer";
button.style.display = "none"; // Hidden by default.. and only appears when you scroll
button.style.zIndex = "1000";

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
  window.location.pathname === "/" ||
  window.location.pathname.endsWith("/index.html") ||
  window.location.pathname.endsWith("index.html");

if (isHome && nameEl) {
  const fullText = "Manmeet\u00A0Sagri";
  nameEl.textContent = "";
  let i = 0;

  (function type() {
    if (i < fullText.length) {
      nameEl.textContent += fullText[i];
      i++;
      setTimeout(type, 150);
    }
  })();
}


//
// Simple slideshow for Glazing Guide project slides
// expects images: images/slides1.png ... images/slides21.png
//
const slideImg = document.getElementById("gg-slide-image");

if (slideImg) {
  const totalSlides = 21; // change this if you add/remove slides
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