api='http://localhost:8083';
token = localStorage.getItem('authToken');

document.addEventListener("DOMContentLoaded", (event) => {
  const tabs = document.querySelectorAll(".nav-link");

  // Retrieve the last active tab from local storage
  const activeTabId = localStorage.getItem("activeTab");

  // If there's an active tab in local storage, activate it
  if (activeTabId) {
    document.querySelector(`#${activeTabId}`).classList.add("active");
  }

  // Add click event listener to each tab
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove 'active' class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));

      // Add 'active' class to the clicked tab
      tab.classList.add("active");

      // Save the active tab ID in local storage
      localStorage.setItem("activeTab", tab.id);
    });
  });
});
function previewPhoto(fileInputId, previewImgId) {
  const fileInput = document.getElementById(fileInputId);
  const previewImg = document.getElementById(previewImgId);
  const file = fileInput.files[0];
  
  if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
          previewImg.src = e.target.result;
          previewImg.style.display = 'block';
      }
      
      reader.readAsDataURL(file);
  } else {
      previewImg.style.display = 'none';
  }
}

async function applyValueToID(id, value) {
  document.getElementById(id).value = value;
}
// Function to upload the photo
async function uploadPhoto(photoInputId, backendName, previewImgId, dtoKeyId = '') {
  const photoInput = document.getElementById(photoInputId);
  const file = photoInput.files[0];

  if (!file) {
      alert('Please select a photo to upload.');
      return;
  }

  const formData = new FormData();
  formData.append(backendName, file);

  console.log(formData)
  try {
      const response = await fetch(`${api}/ppmPhoto/create`, {
          method: 'POST',
          headers: {
            
            'Authorization': `${token}`
          },
          body: formData
      });

      if (!response.ok) {
          throw new Error('Photo upload failed');
      }else{
        alert("Photo Upload Sucessfully");
      }
      
      const data = await response.json();
      console.log(data);
      //document.getElementById("#" + dtoKeyId).value = data.id
      await applyValueToID(dtoKeyId, data.id);

  } catch (error) {
      alert('Error: ' + error.message);
  }
}
// get api for client list
document.addEventListener("DOMContentLoaded", function () {
  const clientSelect = document.getElementById("companyName");
  const storeSelect = document.getElementById("companyAddress");
  const ticketInput = document.getElementById("ticketNumber");

  // Function to fetch client and store data based on the ticket number
  function fetchDataByTicketNumber(ticketInput) {
    // Fetch data for the ticket
    fetch(`${api}/schedule/ticket/${ticketInput}`,{headers: {'Authorization': `${token}`}}) // Update URL as necessary
      .then((response) => response.json())
      .then((data) => {
        console.log("Ticket data:", data); // Log data for debugging

        if (data) {
          // Update the client dropdown
          if (data.client && data.client.id && data.client.clientName) {
            clientSelect.innerHTML = `<option value="${data.client.id}">${data.client.clientName}</option>`;
          } else {
            clientSelect.innerHTML =
              '<option value="">Select a client</option>';
          }

          // Update the store dropdown
          if (data.store && data.store.id && data.store.storeName) {
            storeSelect.innerHTML = `<option value="${data.store.id}">${data.store.storeCode} - ${data.store.storeName}</option>`;
          } else {
            storeSelect.innerHTML = '<option value="">Select a Store</option>';
          }
        } else {
          // Handle cases where no data is returned
          clientSelect.innerHTML = '<option value="">Select a client</option>';
          storeSelect.innerHTML = '<option value="">Select a Store</option>';
        }
      })
      .catch((error) => {
        console.error("Error fetching ticket data:", error);
        displayError("Failed to load ticket data. Please try again later.");
      });
  }

  // Event listener for changes in the ticket number input
  ticketInput.addEventListener("change", function () {
    const ticketNumber = this.value;

    if (ticketNumber) {
      fetchDataByTicketNumber(ticketNumber);
    } else {
      // Reset dropdowns if no ticket number is entered
      clientSelect.innerHTML = '<option value="">Select a client</option>';
      storeSelect.innerHTML = '<option value="">Select a Store</option>';
    }
  });
});

// Function to display error messages
function displayError(message) {
  // Implement error display logic, such as showing a message on the page
  alert(message); // Simple alert for now
}

//moving to the next section
function showNextSection(currentSectionId, nextSectionId) {
  document.getElementById(currentSectionId).classList.remove("active");
  document.getElementById(nextSectionId).classList.add("active");

  if (nextSectionId === "previewSection") {
    populatePreview();
  }
}

