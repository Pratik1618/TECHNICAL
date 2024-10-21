api=getBaseUrl();
token = localStorage.getItem('authToken');

document.addEventListener("DOMContentLoaded", function () {
    // Get all radio buttons
    const allRadioButtons = document.querySelectorAll('input[type="radio"]');

    allRadioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            // Find the closest row (tr)
            const row = this.closest('tr');

            // Find the text box in the row
            const textBox = row.querySelector('.text-box');

            // Hide the text box by default
            textBox.style.display = 'none';

            // Show the text box only if the selected radio button's value is "Not OK"
            const notOkRadio = row.querySelector('input[type="radio"][value="Not OK"]:checked');
            if (notOkRadio) {
                textBox.style.display = 'block';
            }
        });
    });
});




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

function resetForm() {
    document.getElementById('multiStepForm').reset(); // Reset the form
    // Reset any other sections or inputs as needed
}




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
    // Basic Info
    const companyNameSelect = document.getElementById('companyName');
    const companyAddressSelect = document.getElementById('companyAddress');
    const ticketNumberInput = document.getElementById('ticketNumber');

    const companyNameText = companyNameSelect.options[companyNameSelect.selectedIndex].text;
    const companyAddressText = companyAddressSelect.options[companyAddressSelect.selectedIndex].text;
    const ticketNumberText = ticketNumberInput.value.trim();

    // Update the preview elements with basic info
    document.getElementById('previewCompanyName').textContent = companyNameText;
    document.getElementById('previewCompanyAddress').textContent = companyAddressText;
    document.getElementById('previewTicketNumber').textContent = ticketNumberText;

    // Define the sections to populate
    const sections = [
        { id: 'sectionA', title: 'Section A: Electrical' },
        { id: 'sectionB', title: 'Section B: Plumbing' },
        { id: 'sectionC', title: 'Section C: Carpentry' },
        { id: 'sectionD', title: 'Section D: General' }
    ];

    // Clear previous content
    const previewTables = document.getElementById('previewTables');
    previewTables.innerHTML = '';

    sections.forEach(section => {
        const sectionElement = document.createElement('div');
        let tableHTML = `<h3>${section.title}</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Sec</th>
                        <th>ITEM CHECKED</th>
                        <th>YES</th>
                        <th>NO</th>
                        <th>CONDITION</th>
                        <th>REMARK</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>`;

        sectionElement.innerHTML = tableHTML;
        const tableBody = sectionElement.querySelector('tbody');
        const rows = document.querySelectorAll(`#${section.id} table tr:not(:first-child)`);

        rows.forEach((row, index) => {
            const cols = row.querySelectorAll('td');
            const itemChecked = cols[1].textContent;
            const yesChecked = cols[2].querySelector('input[type="radio"]:checked') ? 'YES' : '';
            const noChecked = cols[3].querySelector('input[type="radio"]:checked') ? 'NO' : '';
            const condition = cols[4].querySelector('input[type="radio"]:checked')?.value || '';

            let newRow = `
                <tr>
                    <td>${cols[0].textContent}</td>
                    <td>${itemChecked}</td>
                    <td>${yesChecked}</td>
                    <td>${noChecked}</td>
                    <td>${condition}</td>`;

            // Specific handling for Section A, 5th row (index 4) with R, Y, B inputs
            if (section.id === 'sectionA' && index === 4) { // index 4 corresponds to the 5th row
                const remarkR = cols[5].querySelector('input[id="electialMeter5"]').value || '';
                const remarkY = cols[5].querySelector('input[id="electialMeter6"]').value || '';
                const remarkB = cols[5].querySelector('input[id="electialMeter7"]').value || '';

                newRow += `<td>R: ${remarkR}, Y: ${remarkY}, B: ${remarkB}</td>`;
            }
            // Specific handling for Section D, 7th row (index 6) with Zone: Green and Red inputs
            else if (section.id === 'sectionD' && index === 6) { // index 6 corresponds to the 7th row
                const zoneGreen = cols[5].querySelector('input[id="fireExtinguisher5"]').value || '';
                const zoneRed = cols[5].querySelector('input[id="fireExtinguisher6"]').value || '';

                newRow += `<td>Zone: Green: ${zoneGreen} | Red: ${zoneRed}</td>`;
            }
            // General case for other rows
            else {
                const remark = cols[5].querySelector('input').value || '';
                newRow += `<td>${remark}</td>`;
            }

            newRow += `</tr>`;
            tableBody.innerHTML += newRow;
        });

        previewTables.appendChild(sectionElement);
    });


    // Populate Section E separately
    populateSectionEPreview();
}

