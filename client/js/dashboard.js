// Constants and global variables
const apiUrl =
  "https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries?$filter=disasterNumber eq 1491";

let incidentData = [];
let currentPage = 1;
const rowsPerPage = 10;
let filteredData = [];

// Initialization
function init() {
  attachEventListeners();
  fetchData();
}

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
function attachEventListeners() {
  document
    .querySelector("button.btn-primary")
    .addEventListener("click", handleLogout);

  document.getElementById("zoneFilter").addEventListener("change", filterData);
  document
    .getElementById("incidentFilter")
    .addEventListener("change", filterData);
  document
    .getElementById("statusFilter")
    .addEventListener("change", filterData);
  document.getElementById("dateFilter").addEventListener("change", filterData);
}

// Function to fetch data from API
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Apply randomization to the fetched data
    incidentData = randomizeData(data.DisasterDeclarationsSummaries);
    filteredData = incidentData; // Initialize filteredData
    displayTableData();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to format date to a more readable format
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
}

// Function to randomize data
function randomizeData(data) {
  const states = ["VA", "CA", "TX", "FL", "NY", "WA", "OR"];
  const incidents = ["Hurricane", "Earthquake", "Fire", "Flood", "Tornado"];
  const statuses = ["Low", "Medium", "High"];

  return data.map((item) => ({
    state: getRandomItem(states),
    incident: getRandomItem(incidents),
    status: getRandomItem(statuses),
    date: getRandomDate("2000-01-01", "2024-12-31"),
  }));
}

// Function to get a random date within a specified range
function getRandomDate(startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString().split("T")[0];
}

// Function to get a random item from an array
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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
      <td>${incident.state}</td>
      <td>${incident.incident}</td>
      <td>${incident.status}</td>
      <td>${formatDate(incident.date)}</td>
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
  const prevPageItem = createPaginationItem("«", currentPage === 1, () => {
    if (currentPage > 1) {
      currentPage--;
      displayTableData();
    }
  });
  paginationControls.appendChild(prevPageItem);

  // Page numbers
  for (let i = 1; i <= pageCount; i++) {
    const pageItem = createPaginationItem(i, i === currentPage, () => {
      currentPage = i;
      displayTableData();
    });
    paginationControls.appendChild(pageItem);
  }

  // Next button
  const nextPageItem = createPaginationItem(
    "»",
    currentPage === pageCount,
    () => {
      if (currentPage < pageCount) {
        currentPage++;
        displayTableData();
      }
    }
  );
  paginationControls.appendChild(nextPageItem);
}

// Helper function to create a pagination item
function createPaginationItem(content, isDisabled, onClick) {
  const item = document.createElement("li");
  item.className = `page-item${isDisabled ? " disabled" : ""}`;
  item.innerHTML = `<a class="page-link" href="#" aria-label="${content}"><span aria-hidden="true">${content}</span></a>`;
  item.addEventListener("click", function (e) {
    e.preventDefault();
    if (!isDisabled) onClick();
  });
  return item;
}

// Function to filter data based on selected filters
function filterData() {
  const zoneFilter = document.getElementById("zoneFilter").value;
  const incidentFilter = document.getElementById("incidentFilter").value;
  const statusFilter = document.getElementById("statusFilter").value;
  const dateFilter = document.getElementById("dateFilter").value;

  filteredData = incidentData.filter((incident) => {
    const matchesZone = zoneFilter === "All" || incident.state === zoneFilter;
    const matchesIncident =
      incidentFilter === "All" || incident.incident === incidentFilter;
    const matchesStatus =
      statusFilter === "All" || incident.status === statusFilter;
    const matchesDate =
      !dateFilter ||
      new Date(incident.date).toISOString().split("T")[0] === dateFilter;

    return matchesZone && matchesIncident && matchesStatus && matchesDate;
  });

  currentPage = 1; // Reset to the first page after filtering
  displayTableData();
}

// Initialize the application
init();
