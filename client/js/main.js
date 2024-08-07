document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(`Login attempt: ${email} / ${password}`);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Response received:", data);

      if (data.success) {
        console.log("Login successful, redirecting to dashboard...");
        window.location.href = "/dashboard";
      } else {
        console.log("Login failed");
        alert("Invalid email or password.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
