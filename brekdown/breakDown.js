api='http://localhost:8083/';
token = localStorage.getItem('authToken');


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
  
//show Next
function showNextSection(currentSectionId, nextSectionId) {
    document.getElementById(currentSectionId).classList.remove('active');
    document.getElementById(nextSectionId).classList.add('active');

    if (nextSectionId === 'previewSection') {
        populatePreview();
    }
}
document.getElementById('next-company').addEventListener('click', function() {
    const companyName = document.getElementById('companyName').value.trim();
    const companyAddress = document.getElementById('companyAddress').value.trim();

    if (companyName && companyAddress) {
        showNextSection('companyDetails', 'sectionA');
    } else {
        alert('Please enter a Ticket Number,Company name,Store Name,zone,State & Address');
    }
});
// document.getElementById('submitForm').addEventListener('click', function() {
//   showNextSection('previewSection','companyDetails');
// });

document.addEventListener("DOMContentLoaded", function () {
  
  
    const clientSelect = document.getElementById("companyName");
    const storeSelect = document.getElementById("companyAddress");
    const ticketInput = document.getElementById("ticketNumber");
  
    // Function to fetch client and store data based on the ticket number
    function fetchDataByTicketNumber(ticketInput) {
        // Fetch data for the ticket
        fetch(`${api}schedule/ticket/${ticketInput}`,{headers: { 'Authorization': `${token}`}}) // Update URL as necessary
            .then(response => response.json())
            .then(data => {
                console.log("Ticket data:", data); // Log data for debugging
                
                if (data) {
                    // Update the client dropdown
                    if (data.client && data.client.id && data.client.clientName) {
                        clientSelect.innerHTML = `<option value="${data.client.id}">${data.client.clientName}</option>`;
                    } else {
                        clientSelect.innerHTML = '<option value="">Select a client</option>';
                    }
  
                    // Update the store dropdown
                    if (data.store && data.store.id && data.store.storeName) {
                        storeSelect.innerHTML = `<option value="${data.store.id}">${data.store.storeCode} - ${data.store.storeName}</option>`;
                    } else {
                        storeSelect.innerHTML = '<option value="">Select a Store</option>';
                    }
                } else {
                    // Handle cases where no data is returned
                    clientSelect.innerHTML = '<option value="">Select a client</option>';
                    storeSelect.innerHTML = '<option value="">Select a Store</option>';
                }
            })
            .catch(error => {
                console.error("Error fetching ticket data:", error);
                displayError("Failed to load ticket data. Please try again later.");
            });
    }
  
    // Event listener for changes in the ticket number input
    ticketInput.addEventListener("change", function () {
        const ticketNumber = this.value;
  
        if (ticketNumber) {
            fetchDataByTicketNumber(ticketNumber);
        } else {
            // Reset dropdowns if no ticket number is entered
            clientSelect.innerHTML = '<option value="">Select a client</option>';
            storeSelect.innerHTML = '<option value="">Select a Store</option>';
        }
    });
    
});

//add button of rows

document.addEventListener('DOMContentLoaded', function() {
    let rowCount = 1; // Initialize row count to match the first row ID

    const addRowButton = document.getElementById('addRowButton');
    const tableBody = document.querySelector('#checklistTable tbody');
    const submitButton = document.getElementById('submitButton');

    if (!addRowButton) {
        console.error('Add button not found');
        return;
    }

    if (!tableBody) {
        console.error('Table body not found');
        return;
    }

    addRowButton.addEventListener('click', function() {
        rowCount++; // Increment row count for new row
        
        // Create a new row
        const newRow = document.createElement('tr');
        newRow.id = `row${rowCount}`;
        
        // Create and append cells to the new row
        newRow.innerHTML = `
            <td><input type="text" id="breakdown${rowCount}" name="breakdown${rowCount}" placeholder="breakdown" /></td>
            <td>
                <select id="status${rowCount}" name="status${rowCount}">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="CLOSED">CLOSED</option>
                </select>
            </td>
            <td><input type="text" id="resion${rowCount}" name="resion${rowCount}" placeholder="Enter the reason" /></td>
            <td><button class="remove-button" type="button" onclick="removeRow(this)">Remove</button></td>
        `;
        console.log(rowCount);
        
        // Append the new row to the table body
        tableBody.appendChild(newRow);
    });

    if (submitButton) {
        submitButton.addEventListener('click', function() {
            // Collect all rows' data
            const checklistData = [];
            for (let i = 1; i <= rowCount; i++) {
                const breakdown = document.getElementById(`breakdown${i}`)?.value;
                const status = document.getElementById(`status${i}`)?.value;
                const resion = document.getElementById(`resion${i}`)?.value;

                // Only add rows that have valid data (assuming breakdown is required)
                if (breakdown) {
                    checklistData.push({
                        breakdownOn: breakdown,
                        status: status,
                        remarks: resion
                    });
                }
            }

            // Collect additional data
            const clientId = document.getElementById("companyName")?.value;
            const storeId = document.getElementById("companyAddress")?.value;
            const ticketNumber = document.getElementById("ticketNumber")?.value;

            // Create the full payload object
            const payload = {
                tikitNumber:ticketNumber,
                 store:{
                        id:storeId,
                    } ,
        
                client: {
                        id: clientId,
                    },
                    breakdowns: checklistData
            };

            // Send the data to the backend
            fetch(`${api}breakdown/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     'Authorization': `${token}`
                },
                body: JSON.stringify(payload),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
                // Handle successful response
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors
            });
        });
    } else {
        console.error('Submit button not found');
    }
});

function removeRow(button) {
    // Find the row that contains the button and remove it
    const row = button.closest('tr');
    if (row) {
        row.remove();
    }
}




