async function fetchDisasterData() {
  const url =
    "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=disasterNumber eq 1491";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    window.disasterData = data.DisasterDeclarationsSummaries;
    populateTable(window.disasterData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function populateTable(data) {
  const tableBody = document.getElementById("incidentTableBody");
  tableBody.innerHTML = ""; // Clear existing data

  data.forEach((item) => {
    const row = document.createElement("tr");

    const zoneCell = document.createElement("td");
    zoneCell.textContent = item.state; // Adjust according to data structure
    row.appendChild(zoneCell);

    const incidentCell = document.createElement("td");
    incidentCell.textContent = item.incidentType; // Adjust according to data structure
    row.appendChild(incidentCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = formatDate(item.declarationDate); // Adjust according to data structure
    row.appendChild(statusCell);

    tableBody.appendChild(row);
  });
}

function filterTable() {
  const zoneFilter = document.getElementById("zoneFilter").value;
  const incidentFilter = document.getElementById("incidentFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;

  const filteredData = window.disasterData.filter((item) => {
    const matchesZone = zoneFilter === "All" || item.state === zoneFilter;
    const matchesIncident =
      incidentFilter === "All" || item.incidentType === incidentFilter;
    const matchesStatus =
      statusFilter === "All" ||
      getStatus(item.declarationDate) === statusFilter;

    return matchesZone && matchesIncident && matchesStatus;
  });

  populateTable(filteredData);
}

function getStatus(date) {
  const now = new Date();
  const declarationDate = new Date(date);
  const diffTime = Math.abs(now - declarationDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return "High";
  } else if (diffDays < 90) {
    return "Medium";
  } else {
    return "Low";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchDisasterData();

  document.getElementById("zoneFilter").addEventListener("change", filterTable);
  document
    .getElementById("incidentFilter")
    .addEventListener("change", filterTable);
  document
    .getElementById("statusFilter")
    .addEventListener("change", filterTable);

  // Attach the event handler to the logout button
  document
    .querySelector("button.btn-primary")
    .addEventListener("click", handleLogout);
});

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
