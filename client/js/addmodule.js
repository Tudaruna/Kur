document.addEventListener("DOMContentLoaded", function () {
    const addModuleForm = document.getElementById("addModuleForm");

    addModuleForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const editProjectData = localStorage.getItem('editProjectData');
  const project = JSON.parse(editProjectData);
      const moduleName = document.getElementById("moduleName").value;

      try {
        const response = await fetch(`/api/module-add?projectId=${project.id}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            moduleName: moduleName,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Success:', data);

        // Optionally, you can handle success on the client side

        // Reload the page or update the module list as needed
        window.location.reload(); // You may want to replace this with a more efficient way to update your module list
      } catch (error) {
        console.error('Error:', error);
        // Optionally, you can handle errors on the client side
      }
    });
  });