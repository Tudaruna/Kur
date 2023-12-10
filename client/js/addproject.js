document
  .getElementById("projectForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get user ID from local storage
    const userData = localStorage.getItem("userData");
    const userObject = JSON.parse(userData);

    // Collect form data
    const formData = new FormData(event.target);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Convert date format to match your server expectations
    const deadline = formData.get("deadline");

    // Check if deadline is not null before splitting
    if (deadline !== null) {
      const splitDate = deadline.split("-");
      formObject.projectEndDate = `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
    } else {
      // Handle the case where deadline is null or not provided
      console.error("Error: Deadline is null or not provided");
      return; // Stop further execution
    }

    // Add user ID to the form data
    formObject.userId = userObject.user_id;

    try {
      // Send data to the server using Fetch API
      const response = await fetch(
        `/api/project-add?userId=${userObject.user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formObject),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      window.location.href = "myproject.html";

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
      // Optionally, you can handle errors on the client side
    }
  });
