// Function to handle the logout
async function handleLogout() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (response.ok) {
      // Redirect to login page
      window.location.href = "/";
    } else {
      alert("Failed to logout");
    }
  } catch (error) {
    console.error("Error during logout:", error);
    alert("An error occurred during logout");
  }
}

// Attach the event handler to the logout button
document
  .querySelector("button.btn-primary")
  .addEventListener("click", handleLogout);
