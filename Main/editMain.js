function showNextSection(currentSectionId, nextSectionId) {
    document.getElementById(currentSectionId).classList.remove('active');
    document.getElementById(nextSectionId).classList.add('active');

    if (nextSectionId === 'previewSection') {
        populatePreview();
    }
}
function validateAndNext(currentSectionId, nextSectionId, photoInputId) {
    const photoInput = document.getElementById(photoInputId);
    if (photoInput.files.length === 0) {
        alert('Please upload a photo before proceeding.');
        return;
    }
    showNextSection(currentSectionId, nextSectionId);
}
function toggleReasonInput(radio) {
    const reasonInput = radio.closest('tr').querySelector('.text-box');
    reasonInput.style.display = 'block';  // Always display the reason input
}


document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
        toggleReasonInput(this);
    });
});

function saveFormData() {
    const formData = new FormData(document.getElementById('multiStepForm'));
    const formObj = {};
    formData.forEach((value, key) => {
        if (value instanceof File) {
            // Save file name or identifier
            formObj[key] = value.name;
        } else {
            formObj[key] = value;
        }
    });
    localStorage.setItem('formData', JSON.stringify(formObj));
}

function loadFormData() {
    const savedFormData = JSON.parse(localStorage.getItem('formData'));
    if (savedFormData) {
        for (const key in savedFormData) {
            const element = document.querySelector(`[name="${key}"]`);
            if (element) {
                if (element.type === 'file') {
                    // Handle file inputs separately
                    const fileName = savedFormData[key];
                    const filePreview = document.querySelector(`[name="${key}"] + .file-preview`);
                    if (filePreview) {
                        filePreview.textContent = fileName; // Show file name or provide file link if necessary
                    }
                } else if (element.type === 'radio') {
                    if (element.value === savedFormData[key]) {
                        element.checked = true;
                        toggleReasonInput(element);
                    }
                } else {
                    element.value = savedFormData[key];
                }
            }
        }
    }
}


