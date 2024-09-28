api='http://localhost:8083';
token = localStorage.getItem('authToken');


//Photo
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

  try {
    const response = await fetch(`${api}/inspectionPhoto/create`, {
      method: 'POST',
      headers: {
        'Authorization': `${token}`},
      body: formData
     
    });

    if (!response.ok) {
      throw new Error('Photo upload failed');
    }
    else{
      alert("Photo Uploaded Sucessfully")
    }
    const data = await response.json();
    console.log(data);
    await applyValueToID(dtoKeyId, data.id);

  } catch (error) {
    alert('Error: ' + error.message);
  }
}

function previewPhoto(inputId, previewImgId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewImgId);
  const file = input.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      preview.src = event.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = '';
    preview.style.display = 'none';
  }
}

async function applyValueToID(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.value = value;
  }
}


//tex-Box disable
document.addEventListener("DOMContentLoaded", function () {
  // Get all "Not OK" radio buttons and attach event listeners
  const notOkRadioButtons = document.querySelectorAll(
    'input[type="radio"][value="Not OK"]'
  );

  notOkRadioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      const textBox = this.closest("tr").querySelector(".text-box");
      if (this.checked) {
        textBox.style.display = "block"; // Show the text box when "Not OK" is selected
      }
    });
  });

  // Get all "OK" radio buttons and attach event listeners
  const okRadioButtons = document.querySelectorAll(
    'input[type="radio"][value="OK"]'
  );

  okRadioButtons.forEach((radio) => {
    radio.addEventListener("change", function () {
      const textBox = this.closest("tr").querySelector(".text-box");
      if (this.checked) {
        textBox.style.display = "none"; // Hide the text box when "OK" is selected
      }
    });
  });
});

function showNextSection(currentSectionId, nextSectionId) {
  document.getElementById(currentSectionId).classList.remove("active");
  document.getElementById(nextSectionId).classList.add("active");

  if (nextSectionId === "previewSection") {
    populatePreview();
  }
}
function validateAndNext(currentSectionId, nextSectionId, photoInputId) {
  const photoInput = document.getElementById(photoInputId);
  if (photoInput.files.length === 0) {
    alert("Please upload a photo before proceeding.");
    return;
  }
  showNextSection(currentSectionId, nextSectionId);
}

function toggleReasonInput(radio) {
  const reasonInput = radio.closest("tr").querySelector(".text-box");
  reasonInput.style.display = "block"; // Always display the reason input
}

document.querySelectorAll('input[type="radio"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    toggleReasonInput(this);
  });
});

function saveFormData() {
  const formData = new FormData(document.getElementById("multiStepForm"));
  const formObj = {};
  formData.forEach((value, key) => {
    if (value instanceof File) {
      // Save file name or identifier
      formObj[key] = value.name;
    } else {
      formObj[key] = value;
    }
  });
  localStorage.setItem("formData", JSON.stringify(formObj));
}

