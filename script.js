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

  document.getElementById("time").innerHTML = formatted;
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
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

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

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      form.reset();
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
    alert("Thank you for subscribing!");
    popupForm.reset();
    popupOverlay.style.display = "none";
  });
}


