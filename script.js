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
