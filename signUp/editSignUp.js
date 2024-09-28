const api = 'http://localhost:8083';
const token = localStorage.getItem('authToken');

// Load the form with user data when the page is loaded
document.addEventListener("DOMContentLoaded", function() {
    loadEditForm();
});

function loadEditForm() {
    const userId = getQueryParam("id");
    if (!userId) {
        console.error("No user ID provided");
        return;
    }

    fetch(`${api}/user/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        populateForm(data);
    })
    .catch(error => console.error("Error fetching user details:", error));
}

function populateForm(user) {
    console.log(user); // Log the user object to inspect the structure

    document.getElementById("userId").value = user.id;
    document.getElementById("userNameEdit").value = user.userName;
    document.getElementById("phoneNumberEdit").value = parseInt(user.mobileNumber);
    document.getElementById("passwordEdit").value = user.password;
    
    document.getElementById("clientNameEdit").value =  user.client.clientName;
    clientNameEditValue=user.client.id;
    document.getElementById("zoneNameEdit").value =user.zone.zoneName;
    zoneNameEditValue=user.zone.id;
    document.getElementById("roleNameEdit").value =user.role.roleType+"-"+user.role.displayName;
    roleNameEditValue=user.role.id;
    document.getElementById("storeNameEdit").value = user.store.storeCode+"-"+user.store.storeName;
    storeNameEditValue=user.store.id;
}

function saveEdit() {
    const userId = document.getElementById("userId").value;
    const userName = document.getElementById("userNameEdit").value;
    const phoneNumber = String(document.getElementById("phoneNumberEdit").value);
    const password = document.getElementById("passwordEdit").value;

    const client =clientNameEditValue ;
    const zone =zoneNameEditValue ;
    const role =roleNameEditValue ;
    const store =storeNameEditValue ;

    const formData = {
        client: { id: parseInt(client) },
        userName: userName,
        mobileNumber: phoneNumber,
        password: password,
        zone: { id: parseInt(zone) },
        role: { id: parseInt(role) },
       store: { id: parseInt(store) }
    };

    fetch(`${api}/user/update/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("success-message").textContent = "User updated successfully!";
            window.location.href = "inspectionList.html"; // Redirect after 2 seconds
        } else {
            document.getElementById("error-message").textContent = data.message || "Error updating user";
            console.log(data.message);
        }
    })
    .catch(error => {
        console.error("Error updating user:", error);
        document.getElementById("error-message").textContent = "Error updating user. Please try again.";
    });
}

function cancelEdit() {
    window.location.href = "inspectionList.html"; // Redirect to the main page
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
