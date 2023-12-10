document.addEventListener("DOMContentLoaded", function () {
    const editProjectData = localStorage.getItem("editProjectData");
  const project = JSON.parse(editProjectData);
  function formatDateToInputValue(utcDate) {
  const date = new Date(utcDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Пример использования
const utcDate = "2023-12-07T21:00:00.000Z";
const formattedDate = formatDateToInputValue(utcDate);

// Заполнить поле ввода типа date
document.getElementById("projectEndDate").value = formattedDate;
  // Заполняем поля формы значениями из localStorage
  document.getElementById("projectName").value = project.name || "";
  document.getElementById("projectDescription").value = project.description || "";
  const projectType = project.type;

// Находим элемент select
const projectTypeSelect = document.getElementById("projectType");

// Находим соответствующий option
const optionToSelect = projectTypeSelect.querySelector(`[value="${projectType}"]`);

// Устанавливаем атрибут selected в true, если нашли соответствующий option
if (optionToSelect) {
  optionToSelect.selected = true;
}
  // Очищаем localStorage после использования данных
});






//СОХРАНЕНИЕ

document.getElementById('editProjectForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get user ID from local storage
  const userData = localStorage.getItem('userData');
  const userObject = JSON.parse(userData);

  // Get project data for editing
  const editProjectData = localStorage.getItem('editProjectData');
  const project = JSON.parse(editProjectData);

  // Collect form data
  const formData = new FormData(event.target);
  const formObject = {};
  formData.forEach((value, key) => {
    formObject[key] = value;
  });

  // Convert date format to match your server expectations
  const deadline = formData.get('projectEndDate');
const splitDate = deadline ? deadline.split('-') : null;

// Проверка, что splitDate не является null перед использованием
if (splitDate) {
  formObject.projectEndDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
}

  // Add user ID to the form data
  formObject.userId = userObject.user_id;

  try {
    // Send data to server using Fetch API
    const response = await fetch(`/api/project/${project.id}?userId=${userObject.user_id}`, {
  method: 'PUT',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(formObject),
});

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);
    // Optionally, you can handle success on the client side

      // Clear the localStorage for editProjectData
  localStorage.removeItem('editProjectData');

// Redirect to myproject.html
window.location.href = 'myproject.html';
  } catch (error) {
    console.error('Error:', error);
    // Optionally, you can handle errors on the client side
  }
});