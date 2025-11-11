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
    // filename in the repo is spelled "caeserRecipe.html" (typo in file name), match it here
    { name: "Caesar Salad", file: "recipes/caeserRecipe.html" },
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

    function markError(input, hasError) {
      if (hasError) {
        input.style.border = "2px solid red";
        input.style.outline = "none";
      } else {
        input.style.border = "";
      }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = form.querySelector("#name");
      const email = form.querySelector("#email");
      const message = form.querySelector("#message");
      let isValid = true;

      // Сброс предыдущих стилей
      [name, email, message].forEach(i => markError(i, false));

      if (name.value.trim() === "") {
        markError(name, true);
        isValid = false;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (email.value.trim() === "" || !emailPattern.test(email.value.trim())) {
        markError(email, true);
        isValid = false;
      }

      if (message.value.trim() === "") {
        markError(message, true);
        isValid = false;
      }

      if (!isValid) return;

      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Please wait...';

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
      form.querySelectorAll("input, textarea").forEach(i => (i.style.border = ""));
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
// STAR RATING SYSTEM (CLEAN + SAVES RATING)
// ===========================================
document.addEventListener("DOMContentLoaded", () => {
  // Guard: only run rating code if the rating container exists on the page
  const container = document.querySelector(".rating-container");
  if (!container) return;

  const stars = container.querySelectorAll(".star");
  const ratingMessage = container.querySelector("#ratingMessage") || document.getElementById("ratingMessage");
  let selectedRating = parseInt(localStorage.getItem("userRating"), 10) || 0;

  // Плавное появление блока при загрузке
  setTimeout(() => container.classList.add("visible"), 300);

  // Если ранее была выставлена оценка — восстановим
  if (selectedRating > 0) {
    highlightStars(selectedRating);
    if (ratingMessage) {
      ratingMessage.textContent = `You rated us ${selectedRating} star${selectedRating > 1 ? "s" : ""}! ⭐`;
      ratingMessage.style.color = "#db9898";
    }
  }

  // Наведение и клик по звёздам
  stars.forEach((star, index) => {
    star.addEventListener("mouseover", () => highlightStars(index + 1));

    star.addEventListener("mouseout", () => highlightStars(selectedRating));

    star.addEventListener("click", () => {
      selectedRating = index + 1;
      localStorage.setItem("userRating", selectedRating);

      highlightStars(selectedRating);
      if (ratingMessage) {
        ratingMessage.textContent = `You rated us ${selectedRating} star${selectedRating > 1 ? "s" : ""}! ⭐`;
        ratingMessage.style.color = "#db9898";
      }

      // Анимация клика
      star.style.transform = "scale(1.5)";
      setTimeout(() => (star.style.transform = "scale(1)"), 300);
    });

    // Анимация появления звёзд
    setTimeout(() => star.classList.add("visible"), 200 * (index + 1));
  });

  // Подсветка звёзд
  function highlightStars(rating) {
    stars.forEach((s, i) => {
      s.classList.toggle("active", i < rating);
    });
  }
});


// ===========================================
// Dish of the Day
// ===========================================

const btn = document.getElementById("getMeal");
const mealContainer = document.getElementById("meal");

// Guard: only attach if both elements exist on the page
if (btn && mealContainer) {
  btn.addEventListener("click", getMeal);
}

function getMeal() {
  fetch("https://www.themealdb.com/api/json/v1/1/random.php")
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];
      const ingredients = [];

      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredients.push(`<li>${ingredient} — ${measure}</li>`);
        }
      }

      mealContainer.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <h3>Ingredients:</h3>
        <ul>${ingredients.join('')}</ul>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
        ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank">▶️ Watch on YouTube</a>` : ""}
      `;

      // Анимация появления
      mealContainer.classList.remove("show");
      setTimeout(() => mealContainer.classList.add("show"), 50);
    })
    .catch(err => {
      mealContainer.innerHTML = `<p style="color:red;">Error loading meal 😢</p>`;
      console.error(err);
    });
}





// ==============================
//  Authentication Popup Form
// ==============================
const authOverlay = document.getElementById("authOverlay");
const authBtn = document.getElementById("authBtn");
const authClose = document.getElementById("authClose");

const authChoice = document.getElementById("authChoice");
const signUpForm = document.getElementById("signUpForm");
const signInForm = document.getElementById("signInForm");

const showSignUp = document.getElementById("showSignUp");
const showSignIn = document.getElementById("showSignIn");

// Guard: only set up auth popup behavior if the required elements exist
if (authOverlay && authBtn && authClose && authChoice && signUpForm && signInForm && showSignUp && showSignIn) {

  // Открытие popup
  authBtn.addEventListener("click", () => {
    authOverlay.style.display = "flex";
    authChoice.classList.remove("d-none");
    signUpForm.classList.add("d-none");
    signInForm.classList.add("d-none");
  });

  // Закрытие popup
  authClose.addEventListener("click", () => {
    authOverlay.style.display = "none";
  });

  // Закрытие по клику на overlay
  authOverlay.addEventListener("click", (e) => {
    if (e.target === authOverlay) {
      authOverlay.style.display = "none";
    }
  });

  // Переход к формам
  showSignUp.addEventListener("click", () => {
    authChoice.classList.add("d-none");
    signUpForm.classList.remove("d-none");
  });

  showSignIn.addEventListener("click", () => {
    authChoice.classList.add("d-none");
    signInForm.classList.remove("d-none");
  });
}

// ==============================
//  Sign Up
// ==============================
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const phone = document.getElementById("signupPhone").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (name && email && phone && password.length >= 6) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(u => u.email === email)) {
      alert("User already exists");
      return;
    }
    const newUser = { name, email, phone, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    authOverlay.style.display = "none";
    window.location.href = "profile.html";
  } else {
    alert("Please fill all fields and use password >= 6 characters");
  }
});

// ==============================
//  Sign In
// ==============================
signInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("signinEmail").value.trim();
  const password = document.getElementById("signinPassword").value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    authOverlay.style.display = "none";
    window.location.href = "profile.html";
  } else {
    alert("Invalid email or password");
  }
});
