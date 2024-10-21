api=getBaseUrl();
token = localStorage.getItem('authToken');
approverId = localStorage.getItem('userId');
userrole=localStorage.getItem("userRole");

  
  // Example data fetching function (replace with your actual API call)
  document.addEventListener("DOMContentLoaded", function () {
    const table = $("#ppmId").DataTable({
      ajax: {
        url: `${api}/breakdown/history`, // Replace with your API endpoint
        dataSrc: "",
        headers: { 'Authorization': `${token}`}
      },
      columns: [
        {
          data: null,
          render: function (data, type, row, meta) {
            return meta.row + 1; // Display serial number starting from 1
          },
        },
        { data: "tikitNumber" },
        {data:"createdAt",
          render: function(data) {
            return new Date(data).toISOString().split('T')[0];
          }
        },
        { data: "client.clientName" },
        { data: "store.storeName" },
        { data: "store.storeCode" },
        { data: "store.zone.zoneName" },
        { data: "store.state.stateName" },
        { data: "store.address" },
        {data: "status"},
        {
          data: null,
          render: function (data, type, row) {
           
            return `
              <button class="preview" onclick="previewInspectionForm(${row.id})">Preview</button>
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
    
    window.exportInspectionForm = function (id) {
      // Define the URL for the Excel file
      const url = `${api}/breakdown/${id}/excel?token=${encodeURIComponent(token)}`;
      window.location.href = url;
    };
  
    
    window.previewInspectionForm = function(id) {
      const url = `${api}/breakdown/${id}/excel?token=${encodeURIComponent(token)}`;
    
      fetch(url)
        .then(response => response.arrayBuffer()) // Get the file as an ArrayBuffer
        .then(arrayBuffer => {
          const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: "array" });
          const sheetName = workbook.SheetNames[0]; // Assume the first sheet is the one to display
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Convert to JSON
          displayPreview(data);
        })
        .catch(error => console.error("Error fetching Excel file:", error));
    };
    
    // Function to display the preview in the modal
    function displayPreview(data) {
      const previewContainer = document.getElementById("previewContainer");
      const modal = document.getElementById("previewModal");
      const closeButton = document.querySelector(".close-button");
    
      previewContainer.innerHTML = ""; // Clear previous content
    
      if (data.length === 0) {
        previewContainer.textContent = "No data to display.";
      } else {
        // Create a table element
        const table = document.createElement("table");
        table.className = "preview-table";
    
        // Add a single spanning header row using the first row's value as the title
        const headerRow = document.createElement("tr");
        const headerCell = document.createElement("th");
        headerCell.setAttribute("colspan", data[0].length); // Span across all columns
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
          table.appendChild(columnsRow);
        }
    
        // Add table rows for the remaining data, starting from the third row
        for (let i = 2; i < data.length; i++) {
          const row = document.createElement("tr");
          data[i].forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            row.appendChild(td);
          });
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
 