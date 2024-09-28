api='http://localhost:8083';
token = localStorage.getItem('authToken');


//to keep tab active



// Example data fetching function (replace with your actual API call)
document.addEventListener("DOMContentLoaded", function () {
  const table = $("#inspectionId").DataTable({
    ajax: {
      url: `${api}/inspectionForm/`, // Replace with your API endpoint
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
          return `
            <button class="preview" onclick="previewInspectionForm(${row.id})">Preview</button>
            <button class="delete" onclick="deleteInspectionForm(${row.id})">Delete</button>
            <button class="export" onclick="exportInspectionForm(${row.id})">Export</button>
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
  
  window.exportInspectionForm = function(id) {
    const url = `${api}/inspectionForm/${id}/excel`;
    window.location.href = url;
};

window.previewInspectionForm = function(id) {
    const url = `${api}/inspectionForm/${id}/excel`;

    fetch(url,{ headers: {'Authorization': `${token}`}})
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

function fetchImagesAndDisplayPreview(data) {
    // Define the specific rows where photos will be displayed
    const photoRows = [12, 24, 33, 41, 47, 54, 59, 64];
    const photoIds = photoRows.map(rowIndex => {
        return data[rowIndex - 1] ? data[rowIndex - 1][6] : null; // Adjusting for zero-based index (7th column)
    }).filter(id => id);

    // Construct image fetch promises
    const imagePromises = photoIds.map(id => 
        fetch(`${api}/inspectionPhoto/${id}?token=${encodeURIComponent(token)}`)
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
            displayPreview(data, photoRows, imageUrls);
        })
        .catch(error => console.error("Error processing image URLs:", error));
}

function displayPreview(data, photoRows, imageUrls) {
  const previewContainer = document.getElementById("previewContainer");
  const modal = document.getElementById("previewModal");
  const closeButton = document.querySelector(".close-button");

  previewContainer.innerHTML = ""; // Clear previous content

  if (data.length === 0) {
      previewContainer.textContent = "No data to display.";
  } else {
      const table = document.createElement("table");
      table.className = "preview-table";

      // Add a single spanning header row using the first row's value as the title
      const headerRow = document.createElement("tr");
      const headerCell = document.createElement("th");
      headerCell.setAttribute("colspan", data[0].length + 1); // Span across all columns + 1 for the image column
      headerCell.textContent = data[0][0]; // Assuming the first cell in the first row contains the header title
      headerRow.appendChild(headerCell);
      table.appendChild(headerRow);

      // Add a row for column headers if applicable (typically the second row of your data)
      if (data.length > 1) {
          const columnsRow = document.createElement("tr");
          data[1].forEach(header => {
              const th = document.createElement("th");
              th.textContent = header;
              columnsRow.appendChild(th);
          });
          // Add an extra header cell for the image column
          const imageHeaderCell = document.createElement("th");
          imageHeaderCell.textContent = "Image";
          columnsRow.appendChild(imageHeaderCell);
          table.appendChild(columnsRow);
      }

      // Add table rows for the remaining data
      for (let i = 2; i < data.length; i++) {
          const row = document.createElement("tr");

          data[i].forEach((cell, index) => {
              const td = document.createElement("td");
              td.textContent = cell; // Add data cell
              row.appendChild(td);
          });

          // Check if the current row is in the list of photo rows
          const photoIndex = photoRows.indexOf(i + 1);
          if (photoIndex !== -1) {
              const imageCell = document.createElement("td");
              if (photoIndex < imageUrls.length && imageUrls[photoIndex]) {
                  const img = document.createElement("img");
                  img.src = imageUrls[photoIndex]; // Use the fetched image URL
                  img.alt = `Image for Photo ID: ${data[i][6]}`; // Alternative text for the image
                  img.style.maxWidth = "100px"; // Adjust size as needed
                  img.style.maxHeight = "100px"; // Adjust size as needed  
                  img.style.objectFit = "contain";      
                  imageCell.appendChild(img);
              }
              row.appendChild(imageCell);
          }

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

  
  // Handle delete store operation
  window.deleteInspectionForm = function (id) {
    if (confirm("Are you sure you want to delete this store?")) {
      fetch(`${api}/inspectionForm/delete/${id}`, {
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
