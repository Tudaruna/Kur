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

              // Кнопка для загрузки файла
              const downloadFileButton = document.createElement("button");
              downloadFileButton.textContent = "Загрузить";
              downloadFileButton.classList.add(
                "buttondel",
                "border-white",
                "fill-green"
              );

              downloadFileButton.addEventListener("click", async () => {
                try {
                  // Отправка GET запроса на сервер для получения файла
                  const fileResponse = await fetch(`/api/files/${file.id}`);

                  // Проверка статуса ответа
                  if (!fileResponse.ok) {
                    throw new Error(
                      `HTTP error! Status: ${fileResponse.status}`
                    );
                  }

                  // Получение Blob-объекта с файлом
                  const blob = await fileResponse.blob();

                  // Создание ссылки для скачивания
                  const downloadLink = document.createElement("a");
                  downloadLink.href = URL.createObjectURL(blob);
                  downloadLink.download = file.file_name;

                  // Эмуляция клика по ссылке
                  downloadLink.click();

                  // Очистка ссылки после скачивания
                  URL.revokeObjectURL(downloadLink.href);
                } catch (error) {
                  console.error("Error while downloading file:", error);
                }
              });

              fileItem.appendChild(downloadFileButton);

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
      moduleList.appendChild(moduleDetails);
    });
  } catch (error) {
    console.error("Error while fetching and rendering modules:", error);
  }
});
