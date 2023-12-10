const menuButton = document.getElementById("menuButton");
const menu = document.getElementById("menu");

// Обработчик клика по кнопке
menuButton.addEventListener("click", function () {
  // Переключение класса 'active' при клике
  console.log("Work");
  menu.classList.toggle("active");
});
