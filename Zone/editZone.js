api='http://localhost:8083';
token = localStorage.getItem('authToken');
function loadEditForm() {
    const zoneId = getQueryParam("id"); // Function to get query parameter from URL
    if (!zoneId) {
        console.error("No zone ID provided");
        return;
    }

    fetch(`${api}/zone/${zoneId}`,{ headers: {'Authorization': `${token}`} })
        .then((response) => response.json())
        .then((data) => {
            populateForm(data);
        })
        .catch((error) => console.error("Error fetching zone details:", error));
}

function populateForm(zoneForm) {
    document.getElementById("zoneName").value = zoneForm.zoneName;
}

function saveEdit() {
    const zoneId = getQueryParam("id"); // Get the zone ID from the URL
    const zoneName = document.getElementById("zoneName").value;

    const formData = {
        zoneName: zoneName,
    };

    fetch(`${api}/zone/update/${zoneId}`, {
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
                alert("Zone updated successfully");
                window.location.href = "zone.html"; // Redirect after successful save
            } else {
                // Handle specific errors based on response content
                console.error("Failed to update zone:", data.message);
                alert(data.message || "Error updating zone");
            }
        });
    })
    .catch((error) => {
        console.error("Error updating zone:", error);
        alert("Error updating zone. Please try again.");
    });
}

function cancelEdit() {
    window.location.href = "zone.html"; // Redirect to the main page
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", loadEditForm);
