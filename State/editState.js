api='http://localhost:8083';
token = localStorage.getItem('authToken');

let stateId; // Define stateId in global scope

function loadEditForm() {
    stateId = getQueryParam("id"); // Assign stateId globally
    if (!stateId) {
        console.error("No state ID provided");
        return;
    }

    fetch(`${api}/state/${stateId}`,{ headers: {'Authorization': `${token}`} })
        .then(response => response.json())
        .then(data => {
            console.log("Fetched state data:", data); // Debug log
            populateForm(data);
           // loadZoneOptions(); // Call loadZoneOptions after populating form
        })
        .catch(error => console.error("Error fetching state details:", error));
}

function setDropdownValue(dropdownId, value) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.value = value;
    } else {
        console.error(`Dropdown with id ${dropdownId} not found`);
    }
}

function populateForm(stateForm) {
    if (!stateForm) {
        console.error("No state form data provided");
        return;
    }

    

    document.getElementById("stateName").value = stateForm.stateName;
    document.getElementById("zoneNameEdit").value=stateForm.zone.zoneName;
    
     zoneNameEditValue=stateForm.zone.id;

}
function saveEdit() {
    const zoneName=parseInt(zoneNameEditValue);
    //const zoneName = document.getElementById("zoneNameEdit").value;
    const stateName = document.getElementById("stateName").value;

    const formData = {
        zone: {
            id: zoneName,
        },
        stateName: stateName
    };

    fetch(`${api}/state/update/${stateId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `${token}`,
        },
        body: JSON.stringify(formData),
    })
    .then((response) => {
        return response.json().then((data) => {
            if (response.ok) {
                alert("State updated successfully");
                window.location.href = "state.html"; // Redirect after successful save
            } else {
                // Handle specific errors based on response content
                console.error("Failed to update state:", data.message);
                alert(data.message || "Error updating state");
            }
        });
    })
    .catch((error) => {
        console.error("Error updating state:", error);
        alert("Error updating state. Please try again.");
    });
}

function cancelEdit() {
    window.location.href = "state.html"; // Redirect to the main page
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function getStateZoneId() {
    return null;
}

document.addEventListener("DOMContentLoaded", loadEditForm);