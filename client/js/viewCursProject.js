document.addEventListener("DOMContentLoaded", async function () {
  try {
    const projectList = document.getElementById("accordion");

    // Получаем ID проекта из локального хранилища
    const viewProject = localStorage.getItem("viewProjectData");
    const ProjectObject = JSON.parse(viewProject);
    console.log("id" + ProjectObject.id);
    // Отправляем запрос на сервер для получения данных о проекте по ID
    const response = await fetch(`/api/project/${ProjectObject.id}`);
    const project = await response.json();

    // Создаем элементы для отображения данных проекта
    const card = document.createElement("div");
    card.classList.add("card", "block", "border-orange");

    const cardInner = document.createElement("div");
    cardInner.classList.add(
      "card-inner",
      "block",
      "border-white",
      "fill-orange",
      "fill-rabbit"
    );

    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    const courseTitle = document.createElement("span");
    courseTitle.classList.add("course-title");
    courseTitle.textContent = `Курс ${project.module_count} модуля`;

    const courseDuration = document.createElement("span");
    courseDuration.classList.add("course-duration");
    courseDuration.textContent = "Бессрочный";

    cardHeader.appendChild(courseTitle);
    cardHeader.appendChild(courseDuration);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const contentTitle = document.createElement("h1");
    contentTitle.classList.add("content-title");
    contentTitle.textContent = project.description;

    const author = document.createElement("div");
    author.classList.add("author");
    author.textContent = `Автор: ${project.author_name}`;

    cardBody.appendChild(contentTitle);
    cardBody.appendChild(author);

    cardInner.appendChild(cardHeader);
    cardInner.appendChild(cardBody);

    card.appendChild(cardInner);

    // Добавляем созданный элемент в контейнер, например, в body
    projectList.appendChild(card);
  } catch (error) {
    console.error("Error while displaying project:", error.message);
  }
});
