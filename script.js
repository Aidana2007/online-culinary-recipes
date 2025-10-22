function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning, Chef!";
  if (hour < 18) return "Good afternoon, Chef!";
  return "Good evening, Chef!";
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

function changeColor() {
  let colors = ["#ecd4daff", "#badbd3ff", "#d6d0acff", "#a5bed2ff", "#d5cfdfff"];
  let random = Math.floor(Math.random() * colors.length);
  document.body.style.backgroundColor = colors[random];
}

// =========================
//  TASK 1: FORM VALIDATION
// =========================
function sendFormData(data, callback) {
  setTimeout(() => {
    callback("Message sent successfully!");
  }, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const submitBtn = document.getElementById("submitBtn");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;
    document.querySelectorAll(".error-message").forEach(el => el.remove());

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    function showError(input, message) {
      const error = document.createElement("div");
      error.classList.add("error-message", "text-danger", "mt-1");
      error.textContent = message;
      input.insertAdjacentElement("afterend", error);
    }

    if (name.value.trim() === "") {
      showError(name, "Name is required.");
      isValid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email.value.trim() === "") {
      showError(email, "Email is required.");
      isValid = false;
    } else if (!emailPattern.test(email.value)) {
      showError(email, "Please enter a valid email address.");
      isValid = false;
    }

    if (message.value.trim() === "") {
      showError(message, "Message cannot be empty.");
      isValid = false;
    }

    if (isValid) {
      alert("Form submitted successfully!");

      const data = {
        name: name.value,
        email: email.value,
        message: message.value
      };

      sendFormData(data, messageText => {
        const msg = document.createElement("p");
        msg.textContent = messageText;
        msg.style.color = "green";
        form.appendChild(msg);
        form.reset();
      });
    }
  });
  const clearBtn = document.getElementById("clearBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      document.querySelectorAll("input, textarea").forEach(el => el.value = "");
    });
  }

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



