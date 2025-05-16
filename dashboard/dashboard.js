const api = 'http://localhost:5000'

const token = localStorage.getItem("authToken")
console.log(token,"token")


document.addEventListener("DOMContentLoaded", function () {
    // Replace this with your actual API URL
    const apiUrl = `${api}/schedule/getManagementDashboardDetails`;

    fetch(apiUrl,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token // Include the token in the headers
}})
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log('res',response)
        return response.json();
      })
      .then(data => {
        // Update summary cards
        document.getElementById("eastCount").textContent = data.totalEastZoneSchedules;
        document.getElementById("westCount").textContent = data.totalWestZoneSchedules;
        document.getElementById("northCount").textContent = data.totalNorthZoneSchedules;
        document.getElementById("southCount").textContent = data.totalSouthzoneSchedules;
        document.getElementById("openTicket").textContent = data.openTicket;
        document.getElementById("closedTicket").textContent = data.closedTicket;
        document.getElementById("pendingSm").textContent = data.pendingSmApproval;
        document.getElementById("pendingZm").textContent = data.pendingZmApproval;

        // Initialize DataTable and populate rows
        const table = $('#requestsTable').DataTable();

        data.scheduleinspectiondto.forEach(entry => {
          table.row.add([
            entry.zoneName || "N/A",
            entry.storename || "N/A",
            entry.storeManagerEmail || "N/A",
            entry.zonalManagerEmail || "N/A",
         entry.scheduleType || 'N/A',
            entry.status || "N/A",
            entry.date || "N/A"
          ]).draw();
        });
      })
      .catch(error => {
        console.error("Error fetching dashboard data:", error);
      });
  });