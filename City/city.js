const api = getBaseUrl();
token = localStorage.getItem('authToken');

// To keep the tab active


// Fetch zones and states, and handle form submission
document.addEventListener("DOMContentLoaded", function () {
    const zoneSelect = document.getElementById("zoneName");
    const stateSelect = document.getElementById("stateName");

    // Fetch zones from backend and populate the dropdown
    fetch(`${api}/zone/`, {headers: { 'Authorization': `${token}`}})
        .then(response => response.json())
        .then(data => {
            data.forEach(zone => {
                const option = document.createElement("option");
                option.value = zone.id;
                option.textContent = zone.zoneName;
                zoneSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching zones:", error);
            document.getElementById("error-message").textContent =
                "Failed to load zones. Please try again.";
        });

    // Event listener to fetch states when a zone is selected
    zoneSelect.addEventListener("change", function () {
        const zoneId = this.value;

        if (zoneId) {
            fetch(`${api}/state/zone/${zoneId}`,{headers: { 'Authorization': `${token}`}})
                .then(response => response.json())
                .then(data => {
                    stateSelect.innerHTML = '<option value="">Select a State</option>'; // Reset the state dropdown

                    if (Array.isArray(data)) {
                        data.forEach(state => {
                            if (state.id && state.stateName) {
                                const option = document.createElement("option");
                                option.value = state.id;
                                option.textContent = state.stateName;
                                stateSelect.appendChild(option);
                            }
                        });
                    } else {
                        console.error("Expected an array of states");
                    }
                })
                .catch(error => {
                    console.error("Error fetching state data:", error);
                    document.getElementById("error-message").textContent =
                        "Failed to load states. Please try again later.";
                });
        } else {
            stateSelect.innerHTML = '<option value="">Select a State</option>'; // Reset if no zone selected
        }
    });

    // Handle form submission
    document.getElementById("storeForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const zoneName = parseInt(document.getElementById("zoneName").value);
        const stateName = parseInt(document.getElementById("stateName").value);
        const cityName = document.getElementById("cityName").value;
        const storeData = {
            zone: {
                id: zoneName,
            },
            state: {
                id: stateName,
            },
            cityName: cityName
        };

        console.log("Form data:", storeData);

        fetch(`${api}/city/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `${token}`
            },
            body: JSON.stringify(storeData),
        })
            .then((response) => {
                if (!response.ok) {
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

    // Initialize DataTable
    const table = $("#CityTable").DataTable({
        ajax: {
            url: `${api}/city/`,
            dataSrc: "",
            headers: {
                'Authorization': `${token}`
            },
        },
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + 1; // Serial number starting from 1
                },
                title: "SR No",
            },
            { data: "zone.zoneName" },
            { data: "state.stateName" },
            { data: "cityName" }, // Ensure this matches the key in your data
            {
                data: null,
                render: function (data, type, row) {
                    return `
                       <button class="edit" onclick="window.open('editCity.html?id=${row.id}', '_blank')">Edit</button>
                        <button class="delete" onclick="deleteCity(${row.id})">Delete</button>
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

    // Handle delete operation
    window.deleteCity = function (id) {
        if (confirm("Are you sure you want to delete this city?")) {
            fetch(`${api}/city/delete/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `${token}`
                },
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
                .catch((error) => console.error("Error deleting city:", error));
        }
    };

    // Handle export to Excel
    document.getElementById("exportButton").addEventListener("click", function () {
        exportToExcel();
    });

   
    window.exportToExcel = function() {
   
        const url =`${api}/city/excel`; // Endpoint to get the Excel file
    
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
            link.download = 'city.xlsx'; // Set the default filename for the download
            document.body.appendChild(link);
            link.click(); // Programmatically click the link to trigger the download
            URL.revokeObjectURL(objectURL); // Clean up the object URL
            document.body.removeChild(link);
        })
        .catch(error => {
            console.error('Error exporting to Excel:', error);
        });
    
      }
});