function loadFormData() {
  const savedFormData = JSON.parse(localStorage.getItem("formData"));
  if (savedFormData) {
    for (const key in savedFormData) {
      const element = document.querySelector(`[name="${key}"]`);
      if (element) {
        if (element.type === "file") {
          // Handle file inputs separately
          const fileName = savedFormData[key];
          const filePreview = document.querySelector(
            `[name="${key}"] + .file-preview`
          );
          if (filePreview) {
            filePreview.textContent = fileName; // Show file name or provide file link if necessary
          }
        } else if (element.type === "radio") {
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
  var companyNameSelect = document.getElementById("companyName");
  var companyAddressSelect = document.getElementById("companyAddress");
  // var zoneSelect=document.getElementById('zoneName');
  // var stateNameSelect=document.getElementById('stateName');
  // var addressNameSelect=document.getElementById('addressName');

  // Get the selected option text from the select elements
  var companyNameText =
    companyNameSelect.options[companyNameSelect.selectedIndex].text;
  var companyAddressText =
    companyAddressSelect.options[companyAddressSelect.selectedIndex].text;
  // var zoneText=zoneSelect=zoneSelect.option[zoneSelect.selectedIndex].text;
  // var stateNameText=stateNameSelect.option[stateNameSelect.selectedIndex].text;
  // var addressNametext=addressNameSelect.option[addressNameSelect.selectedIndex].text;

  // Update the preview elements
  document.getElementById("previewCompanyName").textContent = companyNameText;
  document.getElementById("previewCompanyAddress").textContent =
    companyAddressText;
  // document.getElementById('previewZone').textContent=zoneText;
  // document.getElementById('previewState').textContent=stateNameText;
  // document.getElementById('previewAdd').textContent=addressNametext;

  const previewTables = document.getElementById("previewTables");
  previewTables.innerHTML = ""; // Clear previous content

  const sections = [
    {
      id: "sectionA",
      title: "Section A: Signage & Frontage",
      photoInputId: "sectionAPhoto",
    },
    {
      id: "sectionB",
      title: "Section B: Safety & Security",
      photoInputId: "sectionBPhoto",
    },
    {
      id: "sectionC",
      title: "Section C: Main Shop Area",
      photoInputId: "sectionCPhoto",
    },
    {
      id: "sectionD",
      title: "Section D: Trial Rooms",
      photoInputId: "sectionDPhoto",
    },
    {
      id: "sectionE",
      title: "Section E: Washrooms",
      photoInputId: "sectionAEhoto",
    },
    {
      id: "sectionF",
      title: "Section F: Electrical",
      photoInputId: "sectionFPhoto",
    },
    {
      id: "sectionG",
      title: "Section G: Diesel Generator(only High Street)",
      photoInputId: "sectionGPhoto",
    },
    {
      id: "sectionH",
      title: "Section H: Plumbing and Sanitation(only High street)",
      photoInputId: "sectionHPhoto",
    },
    // Add more sections if needed
  ];

  sections.forEach((section) => {
    const sectionElement = document.createElement("div");
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

    const tableBody = sectionElement.querySelector("tbody");
    const rows = document.querySelectorAll(
      `#${section.id} table tr:not(:first-child)`
    );
    rows.forEach((row) => {
      const cols = row.querySelectorAll("td");
      const itemChecked = cols[1].textContent;
      const ok = cols[2].querySelector("input").checked ? "OK" : "";
      const notOk = cols[3].querySelector("input").checked ? "Not OK" : "";
      const standard = cols[4].textContent;
      const reason = cols[5].querySelector("input").value;

      const newRow = document.createElement("tr");
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
      const photoPreview = document.createElement("img");
      photoPreview.src = URL.createObjectURL(photoInput.files[0]);
      photoPreview.alt = `Photo for ${section.title}`;
      photoPreview.style.width = "100px";
      photoPreview.style.height = "100px";
      sectionElement.appendChild(photoPreview);
    }

    previewTables.appendChild(sectionElement);
  });
}

document.getElementById("next-company").addEventListener("click", function () {
  const companyName = document.getElementById("companyName").value.trim();
  const companyAddress = document.getElementById("companyAddress").value.trim();
  //const ticketNumber=document.getElementById('ticketNumber').vlaue.trim();
  // const zoneName=document.getElementById('zoneName').value.trim();
  // const stateName=document.getElementById('stateName').value.trim();
  // const addressName =document.getElementById('addressName').vlaue.trim();

  if (companyName && companyAddress) {
    showNextSection("companyDetails", "sectionA");
  } else {
    alert(
      "Please enter a Ticket Number,Company name,Store Name,zone,State & Address"
    );
  }
});
// document.getElementById("submitForm").addEventListener("click", function () {
//   showNextSection("previewSection", "companyDetails");
// });

document
  .getElementById("previewButton")
  .addEventListener("click", populatePreview);

window.onload = loadFormData;

// get api for client list
document.addEventListener("DOMContentLoaded", function () {
  const clientSelect = document.getElementById("companyName");
  const storeSelect = document.getElementById("companyAddress");
  const ticketInput = document.getElementById("ticketNumber");

  // Function to fetch client and store data based on the ticket number
  function fetchDataByTicketNumber(ticketInput) {
    // Fetch data for the ticket
    fetch(`${api}/schedule/ticket/${ticketInput}`,{ headers: {'Authorization': `${token}`}}) // Update URL as necessary
      .then((response) => response.json())
      .then((data) => {
        console.log("Ticket data:", data); // Log data for debugging

        if (data) {
          if (data.scheduleFor === "INSPECTION") {
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
              storeSelect.innerHTML =
                '<option value="">Select a Store</option>';
            }
          }else{
            console.log("not valid schdeule type");
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

  // Function to display error messages
  function displayError(message) {
    // Implement error display logic, such as showing a message on the page
    alert(message); // Simple alert for now
  }

  document
    .getElementById("multiStepForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      // const zoneName = parseInt(document.getElementById("zoneName").value);
      // const stateName = parseInt(document.getElementById("stateName").value);
      const storeName = parseInt(
        document.getElementById("companyAddress").value
      );
      // const address = parseInt(document.getElementById("addressName").value);
      const client = parseInt(document.getElementById("companyName").value);
      const ticketNumber = parseInt(
        document.getElementById("ticketNumber").value
      );

      function getRadioValue(name) {
        const selected = document.querySelector(
          `input[name="${name}"]:checked`
        );
        return selected ? selected.value : null;
      }

      //Section A ---->
      const A1Ok = getRadioValue("illumination");
      const A1Reasion = document.getElementById("illumination3").value;

      const A2Ok = getRadioValue("physicalCondition");
      const A2Reasion = document.getElementById("physicalCondition3").value;

      const A3Ok = getRadioValue("checkFireExitinguishers");
      const A3Reasion = document.getElementById(
        "checkFireExitinguishers3"
      ).value;

      const A4Ok = getRadioValue("CCTVrecording");
      const A4Reasion = document.getElementById("CCTVrecording3").value;

      const A5Ok = getRadioValue("emergancyLights");
      const A5Reasion = document.getElementById("emergancyLights3").value;

      // section B ---->
      const B1ok = getRadioValue("fireAlarm");
      const B1Reasion = document.getElementById("fireAlarm3").value;

      const B2ok = getRadioValue("smokeDetectors");
      const B2Reasion = document.getElementById("smokeDetectors3").value;

      const B3ok = getRadioValue("exitinguishers");
      const B3Reasion = document.getElementById("exitinguishers3").value;

      const B4ok = getRadioValue("CCTVcameras");
      const B4Reasion = document.getElementById("CCTVcameras3").value;

      const B5ok = getRadioValue("emergancyLights");
      const B5Reasion = document.getElementById("emergancyLights3").value;

      const B6ok = getRadioValue("entryExitLocks");
      const B6Reasion = document.getElementById("entryExitLocks3").value;

      const B7ok = getRadioValue("shutterOperation");
      const B7Reasion = document.getElementById("shutterOperation3").value;

      const B8ok = getRadioValue("CCTVEmergancyLight");
      const B8Reasion = document.getElementById("CCTVEmergancyLight3").value;

      const B9ok = getRadioValue("connectionHangigWires");
      const B9Reasion = document.getElementById("connectionHangigWires3").value;

      // section C ---->
      const C1Ok = getRadioValue("tracklightsceilinglights");
      const C1Reasion = document.getElementById(
        "tracklightsceilinglights3"
      ).value;

      const C2ok = getRadioValue("allFloors");
      const C2Reasion = document.getElementById("allFloors3").value;

      const C3ok = getRadioValue("falseCeilling");
      const C3Reasion = document.getElementById("falseCeilling301").value;

      const C4ok = getRadioValue("displayUnits");
      const C4Reasion = document.getElementById("displayUnits3").value;

      const C5ok = getRadioValue("unitLights");
      const C5Reasion = document.getElementById("unitLights3").value;

      const C6ok = getRadioValue("airConditioning");
      const C6Reasion = document.getElementById("airConditioning3").value;

      // SECTION D ----->
      const D1Ok = getRadioValue("doorLatch");
      const D1Reasion = document.getElementById("doorLatch3").value;

      const D2ok = getRadioValue("mirrors");
      const D2Reasion = document.getElementById("mirrors3").value;

      const D3ok = getRadioValue("interiorSurface");
      const D3Reasion = document.getElementById("interiorSurface3").value;

      const D4ok = getRadioValue("flooring");
      const D4Reasion = document.getElementById("flooring3").value;

      const D5ok = getRadioValue("lightingSystem");
      const D5Reasion = document.getElementById("lightingSystem3").value;

      // SECTION E ----->
      const E1Ok = getRadioValue("downflowFrequency");
      const E1Reasion = document.getElementById("downflowFrequency3").value;

      const E2ok = getRadioValue("mirrorCondition");
      const E2Reasion = document.getElementById("mirrorCondition3").value;

      const E3ok = getRadioValue("allFittings");
      const E3Reasion = document.getElementById("allFittings3").value;

      // SECTION F ----->
      const F1Ok = getRadioValue("meterReading");
      const F1Reasion = document.getElementById("meterReading3").value;

      const F2ok = getRadioValue("powerFactor");
      const F2Reasion = document.getElementById("powerFactor3").value;

      const F3ok = getRadioValue("meterRoom");
      const F3Reasion = document.getElementById("meterRoom3").value;

      const F4ok = getRadioValue("outputVoltage");
      const F4Reasion = document.getElementById("outputVoltage3").value;

      // SECTION G ----->
      const G1Ok = getRadioValue("levelindicator");
      const G1Reasion = document.getElementById("levelindicator3").value;

      const G2ok = getRadioValue("batteryCharge");
      const G2Reasion = document.getElementById("batteryCharge3").value;

      // SECTION H ---->
      const H1Ok = getRadioValue("levelInTanks");
      const H1Reasion = document.getElementById("levelInTanks3").value;

      const H2ok = getRadioValue("allPumps");
      const H2Reasion = document.getElementById("allPumps3").value;

      const storeData = {
       

        // section A ---->
        signageIllumation: A1Ok == "OK" ? true : false,
        signageIllumationRemarks: A1Reasion,

        signagePhysicalConditionChecked: A2Ok == "OK" ? true : false,
        signagePhysicalRemarks: A2Reasion,

        signageDoorCloserCheckedOk: A3Ok == "OK" ? true : false,
        signageDoorCloserRemarks: A3Reasion,

        signageDoorHandlesCheckedOk: A4Ok == "OK" ? true : false,
        signageDoorHandlesRemarks: A4Reasion,

        signageShopFrantageCheckedOk: A5Ok == "OK" ? true : false,
        signageShopFrantageRemarks: A5Reasion,

        signageAndFrontagePhotoId:document.getElementById("sectionAPhotoID").value.trim(),

        // section B ---->
        safetyFireAlarmCheckedOk: B1ok == "OK" ? true : false,
        safetyFireAlarmRemarks: B1Reasion,

        safetySmokeDetectorCheckedOk: B2ok == "OK" ? true : false,
        safetySmokeDetectorRemarks: B2Reasion,

        safetyFireExtinguishersCheckedOk: B3ok == "OK" ? true : false,
        safetyFireExtinguishersRemarks: B3Reasion,

        safteyCCTVRecoding: B4ok == "OK" ? true : false, //no field for resion
        safteyCctvRecordingRemarks: B4Reasion,

        safetyEmergencyLightsCheckedOk: B5ok == "OK" ? true : false,
        safetyEmergencyLightsRemarks: B5Reasion,

        safetyExitAndEntryCheckedOk: B6ok == "OK" ? true : false,
        safetyExitAndEntryRemarks: B6Reasion,

        safetyShutterCheckedOk: B7ok == "OK" ? true : false,
        safetyShutterRemarks: B7Reasion,

        safetyUpsConnectedCheckedOk: B8ok == "OK" ? true : false,
        safetyUpsConnectedRemarks: B8Reasion,

        safetyLooseConnectionCheckedOk: B9ok == "OK" ? true : false,
        safetyLooseConnectionRemarks: B9Reasion,

        safteyAndSecurityPhotoId:document.getElementById("sectionBPhotoID").value.trim(),

        //section C ----->
        shopTrackLightsCheckedOk: C1Ok == "OK" ? true : false,
        shopTrackLightsRemarks: C1Reasion,

        shopAllFloorsCheckedOk: C2ok == "OK" ? true : false,
        shopAllFloorsRemarks: C2Reasion,

        shopFalseCeilingCheckedOk: C3ok == "OK" ? true : false,
        shopFalseCeilingRemarks: C3Reasion,

        shopDisplayUnitsCheckedOk: C4ok == "OK" ? true : false,
        shopDisplayUnitsRemarks: C4Reasion,

        shopDisplayUnitLightsCheckedOk: C5ok == "OK" ? true : false,
        shopDisplayUnitLightsRemarks: C5Reasion,

        shopACCheckedOk: C6ok == "OK" ? true : false,
        shopACRemarks: C6Reasion,

        mainShopPhotoId:document.getElementById("sectionCPhotoID").value.trim(),


        //section D ------>
        trailRoomDoorLatchCheckedOk: D1Ok == "OK" ? true : false,
        trailRoomDoorLatchRemarks: D1Reasion,

        trailRoomMirrorCheckedOk: D2ok == "OK" ? true : false,
        trailRoomMirrorRemarks: D2Reasion,

        trailRoomInteriorSurfaceCheckedOk: D3ok == "OK" ? true : false,
        trailRoomInteriorSurfaceRemarks: D3Reasion,

        trailRoomFlooringCheckedOk: D4ok == "OK" ? true : false,
        trailRoomFlooringRemarks: D4Reasion,

        trailRoomLightingSystemCheckedOk: D5ok == "OK" ? true : false,
        trailRoomLightingSystemRemarks: D5Reasion,

        trailRoomPhotoId:document.getElementById("sectionDPhotoID").value.trim(),

        //section E --->
        washroomWaterFlowCheckedOk: E1Ok == "OK" ? true : false,
        washroomWaterFlowRemarks: E1Reasion,

        washroomMirrorConditionCheckedOk: E2ok == "OK" ? true : false,
        washroomMirrorConditionRemarks: E2Reasion,

        washroomFittingCheckedOk: E3ok == "OK" ? true : false,
        washroomFittingRemarks: E3Reasion,

        washroomPhotoId:document.getElementById("sectionEPhotoID").value.trim(),


        //section F --->
        electricalMeterCheckedOk: F1Ok == "OK" ? true : false,
        electricalMeterRemarks: F1Reasion,

        electricalPowerCheckedOk: F2ok == "OK" ? true : false,
        electricalPowerRemarks: F2Reasion,

        electricalPanelRoomCheckedOk: F3ok == "OK" ? true : false,
        electricalPanelRoomRemarks: F3Reasion,

        electricalStablizerCheckedOk: F4ok == "OK" ? true : false,
        electricalStablizerRemarks: F4Reasion,

        electricalPhotoId:document.getElementById("sectionFPhotoID").value.trim(),

        //section G --->
        deiselFuelIndicatorCheckedOk: G1Ok == "OK" ? true : false,
        deiselFuelIndicatorRemarks: G1Reasion,

        deiselBatteryChargesCheckedOk: G2ok == "OK" ? true : false,
        deiselBatteryChargesRemarks: G2Reasion,

        deiselGeneratorPhotoId:document.getElementById("sectionGPhotoID").value.trim(),


        //section H --->
        pumbingWaterLevelCheckedOk: H1Ok == "OK" ? true : false,
        pumbingWaterLevelRemarks: H1Reasion,

        pumbingAllPumpsCheckedOk: H2ok == "OK" ? true : false,
        pumbingAllPumpsRemarks: H2Reasion,

        pumbingAndsanitationPhotoId:document.getElementById("sectionHPhotoID").value.trim(),

        tikitNumber: ticketNumber,

        
        store: {
          id: storeName,
        },
        
        client: {
          id: client,
        },
      };

      console.log("Form data:", storeData);

      fetch(`${api}/inspectionForm/create`, {
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
});
