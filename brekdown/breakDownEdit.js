api='http://localhost:8083/';
token = localStorage.getItem('authToken');


function showNextSection(currentSectionId, nextSectionId) {
    document.getElementById(currentSectionId).classList.remove('active');
    document.getElementById(nextSectionId).classList.add('active');

    if (nextSectionId === 'previewSection') {
        populatePreview();
    }
}
document.getElementById('next-company').addEventListener('click', function() {
    const companyName = document.getElementById('clientNameEdit').value.trim();
    const companyAddress = document.getElementById('storeNameEdit').value.trim();

    if (companyName && companyAddress) {
        showNextSection('companyDetails', 'sectionA');
    } else {
        alert('Please enter a Ticket Number,Company name,Store Name,zone,State & Address');
    }
});

function loadEditForm() {
    const storeId = getQueryParam("id"); // Function to get query parameter from URL
    if (!storeId) {
        console.error("No store ID provided");
        return;
    }

    fetch(`${api}breakdown/${storeId}`,{headers: { 'Authorization': `${token}`}})
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
    document.getElementById("ticketNumberEdit").value=storeForm.tikitNumber;
    document.getElementById("clientNameEdit").value=storeForm.client.clientName;
    clientNameEditValue=parseInt(storeForm.client.id);
    document.getElementById("storeNameEdit").value=storeForm.store.storeName;
    storeNameEditValue=parseInt(storeForm.store.id);

    const tableBody = document.querySelector('#checklistTable tbody');
    storeForm.breakdowns.forEach((item, index) => {
        const rowCount = index + 1; // Adjust rowCount to match the index of the item
        const newRow = document.createElement('tr');
        newRow.id = `row${rowCount}`;
        
        newRow.innerHTML = `
            <td><input type="text" id="breakdown${rowCount}" name="breakdown${rowCount}" value="${item.breakdownOn}" placeholder="breakdown" /></td>
            <td>
                <select id="status${rowCount}" name="status${rowCount}">
                    <option value="ACTIVE" ${item.status === 'ACTIVE' ? 'selected' : ''}>ACTIVE</option>
                    <option value="CLOSED" ${item.status === 'CLOSED' ? 'selected' : ''}>CLOSED</option>
                </select>
            </td>
            <td><input type="text" id="resion${rowCount}" name="resion${rowCount}" value="${item.remarks}" placeholder="Enter the reason" /></td>
            <td><button class="remove-button" type="button" onclick="removeRow(this)">Remove</button></td>
        `;

        tableBody.appendChild(newRow);
    });

}
function addNewRow() {
    const tableBody = document.querySelector('#checklistTable tbody');
    const rowCount = tableBody.querySelectorAll('tr').length + 1;

    const newRow = document.createElement('tr');
    newRow.id = `row${rowCount}`;

    newRow.innerHTML = `
        <td><input type="text" id="breakdown${rowCount}" name="breakdown${rowCount}" placeholder="breakdown" /></td>
        <td>
            <select id="status${rowCount}" name="status${rowCount}">
                <option value="ACTIVE">ACTIVE</option>
                <option value="CLOSED">CLOSED</option>
            </select>
        </td>
        <td><input type="text" id="resion${rowCount}" name="resion${rowCount}" placeholder="Enter the reason" /></td>
        <td><button class="remove-button" type="button" onclick="removeRow(this)">Remove</button></td>
    `;

    tableBody.appendChild(newRow);
}

function removeRow(button) {
    const row = button.closest('tr');
    row.remove();
}


function saveEdit() {
    const storeId = document.getElementById("storeId").value;
    const checklistData = [];
    document.querySelectorAll('#checklistTable tbody tr').forEach((row, index) => {
        const rowCount = index + 1; // Adjust rowCount to match the index of the row
        const breakdown = document.getElementById(`breakdown${rowCount}`)?.value;
        const status = document.getElementById(`status${rowCount}`)?.value;
        const resion = document.getElementById(`resion${rowCount}`)?.value;

        if (breakdown) {
            checklistData.push({
                breakdownOn: breakdown,
                status: status,
                remarks: resion
            });
        }
    });

    const formData = {
        tikitNumber: document.getElementById(ticketNumberEdit),
        client: {
            id: clientNameEditValue
        },
        store: {
            id: storeNameEditValue
        },
        breakdowns: checklistData
        
    };

    fetch(`${api}breakdown/update/${storeId}`, {
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
                window.location.href = "breakdownList.html"; // Redirect after successful save
            } else {
                console.error("Failed to update store");
                alert("Error updating store");
            }
        })
        .catch((error) => console.error("Error updating store:", error));
}

function cancelEdit() {
    window.location.href = "breakdownList.html"; // Redirect to the main page
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
document.getElementById('addRowButton').addEventListener('click', addNewRow);
document.addEventListener("DOMContentLoaded", loadEditForm);