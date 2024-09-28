api="http://localhost:8083";
token = localStorage.getItem('authToken');

// Function to load the form with existing client data
function loadEditForm() {
    const clientId = getQueryParam("id"); // Function to get query parameter from URL
    if (!clientId) {
        console.error("No client ID provided");
        return;
    }

    fetch(`${api}/client/${clientId}`,{ headers: {'Authorization': `${token}`}})
        .then((response) => response.json())
        .then((data) => {
            populateForm(data);
        })
        .catch((error) => console.error("Error fetching client details:", error));
}

// Function to populate the form with existing data
function populateForm(client) {
    document.getElementById("clientName").value = client.clientName;
}

// Function to handle saving the edited information
function saveEdit() {
    const clientId = getQueryParam("id"); // Get the client ID from the URL
    const clientName = document.getElementById("clientName").value;

    const formData = {
        clientName: clientName,
    };

    fetch(`${api}/client/update/${clientId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `${token}`
        },
        body: JSON.stringify(formData),
    })
    .then((response) => {
        return response.json().then((data) => {
            if (response.ok) {
                alert("Client updated successfully");
                window.location.href = "client.html"; // Redirect after successful save
            } else {
                // Handle specific errors based on response content
                console.error("Failed to update client:", data.message);
                alert(data.message || "Error updating client");
            }
        });
    })
    .catch((error) => {
        console.error("Error updating client:", error);
        alert("Error updating client. Please try again.");
    });
}

// Function to handle canceling the edit
function cancelEdit() {
    window.location.href = "client.html"; // Redirect to the main page
}

// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Load the form data when the DOM content is loaded
document.addEventListener("DOMContentLoaded", loadEditForm);
