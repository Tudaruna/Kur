document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Получаем userId из локального хранилища
    const userData = localStorage.getItem("userData");
    const userObject = JSON.parse(userData);
    console.log(userObject);

    const response = await fetch(`/api/project?userId=${userObject.user_id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const projects = await response.json();
    const projectListContainer = document.querySelector(".project-list");

    // Очищаем контейнер от предыдущих проектов
    projectListContainer.innerHTML = "";

    // Создаем элементы для каждого проекта и добавляем их в контейнер
    projects.forEach((project) => {
      console.log(project);
   

      const projectItem = document.createElement("div");

   
      projectItem.classList.add("project-item", "fill-orange", "block");

      const projectInfo = document.createElement("div");
      projectInfo.classList.add("project-info");

      // Создаем блок для статистики проекта
      const projectItemStat = document.createElement("div");
      projectItemStat.classList.add("project-item-stat");

      projectItemStat.addEventListener("click", () => {
        // Сохраняем данные проекта в локальное хранилище
        localStorage.setItem("viewProjectData", JSON.stringify(project));

        // Переход на страницу viewCurs.html
        window.location.href = "viewCurs.html";
      });

      const projectModule = document.createElement("p");
      projectModule.classList.add("project-module");
      projectModule.textContent = `Курс ${project.module_count} модуля`;

      const projectName = document.createElement("p");
      projectName.classList.add("project-name");
      projectName.textContent = ` ${project.name} `;

      const projectType = document.createElement("p");
      projectType.classList.add("project-type");
      projectType.textContent = ` ${project.type} `;

      const deadlineDate = new Date(project.deadline);
      const day = deadlineDate.getDate();
      const month = deadlineDate.getMonth() + 1;
      const year = deadlineDate.getFullYear();
      const formattedDeadline = `${day < 10 ? "0" : ""}${day}-${
        month < 10 ? "0" : ""
      }${month}-${year}`;

      const projectSubtitle = document.createElement("p");
      projectSubtitle.classList.add("project-subtitle");
      projectSubtitle.textContent = `Доступ ${formattedDeadline}`;

      projectItemStat.appendChild(projectName);
      projectItemStat.appendChild(projectModule);
      projectItemStat.appendChild(projectSubtitle);
      projectItemStat.appendChild(projectType);

      // Создаем блок с описанием проекта
      const projectDescription = document.createElement("div");
      projectDescription.classList.add("project-description");

      const toggleButton = document.createElement("button");
      toggleButton.classList.add(
        "button-descr",
        "fill-orange",
        "border-orange",
        "toggle-description"
      );
      toggleButton.textContent = "Описание  ▼";

      const descriptionText = document.createElement("p");
      descriptionText.classList.add("project-description-text");
      descriptionText.textContent = project.description;

      toggleButton.addEventListener("click", () => {
        const isDescriptionVisible = projectDescription.classList.toggle(
          "description-visible"
        );
        toggleButton.textContent = `Описание ${
          isDescriptionVisible ? "▲" : "▼"
        }`;
        descriptionText.style.display = isDescriptionVisible ? "block" : "none";
      });

      projectDescription.appendChild(toggleButton);
      projectDescription.appendChild(descriptionText);

      // Создаем блок с контрольными кнопками
      const projectControls = document.createElement("div");
      projectControls.classList.add("project-controls");

      const editButton = document.createElement("button");
      editButton.classList.add(
        "button-edit",
        "border-white",
        "fill-green",
        "delete-project"
      );
      editButton.type = "button";
      editButton.textContent = "Изменить";
      editButton.onclick = () => {
        localStorage.setItem("editProjectData", JSON.stringify(project));

        // console.log(queryParams);
        window.location.href = "changeproject.html";
      };

      const deleteButton = document.createElement("button");
      deleteButton.classList.add(
        "button-delete",
        "border-white",
        "fill-green",
        "delete-project"
      );

      deleteButton.textContent = "Удалить";
      deleteButton.addEventListener("click", () => {
        localStorage.setItem("projectToDelete", JSON.stringify(project));
        const modal = document.getElementById("ud1");
        modal.style.display = "flex";
        const confirmDeleteButton = document.querySelector(".okonbut");
        confirmDeleteButton.addEventListener("click", async () => {
          const projectToDelete = JSON.parse(
            localStorage.getItem("projectToDelete")
          );
          const userData = JSON.parse(localStorage.getItem("userData"));

          try {
            const response = await fetch(
              `/api/project/${projectToDelete.id}?userId=${userData.user_id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("Project deleted successfully");

            localStorage.removeItem("projectToDelete");
            location.reload();
          } catch (error) {
            console.error("Error:", error);
          }

          modal.style.display = "none";
        });
        const cancelButton = document.querySelector(".cross-modal");
        cancelButton.addEventListener("click", () => {
          modal.style.display = "none";
        });
      });

      projectControls.appendChild(editButton);
      projectControls.appendChild(deleteButton);

      // Добавляем все созданные блоки в основной блок проекта
      projectInfo.appendChild(projectItemStat);
      projectInfo.appendChild(projectDescription);
      projectInfo.appendChild(projectControls);

      projectItem.appendChild(projectInfo);

      // Добавляем проект в контейнер
      projectListContainer.appendChild(projectItem);
    });
  } catch (error) {
    console.error("Error while fetching projects:", error.message);
  }
});
