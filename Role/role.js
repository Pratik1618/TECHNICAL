api='http://localhost:8083';
token = localStorage.getItem('authToken');

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

//post methods
document.addEventListener("DOMContentLoaded", function () {
  const clientSelect = document.getElementById("clientName");

  // Handle form submission
  document
    .getElementById("storeForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const roleName = document.getElementById("roleName").value;

      const storeData = {
        roleType: roleName,
      };

      console.log("Form data:", storeData);

      fetch(`${api}/role/create`, {
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
          table.ajax.reload();
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


//data table of client

  const table = $("#roletTable").DataTable({
      ajax: {
          url: `${api}/role/`, // Replace with your API endpoint
          dataSrc: '',
           headers: {'Authorization': `${token}`} 
      },
      columns: [
          {
              data: null,
              render: function(data, type, row, meta) {
                  return meta.row + 1; // Increment by 1 to display the serial number starting from 1
              },
              title: "SR No"
          },
          { data: 'roleType' },
          { 
              data: null,
              render: function(data, type, row) {
                  return `
                      <button class="edit" onclick="window.location.href='editRole.html?id=${row.id}'">Edit</button>
                      <button class="delete" onclick="deleteRole(${row.id})">Delete</button>
                  `;
              }
          }
      ],
      searching: true,
      paging: true,
      info: true,
      lengthChange: false,
      pageLength: 5,
      language: {
          search: "Search:",
          info: "Showing _START_ to _END_ of _TOTAL_ entries",
          paginate: {
              previous: "Previous",
              next: "Next"
          }
      }
  });

  // Handle delete client operation
  window.deleteRole = function (id) {
      if (confirm("Are you sure you want to delete this role?")) {
          fetch(`${api}/role/delete/${id}`, {
              method: "DELETE",
              headers: {'Authorization': `${token}`} 
          })
          .then(response => {
              if (response.ok) {
                  return response.text(); // or response.json() if you expect JSON
              } else {
                  return response.text().then(text => Promise.reject(text));
              }
          })
          .then(() => {
              table.ajax.reload(); // Refresh the table data
          })
          .catch(error => console.error("Error deleting role:", error));
      }
  };

  document
    .getElementById("exportButton")
    .addEventListener("click", function () {
      exportToExcel();
    });

  window.exportToExcel = function(){
    const url = `${api}role/excel?token=${encodeURIComponent(token)}`
    window.location.href = url;
  }

  // Optional: Style the search input field with CSS
  const customFilterStyle = `
    .custom-filter {
        float: right;
        margin-bottom: 20px;
    }
    .custom-filter input {
        width: 200px;
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



