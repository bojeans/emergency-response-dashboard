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
        data.forEach((incident) => {
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
      },
      error: function (err) {
        console.error("Failed to load incidents", err);
      },
    });
  }
});