function populateSectionEPreview() {
    const previewTables = document.getElementById('previewTables');

    const sectionElement = document.createElement('div');
    let tableHTML = `<h3>Section E: Details of Power Supply</h3>
        <table border="1">
            <thead>
                <tr>
                    <th>Proper Earthing</th>
                    <th>Earth Pit</th>
                    <th>Available Load</th>
                    <th>Required Load</th>
                    <th>Avg. Billing for last 3 months</th>
                    <th>Meter No</th>
                    <th>Amount of Three Months</th>
                    <th>Due On</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>UPS Output:<br>PH-N=220-230V:${document.getElementById('ph1').value}<br>PH-E=220-230V:${document.getElementById('pe1').value}<br>N-E=0-3V${document.getElementById('ne1').value}</td>
                    <td>${document.getElementById('earthing').value}</td>
                    <td>${document.getElementById('load').value}</td>
                    <td>${document.getElementById('requireLoad').value}</td>
                    <td>${document.getElementById('month1').value}: ${document.getElementById('month1Reading').value}<br>${document.getElementById('month2').value}: ${document.getElementById('month2Reading').value}<br>${document.getElementById('month3').value}: ${document.getElementById('month3Reading').value}</td>
                    <td>${document.getElementById('meterReading').value}</td>
                    <td>${document.getElementById('month1Amout').value}, ${document.getElementById('month2Amout').value}, ${document.getElementById('month3Amout').value}</td>
                    <td>${document.getElementById('date').value}</td>
                </tr>
                <tr>
                    <td>Panel (Input):<br>PH-N=220-230V:${document.getElementById('ph2').value}<br>PH-E=220-230V:${document.getElementById('pe2').value}<br>N-E=0-3V${document.getElementById('ne2').value}</td>
                    <td>${document.getElementById('panel3').value}</td>
                    <td>${document.getElementById('panel4').value}</td>
                    <td>${document.getElementById('panel5').value}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>`;

    sectionElement.innerHTML = tableHTML;
    previewTables.appendChild(sectionElement);
}







document.getElementById('next-company').addEventListener('click', function () {
    const companyName = document.getElementById('companyName').value.trim();
    const companyAddress = document.getElementById('companyAddress').value.trim();
    //const ticketNumber=document.getElementById('ticketNumber').vlaue.trim();
    // const zoneName=document.getElementById('zoneName').value.trim();
    // const stateName=document.getElementById('stateName').value.trim();
    // const addressName =document.getElementById('addressName').vlaue.trim();

    if (companyName && companyAddress) {
        showNextSection('companyDetails', 'sectionA');
    } else {
        alert('Please enter a Ticket Number,Company name,Store Name,zone,State & Address');
    }
});
// document.getElementById('submitForm').addEventListener('click', function () {
//     resetForm();
//     showNextSection('previewSection', 'companyDetails');
// });


