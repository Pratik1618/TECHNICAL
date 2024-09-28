api="http://localhost:8083",
document.addEventListener('DOMContentLoaded', (event) => {
  const tabs = document.querySelectorAll('.nav-link');
  
  // Retrieve the last active tab from local storage
  const activeTabId = localStorage.getItem('activeTab');
  
  // If there's an active tab in local storage, activate it
  if (activeTabId) {
    document.querySelector(`#${activeTabId}`).classList.add('active');
  }
  
  // Add click event listener to each tab
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove 'active' class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add 'active' class to the clicked tab
      tab.classList.add('active');
      
      // Save the active tab ID in local storage
      localStorage.setItem('activeTab', tab.id);
    });
  });
});

document.getElementById('phoneNumber').addEventListener('input', function (event) {
  const input = event.target;
  if (input.value.length > 10) {
    input.value = input.value.slice(0, 10);
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const clientSelect = document.getElementById("clientName");
  const zoneSelect = document.getElementById("zoneName");
  const roleSelect = document.getElementById("roleName");
  const storeSelect = document.getElementById("storeName");

  // Fetch clients and populate dropdown
  fetch(`${api}/client/`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Client data:", data);
      data.forEach((client) => {
        const option = document.createElement("option");
        option.value = client.id;
        option.textContent = client.clientName;
        clientSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching clients:", error);
      document.getElementById("error-message").textContent =
        "Failed to load clients. Please try again.";
    });

  // Fetch roles independently
  fetch(`${api}/role/`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Role data:", data);
      data.forEach((role) => {
        const option = document.createElement("option");
        option.value = role.id;
        option.textContent = role.roleType + "- " + role.displayName;
        roleSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
      document.getElementById("error-message").textContent =
        "Failed to load roles. Please try again.";
    });

  // Event listener for client dropdown change
  clientSelect.addEventListener("change", function () {
    const selectedClientId = this.value;

    if (selectedClientId) {
      fetch(`${api}/store/zone/client/${selectedClientId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Zone data:", data); // Log zone data
          zoneSelect.innerHTML = '<option value="">Select a zone</option>'; // Clear previous zones
          data.forEach((store) => {
            const option = document.createElement("option");
            option.value = store.zone.id;
            option.textContent = store.zone.zoneName;
            zoneSelect.appendChild(option);
          });
        })
        .catch((error) => {
          console.error("Error fetching zones:", error);
          document.getElementById("error-message").textContent =
            "Failed to load zones. Please try again.";
        });

      fetch(`${api}/store/client/${selectedClientId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Store data:", data); // Log store data
          storeSelect.innerHTML = '<option value="">Select a Store</option>'; // Clear previous stores
          data.forEach((store) => {
            console.log("Store item:", store); // Log each store item
            const option = document.createElement("option");
            option.value = store.id;
            option.textContent = store.storeCode + " - " + store.storeName;
            storeSelect.appendChild(option);
          });
        })
        .catch((error) => {
          console.error("Error fetching stores:", error);
          document.getElementById("error-message").textContent =
            "Failed to load stores. Please try again.";
        });
    } else {
      zoneSelect.innerHTML = '<option value="">Select a Zone</option>'; // Clear zone dropdown if no client is selected
      storeSelect.innerHTML = '<option value="">Select a Store</option>'; // Clear store dropdown if no client is selected
    }
  });


  
  // Handle form submission
  document
    .getElementById("signUpForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const userName = document.getElementById("username").value;
      const phoneNumber=String(document.getElementById("phoneNumber").value);
      const password=document.getElementById("password").value;
      function parseOrNull(value) {
        const parsedValue = parseInt(value.trim());
        return isNaN(parsedValue) ? null : parsedValue;
    }
    const client = parseOrNull(document.getElementById("clientName").value);
    console.log(client);
    const zone = parseOrNull(document.getElementById("zoneName").value);
    console.log(zone);
    const role = parseOrNull(document.getElementById("roleName").value);
    console.log(role);
    const store = parseOrNull(document.getElementById("storeName").value);

      const storeData = {
        client: {
          id:client
        },
        userName:userName,
        mobileNumber:phoneNumber,
        password:password,
        store:{
          id:store
        },
        zone:{
          id:zone,
        },
        role:{
          id:role,
        }

      };

      console.log("Form data:", storeData);

      fetch(`${api}/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      })
        .then((response) => {
          if (!response.ok) {
            // Check if response status is not OK
            return response.json().then((error) => {
              throw new Error(error.message || 'Unknown error');
            });
          }
          return response.json();
        })
        .then((result) => {
          console.log("Success:", result);
          displaySuccess("Data saved successfully!");
          alert("User Created Sucessfully");
          document.getElementById("signUpForm").reset();
        })
        .catch((error) => {
          console.error("Error submitting form:", error);
          displayError(error.message || "Error saving data. Please try again.");
        });
    });

  // Function to display error messages
  function displayError(message) {
    const errorMessageElement =
      document.getElementById("error-message");
    const successMessageElement =
      document.getElementById("success-message");

    successMessageElement.textContent = ""; // Clear success message
    errorMessageElement.textContent = message;
  }

  // Function to display success messages
  function displaySuccess(message) {
    const successMessageElement =
      document.getElementById("success-message");
    const errorMessageElement =
      document.getElementById("error-message");

    errorMessageElement.textContent = ""; // Clear error message
    successMessageElement.textContent = message;
  }

  
});
   






//user/create

