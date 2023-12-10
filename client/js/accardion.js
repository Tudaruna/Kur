document.addEventListener("DOMContentLoaded", (event) => {
  const toggleButtons = document.querySelectorAll(".toggle-description");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const description = this.nextElementSibling;
      const isVisible = description.style.display === "block";
      description.style.display = isVisible ? "none" : "block";
      this.textContent = isVisible ? "Описание ▼" : "Описание ▲";
    });
  });
});
