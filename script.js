// =======================
// Setup
// =======================
$(document).ready(function () {
  // =======================
  // Search
  // =======================
  const recipes = [
    { name: "Breakfast", file: "breakfast.html" },
    { name: "Lunch", file: "lunch.html" },
    { name: "Drinks", file: "drinks.html" },
    { name: "Salad", file: "salad.html" },
    { name: "Dessert", file: "dessert.html" },
    { name: "Apple Slush", file: "recipes/appleslushRecipe.html" },
    { name: "Borscht", file: "recipes/borschtRecipe.html" },
    { name: "Caesar Salad", file: "recipes/caesarRecipe.html" },
    { name: "Caprese Salad", file: "recipes/capreseRecipe.html" },
    { name: "Cheese Omelette", file: "recipes/cheeseomelette.html" },
    { name: "Cherry Tart", file: "recipes/cherrytartrecipe.html" },
    { name: "Chocolate Cake", file: "recipes/chocolateCakeRecipe.html" },
    { name: "Latte", file: "recipes/latteRecipe.html" },
    { name: "Martini", file: "recipes/martiniRecipe.html" },
    { name: "Olivye Salad", file: "recipes/olivyeRecipe.html" },
    { name: "Pancakes", file: "recipes/pancakesRecipe.html" },
    { name: "Pepperoni Pizza", file: "recipes/pepperonipizzaRecipe.html" },
    { name: "Pesto Pasta", file: "recipes/pestopastaRecipe.html" },
    { name: "Tiramisu", file: "recipes/tiramisuRecipe.html" },
    { name: "Toast with Eggs", file: "recipes/toastswitheggsRecipe.html" }
  ];


  function norm(str) {
    return String(str || "").trim().toLowerCase();
  }

  function findRecipe(query) {
    const q = norm(query);
    if (!q) return null;

    let found = recipes.find(r => norm(r.name) === q);
    if (found) return found;

    found = recipes.find(r => norm(r.name).includes(q));
    if (found) return found;

    found = recipes.find(r => norm(r.name).startsWith(q));
    if (found) return found;

    return null;
  }

  $("#searchInput").on("input", function () {
    const query = norm(this.value);
    const suggestionBox = $("#suggestions");
    suggestionBox.empty();

    if (!query) return;

    const matches = recipes
      .filter(r => norm(r.name).includes(query))
      .slice(0, 10);

    matches.forEach(m => {
      suggestionBox.append(`<div class="suggestion-item" data-file="${m.file}">${m.name}</div>`);
    });
  });

  $(document).on("click", ".suggestion-item", function () {
    const name = $(this).text();
    const file = $(this).data("file");
    $("#searchInput").val(name);
    $("#suggestions").empty();

    if (file) {
      window.location.href = file;
    }
  });

  $("#searchBtn").on("click", function () {
    const query = $("#searchInput").val();
    const recipe = findRecipe(query);
    if (recipe && recipe.file) {
      window.location.href = recipe.file;
    } else {
      alert("Recipe not found. Please try another search.");
      console.log("Search not found for:", query);
    }
  });

  $("#searchInput").on("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $("#searchBtn").trigger("click");
    }
  });

  // =============================
  // Text Highlighting 
  // =============================
  $("#highlightBtn").on("click", function () {
    const term = $("#searchInput").val().trim();
    if (!term) return;

    // Remove previous highlights
    $("span.highlight").each(function () {
      $(this).replaceWith($(this).text());
    });

    const regex = new RegExp(term, "gi");
    let foundMatches = false;

    // Search through all FAQ items
    $('.faq-item').each(function () {
      const faqItem = $(this);
      const question = faqItem.find('.faq-question');
      const answer = faqItem.find('.faq-answer');

      const questionText = question.text();
      const answerText = answer.text();

      const questionHasMatch = regex.test(questionText);
      regex.lastIndex = 0; // Reset regex
      const answerHasMatch = regex.test(answerText);

      if (questionHasMatch || answerHasMatch) {
        foundMatches = true;

        // Open the FAQ item if it's closed
        if (!answer.hasClass('show')) {
          question.addClass('active');
          answer.addClass('show');
          answer.css('max-height', answer[0].scrollHeight + 'px');
        }

        // Highlight the text
        if (questionHasMatch) {
          const newQuestionHtml = questionText.replace(regex, `<span class="highlight">$&</span>`);
          question.html(newQuestionHtml);
        }

        if (answerHasMatch) {
          const newAnswerHtml = answerText.replace(regex, `<span class="highlight">$&</span>`);
          answer.html(newAnswerHtml);
        }
      }
    });

    // Scroll to first highlight
    if (foundMatches) {
      $('html, body').animate({
        scrollTop: $('.highlight').first().offset().top - 100
      }, 500);
    }
  });



  // ----------------------------
  // Scroll Progress Bar
  // ----------------------------
  $(window).on('scroll', function () {
    let scrollTop = $(window).scrollTop();
    let docHeight = $(document).height() - $(window).height();
    let scrollPercent = (scrollTop / docHeight) * 100;
    $('#scrollProgress').css('width', scrollPercent + '%');
  });
  // ----------------------------
  // Animated Counter
  // ----------------------------
  $('.counter').each(function () {
    let $this = $(this);
    let countTo = $this.attr('data-target');
    $({ countNum: $this.text() }).animate(
      { countNum: countTo },
      {
        duration: 2000,
        easing: 'swing',
        step: function () {
          $this.text(Math.floor(this.countNum));
        },
        complete: function () {
          $this.text(this.countNum);
        }
      }
    );
  });

  // ----------------------------
  // Loading Spinner on Submit
  // ----------------------------
  const form = document.getElementById("contactForm");
  if (form) {
    const submitBtn = document.getElementById("submitBtn");
    const clearBtn = document.getElementById("clearBtn");
    const notification = document.getElementById("formNotification");

    function showError(input, message) {
      const err = document.createElement("div");
      err.className = "error-message text-danger mt-1";
      err.textContent = message;
      const next = input.nextElementSibling;
      if (next && next.classList.contains("error-message")) next.remove();
      input.insertAdjacentElement("afterend", err);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      document.querySelectorAll(".error-message").forEach(el => el.remove());

      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const message = form.querySelector("#message");
      let isValid = true;

      if (name.value.trim() === "") {
        showError(name, "Name is required.");
        isValid = false;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (email.value.trim() === "") {
        showError(email, "Email is required.");
        isValid = false;
      } else if (!emailPattern.test(email.value.trim())) {
        showError(email, "Please enter a valid email address.");
        isValid = false;
      }

      if (message.value.trim() === "") {
        showError(message, "Message cannot be empty.");
        isValid = false;
      }

      if (!isValid) return;

      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Please wait...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        form.reset();
        notification.textContent = "✅ Message sent successfully!";
        notification.style.display = "block";
        setTimeout(() => (notification.style.display = "none"), 2500);
      }, 1500);
    });

    clearBtn.addEventListener("click", e => {
      e.preventDefault();
      form.reset();
      document.querySelectorAll(".error-message").forEach(el => el.remove());
    });
  }



  // =============================
  // Lazy Loading Images
  // =============================

  function loadVisibleImages() {
    const viewportBottom = $(window).scrollTop() + $(window).height() + 100;

    $('img.lazy[data-src]').each(function () {
      const img = $(this);
      const imgTop = img.offset().top;

      if (imgTop < viewportBottom) {
        const dataSrc = img.attr('data-src');
        if (dataSrc) {
          img.attr('src', dataSrc);
          img.removeAttr('data-src');
          img.on('load', function () {
            img.addClass('loaded');
          });
          return false;
        }
      }
    });
  }

  $(window).on('scroll', function () {
    loadVisibleImages();
  });




  // =========================
  //  Dynamic Time and Greeting
  // =========================

  function getGreeting() {
    const hour = new Date().getHours();
    let greeting;

    switch (true) {
      case (hour < 12):
        greeting = "Good morning!";
        break;
      case (hour < 18):
        greeting = "Good afternoon!";
        break;
      default:
        greeting = "Good evening!";
    }

    return greeting;
  }

  function showTime() {
    let now = new Date();
    let formatted = now.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const timeEl = document.getElementById("time");
    if (timeEl) {
      timeEl.innerHTML = `${formatted} | ${getGreeting()}`;
    }
  }
  showTime();
  setInterval(showTime, 1000);

  // ========================
  // DARK/LIGHT MODE TOGGLE
  // ========================
  const toggleBtn = document.getElementById("themeToggle");
  const icon = toggleBtn.querySelector("i");
  const body = document.body;

  if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
  }

  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });

  // ==============================
  //  FAQ Accordion Logic
  // ==============================

  document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
      const answer = question.nextElementSibling;
      const isOpen = answer.classList.contains("show");

      document.querySelectorAll(".faq-answer").forEach(a => {
        a.style.maxHeight = null;
        a.classList.remove("show");
        a.previousElementSibling.classList.remove("active");
      });

      if (!isOpen) {
        question.classList.add("active");
        answer.classList.add("show");
        answer.style.maxHeight = answer.scrollHeight + "px";
      } else {
        question.classList.remove("active");
        answer.style.maxHeight = null;
        answer.classList.remove("show");
      }
    });
  });

  // ==============================
  //  Popup Subscription Form
  // ==============================
  const popupOverlay = document.getElementById("popupOverlay");
  const openPopupBtn = document.getElementById("openPopup");
  const closePopupBtn = document.getElementById("closePopup");

  if (popupOverlay && openPopupBtn && closePopupBtn) {

    openPopupBtn.addEventListener("click", () => {
      popupOverlay.style.display = "flex";
    });

    closePopupBtn.addEventListener("click", () => {
      popupOverlay.style.display = "none";
    });

    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.style.display = "none";
      }
    });

    const popupForm = document.getElementById("popupForm");
    popupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const sound = document.getElementById("subscribeSound");
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(err => console.log("Autoplay blocked:", err));
      }

      alert("Thank you for subscribing!");

      popupForm.reset();
      popupOverlay.style.display = "none";
    });

  }

  // ==============================
  //  Keyboard Navigation for Menu
  // ==============================
  const links = document.querySelectorAll('.nav-link');
  let index = 0;

  function updateActiveLink() {
    links.forEach((link, i) => {
      if (i === index) {
        link.classList.add('active-link');
        link.focus();
      } else {
        link.classList.remove('active-link');
      }
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      index = (index + 1) % links.length;
      updateActiveLink();
    } else if (e.key === 'ArrowLeft') {
      index = (index - 1 + links.length) % links.length;
      updateActiveLink();
    }
  });

  updateActiveLink();


  // ===========================================
  // STAR RATING SYSTEM
  // ===========================================
  document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");
    const ratingMessage = document.getElementById("ratingMessage");
    let selectedRating = 0;

    stars.forEach((star, index) => {
      star.addEventListener("mouseover", () => {
        stars.forEach((s, i) => {
          s.classList.toggle("hovered", i <= index);
        });
      });

      star.addEventListener("mouseout", () => {
        stars.forEach(s => s.classList.remove("hovered"));
      });
      star.addEventListener("click", () => {
        selectedRating = index + 1;
        stars.forEach((s, i) => {
          s.classList.toggle("active", i < selectedRating);
        });
        ratingMessage.textContent = `You rated us ${selectedRating} star${selectedRating > 1 ? "s" : ""}! ⭐`;
        ratingMessage.style.color = "#db9898";
      });
    });
  });
  // ===========================================
  // STAR ANIMATION ON CLICK
  // ===========================================
  document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");

    stars.forEach(star => {
      star.addEventListener("click", () => {
        star.style.transform = "scale(1.5)";
        setTimeout(() => {
          star.style.transform = "scale(1)";
        }, 300);
      });
    });
  });

  // ==============================
  // COPY INGREDIENTS TO CLIPBOARD
  // ============================== 

  $("#copyIngredientsBtn").on("click", function () {
    let ingredients = [];
    $("#ingredientList li").each(function () {
      ingredients.push($(this).text());
    });

    const ingredientText = ingredients.join("\n");

    navigator.clipboard.writeText(ingredientText).then(() => {
      const button = $("#copyIngredientsBtn");
      button.html("✔ Copied!");
      button.addClass("btn-success").removeClass("btn-outline-secondary");

      $("#copyTooltip").fadeIn(300).delay(1200).fadeOut(500);

      setTimeout(() => {
        button.html("Copy Ingredients");
        button.removeClass("btn-success").addClass("btn-outline-secondary");
      }, 2000);
    });
  });
});

// ===========================================
// STAR RATING ON SCROLL INTO VIEW
// ===========================================

const stars = document.querySelectorAll('.star');
const ratingSection = document.querySelector('.rating-container');
const ratingText = document.getElementById('ratingText');
let selectedRating = 0;

window.addEventListener('scroll', () => {
  if (!ratingSection) return;

  const rect = ratingSection.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    ratingSection.classList.add('visible');

    stars.forEach((star, index) => {
      setTimeout(() => star.classList.add('visible'), index * 150);
    });
  }
});

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    resetStars();
    highlightStars(star.dataset.value);
  });

  star.addEventListener('mouseout', () => {
    resetStars();
    if (selectedRating > 0) highlightStars(selectedRating);
  });

  star.addEventListener('click', () => {
    selectedRating = star.dataset.value;
    ratingText.textContent = `You rated ${selectedRating} out of 5 ⭐`;
    resetStars();
    highlightStars(selectedRating);
  });
});

function highlightStars(rating) {
  stars.forEach(s => {
    if (s.dataset.value <= rating) s.classList.add('selected');
  });
}

function resetStars() {
  stars.forEach(s => s.classList.remove('selected'));
}