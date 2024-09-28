api='http://localhost:8083';
token = localStorage.getItem('authToken');
//to keep tab active


//get call

document.addEventListener("DOMContentLoaded", function () {
  const table = $("#ppmId").DataTable({
    ajax: {
      url: `${api}/ppmForm/`, // Replace with your API endpoint
      dataSrc: "",
      headers: {
        'Authorization': `${token}`
      },
    },
    columns: [
      {
        data: null,
        render: function (data, type, row, meta) {
          return meta.row + 1; // Display serial number starting from 1
        },
      },
      { data: "tikitNumber" },
      { data: "client.clientName" },
      { data: "store.storeName" },
      { data: "store.storeCode" },
      { data: "store.zone.zoneName" },
      { data: "store.state.stateName" },
      { data: "store.address" },
      { data: "status" },
      {
        data: null,
        render: function (data, type, row) {
          return  `
          <!--<button class = "edit" onclick="editSchedule(${row.id})">Edit</button>-->
        <button class = "delete" onclick="deleteSchedule(${row.id})">Delete</button>
        <button class = "export" onclick="exportSchedule(${row.id})">Export</button>
        <button class="preview" onclick="previewInspectionForm(${row.id})">Preview</button>
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
  
   window.previewInspectionForm = function(id) {
            const integerId = parseInt(id, 10); // Convert id to integer

            if (isNaN(integerId)) {
                console.error("Invalid ID provided. Must be a number.");
                return;
            }

            const excelUrl = `${api}/ppmForm/${integerId}/excel`;

            // Fetch the Excel data
            fetch(excelUrl)
                .then(response => response.arrayBuffer()) // Get the file as an ArrayBuffer
                .then(arrayBuffer => {
                    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
                    const sheetName = workbook.SheetNames[0]; // Assume the first sheet is the one to display
                    const worksheet = workbook.Sheets[sheetName];
                    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to JSON
                    fetchImagesAndDisplayPreview(data);
                })
                .catch(error => console.error("Error fetching Excel file:", error));
        };

        // Function to fetch images and display the preview
        function fetchImagesAndDisplayPreview(data) {
            // Determine the column index where photo IDs are located
            const photoIdColumnIndex = 5; // Adjust if your photo IDs are in a different column

            // Extract photo IDs from the data
            const photoIds = data.slice(5).map(row => row[photoIdColumnIndex]).filter(id => id); // Assuming IDs are in the 6th column and beyond

            // Construct image fetch promises
            const imagePromises = photoIds.map(id => 
                fetch(`${api}/ppmPhoto/${id}`,{headers: {'Authorization': `${token}`} })
                    .then(response => response.json())
                    .then(json => `data:${json.contentType};base64,${json.data}`)
                    .catch(error => {
                        console.error(`Error fetching image for ID ${id}:`, error);
                        return null; // Return null if there's an error
                    })
            );

            // Fetch all images and then display the preview
            Promise.all(imagePromises)
                .then(imageUrls => {
                    displayPreview(data, imageUrls);
                })
                .catch(error => console.error("Error processing image URLs:", error));
        }

        function displayPreview(data, imageUrls) {
            const previewContainer = document.getElementById("previewContainer");
            const modal = document.getElementById("previewModal");
            const closeButton = document.querySelector(".close-button");

            previewContainer.innerHTML = ""; // Clear previous content

            if (data.length === 0) {
                previewContainer.textContent = "No data to display.";
            } else {
                const table = document.createElement("table");
                table.className = "preview-table";

                const headerRow = document.createElement("tr");
                const headerCell = document.createElement("th");
                headerCell.setAttribute("colspan", data[0].length + 1); // Add one more column for images
                headerCell.textContent = data[0][0]; // Set the header title to the first cell value
                headerRow.appendChild(headerCell);
                table.appendChild(headerRow);

                // Add rows for Excel headers and other information up to the 5th row
                for (let i = 1; i < Math.min(data.length, 5); i++) {
                    const row = document.createElement("tr");
                    data[i].forEach(cell => {
                        const td = document.createElement("td");
                        td.textContent = cell;
                        row.appendChild(td);
                    });
                    table.appendChild(row);
                }

                // Add rows for data including images
                for (let i = 5; i < data.length; i++) {
                    const row = document.createElement("tr");

                    data[i].forEach((cell, index) => {
                        const td = document.createElement("td");
                        td.textContent = cell; // Add data cell
                        row.appendChild(td);
                    });

                    // Add an extra cell for the image in the new column
                    const imageCell = document.createElement("td");
                    if (i - 5 < imageUrls.length && imageUrls[i - 5]) {
                        const img = document.createElement("img");
                        img.src = imageUrls[i - 5]; // Use the fetched image URL
                        img.alt = `Image for Photo ID: ${data[i][5]}`; // Alternative text for the image
                        img.style.maxWidth = "100px"; // Adjust size as needed
                        img.style.maxHeight = "100px"; // Adjust size as needed
                        imageCell.appendChild(img);
                    }
                    row.appendChild(imageCell);

                    table.appendChild(row);
                }

                // Add the table to the preview container
                previewContainer.appendChild(table);

                // Show the modal
                modal.style.display = "block";

                // Close button functionality
                closeButton.onclick = function() {
                    modal.style.display = "none";
                }

                // Close the modal when clicking outside of it
                window.onclick = function(event) {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                }
            }
        }

        // Handle delete schedule operation
        window.deleteSchedule = function(id) {
            const integerId = parseInt(id, 10); // Convert id to integer

            if (isNaN(integerId)) {
                console.error("Invalid ID provided. Must be a number.");
                return;
            }

            if (confirm("Are you sure you want to delete this store?")) {
                fetch(`${api}/ppmForm/delete/${integerId}`, {
                    method: "DELETE",
                    headers: {'Authorization': `${token}`} 
                })
                .then(response => {
                    if (response.ok) {
                        // Refresh the table data after a successful delete
                        table.ajax.reload();
                        console.log(response);
                    } else {
                        console.error("Failed to delete the store. Status:", response.status);
                        return response.text().then(text => {
                            console.error("Response text:", text);
                        });
                    }
                })
                .catch(error => console.error("Error deleting store:", error));
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

