// =======================
// Setup
// =======================
$(document).ready(function () {
  console.log("jQuery is ready!");

  // =======================
  // Real-time Search and Live Filter
  // =======================
  $("#searchInput").on("keyup", function () {
    let value = $(this).val().toLowerCase();
    $(".search-item").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  // =======================
  // Autocomplete Search Suggestions
  // =======================
  const items = [
    "Breakfast",
    "Lunch",
    "Drinks",
    "Salad",
    "Dessert",
    "Apple Slush",
    "Borscht",
    "Caesar Salad",
    "Caprese Salad",
    "Cheese Omelette",
    "Cherry Tart",
    "Chocolate Cake",
    "Latte",
    "Martini",
    "Olivye Salad",
    "Pancakes",
    "Pepperoni Pizza",
    "Pesto Pasta",
    "Tiramisu",
    "Toast with Eggs",
  ];

  $("#searchInput").on("input", function () {
    const query = $(this).val().toLowerCase();
    const suggestionBox = $("#suggestions");
    suggestionBox.empty();

    if (query.length === 0) return;

    const matched = items.filter(item => item.toLowerCase().includes(query));

    matched.forEach(match => {
      suggestionBox.append(`<div class="suggestion-item">${match}</div>`);
    });
  });

  $(document).on("click", ".suggestion-item", function () {
    $("#searchInput").val($(this).text());
    $("#suggestions").empty();
  });

  // =============================
  // Text Highlighting 
  // =============================
  $("#highlightBtn").on("click", function () {
    const term = $("#searchInput").val().trim();
    if (!term) return;

    $("span.highlight").each(function () {
      $(this).replaceWith($(this).text());
    });

    const regex = new RegExp(term, "gi");

    $("body *:not(script):not(style)").contents().filter(function () {
      return this.nodeType === 3 && this.nodeValue.trim() !== "";
    }).each(function () {
      const newHtml = this.nodeValue.replace(regex, `<span class="highlight">$&</span>`);
      if (newHtml !== this.nodeValue) $(this).replaceWith(newHtml);
    });
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
  $(window).on('scroll', function () {
    $('img.lazy').each(function () {
      const img = $(this);
      if (img.attr('data-src') && img.offset().top < $(window).scrollTop() + $(window).height() + 200) {
        img.attr('src', img.data('src'));
        img.removeAttr('data-src');
        img.on('load', function () {
          img.addClass('loaded');
        });
      }
    });
  });
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

  // =========================
  //  Random Background Color
  // =========================
  function changeColor() {
    let colors = ["#ecd4daff", "#badbd3ff", "#d6d0acff", "#a5bed2ff", "#d5cfdfff"];
    let random = Math.floor(Math.random() * colors.length);
    document.body.style.backgroundColor = colors[random];
  }
  // ========================
  // DARK/LIGHT MODE TOGGLE
  // ========================
  document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("themeToggle");
    const icon = toggleBtn.querySelector("i");
    const body = document.body;

    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
      icon.classList.replace("bi-moon", "bi-sun");
    }

    toggleBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");

      if (body.classList.contains("dark-mode")) {
        icon.classList.replace("bi-moon", "bi-sun");
        localStorage.setItem("theme", "dark");
      } else {
        icon.classList.replace("bi-sun", "bi-moon");
        localStorage.setItem("theme", "light");
      }
    });
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