document.getElementById("next-company").addEventListener("click", function () {
  const companyName = document.getElementById("companyName").value.trim();
  const companyAddress = document.getElementById("companyAddress").value.trim();

  if (companyName && companyAddress) {
    showNextSection("companyDetails", "sectionA");
  } else {
    alert("Please enter a company name & address");
  }
  document.getElementById('submitForm').addEventListener('click', function() {
    showNextSection('sectionA','companyDetails');
  });
});

document
  .getElementById("multiStepForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const storeName = parseInt(document.getElementById("companyAddress").value);
    const client = parseInt(document.getElementById("companyName").value);
    const ticketNumber = parseInt(
      document.getElementById("ticketNumber").value
    );

    const parameters1 = document.getElementById("parameters1").value;
    const values1 = document.getElementById("values1").value;
    const resion1 = document.getElementById("resion1").value;

    const parameters2 = document.getElementById("parameters2").value;
    const values2 = document.getElementById("values2").value;
    const resion2 = document.getElementById("resion2").value;

    const parameters3 = document.getElementById("parameters3").value;
    const values3 = document.getElementById("values3").value;
    const resion3 = document.getElementById("resion3").value;

    const parameters4 = document.getElementById("parameters4").value;
    const values4 = document.getElementById("values4").value;
    const resion4 = document.getElementById("resion4").value;

    const parameters5 = document.getElementById("parameters5").value;
    const values5 = document.getElementById("values5").value;
    const resion5 = document.getElementById("resion5").value;

    const parameters6 = document.getElementById("parameters6").value;
    const values6 = document.getElementById("values6").value;
    const resion6 = document.getElementById("resion6").value;

    const parameters7 = document.getElementById("parameters7").value;
    const values7 = document.getElementById("values7").value;
    const resion7 = document.getElementById("resion7").value;

    const parameters8 = document.getElementById("parameters8").value;
    const values8 = document.getElementById("values8").value;
    const resion8 = document.getElementById("resion8").value;

    const parameters9 = document.getElementById("parameters9").value;
    const values9 = document.getElementById("values9").value;
    const resion9 = document.getElementById("resion9").value;

    const parameters10 = document.getElementById("parameters10").value;
    const values10 = document.getElementById("values10").value;
    const resion10 = document.getElementById("resion10").value;

    const parameters11 = document.getElementById("parameters11").value;
    const values11 = document.getElementById("values11").value;
    const resion11 = document.getElementById("resion11").value;

    const parameters12 = document.getElementById("parameters12").value;
    const values12 = document.getElementById("values12").value;
    const resion12 = document.getElementById("resion12").value;

    const parameters13 = document.getElementById("parameters13").value;
    const values13 = document.getElementById("values13").value;
    const resion13 = document.getElementById("resion13").value;

    const parameters14 = document.getElementById("parameters14").value;
    const values14 = document.getElementById("values14").value;
    const resion14 = document.getElementById("resion14").value;

    const parameters15 = document.getElementById("parameters15").value;
    const values15 = document.getElementById("values15").value;
    const resion15 = document.getElementById("resion15").value;

    const parameters16 = document.getElementById("parameters16").value;
    const values16 = document.getElementById("values16").value;
    const resion16 = document.getElementById("resion16").value;

    const parameters17 = document.getElementById("parameters17").value;
    const values17 = document.getElementById("values17").value;
    const resion17 = document.getElementById("resion17").value;

    const parameters18 = document.getElementById("parameters18").value;
    const values18 = document.getElementById("values18").value;
    const resion18 = document.getElementById("resion18").value;

    const parameters19 = document.getElementById("parameters19").value;
    const values19 = document.getElementById("values19").value;
    const resion19 = document.getElementById("resion19").value;


    const storeData = {
      mainControlPanelParameter: parameters1,
      mainControlPanelValue: values1,
      mainControlPanelRemarks: resion1,
      mainControlPanelPhotoId: document.getElementById("mainControlPanelPhotoId").value.trim(),

      distributionBoards1Paramaters: parameters2,
      distributionBoards1Value: values2,
      distributionBoards1Remarks: resion2,
      distributionBoards1PhotoId:document.getElementById("distributionBoards1PhotoId").value.trim(),

      distributionBoards2Paramaters: parameters3,
      distributionBoards2Value: values3,
      distributionBoards2Remarks: resion3,
      distributionBoards2PhotoId:document.getElementById("distributionBoards2PhotoId").value.trim(),

      capacitorPanelParameter:parameters19,
      capacitorPanelValue:values19,
      capacitorPanelRemarks:resion19,
      capacitorPanelPhotoId:document.getElementById("capacitorPanelPhotoId").value.trim(),


      busDuctParameters: parameters4,
      busDuctValue: values4,
      busDuctRemarks: resion4,
      busDuctPhotoId:document.getElementById("busDuctPhotoId").value.trim(),


      electricMotor1Parameter: parameters5,
      electricMotor1Value: values5,
      electricMotor1Remarks: resion5,
      electricMotor1PhotoId:document.getElementById("electricMotor1PhotoId").value.trim(),


      electricMotor2Parameter: parameters6,
      electricMotor2Value: values6,
      electricMotor2Remarks: resion6,
      electricMotor2PhotoId:document.getElementById("electricMotor2PhotoId").value.trim(),


      updDbParameter: parameters7,
      updDbValue: values7,
      updDbRemarks: resion7,
      updDbPhotoId:document.getElementById("updDbPhotoId").value.trim(),


      shutterMotorParameter: parameters8,
      shutterMotorValue: values8,
      shutterMotorRemarks: resion8,
      shutterMotorPhotoId:document.getElementById("shutterMotorPhotoId").value.trim(),


      signageParameter: parameters9,
      signageValue: values9,
      signageRemarks: resion9,
      signagePhotoId:document.getElementById("signagePhotoId").value.trim(),


      stablizerPanelParameter: parameters10,
      stablizerPanelValue: values10,
      stablizerPanelRemarks: resion10,
      stablizerPanelPhotoId:document.getElementById("stablizerPanelPhotoId").value.trim(),


      dgChangoverSwitchParameter: parameters11,
      dgChangoverSwitchValue: values11,
      dgChangoverSwitchRemarks: resion11,
      dgChangoverSwitchphotoId:document.getElementById("dgChangoverSwitchphotoId").value.trim(),


      killSwitchParameter: parameters12,
      killSwitchValue: values12,
      killSwitchRemarks: resion12,
      killSwitchPhotoId:document.getElementById("killSwitchPhotoId").value.trim(),


      energyMeterParameter: parameters13,
      energyMeterValue: values13,
      energyMeterRemarks: resion13,
      energyMeterPhotoId:document.getElementById("energyMeterPhotoId").value.trim(),


      loadCheckingParameter: parameters14,
      loadCheckingValue: values14,
      loadCheckingRemarks: resion14,
      loadCheckingPhotoId:document.getElementById("loadCheckingPhotoId").value.trim(),


      leadScreenParameter: parameters15,
      leadScreenValue: values15,
      leadScreenRemarks: resion15,
      leadScreenPhotoId:document.getElementById("leadScreenPhotoId").value.trim(),


      hvacPanelParameter: parameters16,
      hvacPanelValue: values16,
      hvacPanelRemarks: resion16,
      hvacPanelPhotoId:document.getElementById("hvacPanelPhotoId").value.trim(),


      earthPitParameter: parameters17,
      earthPitValue: values17,
      earthPitRemarks: resion17,
      earthPitPhotoId:document.getElementById("earthPitPhotoId").value.trim(),


      // capacitorPanelParameter: parameters18,
      // capacitorPanelValue: values18,
      // capacitorPanelRemarks: resion18,

      waterPumpParameter: parameters18,
      waterPumpValue: values18,
      waterPumpRemarks: resion18,
      waterPumpPhotoId:document.getElementById("waterPumpPhotoId").value.trim(),



      tikitNumber: ticketNumber,
      store: {
        id: storeName,
      },

      client: {
        id: client,
      },
    };

    console.log("Form data:", storeData);

    fetch(`${api}/ppmForm/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `${token}`
      },
      body: JSON.stringify(storeData),
    })
      .then((response) => response.json())
      .then((result) => {
        alert("Data saved successfully");
        alert("Success");
        console.log("Success:", result);
        displaySuccess("Data saved successfully!");
        document.getElementById("multiStepForm").reset();
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        displayError("Error saving data. Please try again.");
      });
  });

// Function to display error messages
function displayError(message) {
  const errorMessageElement = document.getElementById("error-message");
  const successMessageElement = document.getElementById("success-message");

  successMessageElement.textContent = ""; // Clear success message
  errorMessageElement.textContent = message;
}

// Function to display success messages
function displaySuccess(message) {
  const successMessageElement = document.getElementById("success-message");
  const errorMessageElement = document.getElementById("error-message");

  errorMessageElement.textContent = ""; // Clear error message
  successMessageElement.textContent = message;
}
