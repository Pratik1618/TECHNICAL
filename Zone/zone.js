 token = localStorage.getItem('authToken');
api='http://localhost:8083/';

//to keep tab active
document.addEventListener('DOMContentLoaded', (event) => {
  const tabs = document.querySelectorAll('.nav-link');
  
  // Retrieve the last active tab from local storage
  const activeTabId = localStorage.getItem('activeTab');
  
  // If there's an active tab in local storage, activate it
  if (activeTabId) {
    document.querySelector(`#${activeTabId}`).classList.add('active');
  }
  
  // Add click event listener to each tab
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove 'active' class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add 'active' class to the clicked tab
      tab.classList.add('active');
      
      // Save the active tab ID in local storage
      localStorage.setItem('activeTab', tab.id);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  //const clientSelect = document.getElementById("clientName");

  // Handle form submission
  document
    .getElementById("storeForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const zoneName = document.getElementById("zoneName").value;

      const storeData = {
        zoneName: zoneName,
      };

      console.log("Form data:", storeData);

      fetch(`${api}zone/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `${token}`
        },
        body: JSON.stringify(storeData),
      })
      .then((response) => {
        if (!response.ok) {
          // Check if response status is not OK
          return response.json().then((error) => {
            throw new Error(error.message || 'Unknown error');
          });
        }
        return response.json();
      })
      .then((result) => {
        console.log("Success:", result);
        displaySuccess("Data saved successfully!");
        document.getElementById("storeForm").reset();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        displayError(error.message || "Error saving data. Please try again.");
      });
    });

  // Function to display error messages
  function displayError(message) {
    const errorMessageElement =
      document.getElementById("error-message");
    const successMessageElement =
      document.getElementById("success-message");

    successMessageElement.textContent = ""; // Clear success message
    errorMessageElement.textContent = message;
  }

  // Function to display success messages
  function displaySuccess(message) {
    const successMessageElement =
      document.getElementById("success-message");
    const errorMessageElement =
      document.getElementById("error-message");

    errorMessageElement.textContent = ""; // Clear error message
    successMessageElement.textContent = message;
  }
});

// Initialize DataTables when the document is ready
document.addEventListener("DOMContentLoaded", function() {
    const table = $("#zoneDataTable").DataTable({
        ajax: {
            url: `${api}zone/`, // Replace with your API endpoint
            dataSrc: '',
            headers: {
              'Authorization': `${token}`
            },
        },
        columns: [
          {
            data: null, // No data source
            render: function (data, type, row, meta) {
              return meta.row + 1; // Increment by 1 to display the serial number starting from 1
            },
            title: "SR No", // Column title
          },
            { data: "zoneName" },
          
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="edit" onclick="window.location.href='editZone.html?id=${row.id}'">Edit</button>
                        <button class ="delete" onclick="deleteZone(${row.id})">Delete</button>
                    `;
                }
            }
        ],
        searching: true,
        paging: true,
        info: true,
        lengthChange: false, // Hide the page length dropdown
        pageLength: 5, // Number of entries per page
        language: {
            search: "Search:",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            paginate: {
                previous: "Previous",
                next: "Next"
            }
        }
    });

    // Handle delete store operation
  window.deleteZone = function (id) {
    if (confirm("Are you sure you want to delete this store?")) {
      fetch(`${api}zone/delete/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `${token}`
        },
      })
        .then((response) => {
          if (response.ok) {
            table.ajax.reload(); // Refresh the table data
          } else {
            console.error("Failed to delete the store");
          }
        })
        .catch((error) => console.error("Error deleting store:", error));
    }
  };

  document
    .getElementById("exportButton")
    .addEventListener("click", function () {
      exportToExcel();
    });
  });

 

  window.exportToExcel = function(){
    const url = `${api}zone/excel`
    window.location.href = url;
  }



