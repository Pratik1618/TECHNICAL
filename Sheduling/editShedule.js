api='http://localhost:8083';
token = localStorage.getItem('authToken');


function loadEditForm() {
    const storeId = getQueryParam("id"); // Function to get query parameter from URL
    if (!storeId) {
        console.error("No store ID provided");
        return;
    }

    fetch(`${api}/schedule/${storeId}`,{ headers: {'Authorization': `${token}`} })
        .then((response) => response.json())
        .then((data) => {
            populateForm(data);
           // loadClientOptions(data); // Call loadClientOptions after populating form
            //loadStoreOptions(data);
        })
        .catch((error) => console.error("Error fetching store details:", error));
}

function setDropdownValue(dropdownId, value) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.value = value;
}

function populateForm(storeForm) {
    document.getElementById("storeId").value = storeForm.id;

   // setDropdownValue("clientName", storeForm.client.id);
    //setDropdownValue("storeName", storeForm.store.id);
    setDropdownValue("scheduleFor", storeForm.scheduleFor);
    document.getElementById("clientNameEdit").value=storeForm.client.clientName;
    clientNameEditValue=storeForm.client.id;
    document.getElementById("storeNameEdit").value=storeForm.store.storeName;
    storeNameEditValue=storeForm.store.id;
    document.getElementById("technicianName").value = storeForm.technicianName;
    document.getElementById("phoneNumber").value = storeForm.mobNumber;
    document.getElementById("technicianEmail").value = storeForm.technicianEmail;
    document.getElementById("date").value = storeForm.date;
}



function saveEdit() {
    const storeId = document.getElementById("storeId").value;
    // const clientId = parseInt(document.getElementById("clientName").value);
    const clientId=parseInt(clientNameEditValue);
    //const store = parseInt(document.getElementById("storeName").value);
    const store=parseInt(storeNameEditValue);
    const technicianName = document.getElementById("technicianName").value;

    const phoneNumber = document.getElementById("phoneNumber").value;
    const technicianEmail = document.getElementById("technicianEmail").value;
    const date = document.getElementById("date").value;
    const scheduleFor = document.getElementById("scheduleFor").value;

    const formData = {
        client: {
            id: clientId
        },
        store: {
            id: store
        },
        scheduleFor: scheduleFor,
        technicianName: technicianName,
        mobNumber: phoneNumber,
        technicianEmail: technicianEmail,
        date: date,
    };

    fetch(`${api}/schedule/update/${storeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `${token}`
        },
        body: JSON.stringify(formData),
    })
        .then((response) => {
            if (response.ok) {
                alert("Store updated successfully");
                window.location.href = "sheduling.html"; // Redirect after successful save
            } else {
                console.error("Failed to update store");
                alert("Error updating store");
            }
        })
        .catch((error) => console.error("Error updating store:", error));
}

function cancelEdit() {
    window.location.href = "sheduling.html"; // Redirect to the main page
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

document.addEventListener("DOMContentLoaded", loadEditForm);
