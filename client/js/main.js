document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Simulate an API call to authenticate the user
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Redirect to the dashboard
          window.location.href = "/dashboard";
        } else {
          alert("Invalid email or password.");
        }
      })
      .catch(() => {
        alert("An error occurred. Please try again.");
      });
  });
});
