document.addEventListener("DOMContentLoaded", async function () {
  try {
    const viewProject = localStorage.getItem("viewProjectData");
    const ProjectObject = JSON.parse(viewProject);

    // Получение элемента, куда будут добавляться модули
    const moduleList = document.getElementById("main-content");

    if (!moduleList) {
      console.error('Element with ID "moduleList" not found.');
      return;
    }

    // Загрузка модулей с сервера
    const response = await fetch(`/api/modules?projectId=${ProjectObject.id}`);
    const modules = await response.json();

    // Отрисовка каждого модуля
    modules.forEach((module, index) => {
      const moduleDetails = document.createElement("details");
      moduleDetails.classList.add("border-green");

      const moduleSummary = document.createElement("summary");
      moduleSummary.classList.add("quv");
      moduleSummary.textContent = `${index + 1}. ${module.module_name}`;

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("buttondel", "border-white", "fill-green");
      deleteButton.textContent = "Удалить";

      // Убираем существующие обработчики событий перед добавлением новых
      deleteButton.removeEventListener("click", deleteButtonClickHandler);

      // Добавление обработчика событий для удаления модуля
      deleteButton.addEventListener("click", deleteButtonClickHandler);

      function deleteButtonClickHandler() {
        localStorage.setItem("moduleToDelete", JSON.stringify(module));

        const modal = document.getElementById("ud1");
        modal.style.display = "flex";

        const confirmDeleteButton = document.querySelector(".okonbut");
        confirmDeleteButton.removeEventListener(
          "click",
          confirmDeleteButtonClickHandler
        );
        confirmDeleteButton.addEventListener(
          "click",
          confirmDeleteButtonClickHandler
        );

        async function confirmDeleteButtonClickHandler() {
          const moduleToDelete = JSON.parse(
            localStorage.getItem("moduleToDelete")
          );
          const editProjectData = localStorage.getItem("editProjectData");
          const project = JSON.parse(editProjectData);
          try {
            // Отправка DELETE запроса на сервер
            const response = await fetch(
              `/api/module/${moduleToDelete.module_id}?projectId=${project.id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            console.log("Project deleted successfully");

            // Очистка локального хранилища после успешного удаления
            localStorage.removeItem("moduleToDelete");
            location.reload();
          } catch (error) {
            console.error("Error:", error);
            // Обработка ошибки при удалении проекта
          }

          modal.style.display = "none";
        }

        const cancelButton = document.querySelector(".cross-modal");
        cancelButton.removeEventListener("click", cancelButtonClickHandler);
        cancelButton.addEventListener("click", cancelButtonClickHandler);

        function cancelButtonClickHandler() {
          // Скрыть модальное окно
          modal.style.display = "none";
        }
      }

      moduleSummary.appendChild(deleteButton);

      const addModuleButton = document.createElement("button");
      addModuleButton.classList.add("button-add");
      addModuleButton.type = "button";

      const img = document.createElement("img");
      img.src = "../rashod/plus.png";
      img.width = 30;
      img.height = 30;

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.style.display = "none";

      addModuleButton.addEventListener("click", () => {
        fileInput.click();
      });

      addModuleButton.appendChild(img);
      addModuleButton.appendChild(fileInput);

      fileInput.addEventListener("change", async () => {
        localStorage.setItem("moduleToAddFile", JSON.stringify(module));
        const moduleId = module.module_id;
        const file = fileInput.files[0];

        if (!moduleId || !file) {
          console.log(file);
          console.log(moduleId);

          console.error("Invalid request data");
          return;
        }

        const formData = new FormData();
        formData.append("moduleId", moduleId);
        formData.append("file", file);

        try {
          const response = await fetch("/api/files", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const result = await response.json();
          console.log("File uploaded successfully:", result);

          location.reload();

          // Можете добавить дополнительную логику после успешной загрузки файла
        } catch (error) {
          console.error("Error uploading file:", error);
          // Обработка ошибок при загрузке файла
        }
      });

      moduleDetails.addEventListener("click", async () => {
        try {
          console.log(module.module_id);
          // Отправка GET запроса на сервер для получения файлов модуля
          const fileResponse = await fetch(
            `/api/files?moduleId=${module.module_id}`
          );
          const files = await fileResponse.json();

          // Создание элемента для отображения файлов
          let filesContainer = moduleDetails.querySelector(".files-container");

          // Проверка, были ли файлы уже отрисованы
          if (!filesContainer) {
            filesContainer = document.createElement("div");
            filesContainer.classList.add("files-container");
            filesContainer.setAttribute("data-rendered", "true");

            // Отрисовка каждого файла
            files.forEach(async (file, index) => {
              const fileItem = document.createElement("div");
              fileItem.classList.add("file-item");

              // Номерация файла
              const fileNumber = document.createElement("span");
              fileNumber.textContent = `${index + 1}. `;
              fileItem.appendChild(fileNumber);

              // Имя файла
              const fileName = document.createElement("span");
              fileName.textContent = file.file_name;
              fileItem.appendChild(fileName);

              // Кнопка для удаления файла
              const deleteFileButton = document.createElement("button");
              deleteFileButton.textContent = "Удалить";
              deleteFileButton.classList.add(
                "buttondel",
                "border-white",
                "fill-green"
              );

              deleteFileButton.addEventListener("click", async () => {
                try {
                  // Отправка DELETE запроса на сервер для удаления файла
                  const deleteResponse = await fetch(`/api/files/${file.id}`, {
                    method: "DELETE",
                  });

                  if (!deleteResponse.ok) {
                    throw new Error(
                      `HTTP error! Status: ${deleteResponse.status}`
                    );
                  }

                  console.log("File deleted successfully");

                  // Удаление элемента файла из интерфейса
                  fileItem.remove();
                } catch (error) {
                  console.error("Error while deleting file:", error);
                }
              });

              fileItem.appendChild(deleteFileButton);

              // Добавьте дополнительные элементы или информацию о файле по вашему выбору

              filesContainer.appendChild(fileItem);
            });

            // Отображение контейнера с файлами
            moduleDetails.appendChild(filesContainer);
          }
        } catch (error) {
          console.error("Error while fetching and rendering files:", error);
        }
      });

      moduleDetails.appendChild(moduleSummary);
      moduleDetails.appendChild(addModuleButton);
      moduleList.appendChild(moduleDetails);
    });
  } catch (error) {
    console.error("Error while fetching and rendering modules:", error);
  }
});