document.getElementById('previewButton').addEventListener('click', populatePreview);

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
            .then(response => response.json())
            .then(data => {
                console.log("Ticket data:", data); // Log data for debugging

                if (data) {
                    // Update the client dropdown
                    if (data.client && data.client.id && data.client.clientName) {
                        clientSelect.innerHTML = `<option value="${data.client.id}">${data.client.clientName}</option>`;
                    } else {
                        clientSelect.innerHTML = '<option value="">Select a client</option>';
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
            .catch(error => {
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
            const ticketNumber = parseInt(document.getElementById("ticketNumber").value);
            function getInputValue(id) {
                const element = document.getElementById(id);
                return element ? element.value.trim() || null : null;
            }

            function getRadioValue(name) {
                const selected = document.querySelector(`input[name="${name}"]:checked`);
                return selected ? selected.value : null;
            }

            //Section A ---->
            const upsRoomYesNo = getRadioValue("upsRoomYesNo");
            const upsRoomOkNotOk = getRadioValue("upsRoomOkNotOk");
            const upsRoomRemark = getInputValue("upsRoomRemark1");

            const mainSwitchYesNo = getRadioValue("mainSwitchYesNo");
            const mainSwitchOkNotOk = getRadioValue("mainSwitchOkNotOk");
            const mainSwitch5 = getInputValue("mainSwitch5");

            const plugPointYesNo = getRadioValue("plugPointYesNo");
            const plugPointOkNotOk = getRadioValue("plugPointOkNotOk");
            const plugPoint5 = getInputValue("plugPoint5");

            const lightingConditionYesNo = getRadioValue("lightingConditionYesNo");
            const lightingConditionOkNotOk = getRadioValue("lightingConditionOkNotOk");
            const lightingCondition5 = getInputValue("lightingCondition5");

            const electialMeterYesNo = getRadioValue("electialMeterYesNo");
            const electialMeterOkNotOk = getRadioValue("electialMeterOkNotOk");
            const electialMeter5 = getInputValue("electialMeter5");
            const electialMeter6 = getInputValue("electialMeter6");
            const electialMeter7 = getInputValue("electialMeter7");

            const fanYesNo = getRadioValue("fanYesNo");
            const fanOkNotOk = getRadioValue("fanOkNotOk");
            const fan5 = getInputValue("fan5");

            const lightsYesNo = getRadioValue("lightsYesNo");
            const lightsOkNotOk = getRadioValue("lightsOkNotOk");
            const lights5 = getInputValue("lights5");

            const serverRoomYesNo = getRadioValue("serverRoomYesNo");
            const serverRoomOkNotOk = getRadioValue("serverRoomOkNotOk");
            const serverRoom15 = getInputValue("serverRoom15");

            const inverterYesNo = getRadioValue("inverterYesNo");
            const inverterOkNotOk = getRadioValue("inverterOkNotOk");
            const inverter15 = getInputValue("inverter15");

            const writingYesNo = getRadioValue("writingYesNo");
            const writingOkNotOk = getRadioValue("writingOkNotOk");
            const writing5 = getInputValue("writing5");

            // Section B
            const plumbingYesNo = getRadioValue("plumbingYesNo");
            const plumbingOkNotOk = getRadioValue("plumbingOkNotOk");
            const plumbing5 = getInputValue("plumbing5");

            const waterSupplyYesNo = getRadioValue("waterSupplyYesNo");
            const waterSupplyOkNotOk = getRadioValue("waterSupplyOkNotOk");
            const waterSupply5 = getInputValue("waterSupply5");

            const toiletYesNo = getRadioValue("toiletYesNo");
            const toiletOkNotOk = getRadioValue("toiletOkNotOk");
            const toilet5 = getInputValue("toilet5");

            // Section C
            const storageUnitYesNo = getRadioValue("storageUnitYesNo");
            const storageUnitOkNotOk = getRadioValue("storageUnitOkNotOk");
            const storageUnit5 = getInputValue("storageUnit5");

            const collapsibleGateYesNo = getRadioValue("collapsibleGateYesNo");
            const collapsibleGateOkNotOk = getRadioValue("collapsibleGateOkNotOk");
            const collapsibleGate5 = getInputValue("collapsibleGate5");

            const frontDoorYesNo = getRadioValue("frontDoorYesNo");
            const frontDoorOkNotOk = getRadioValue("frontDoorOkNotOk");
            const frontDoor5 = getInputValue("frontDoor5");

            const executiveChairsYesNo = getRadioValue("executiveChairsYesNo");
            const executiveChairsOkNotOk = getRadioValue("executiveChairsOkNotOk");
            const executiveChairs5 = getInputValue("executiveChairs5");

            const workStationsYesNo = getRadioValue("workStationsYesNo");
            const workStationsOkNotOk = getRadioValue("workStationsOkNotOk");
            const workStations5 = getInputValue("workStations5");

            const bmCabinYesNo = getRadioValue("bmCabinYesNo");
            const bmCabinOkNotOk = getRadioValue("bmCabinOkNotOk");
            const bmCabin5 = getInputValue("bmCabin5");

            const cashCounterYesNo = getRadioValue("cashCounterYesNo");
            const cashCounterOkNotOk = getRadioValue("cashCounterOkNotOk");
            const cashCounter5 = getInputValue("cashCounter5");

            // Section D
            const checkDoorYesNo = getRadioValue("checkDoorYesNo");
            const checkDoorOkNotOk = getRadioValue("checkDoorOkNotOk");
            const checkDoor5 = getInputValue("checkDoor5");

            const pantryYesNo = getRadioValue("pantryYesNo");
            const pantryOkNotOk = getRadioValue("pantryOkNotOk");
            const pantry5 = getInputValue("pantry5");

            const acYesNo = getRadioValue("acYesNo");
            const acOkNotOk = getRadioValue("acOkNotOk");
            const ac5 = getInputValue("ac5");

            const glowSignBoardYesNo = getRadioValue("glowSignBoardYesNo");
            const glowSignBoardOkNotOk = getRadioValue("glowSignBoardOkNotOk");
            const glowSignBoard5 = getInputValue("glowSignBoard5");

            const pestControlYesNo = getRadioValue("pestControlYesNo");
            const pestControlOkNotOk = getRadioValue("pestControlOkNotOk");
            const pestControl5 = getInputValue("pestControl5");

            const displayBoardYesNo = getRadioValue("displayBoardYesNo");
            const displayBoardOkNotOk = getRadioValue("displayBoardOkNotOk");
            const displayBoard5 = getInputValue("displayBoard5");

            const fireExtinguisherYesNo = getRadioValue("fireExtinguisherYesNo");
            const fireExtinguisherOkNotOk = getRadioValue("fireExtinguisherOkNotOk");
            const fireExtinguisher5 = getInputValue("fireExtinguisher5");
            const fireExtinguisher6 = getInputValue("fireExtinguisher6");

            const consumableStockYesNo = getRadioValue("consumableStockYesNo");
            const consumableStockOkNotOk = getRadioValue("consumableStockOkNotOk");
            const consumableStock5 = getInputValue("consumableStock5");

            const officePaintYesNo = getRadioValue("officePaintYesNo");
            const officePaintOkNotOk = getRadioValue("officePaintOkNotOk");
            const officePaint5 = getInputValue("officePaint5");

            const OfficeCleanlinessYesNo = getRadioValue("OfficeCleanlinessYesNo");
            const OfficeCleanlinessOkNotOk = getRadioValue("OfficeCleanlinessOkNotOk");
            const OfficeCleanliness5 = getInputValue("OfficeCleanliness5");

            const improvements = getInputValue("improvements");

            // Section E
            const ph1 = getInputValue("ph1");
            const pe1 = getInputValue("pe1");
            const ne1 = getInputValue("ne1");
            const earthing = getInputValue("earthing");
            const load = getInputValue("load");
            const requireLoad = getInputValue("requireLoad");
            const month1 = getInputValue("month1");
            const month1Reading = getInputValue("month1Reading");
            const month2 = getInputValue("month2");
            const month2Reading = getInputValue("month2Reading");
            const month3 = getInputValue("month3");
            const month3Reading = getInputValue("month3Reading");
            const meterReading = getInputValue("meterReading");
            const month1Amout = getInputValue("month1Amout");
            const month2Amout = getInputValue("month2Amout");
            const month3Amout = getInputValue("month3Amout");
            const date = getInputValue("date");

            const ph2 = getInputValue("ph2");
            const pe2 = getInputValue("pe2");
            const ne2 = getInputValue("ne2");

            const panel3 = getInputValue("panel3");
            const panel4 = getInputValue("panel4");
            const panel5 = getInputValue("panel5");


            // SECTION F ----->


            const storeData = {


                // section A ---->
                isElectricalUpsRoom: upsRoomYesNo == "YES" ? true : false,
                isElectricalUpsRoomCondition: upsRoomOkNotOk == "OK" ? true : false,
                electricalUpsRoomRemarks: upsRoomRemark,

                isElectricalMainSwitchArea: mainSwitchYesNo == "YES" ? true : false,
                isElectricalMainSwitchCondition: mainSwitchOkNotOk == "OK" ? true : false,
                electricalMainSwitchRemarks: mainSwitch5,

                isElectricalPlugPoints: plugPointYesNo == "YES" ? true : false,
                isElectricalPlugPointCondition: plugPointOkNotOk == "OK" ? true : false,
                electricalPlugPointRearks: plugPoint5,

                isElectricalLighting: lightingConditionYesNo == "YES" ? true : false,
                isElectricalLightingCondition: lightingConditionOkNotOk == "OK" ? true : false,
                electricalLightingRemarks: lightingCondition5,

                isElectricalChecked: electialMeterYesNo == "YES" ? true : false,
                isElectricalCheckedCondition: electialMeterOkNotOk == "OK" ? true : false,
                electricalCheckedR: electialMeter5,
                electricalCheckedY: electialMeter6,
                electricalCheckedB: electialMeter7,

                isElectricalFans: fanYesNo == "YES" ? true : false,
                isElectricalFanCondition: fanOkNotOk == "OK" ? true : false,
                electricalFanRemarks: fan5,

                isElectricalLights: lightsYesNo == "YES" ? true : false,
                isElectricalLightsCondition: lightsOkNotOk == "OK" ? true : false,
                electricalLightsRemarks: lights5,

                isElectricalServerRoom: serverRoomYesNo == "YES" ? true : false,
                isElectricalServerRoomCondition: serverRoomOkNotOk == "OK" ? true : false,
                electricalServerRoomRemarks: serverRoom15,

                isElectricalInverter: inverterYesNo == "YES" ? true : false,
                isElectricalInverterCondition: inverterOkNotOk == "OK" ? true : false,
                electricalInverterBatteryLevel: inverter15,

                isElectricalWriting: writingYesNo == "YES" ? true : false,
                isElectricalWritingCondition: writingOkNotOk == "OK" ? true : false,
                electricalWritingRemarks: writing5,


                // section B ---->

                isPlumbingFitting: plumbingYesNo == "YES" ? true : false,
                isPlumbingFittingCondition: plumbingOkNotOk == "OK" ? true : false,
                plumbingFittingRemarks: plumbing5,

                isPlumbingWatersupply: waterSupplyYesNo == "YES" ? true : false,
                isPlumbingWatersupplyCondition: waterSupplyOkNotOk == "OK" ? true : false,
                plumbingWaterSupplyRemarks: waterSupply5,

                isPlumbingToilet: toiletYesNo == "YES" ? true : false,
                isPlumbingToiletCondition: toiletOkNotOk == "OK" ? true : false,
                plumbingToiletRemarks: toilet5,
                //section C ----->
                isCarpentryStorage: storageUnitYesNo == "YES" ? true : false,
                isCarpentryStorageCondition: storageUnitOkNotOk == "OK" ? true : false,
                carpentryStorageRemarks: storageUnit5,

                isCarpentryCollapsible: collapsibleGateYesNo === "YES" ? true : false,
                isCarpentryCollapsibleCondition: collapsibleGateOkNotOk == "OK" ? true : false,
                carpentryCollapsibleRemarks: collapsibleGate5,

                isCarpentryFrontdoor: frontDoorYesNo == "YES" ? true : false,
                isCarpentryFrontdoorCondition: frontDoorOkNotOk == "OK" ? true : false,
                carpentryFrontdoorRemarks: frontDoor5,

                isCarpentryExecutive: executiveChairsYesNo == "YES" ? true : false,
                isCarpentryExecutiveCondition: executiveChairsOkNotOk == "OK" ? true : false,
                carpentryExecutiveRemarks: executiveChairs5,

                isCarpentryWorkStation: workStationsYesNo == "YES" ? true : false,
                isCarpentryWorkStationCondition: workStationsOkNotOk == "OK" ? true : false,
                carpentryWorkstationRemarks: workStations5,

                isCarpentryBmCabin: bmCabinYesNo == "YES" ? true : false,
                isCarpentryBmCabinCondition: bmCabinOkNotOk == "OK" ? true : false,
                carpentryBmCabinremarks: bmCabin5,

                isCarpentryCashCounter: cashCounterYesNo == "YES" ? true : false,
                isCarpentryCashCounterCondition: cashCounterOkNotOk == "OK" ? true : false,
                carpentryCashCounterRemarks: cashCounter5,

                //section D ------>
                isGeneralRollingShutter: checkDoorYesNo == "YES" ? true : false,
                isGeneralRollingShutterCondition: checkDoorOkNotOk == "YES" ? true : false,
                generalRollingShutterRemarks: checkDoor5,

                isGeneralPantry: pantryYesNo == "YES" ? true : false,
                isGeneralPantryCondition: pantryOkNotOk == "YES" ? true : false,
                generalPantryRemarks: pantry5,

                isGeneralAc: acYesNo == "YES" ? true : false,
                isGeneralAcCondition: acOkNotOk == "YES" ? true : false,
                generalAcRemarks: ac5,

                isGeneralGlowSignBoard: glowSignBoardYesNo == "YES" ? true : false,
                isGeneralGlowSignBoardCondition: glowSignBoardOkNotOk == "YES" ? true : false,
                generalGlowSignBoardRemarks: glowSignBoard5,

                isGenaralPestControl: pestControlYesNo == "YES" ? true : false,
                isGeneralPestControlCondition: pestControlOkNotOk == "YES" ? true : false,
                generalPestControlRemarks: pestControl5,

                isGeneralDisplayBoard: displayBoardYesNo == "YES" ? true : false,
                isGeneralDisplayBoardCondition: displayBoardOkNotOk == "YES" ? true : false,
                generalDisplayBoardRemarks: displayBoard5,

                isGeneralFireExtinguisher: fireExtinguisherYesNo == "YES" ? true : false,
                isGeneralFireExtinguisherCondition: fireExtinguisherOkNotOk == "YES" ? true : false,
                fireExtinguisherGreenZone: fireExtinguisher5,
                fireExtinguisherRedZone: fireExtinguisher6,

                isGeneralHk: consumableStockYesNo == "YES" ? true : false,
                isGeneralHkCondition: consumableStockOkNotOk == "YES" ? true : false,
                generalHkRemarks: consumableStock5,

                isGeneralOfficePaint: officePaintYesNo == "YES" ? true : false,
                isGeneralOfficePaintCondition: officePaintOkNotOk == "YES" ? true : false,
                generalOfficePaintsRemarks: officePaint5,

                isGeneralOverallOffice: OfficeCleanlinessYesNo == "YES" ? true : false,
                isGeneralOverallOfficeCondition: OfficeCleanlinessOkNotOk == "YES" ? true : false,
                generalOverallOfficeRemarks: OfficeCleanliness5,

                generalSuggestionRemarks: improvements,

                //section E --->
                powerSupply1upsPn: ph1,
                powerSupply1upsPe: pe1,
                powerSupply1upsNe: ne1,
                powerSupply1earthPit: earthing,
                powerSupply1availableLoad: load,
                powerSupply1RequiredLoad: requireLoad,
                powerSupply1Month1: month1,
                powerSupply1Month1Red: month1Reading,
                powerSupply1Month2: month2,
                powerSupply1Month2Red: month2Reading,
                powerSupply1Month3: month3,
                powerSupply1Month3Red: month3Reading,
                powerSupply1MeterNo: meterReading,
                powerSupply1Amount1: month1Amout,
                powerSupply1Amount2: month2Amout,
                powerSupply1Amount3: month3Amout,
                powerSupply1DueDate: date,

                powerSupply2PenalPn: ph2,
                powerSupply2PenalPe: pe2,
                powerSupply2PenalNe: ne2,
                powerSupply2earthPit: panel3,
                powerSupply2availableLoad: panel4,
                powerSupply2RequiredLoad: panel5,

                //section H --->

                tikitNumber: ticketNumber,
                store: {
                    id: storeName,
                },
                client: {
                    id: client,
                }
            };

            console.log("Form data:", storeData);

            fetch(`${api}/mstForm/create`, {
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
                    window.location.href="mstList.html";
                })
                .catch((error) => {
                    console.error("Error submitting form:", error);
                    displayError("Error saving data. Please try again.");
                });
        });

    // Function to display error messages
    // Function to display error messages
    function displayError(message) {
        const errorMessageElement = document.getElementById("error-message");
        const successMessageElement = document.getElementById("success-message");

        if (successMessageElement) {
           // successMessageElement.textContent = ""; // Clear success message
            console.log(successMessageElement);
        }

        if (errorMessageElement) {
            console.log(errorMessageElement)
           // errorMessageElement.textContent = message;
        } else {
            console.error("Error message element not found.");
        }
    }

    // Function to display success messages
    function displaySuccess(message) {
        const successMessageElement = document.getElementById("success-message");
        const errorMessageElement = document.getElementById("error-message");

        if (errorMessageElement) {
            errorMessageElement.textContent = ""; // Clear error message
        }

        if (successMessageElement) {
            successMessageElement.textContent = message;
        } else {
            console.error("Success message element not found.");
        }
    }

});



