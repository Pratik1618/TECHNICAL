api=getBaseUrl();
token = localStorage.getItem('authToken');


// to keep tab active

//get call
document.addEventListener("DOMContentLoaded", function () {
  // Fetch zones from backend and populate the dropdown
  fetch(`${api}/zone/`,{ headers: {'Authorization': `${token}`} }) // Replace with your actual API endpoint
    .then((response) => response.json())
    .then((data) => {
      const zoneSelect = document.getElementById("zoneName");
      data.forEach((zone) => {
        const option = document.createElement("option");
        option.value = zone.id;
        option.textContent = zone.zoneName;
        zoneSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching zones:", error);
      document.getElementById("error-message").textContent =
        "Failed to load zones. Please try again.";
    });


// Handle form submission
document
  .getElementById("storeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const zoneName = parseInt(document.getElementById("zoneName").value);
    const stateName = document.getElementById("stateName").value; // Get selected client ID
    const storeData = {
      zone: {
        id: zoneName,
      },
      stateName: stateName,
    };

    console.log("Form data:", storeData);

    fetch(`${api}/state/new`, {
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
            throw new Error(error.message || "Unknown error");
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
  const errorMessageElement = document.getElementById("error-message");
  const successMessageElement = document.getElementById("success-message");

  successMessageElement.textContent = ""; // Clear success message
  errorMessageElement.textContent = message;
}

// Function to display success messages
function displaySuccess(message) {
  const successMessageElement = document.getElementById("success-message");
  const errorMessageElement = document.getElementById("error-message");

  errorMessageElement.textContent = ""; // Clear error message
  successMessageElement.textContent = message;
}


  const table = $("#stateTable").DataTable({
    ajax: {
      url: `${api}/state/`, // Replace with your API endpoint
      dataSrc: "",
      headers: {
        'Authorization': `${token}`
      } 
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1; // Increment by 1 to display the serial number starting from 1
        },
        title: "SR No",
      },
      { data: "zone.zoneName" },
      { data: "stateName" },
      {
        data: null,
        render: function (data, type, row) {
          return `
                        <button class="edit" onclick="window.location.href='editState.html?id=${row.id}'">Edit</button>
                        <button class = "delete" onclick="deleteStore(${row.id})">Delete</button>
                    `;
        },
      },
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
        next: "Next",
      },
    },
  });

  // Handle delete client operation
  window.deleteStore = function (id) {
    if (confirm("Are you sure you want to delete this client?")) {
      fetch(`${api}/state/delete/${id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `${token}`
        } 
      })
        .then((response) => {
          if (response.ok) {
            return response.text(); // or response.json() if you expect JSON
          } else {
            return response.text().then((text) => Promise.reject(text));
          }
        })
        .then(() => {
          table.ajax.reload(); // Refresh the table data
        })
        .catch((error) => console.error("Error deleting client:", error));
    }
  };

  document
    .getElementById("exportButton")
    .addEventListener("click", function () {
      exportToExcel();
    });

   
    window.exportToExcel = function() {
   
      const url = `${api}/state/excel`; // Endpoint to get the Excel file
  
      fetch(url, {
          method: 'GET',
          headers: {
              'Authorization': `${token}`,
               // Optional: specify content type if needed
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.blob(); // Convert response to a blob (binary large object)
      })
      .then(blob => {
          // Create a link element
          const link = document.createElement('a');
          const objectURL = URL.createObjectURL(blob); // Create an object URL for the blob
          link.href = objectURL;
          link.download = 'state.xlsx'; // Set the default filename for the download
          document.body.appendChild(link);
          link.click(); // Programmatically click the link to trigger the download
          URL.revokeObjectURL(objectURL); // Clean up the object URL
          document.body.removeChild(link);
      })
      .catch(error => {
          console.error('Error exporting to Excel:', error);
      });
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
