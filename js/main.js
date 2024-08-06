$(function () {
  $("#loginForm").on("submit", function (e) {
    e.preventDefault();
    const email = $("#email").val();
    const password = $("#password").val();

    $.ajax({
      url: "/api/auth/login",
      method: "POST",
      data: { email, password },
      success: function (response) {
        localStorage.setItem("token", response.token);
        $("#login").hide();
        $("#dashboard").show();
        loadIncidents();
      },
      error: function (err) {
        console.error("Login error", err);
      },
    });
  });

  function loadIncidents() {
    $.ajax({
      url: "/api/incidents",
      method: "GET",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      success: function (data) {
        const incidentTableBody = $("#incidentTableBody");
        incidentTableBody.empty();
        const labels = [];
        const dataPoints = [];
        data.forEach((incident) => {
          labels.push(incident.title);
          dataPoints.push(incident.status === "Resolved" ? 1 : 0);
          incidentTableBody.append(`
              <tr>
                <td>${incident.title}</td>
                <td>${incident.status}</td>
                <td>
                  <button class="btn btn-info">View</button>
                  <button class="btn btn-warning">Edit</button>
                </td>
              </tr>
            `);
        });
        renderChart(labels, dataPoints);
      },
      error: function (err) {
        console.error("Failed to load incidents", err);
      },
    });
  }
  function renderChart(labels, dataPoints) {
    const ctx = document.getElementById("incidentChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Incident Status",
            data: dataPoints,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
});
