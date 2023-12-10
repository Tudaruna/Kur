//Обновление профиля:

// Обработчик формы обновления профиля
const profileForm = document.querySelector(".personal-info form");
profileForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const birthday = document.getElementById("birthdate").value;
  const userData = localStorage.getItem("userData");
  const userObject = JSON.parse(userData);

  // Отправка данных на сервер
  const response = await fetch(`/api/auth/update/${userObject.user_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, birthday }),
  });

  const result = await response.json();
  console.log(result); // Обработка ответа от сервера, если необходимо
});



//2 ОБНОВЛЕНИЕ ПАРОЛЯ 

const passwordForm = document.querySelector('.password form');
passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const userData = localStorage.getItem("userData");
  const userObject = JSON.parse(userData);

    // Проведем проверки на клиенте
    if (!currentPassword || !newPassword || !confirmPassword) {
        // Если какие-то поля не заполнены, выведем ошибку
        console.error("All fields are required");
        return;
      }
    
      if (newPassword !== confirmPassword) {
        // Если новый пароль и его подтверждение не совпадают, выведем ошибку
        console.error("New password and confirm password do not match");
        return;
      }
  // Отправка данных на сервер
  const response = await fetch(`/api/auth/update/${userObject.user_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const result = await response.json();
  console.log(result); // Обработка ответа от сервера, если необходимо
});


//3 ПОЛ И ТЕЛЕФОН

// Обработчик формы обновления дополнительной информации
const additionalInfoForm = document.querySelector('.additional-info form');
additionalInfoForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const sex = document.getElementById('gender').value;
  const phone = document.getElementById('phone').value;
  const userData = localStorage.getItem("userData");
  const userObject = JSON.parse(userData);
  // Отправка данных на сервер
  const response = await fetch(`/api/auth/update/${userObject.user_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sex, phone }),
  });

  const result = await response.json();
  console.log(result); // Обработка ответа от сервера, если необходимо
});