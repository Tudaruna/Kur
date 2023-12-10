document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });
    console.log(data);
    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const jsonString = JSON.stringify(data);
        localStorage.setItem("userData", jsonString);

        window.location.href = "/mainprepod.html";
        console.log(data);
      })
      .catch((error) => {
        console.error("Error during login:", error.message);
      });
  });
