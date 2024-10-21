const api = getBaseUrl();
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
            'Authorization': `${token}`
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
   
    document.getElementById("clientNameEdit").value = user.client && user.client.clientName ? user.client.clientName : null;
    clientNameEditValue = user.client && user.client.id ? user.client.id : null;
    document.getElementById("zoneNameEdit").value =user.zone && user.zone.zoneName ?user.zone.zoneName:null;

    zoneNameEditValue=user.zone && user.zone.id ? user.zone.id:null;
    document.getElementById("roleNameEdit").value =user.role;
    roleNameEditValue=user.role;
    document.getElementById("storeNameEdit").value = user.store&& user.store.storeCode+"-"+user.store.storeName?user.store.storeCode+"-"+user.store.storeName:null;
    storeNameEditValue=user.store && user.store.id ?user.store.id:null ;
}

function saveEdit() {
    const userId = document.getElementById("userId").value;
    const userName = document.getElementById("userNameEdit").value;
    const phoneNumber = String(document.getElementById("phoneNumberEdit").value);
    const password = document.getElementById("passwordEdit").value;

    function parseOrNull(value) {
        // Check if value is not null, undefined, or not a string
        if (value !== null && value !== undefined) {
            // Only trim if it's a string
            const trimmedValue = typeof value === 'string' ? value.trim() : String(value).trim();
            const parsedValue = parseInt(trimmedValue);  // Specify base 10 for parsing
    
            // Return the parsed value or null if it's NaN
            return isNaN(parsedValue) ? null : parsedValue;
        }
    
        // Return null if value is null, undefined, or empty
        return null;
    }
    
    
    // function parseOrNull(value) {
    //     if(value!=null){
    //     const parsedValue = parseInt(value.trim());
        
    //     return isNaN(parsedValue) ? null : parsedValue;
    // }}
    const client = parseOrNull(clientNameEditValue);
    const zone = parseOrNull(zoneNameEditValue);
    const store = parseOrNull(storeNameEditValue);
    
    const role =roleNameEditValue ;
    

    const formData = {
        client: client !== null ? { id: client } : null,
        userName: userName,
        mobileNumber: phoneNumber,
        password: password,
        store: store !== null ? { id: store } : null,
        zone: zone !== null ? { id: zone } : null,
        role:  role ,
       
    };

    fetch(`${api}/user/update/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
             'Authorization': `${token}`
        },
        body: JSON.stringify(formData)
    })
    .then((response) => {
        return response.json().then((data) => {
            if (response.ok) {
                alert("User updated successfully");
                window.location.href = "signUpList.html"; // Redirect after successful save
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
    window.location.href = "signUpList.html"; // Redirect to the main page
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
