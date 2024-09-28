api='http://localhost:8083';
token = localStorage.getItem('authToken');

function loadEditForm() {
  const storeId = getQueryParam("id"); // Function to get query parameter from URL
  if (!storeId) {
    console.error("No store ID provided");
    return;
  }

  fetch(`${api}/store/${storeId}`,{ headers: {'Authorization': `${token}`} })
    .then((response) => response.json())
    .then((data) => {
      populateForm(data);
    })
    .catch((error) => console.error("Error fetching store details:", error));
}

function setDropdownValue(dropdownId, value) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.value = value;
}

function populateForm(store) {
  console.log(store);
  document.getElementById("storeId").value = store.id;
  document.getElementById("clientNameEdit").value=store.client.clientName;
  clientNameEditValue=store.client.id;

  document.getElementById("zoneNameEdit").value=store.zone.zoneName;
  zoneNameEditValue=store.zone.id;

  document.getElementById("stateNameEdit").value=store.state.stateName;
  stateNameEditValue=store.state.id;

  document.getElementById("cityNameEdit").value = store.city.cityName; // Make sure this is correct
  cityNameEditValue=store.city.id;

  document.getElementById("storeId").value = store.id;
  document.getElementById("storeName").value = store.storeName;
  document.getElementById("storeCode").value = store.storeCode;
  //document.getElementById("cityEdit").value = store.city;
  
  document.getElementById("type").value = store.type;
  document.getElementById("sqft").value = store.sqft;
  document.getElementById("billing").value = store.billing;
  document.getElementById("storeManagerEmail").value = store.storeManagerEmail;
  document.getElementById("zonalHeadEmail").value = store.zonalHeadEmail;
  document.getElementById("nationalHeadEmail").value = store.nationalHeadEmail;
  document.getElementById("address").value = store.address;
}




function saveEdit() {
  const storeId = document.getElementById("storeId").value;
  const clientId=parseInt(clientNameEditValue);
  // const clientId = parseInt(document.getElementById("clientName").value);
 // const zoneId = parseInt(document.getElementById("zoneName").value);
 const zoneId=parseInt(zoneNameEditValue);
 // const stateId = parseInt(document.getElementById("stateName").value);
 const stateId =parseInt(stateNameEditValue);
 const cityId=parseInt( cityNameEditValue);
  const formData = {
    client: {
      id: clientId
    },
    storeName: document.getElementById("storeName").value,
    storeCode: document.getElementById("storeCode").value,
    zone: {
      id: zoneId
    },
    state: {
        id : stateId
    },
    city:{
      id:cityId
    } ,
    type: document.getElementById("type").value,
    sqft: document.getElementById("sqft").value,
    billing: document.getElementById("billing").value,
    storeManagerEmail: document.getElementById("storeManagerEmail").value,
    zonalHeadEmail: document.getElementById("zonalHeadEmail").value,
    nationalHeadEmail: document.getElementById("nationalHeadEmail").value,
    address: document.getElementById("address").value,
  };

  fetch(`${api}/store/update/${storeId}`, {
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
            alert("Store updated successfully");
            window.location.href = "store.html"; // Redirect after successful save
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

function cancelEdit() {
  window.location.href = "store.html"; // Redirect to the main page
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}
