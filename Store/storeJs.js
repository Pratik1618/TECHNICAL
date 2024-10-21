token = localStorage.getItem('authToken');
api=getBaseUrl();

//to Keep tab active

// get call
document.addEventListener("DOMContentLoaded", function () {
  const clientSelect = document.getElementById("clientName");
  const zoneSelect = document.getElementById("zoneName");
  const stateSelect = document.getElementById("stateName");
  

  // Fetch and populate client data
  fetch(`${api}/client/`,{ headers: {'Authorization': `${token}`} })
    .then((response) => response.json())
    .then((data) => {
      console.log("Client data:", data); // Log data for debugging
      if (Array.isArray(data)) {
        data.forEach((client) => {
          if (client.id && client.clientName) {
            const option = document.createElement("option");
            option.value = client.id;
            option.textContent = client.clientName;
            clientSelect.appendChild(option);
          }
        });
      } else {
        console.error("Expected an array of clients");
      }
    })
    .catch((error) => {
      console.error("Error fetching client data:", error);
      displayError("Failed to load client data. Please try again later.");
    });

  // Fetch and populate zone data
  fetch(`${api}/zone/`,{ headers: {'Authorization': `${token}`} })
    .then((response) => response.json())
    .then((data) => {
      console.log("Zone data:", data); // Log data for debugging
      if (Array.isArray(data)) {
        data.forEach((zone) => {
          if (zone.id && zone.zoneName) {
            const option = document.createElement("option");
            option.value = zone.id;
            option.textContent = zone.zoneName;
            zoneSelect.appendChild(option);
          }
        });
      } else {
        console.error("Expected an array of zones");
      }
    })
    .catch((error) => {
      console.error("Error fetching zone data:", error);
      displayError("Failed to load zone data. Please try again later.");
    });

  // Event listener to fetch states when a zone is selected
  zoneSelect.addEventListener("change", function () {
    const zoneId = this.value;

    if (zoneId) {
      fetch(`${api}/state/zone/${zoneId}`,{ headers: {'Authorization': `${token}`} }) // Assuming this is your endpoint
        .then((response) => response.json())
        .then((data) => {
          console.log("Store data:", data); // Log data for debugging
          stateSelect.innerHTML = '<option value="">Select a State</option>'; // Reset the state dropdown

          if (Array.isArray(data)) {
            data.forEach((state) => {
              if (state.id && state.stateName) {
                const option = document.createElement("option");
                option.value = state.id;
                option.textContent = state.stateName;
                stateSelect.appendChild(option);
              }
            });
          } else {
            console.error("Expected an array of stores");
          }
        })
        .catch((error) => {
          console.error("Error fetching store data:", error);
          displayError("Failed to load store data. Please try again later.");
        });
    } else {
      stateSelect.innerHTML = '<option value="">Select a Store</option>'; // Reset if no zone selected
    }
  });
  document.getElementById("stateName").addEventListener("change", function () {
    const stateId = this.value;
    const citySelect = document.getElementById("cityName");
    
    if (stateId) {
        fetch(`${api}/city/state/${stateId}`,{ headers: {'Authorization': `${token}`} })
            .then(response => response.json())
            .then(data => {
                console.log("City data:", data);
                citySelect.innerHTML = '<option value="">Select a City</option>'; // Reset city dropdown

                if (Array.isArray(data)) {
                    data.forEach(city => {
                        if (city.id && city.cityName) {
                            const option = document.createElement("option");
                            option.value = city.id;
                            option.textContent = city.cityName;
                            citySelect.appendChild(option);
                        }
                    });
                } else {
                    console.error("Expected an array of cities");
                }
            })
            .catch(error => {
                console.error("Error fetching city data:", error);
                displayError("Failed to load city data. Please try again later.");
            });
    } else {
        citySelect.innerHTML = '<option value="">Select a City</option>'; // Reset if no state selected
    }
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

  // Handle form submission
  document
    .getElementById("storeForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const zoneName = parseInt(document.getElementById("zoneName").value);
      const stateName = parseInt(document.getElementById("stateName").value);
      const cityName = parseInt(document.getElementById("cityName").value);
      const storeName = document.getElementById("storeName").value;
      const storeCode = document.getElementById("storeCode").value;
      const address = document.getElementById("address").value;
      const storeManagerEmail = document.getElementById("storeManagerEmail").value;
      const zonalHeadEmail = document.getElementById("zonalHeadEmail").value;
      const nationalHeadEmail = document.getElementById("nationalHeadEmail").value;
      const client = parseInt(document.getElementById("clientName").value); // Get selected client ID
      const sqft=parseInt(document.getElementById("sqft").value);
      const billing=document.getElementById("billing").value;
      const type =document.getElementById("type").value;
     // const city=document.getElementById("city").value;

      const storeData = {
        storeName: storeName,
        storeCode: storeCode,
        address: address,
        zonalHeadEmail: zonalHeadEmail,
        storeManagerEmail: storeManagerEmail,
        nationalHeadEmail: nationalHeadEmail,
        sqft:sqft,
        city:{
          id:cityName,
        },
        type:type,
        billing:billing,
        zone: {
          id: zoneName,
        },
        state: {
          id: stateName,
        },
        client: {
          id: client,
        }
      };

      console.log("Form data:", storeData);

      fetch(`${api}/store/create`, {
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



// new 
// Initialize DataTables when the document is ready

  const table = $('#storeTable').DataTable({
      ajax: {
          url: `${api}/store/`, // Replace with your API endpoint
          dataSrc: '',
          headers: {
            'Authorization': `${token}`
          },
      },
      columns: [
          { data: 'client.clientName' },
          { data: 'storeName' },
          { data: 'storeCode' },
          { data: 'zone.zoneName' },
          { data: 'state.stateName' },
          { data: 'city.cityName' },
          { data: 'type' },
          { data: 'sqft' },
          { data: 'billing' },
          { data: 'storeManagerEmail' },
          { data: 'zonalHeadEmail' },
          { data: 'nationalHeadEmail' },
          { data: 'address' },
          {
            data: null,
            render: function(data, type, row) {
                const qrCodeUrl = `${api}/store/QR/${row.id}`; 

                return `
                    <button class="download-qr" onclick="downloadQRCode('${qrCodeUrl}')">
                      QR Code
                    </button>
                `;
            }
        },
        {
            data: null,
            render: function(data, type, row) {
                return `
                    <button class="edit" onclick="window.location.href='edit.html?id=${row.id}'">Edit</button>
                    <button class="delete" onclick="deleteStore(${row.id})">Delete</button>
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
  // document.getElementById('exportButton').addEventListener('click', function() {
  //   exportToExcel(table);
 // });

 
  
  // Handle delete store operation
  window.deleteStore = function(id) {
      if (confirm("Are you sure you want to delete this store?")) {
          fetch(`${api}/store/delete/${id}`, { 
              method: 'DELETE',
              headers: {
                'Authorization': `${token}`
              }, 
          })
          .then(response => {
              if (response.ok) {
                  table.ajax.reload(); // Refresh the table data
              } else {
                  console.error('Failed to delete the store');
              }
          })
          .catch(error => console.error('Error deleting store:', error));
      }
  };

  document
  .getElementById("exportButton")
  .addEventListener("click", function () {
    exportToExcel(table);
  });


  window.downloadQRCode = async function(url) {
    // Replace with your actual token or fetch dynamically

   try {
       // Log the URL to ensure it is correct
       console.log('Fetching QR code from URL:', url);

       // Make a request to the QR code URL with the Authorization header
       const response = await fetch(url, {
           method: 'GET',
           headers: {
               'Authorization': `${token}`
           }
       });

       if (!response.ok) {
           throw new Error('Network response was not ok');
       }

       // Get the blob from the response
       const blob = await response.blob();
       
       // Create a URL for the blob
       const blobUrl = URL.createObjectURL(blob);
       
       // Create a temporary link element
       const a = document.createElement('a');
       a.href = blobUrl;
       a.download = 'qr-code.png'; // Specify the desired filename here
       document.body.appendChild(a);
       a.click();
       
       // Cleanup
       a.remove();
       URL.revokeObjectURL(blobUrl);
   } catch (error) {
       console.error('Error downloading QR code:', error);
   }
};


function exportToExcel(table) {
// Get the filtered data from DataTable
const filteredData = table.rows({ filter: "applied" }).data().toArray();

// Define custom headers
const customHeaders = [
  { header: "Client Name", key: "client.clientName" },
  { header: "Store Name", key: "storeName" },
  { header: "Store Code", key: "storeCode" },
  { header: "Store Location", key: "address" },
  { header: "State", key: "state.stateName" },
  { header: "Zone", key: "zone.zoneName" },
  { header: "City", key: "city" },
  { header: "Type", key: "type" },
  { header: "Sqft.", key: "sqft" },
  { header: "Billing", key: "billing" },
  { header: "Store Manager Email", key: "storeManagerEmail" },
  { header: "Store Zonal Head Email", key: "zonalHeadEmail" },
  { header: "Store National Head Email", key: "nationalHeadEmail" },
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
XLSX.utils.book_append_sheet(wb, ws, `Store_Data_${timestamp}`);

// Write the workbook to a file and trigger the download
XLSX.writeFile(wb, `Store_Data_${timestamp}.xlsx`);
}

});





