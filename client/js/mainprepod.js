document.addEventListener("DOMContentLoaded", function () {
  const userData = localStorage.getItem("userData");
  console.log(userData);
  if (userData) {
    const userObject = JSON.parse(userData);

    const loginElement = document.querySelector('.login-name span[lang="ru"]');
    if (loginElement) {
      loginElement.textContent = userObject.login; 
    }
  }
});
