const apiUrl =
  "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=disasterNumber eq 1491";

let incidentData = [];
let currentPage = 1;
const rowsPerPage = 10;
let filteredData = [];

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

// Function to fetch data from API
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    // Adding diversity
    incidentData = data.DisasterDeclarationsSummaries.map((item, index) => ({
      zone: index % 2 === 0 ? "VA" : "CA",
      incident: index % 3 === 0 ? "Hurricane" : "Earthquake",
      status: ["Low", "Medium", "High"][index % 3],
      date: item.declarationDate,
    }));
    filteredData = incidentData; // Initializing filteredData
    displayTableData();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to display data in the table
function displayTableData() {
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const tableBody = document.getElementById("incidentTableBody");
  tableBody.innerHTML = "";

  currentPageData.forEach((incident) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${incident.zone}</td>
      <td>${incident.incident}</td>
      <td>${incident.status}</td>
    `;
    tableBody.appendChild(row);
  });

  setupPagination();
}

// Function to setup pagination controls
function setupPagination() {
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginationControls = document.getElementById("paginationControls");
  paginationControls.innerHTML = "";

  // Previous button
  const prevPageItem = document.createElement("li");
  prevPageItem.className = "page-item" + (currentPage === 1 ? " disabled" : "");
  prevPageItem.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
  prevPageItem.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      displayTableData();
    }
  });
  paginationControls.appendChild(prevPageItem);

  // Page numbers
  for (let i = 1; i <= pageCount; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = "page-item" + (i === currentPage ? " active" : "");
    pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    pageItem.addEventListener("click", function (e) {
      e.preventDefault();
      currentPage = i;
      displayTableData();
    });
    paginationControls.appendChild(pageItem);
  }

  // Next button
  const nextPageItem = document.createElement("li");
  nextPageItem.className =
    "page-item" + (currentPage === pageCount ? " disabled" : "");
  nextPageItem.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
  nextPageItem.addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage < pageCount) {
      currentPage++;
      displayTableData();
    }
  });
  paginationControls.appendChild(nextPageItem);
}

// Function to filter data based on selected filters
function filterData() {
  const zoneFilter = document.getElementById("zoneFilter").value;
  const incidentFilter = document.getElementById("incidentFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;

  filteredData = incidentData.filter((incident) => {
    const matchesZone = zoneFilter === "All" || incident.zone === zoneFilter;
    const matchesIncident =
      incidentFilter === "All" || incident.incident === incidentFilter;
    const matchesStatus =
      statusFilter === "All" || incident.status === statusFilter;
    return matchesZone && matchesIncident && matchesStatus;
  });

  currentPage = 1; // Reset to the first page after filtering
  displayTableData();
}

// Attach event listeners to filters
document.getElementById("zoneFilter").addEventListener("change", filterData);
document
  .getElementById("incidentFilter")
  .addEventListener("change", filterData);
document.getElementById("statusFilter").addEventListener("change", filterData);

// Initial data fetch
fetchData();
