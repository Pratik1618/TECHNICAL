api=getBaseUrl();
token = localStorage.getItem('authToken');
userName=localStorage.getItem('UserName');
userrole=localStorage.getItem("userRole");
console.log("userrole"+userrole);


//to keep tab active

if (userrole!="ADMIN"){
  document.getElementById('containerHide').style.display = 'none';
  document.getElementById('shaduleContainerHide').style.display = 'none';
  document.getElementById('adminActionHide').style.display = 'none';
}
//phone number
const phoneNumberInput = document.getElementById("phoneNumber");

phoneNumberInput.addEventListener("input", function () {
  this.value = this.value.replace(/\D/, ""); // Remove any non-numeric characters
});

//date from prasent to feature
const today = new Date().toISOString().split("T")[0];
document.getElementById("date").setAttribute("min", today);

document.getElementById('excelFile').addEventListener('change', function() {
  var fileName = this.files[0] ? this.files[0].name : 'No file chosen';
  document.getElementById('fileName').textContent = fileName;
});

//chatgpt
document.addEventListener("DOMContentLoaded", function () {
  const clientSelect = document.getElementById("clientName");
  const storeSelect = document.getElementById("storeName");

  // Fetch clients and populate dropdown
  fetch(`${api}/client/`,{ headers: {'Authorization': `${token}`} })
    .then((response) => response.json())
    .then((data) => {
      console.log("Client data:", data);
      data.forEach((client) => {
        const option = document.createElement("option");
        option.value = client.id;
        option.textContent = client.clientName;
        clientSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching clients:", error);
      document.getElementById("error-message").textContent =
        "Failed to load clients. Please try again.";
    });

  // Event listener for client dropdown change
  clientSelect.addEventListener("change", function () {
    const selectedClientId = this.value;

    if (selectedClientId) {
      fetch(`${api}/store/client/${selectedClientId}`,{ headers: {'Authorization': `${token}`} })
        .then((response) => response.json())
        .then((data) => {
          console.log("Store data:", data);
          storeSelect.innerHTML = '<option value="">Select a Store</option>'; // Clear previous stores
          data.forEach((store) => {
            const option = document.createElement("option");
            option.value = store.id;
            option.textContent = store.storeCode + " - " + store.storeName;
            storeSelect.appendChild(option);
          });
        })
        .catch((error) => {
          console.error("Error fetching stores:", error);
          document.getElementById("error-message").textContent =
            "Failed to load stores. Please try again.";
        });
    } else {
      storeSelect.innerHTML = '<option value="">Select a Store</option>'; // Clear store dropdown if no client is selected
    }
  });

  // Handle form submission
  document.getElementById("storeForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const client = parseInt(document.getElementById("clientName").value, 10);
    const storeName = parseInt(document.getElementById("storeName").value, 10);
    const technicianName = document.getElementById("technicianName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const technicianEmail = document.getElementById("technicianEmail").value.trim();
    const date = document.getElementById("date").value;
    const scheduleFor = document.getElementById("scheduleFor").value;

    const storeData = {
      client: { id: client },
      store: { id: storeName },
      scheduleFor: scheduleFor,
      technicianName: technicianName,
      mobNumber: phoneNumber,
      technicianEmail: technicianEmail,
      date: date,
    };

    console.log("Form data:", storeData);

    fetch(`${api}/schedule/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `${token}`
      },
      body: JSON.stringify(storeData),
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.message || 'Unknown error');
        });
      }
      return response.json();
    })
    .then(result => {
      console.log("Success:", result);
      displaySuccess("Data saved successfully!");
      document.getElementById("storeForm").reset();
      table.ajax.reload(); // Reload table after form submission
    })
    .catch(error => {
      console.error("Error submitting form:", error);
      displayError(error.message || "Error saving data. Please try again.");
    });
  });

  // Handle Excel file upload
  document.getElementById("uploadForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];

    if (!file) {
      displayUploadError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch(`${api}/schedule/upload`, {
      method: "POST",
      headers: {
        'Authorization': `${token}`
      },
      body: formData,
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
          throw new Error(error.message || 'Unknown error');
        });
      }
      return response.json();
    })
    .then(result => {
      console.log("Upload Success:", result);
      displayUploadSuccess("Excel file uploaded successfully!");
      document.getElementById("uploadForm").reset();
      table.ajax.reload(); // Reload table after file upload
    })
    .catch(error => {
      console.error("Error uploading file:", error);
      displayUploadError(error.message || "Error uploading file. Please try again.");
    });
  });

  // Helper functions to display messages
  function displayError(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = 'block'; // Ensure it's visible
  }

  function displaySuccess(message) {
    const successElement = document.getElementById("success-message");
    successElement.textContent = message;
    successElement.style.display = 'block'; // Ensure it's visible
  }

  function displayUploadError(message) {
    const uploadErrorElement = document.getElementById("upload-error-message");
    uploadErrorElement.textContent = message;
    uploadErrorElement.style.display = 'block'; // Ensure it's visible
  }

  function displayUploadSuccess(message) {
    const uploadSuccessElement = document.getElementById("upload-success-message");
    uploadSuccessElement.textContent = message;
    uploadSuccessElement.style.display = 'block'; // Ensure it's visible
  }


// Initialize DataTables when the document is ready

    const table = $("#scheduleTable").DataTable({
        ajax: {
            url: `${api}/schedule/`, // Replace with your API endpoint
            dataSrc: '',
            headers: {
              'Authorization': `${token}`
            },
        },
        columns: [
            { data: "tikitNumber" },
            { data: "client.clientName" },
            { data: "store.storeName" },
            {data:  "store.storeCode"},
            { data: "scheduleFor" },
            { data: "technicianName" },
            { data: "mobNumber" },
            { data: "technicianEmail" },
            { data: "date" },
            {
              data: "status",
              render: function(data, type, row) {
                  if (data === "TICKET CLOSED") {
                      return `<span style="color: green;">${data}</span>`;
                  }else if(data==="TICKET OPEN"){
                    return `<span style="color: red;">${data}</span>`;
                  }
                  return data;
              }
          },
            {
              data: null,
              render: function(data, type, row) {
                  if (userrole === "ADMIN") {
                      return `
                          <button class="edit" onclick="window.location.href='editShedule.html?id=${row.id}'">Edit</button>
                          <button class="delete" onclick="deleteSchedule(${row.id})">Delete</button>
                      `;
                  }
                  return ''; 
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
    $('#filter-client').on('keyup', function () {
      table.column(1).search(this.value).draw();
    });
    
    $('#filter-shadule').on('keyup', function () {
      table.column(4).search(this.value).draw();
    });
    $('#filter-store').on('keyup', function () {
      table.column(2).search(this.value).draw();
    });
    $('#filter-technician').on('keyup', function () {
      table.column(5).search(this.value).draw();
    });
    
    $('#filter-status').on('change', function () {
      table.column(9).search(this.value).draw();
    });
    
    // Date range filtering
    $.fn.dataTable.ext.search.push(function (settings, data) {
      const fromDate = $('#filter-from-date').val();
      const toDate = $('#filter-to-date').val();
      const visitDate = data[8]; // The date column in the DataTable
    
      if (
          (!fromDate && !toDate) ||
          (fromDate && !toDate && visitDate >= fromDate) ||
          (!fromDate && toDate && visitDate <= toDate) ||
          (fromDate && toDate && visitDate >= fromDate && visitDate <= toDate)
      ) {
          return true;
      }
      return false;
    });
    
    $('#filter-from-date, #filter-to-date').on('change', function () {
      table.draw();
    });
    // Handle delete store operation
  window.deleteSchedule = function (id) {
    if (confirm("Are you sure you want to delete this store?")) {
      fetch(`${api}/schedule/delete/${id}`, {
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
      exportToExcel(table);
    });


function exportToExcel(table) {
  // Get the filtered data from DataTable
  const filteredData = table.rows({ filter: "applied" }).data().toArray();

  // Define custom headers
  const customHeaders = [
    { header: "Ticket Number", key: "tikitNumber" },
    { header: "Client Name", key: "client.clientName" },
    { header: "Store Name", key: "store.storeName" },
    { header: "Store Code", key: "store.storeCode" },
    { header: "Scheduled For", key: "scheduleFor" },
    { header: "Technician Name", key: "technicianName" },
    { header: "Mobile Number", key: "mobNumber" },
    { header: "Technician Email", key: "technicianEmail" },
    { header: "Date", key: "date" },
    {header:"Status",key:"status"},
  ];

  // Map column headers and data keys
  const headers = customHeaders.map((header) => header.header);
  const keys = customHeaders.map((header) => header.key);

  // Filter out the excluded columns from each row of data
  const filteredDataForExport = filteredData.map((row) => {
    return keys.reduce((acc, key) => {
      const keysArray = key.split(".");
      let value = row;
      keysArray.forEach((k) => {
        if (value) value = value[k];
      });
      acc[headers[keys.indexOf(key)]] = value; // Map to header names
      return acc;
    }, {});
  });

  // Convert filtered data to a worksheet
  const ws = XLSX.utils.json_to_sheet(filteredDataForExport, {
    header: headers,
  });

  // Apply custom headers and styling
  customHeaders.forEach((header, index) => {
    const cell_address = { c: index, r: 0 }; // Header row
    const cell_ref = XLSX.utils.encode_cell(cell_address);
    if (!ws[cell_ref]) ws[cell_ref] = {};
    ws[cell_ref].v = header.header; // Set custom header text

    // Apply style to header
    ws[cell_ref].s = {
      font: { bold: true, sz: 12, color: { rgb: "000000" } }, // Black font
      fill: { fgColor: { rgb: "FFFF00" } }, // Yellow background color
      alignment: { horizontal: "center", vertical: "center" }, // Center alignment
    };
  });

  // Auto-size columns based on content
  const col_widths = headers.map((header) => {
    return Math.max(
      ...filteredDataForExport.map((row) =>
        row[header] ? row[header].toString().length : 0
      ),
      header.length
    );
  });

  ws["!cols"] = headers.map((_, index) => ({
    width: col_widths[index] + 2, // Add some padding to the column width
  }));

  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:T]/g, "").slice(0, 15); // Format as YYYYMMDDHHmm

  // Create a workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `Schedule_Data_${timestamp}`);

  // Write the workbook to a file and trigger the download
  XLSX.writeFile(wb, `schedule_data_${timestamp}.xlsx`);
}

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

function editSchedule(id) {
  console.log("Edit schedule with ID:", id);
}

function deleteSchedule(id) {
  console.log("Delete schedule with ID:", id);
}
});

//download format 
// Custom filtering functionality

document
    .getElementById("format")
    .addEventListener("click", function () {
      exportToExcel();
    });
  
  // window.exportToExcel = function(){
  //   const url = `${api}/schedule/format/download?token=${encodeURIComponent(token)}`
  //   window.location.href = url;
  // }

  window.exportToExcel = function() {
   
    const url = `${api}/schedule/format/download`; // Endpoint to get the Excel file

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json' // Optional: specify content type if needed
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
        link.download = 'data.xlsx'; // Set the default filename for the download
        document.body.appendChild(link);
        link.click(); // Programmatically click the link to trigger the download
        URL.revokeObjectURL(objectURL); // Clean up the object URL
        document.body.removeChild(link);
    })
    .catch(error => {
        console.error('Error exporting to Excel:', error);
    });
}

