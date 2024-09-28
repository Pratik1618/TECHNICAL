api='http://localhost:8083';
token = localStorage.getItem('authToken');

//to keep tab active
document.addEventListener("DOMContentLoaded", (event) => {
  const tabs = document.querySelectorAll(".nav-link");

  // Retrieve the last active tab from local storage
  const activeTabId = localStorage.getItem("activeTab");

  // If there's an active tab in local storage, activate it
  if (activeTabId) {
    document.querySelector(`#${activeTabId}`).classList.add("active");
  }

  // Add click event listener to each tab
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove 'active' class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));

      // Add 'active' class to the clicked tab
      tab.classList.add("active");

      // Save the active tab ID in local storage
      localStorage.setItem("activeTab", tab.id);
    });
  });
});


// Example data fetching function (replace with your actual API call)
document.addEventListener("DOMContentLoaded", function () {
  const table = $("#inspectionId").DataTable({
    ajax: {
      url: `${api}/user/`, // Replace with your API endpoint
      dataSrc: "",
    headers: {
      'Authorization': `${token}`}
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1; // Display serial number starting from 1
        },
      },
      { data: "userName" },
      { data: "mobileNumber" },
      { data: "password" },
      { data: "client.clientName" },
      {data:"store.storeName"},
      {data:"store.storeCode"},
      { data: "zone.zoneName" },
      { data: "role.displayName" },
      {
        data: null,
        render: function (data, type, row) {
          return `
            <button class="edit" onclick="window.location.href='editSignUp.html?id=${row.id}'">Edit</button>
            <button class="delete" onclick="deleteInspectionForm(${row.id})">Delete</button>
          `;
        },
      },
    
    ],
    pagingType: "simple_numbers",
    pageLength: 10,
    lengthChange: false,
    searching: true,
    ordering: true,
    autoWidth: false,
    responsive: true,
  });

  

  // Move pagination to the right side
  $("#inspectioId_paginate").addClass("pagination-right");

  // Add a custom search input field (optional)
  $("#inspectioId_filter").addClass("custom-filter");
  
  // Handle delete store operation
  window.deleteInspectionForm = function (id) {
    if (confirm("Are you sure you want to delete this store?")) {
      fetch(`${api}/user/delete/${id}`, {
        method: "DELETE",
        headers: {
            
          'Authorization': `${token}`
        },
      })
        .then((response) => {
          if (response.ok) {
            table.ajax.reload(); // Refresh the table data
            console.log(response);
          } else {
            console.error("Failed to delete the store");
          }
        })
        .catch((error) => console.error("Error deleting store:", error));
    }
  };

  // Optional: Style the search input field with CSS
  const customFilterStyle = `
    .custom-filter {
        float: right;
        margin-bottom: 20px;
    }

    .custom-filter input {
        width: 200px; /* Set width for the search input */
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
`;
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customFilterStyle;
  document.head.appendChild(styleSheet);
});