function populatePreview() {
  var companyNameSelect = document.getElementById('companyNameEdit');
  var companyAddressSelect = document.getElementById('storeNameEdit');
  var companyNameText = companyNameSelect.options[companyNameSelect.selectedIndex].text;
  var companyAddressText = companyAddressSelect.options[companyAddressSelect.selectedIndex].text;
  // Update the preview elements
  document.getElementById('previewCompanyName').textContent = companyNameText;
  document.getElementById('previewCompanyAddress').textContent = companyAddressText;


    const previewTables = document.getElementById('previewTables');
    previewTables.innerHTML = ''; // Clear previous content

    const sections = [
        { id: 'sectionA', title: 'Section A: Signage & Frontage', photoInputId: 'sectionAPhoto' },
        { id: 'sectionB', title: 'Section B: Safety & Security', photoInputId: 'sectionBPhoto' },
        { id: 'sectionC', title: 'Section C: Main Shop Area', photoInputId: 'sectionCPhoto' },
        { id: 'sectionD', title: 'Section D: Trial Rooms', photoInputId: 'sectionDPhoto' },
        { id: 'sectionE', title: 'Section E: Washrooms', photoInputId: 'sectionAEhoto' },
        { id: 'sectionF', title: 'Section F: Electrical', photoInputId: 'sectionFPhoto' },
        { id: 'sectionG', title: 'Section G: Diesel Generator(only High Street)', photoInputId: 'sectionGPhoto' },
        { id: 'sectionH', title: 'Section H: Plumbing and Sanitation(only High street)', photoInputId: 'sectionHPhoto' }
        // Add more sections if needed
    ];

    sections.forEach(section => {
        const sectionElement = document.createElement('div');
        sectionElement.innerHTML = `<h3>${section.title}</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Sec</th>
                        <th>ITEM CHECKED</th>
                        <th>OK</th>
                        <th>NOT OK</th>
                        <th>MINIMUM ACCEPTABLE STANDARD</th>
                        <th>Reason</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>`;

        const tableBody = sectionElement.querySelector('tbody');
        const rows = document.querySelectorAll(`#${section.id} table tr:not(:first-child)`);
        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            const itemChecked = cols[1].textContent;
            const ok = cols[2].querySelector('input').checked ? 'OK' : '';
            const notOk = cols[3].querySelector('input').checked ? 'Not OK' : '';
            const standard = cols[4].textContent;
            const reason = cols[5].querySelector('input').value;

            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${cols[0].textContent}</td>
                <td>${itemChecked}</td>
                <td>${ok}</td>
                <td>${notOk}</td>
                <td>${standard}</td>
                <td>${reason}</td>`;
            
            tableBody.appendChild(newRow);
        });

        // Add photo to the section if uploaded
        const photoInput = document.getElementById(section.photoInputId);
        if (photoInput && photoInput.files.length > 0) {
            const photoPreview = document.createElement('img');
            photoPreview.src = URL.createObjectURL(photoInput.files[0]);
            photoPreview.alt = `Photo for ${section.title}`;
            photoPreview.style.width = '100px';
            photoPreview.style.height='100px';
            sectionElement.appendChild(photoPreview);
        }

        previewTables.appendChild(sectionElement);
    });
}


document.getElementById('next-company').addEventListener('click', function() {
    const companyName = document.getElementById('clientNameEdit').value.trim();
    const storeName = document.getElementById('storeNameEdit').value.trim();

    if (companyName && storeName) {
        showNextSection('companyDetails', 'sectionA');
    } else {
        alert('Please enter a company name & address');
    }
});

document.getElementById('previewButton').addEventListener('click', populatePreview);

window.onload = loadFormData;


document.addEventListener("DOMContentLoaded", function () {
  loadEditForm(); // Load form with existing data when the page is ready
  //loadClientOptions(); // Load client options for the dropdowns
});

// Load form data based on store ID from URL
function loadEditForm() {
  const storeId = getQueryParam("id"); // Get query parameter from URL
  if (!storeId) {
      console.error("No store ID provided");
      return;
  }

  fetch(`http://localhost:8083/inspectionForm/${storeId}`)
      .then((response) => response.json())
      .then((data) => {
          populateForm(data); // Populate the form with the fetched data
      })
      .catch((error) => console.error("Error fetching store details:", error));
}

// Set the value for a dropdown based on ID and value
function setDropdownValue(dropdownId, value) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.value = value;
}

// Populate form fields with data fetched from backend
function populateForm(storeForm) {
  document.getElementById("storeId").value = storeForm.id;
document.getElementById("ticketNumberEdit").value=storeForm.tikitNumber;
  document.getElementById("clientNameEdit").value=storeForm.client.clientName;
  document.getElementById("storeNameEdit").value=storeForm.store.storeName;

//   setDropdownValue("companyName", storeForm.client.id);
//   console.log("clint"+storeForm.client.id);
  
//   setDropdownValue("storeName", storeForm.store.id);
 
 
//   setDropdownValue("zoneName", storeForm.data.zone.id);
//   console.log("zone"+storeForm.data.zone.id);
//   setDropdownValue("stateName",storeForm.data.state.id)
//   console.log(storeForm.data.state.id);
//   setDropdownValue("addressName",storeForm.data.id);
//   console.log("addressName"+storeForm.data.id);
  
  // document.getElementById("technicianName").value = storeForm.technicianName;
  // document.getElementById("phoneNumber").value = storeForm.mobNumber;
  // document.getElementById("technicianEmail").value = storeForm.technicianEmail;
  // document.getElementById("date").value = storeForm.date;
}

// Load client options into the dropdowns
// function loadClientOptions() {
//   const clientSelect = document.getElementById("companyName");
//   const storeSelect = document.getElementById("companyAddress");
//   const zoneSelect = document.getElementById("zoneName");
//   const stateSelect = document.getElementById("stateName");
//   const addressSelect = document.getElementById("addressName");

//   // Function to display error messages
//   function displayError(message) {
//       document.getElementById("error-message").textContent = message;
//   }

//   // Fetch client data and populate the client dropdown
//   fetch("http://localhost:8083/client/")
//       .then((response) => response.json())
//       .then((data) => {
//           const existingClients = new Set(); // Track added client IDs to avoid duplicates
//           data.forEach((client) => {
//               if (!existingClients.has(client.id)) {
//                   const option = document.createElement("option");
//                   option.value = client.id;
//                   option.textContent = client.clientName;
//                   clientSelect.add(option);
//                   existingClients.add(client.id);
//               }
//           });
//       })
//       .catch((error) => {
//           console.error("Error fetching clients:", error);
//           displayError("Failed to load clients. Please try again.");
//       });

//   // Event listener for client dropdown change
//   clientSelect.addEventListener("change", function () {
//       const selectedClientId = this.value;

//       if (selectedClientId) {
//           fetch(`http://localhost:8083/store/client/${selectedClientId}`)
//               .then((response) => response.json())
//               .then((data) => {
//                   storeSelect.innerHTML = '<option value="">Select a Store</option>'; // Clear previous stores
//                   data.forEach((store) => {
//                       const option = document.createElement("option");
//                       option.value = store.id;
//                       option.textContent = store.storeCode + " - " + store.storeName;
//                       storeSelect.appendChild(option);
//                   });

//                   // Add event listener for store dropdown after it is populated
//                   storeSelect.addEventListener("change", function () {
//                       const selectedStoreId = this.value;

//                       if (selectedStoreId) {
//                           fetch(`http://localhost:8083/store/storeId/${selectedStoreId}/clientId/${selectedClientId}`)
//                               .then((response) => response.json())
//                               .then((data) => {
//                                   // Reset the zone, state, and address dropdowns
//                                   zoneSelect.innerHTML = '<option value="">Select a zone</option>';
//                                   stateSelect.innerHTML = '<option value="">Select a State</option>';
//                                   addressSelect.innerHTML = '<option value="">Select an address</option>';

//                                   // Populate zone dropdown
//                                   if (data && data.zone && data.zone.id && data.zone.zoneName) {
//                                       const option = document.createElement("option");
//                                       option.value = data.zone.id;
//                                       option.textContent = data.zone.zoneName;
//                                       zoneSelect.appendChild(option);
//                                   } else {
//                                       console.error("Expected a zone object");
//                                   }

//                                   // Populate state dropdown
//                                   if (data && data.state && data.state.id && data.state.stateName) {
//                                       const stateOption = document.createElement("option");
//                                       stateOption.value = data.state.id;
//                                       stateOption.textContent = data.state.stateName;
//                                       stateSelect.appendChild(stateOption);
//                                   } else {
//                                       console.error("Expected a state object");
//                                   }

//                                   // Populate address dropdown
//                                   if (data && data.address) {
//                                       const addressOption = document.createElement("option");
//                                       addressOption.value = data.id;
//                                       addressOption.textContent = data.address;
//                                       addressSelect.appendChild(addressOption);
//                                   } else {
//                                       console.error("Expected an address object");
//                                   }
//                               })
//                               .catch((error) => {
//                                   console.error("Error fetching zone/state/address data:", error);
//                                   displayError("Failed to load zone/state/address data. Please try again.");
//                               });
//                       } else {
//                           // Reset if no store selected
//                           zoneSelect.innerHTML = '<option value="">Select a zone</option>';
//                           stateSelect.innerHTML = '<option value="">Select a State</option>';
//                           addressSelect.innerHTML = '<option value="">Select an address</option>';
//                       }
//                   });
//               })
//               .catch((error) => {
//                   console.error("Error fetching stores:", error);
//                   displayError("Failed to load stores. Please try again.");
//               });
//       } else {
//           // Reset store dropdown if no client selected
//           storeSelect.innerHTML = '<option value="">Select a Store</option>';
//       }
//   });
// }


// Save edited form data back to the server
function saveEdit() {
  const storeId = document.getElementById("storeId").value;
  const clientId = parseInt(document.getElementById("companyName").value);
  const store = parseInt(document.getElementById("companyAddress").value);
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

  fetch(`http://localhost:8083/inspectionForm/update/${storeId}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
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

// Cancel the edit and return to the main page
function cancelEdit() {
  window.location.href = "sheduling.html"; // Redirect to the main page
}

// Get query parameter by name from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Handle radio button change to toggle reason input visibility
function toggleReasonInput(radio) {
  const reasonInput = radio.closest('tr').querySelector('.text-box');
  reasonInput.style.display = radio.value === 'Not OK' ? 'block' : 'none';
}

document.querySelectorAll('input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', function () {
      toggleReasonInput(this);
  });
});

// Populate preview section before form submission
function populatePreview() {
  const companyNameSelect = document.getElementById('companyName');
  const companyAddressSelect = document.getElementById('companyAddress');
  const companyNameText = companyNameSelect.options[companyNameSelect.selectedIndex].text;
  const companyAddressText = companyAddressSelect.options[companyAddressSelect.selectedIndex].text;

  document.getElementById('previewCompanyName').textContent = companyNameText;
  document.getElementById('previewCompanyAddress').textContent = companyAddressText;

  const previewTables = document.getElementById('previewTables');
  previewTables.innerHTML = '';

  const sections = [
      { id: 'sectionA', title: 'Section A: Signage & Frontage', photoInputId: 'sectionAPhoto' },
      { id: 'sectionB', title: 'Section B: Safety & Security', photoInputId: 'sectionBPhoto' },
      { id: 'sectionC', title: 'Section C: Main Shop Area', photoInputId: 'sectionCPhoto' },
      { id: 'sectionD', title: 'Section D: Trial Rooms', photoInputId: 'sectionDPhoto' },
      { id: 'sectionE', title: 'Section E: Washrooms', photoInputId: 'sectionEPhoto' },
      { id: 'sectionF', title: 'Section F: Electrical', photoInputId: 'sectionFPhoto' },
      { id: 'sectionG', title: 'Section G: Diesel Generator(only High Street)', photoInputId: 'sectionGPhoto' },
      { id: 'sectionH', title: 'Section H: Plumbing and Sanitation(only High street)', photoInputId: 'sectionHPhoto' }
  ];

  sections.forEach(section => {
      const sectionElement = document.createElement('div');
      sectionElement.innerHTML = `<h3>${section.title}</h3>
          <table border="1">
              <thead>
                  <tr>
                      <th>Sec</th>
                      <th>ITEM CHECKED</th>
                      <th>OK</th>
                      <th>NOT OK</th>
                      <th>MINIMUM ACCEPTABLE STANDARD</th>
                      <th>Reason</th>
                  </tr>
              </thead>
              <tbody></tbody>
          </table>`;

      const tableBody = sectionElement.querySelector('tbody');
      const rows = document.querySelectorAll(`#${section.id} table tr:not(:first-child)`);
      rows.forEach(row => {
          const cols = row.querySelectorAll('td');
          const itemChecked = cols[1].textContent;
          const ok = cols[2].querySelector('input').checked ? 'OK' : '';
          const notOk = cols[3].querySelector('input').checked ? 'Not OK' : '';
          const standard = cols[4].textContent;
          const reason = cols[5].querySelector('input').value;

          const newRow = document.createElement('tr');
          newRow.innerHTML = `
              <td>${cols[0].textContent}</td>
              <td>${itemChecked}</td>
              <td>${ok}</td>
              <td>${notOk}</td>
              <td>${standard}</td>
              <td>${reason}</td>`;
          
          tableBody.appendChild(newRow);
      });

      const photoInput = document.getElementById(section.photoInputId);
      if (photoInput && photoInput.files.length > 0) {
          const photoPreview = document.createElement('img');
          photoPreview.src = URL.createObjectURL(photoInput.files[0]);
          photoPreview.alt = `Photo for ${section.title}`;
          photoPreview.style.width = '100px';
          photoPreview.style.height = '100px';
          sectionElement.appendChild(photoPreview);
      }

      previewTables.appendChild(sectionElement);
  });
}

// Navigation between sections
function showNextSection(currentSectionId, nextSectionId) {
  document.getElementById(currentSectionId).classList.remove('active');
  document.getElementById(nextSectionId).classList.add('active');

  if (nextSectionId === 'previewSection') {
      populatePreview();
  }
}

// Trigger the preview population on button click
document.getElementById('previewButton').addEventListener('click', populatePreview);

// Load any saved form data on window load
//window.onload = loadFormData;
