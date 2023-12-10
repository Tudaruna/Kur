document.addEventListener("DOMContentLoaded", function () {
    // Находим кнопку "Удалить"
    const deleteButton = document.querySelector(".buttondel");
  
    // Находим модальное окно
    const deleteModal = document.getElementById("ud1");
  
    // Находим кнопки в модальном окне
    const confirmDeleteButton = document.querySelector(".okonbut");
    const cancelButton = document.querySelector(".cross-modal");
  
    // Добавляем обработчик события клика на кнопку "Удалить"
    deleteButton.addEventListener("click", function () {
      // Показываем модальное окно
      deleteModal.style.display = "flex";
    });
  
    // Добавляем обработчик события клика на кнопку подтверждения удаления
    confirmDeleteButton.addEventListener("click", async function () {
      // Получаем id пользователя из локального хранилища
      const userData = localStorage.getItem("userData");
      const userObject = JSON.parse(userData);
   
  
      // Отправляем запрос на удаление пользователя
      try {
        const response = await fetch(`api/auth/delete/${userObject.user_id}`, {
          method: "DELETE",
          credentials: "include",
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log("User deleted successfully:", result);
  
        // Закрываем модальное окно после успешного удаления
        deleteModal.style.display = "none";
  
        // Опционально: перенаправляем пользователя на другую страницу
        window.location.href = "/about";
      } catch (error) {
        console.error("Error deleting user:", error);
        // Обработка ошибок при удалении пользователя
      }
    });
   
    // Добавляем обработчик события клика на кнопку отмены
    cancelButton.addEventListener("click", function () {
      // Закрываем модальное окно
      deleteModal.style.display = "none";
    });
  });