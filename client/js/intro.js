function smoothPageTransition() {
  document.body.classList.add('transition-out');
  setTimeout(function() {
    window.location.href = "About.html";
  }, 1000); // Задержка перед переходом, здесь 1000 миллисекунд (1 секунда)
}