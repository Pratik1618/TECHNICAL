
api='http://localhost:8083'
token = localStorage.getItem('authToken');
// Function to load the form with existing client data
function loadEditForm() {
    const roleId = getQueryParam("id"); // Function to get query parameter from URL
    if (!roleId) {
        console.error("No client ID provided");
        return;
    }

    fetch(`${api}/role/${roleId}`,{ headers: {'Authorization': `${token}`} })
        .then((response) => response.json())
        .then((data) => {
            populateForm(data);
        })
        .catch((error) => console.error("Error fetching client details:", error));
}

// Function to populate the form with existing data
function populateForm(role) {
    document.getElementById("roleName").value = role.roleType;
}

// Function to handle saving the edited information
function saveEdit() {
    const roleId = getQueryParam("id"); // Get the client ID from the URL
    const roleName = document.getElementById("roleName").value;

    const formData = {
        roleType: roleName,
    };

    fetch(`${api}/role/update/${roleId}`, {
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
                alert("Role updated successfully");
                window.location.href = "role.html"; // Redirect after successful save
            } else {
                // Handle specific errors based on response content
                console.error("Failed to update client:", data.message);
                alert(data.message || "Error updating role");
            }
        });
    })
    .catch((error) => {
        console.error("Error updating role:", error);
        alert("Error updating role. Please try again.");
    });
}

// Function to handle canceling the edit
function cancelEdit() {
    window.location.href = "role.html"; // Redirect to the main page
}

// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Load the form data when the DOM content is loaded
document.addEventListener("DOMContentLoaded", loadEditForm);
