api = getBaseUrl();
token = localStorage.getItem('authToken');


// Fire Extinguisher Dynamic Rows
let fireExtinguisherCounter = 1;
function addFireExtinguisherRow() {
    const tbody = document.getElementById('fireExtinguisherBody');
    fireExtinguisherCounter++;

    const newRow = `
        <tr>
            <td>${fireExtinguisherCounter}</td>
            <td><input type="text" id="extinguisherType${fireExtinguisherCounter}"></td>
            <td><input type="text"  id="extinguisherCapacity${fireExtinguisherCounter}"></td>
            <td><input type="date" id="extinguisherRefillDate${fireExtinguisherCounter}"></td>
            <td><input type="text" id="extinguisherRemark${fireExtinguisherCounter}"></td>
        </tr>`;

    tbody.insertAdjacentHTML('beforeend', newRow);
}

// Form Submission
document.getElementById('ppmForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Add validation logic here
    const formData = new FormData(this);

    // Process form data (Add your submission logic here)
    console.log([...formData.entries()]);

    alert('Form submitted successfully!');
    // Reset form or redirect as needed
});
function previewPhoto(inputId, previewImgId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewImgId);
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            preview.src = event.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.src = '';
        preview.style.display = 'none';
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
                'Authorization': `${token}`
            },
            body: formData

        });

        if (!response.ok) {
            throw new Error('Photo upload failed');
        } else {
            alert("Photo Upload Sucessfully")
        }

        const data = await response.json();
        console.log(data);

        await applyValueToID(dtoKeyId, data.id);

    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Update Preview Section
function updatePreview() {
    // Company Details
    document.getElementById('previewCompanyName').textContent =
        document.getElementById('companyName').value;
    document.getElementById('previewCompanyAddress').textContent =
        document.getElementById('storeName').value;

    // Monthly PPM Table
    const monthlyTable = document.createElement('table');
    monthlyTable.innerHTML = `
        <thead>
            <tr>
                <th>Equipment</th>
                <th>Description</th>
                <th>Status</th>
                <th>Comments</th>
                <th>Photo</th>
            </tr>
        </thead>
        <tbody>
            ${Array.from(document.querySelectorAll('#monthlyPPM tbody tr')).map(row => {
        const cells = row.querySelectorAll('td');
        return `
                    <tr>
                        <td>${cells[0].textContent}</td>
                        <td>${cells[1].textContent}</td>
                        <td>${cells[2].querySelector('select')?.value || ''}</td>
                        <td>${cells[3].querySelector('input')?.value || ''}</td>
                        <td>${cells[4]?.querySelector('img')?.src ?
                '<img src="' + cells[4].querySelector('img').src + '" style="width:50px">' : ''}
                        </td>
                    </tr>
                `;
    }).join('')}
        </tbody>
    `;

    // Load Readings Table
    const loadTable = document.createElement('table');
    loadTable.innerHTML = `
        <thead>
            <tr>
                <th colspan="2">Load Before</th>
                <th colspan="2">Load After</th>
            </tr>
            <tr>
                <th>Voltage</th>
                <th>Load</th>
                <th>Voltage</th>
                <th>Load</th>
            </tr>
        </thead>
        <tbody>
            ${Array.from(document.querySelectorAll('#loadReadings tbody tr')).map(row => `
                <tr>
                    ${Array.from(row.querySelectorAll('td')).map(td => {
                        const div = td.querySelector('div');
                        if (!div) return '<td></td>';
                        
                        // Get both label text and input value
                        const label = div.childNodes[0].textContent.trim();
                        const input = div.querySelector('input');
                        return `<td>${label}${input?.value ? ': ' + input.value : ''}</td>`;
                    }).join('')}
                </tr>
            `).join('')}
        </tbody>
    `;

    // Fire Extinguisher Table (keep existing implementation)
    const fireTable = document.createElement('table');
    fireTable.innerHTML = `
    <thead>
        <tr>
            <th>Sr.No.</th>
            <th>Extinguisher Type</th>
            <th>Capacity</th>
            <th>Refill Date</th>
            <th>Remark</th>
        </tr>
    </thead>
    <tbody>
        ${Array.from(document.querySelectorAll('#fireExtinguisherBody tr')).map(row => `
            <tr>
                <td>${row.querySelector('td:first-child')?.textContent || ''}</td>
                <td>${row.querySelector('input[id^="extinguisherType"]')?.value || ''}</td>
                <td>${row.querySelector('input[id^="extinguisherCapacity"]')?.value || ''}</td>
                <td>${row.querySelector('input[type="date"]')?.value || ''}</td>
                <td>${row.querySelector('input[id^="extinguisherRemark"]')?.value || ''}</td>
            </tr>
        `).join('')}
    </tbody>
`;
    // Clear and update preview
    const previewTables = document.getElementById('previewTables');
    previewTables.innerHTML = '';

    // Add sections with proper headers
    const addSection = (title, table) => {
        const header = document.createElement('h3');
        header.textContent = title;
        previewTables.appendChild(header);
        previewTables.appendChild(table);
    };

    addSection('Monthly PPM Checklist', monthlyTable);
    addSection('Load Readings', loadTable);
    addSection('Fire Extinguisher Status', fireTable);
}


// Update the showSection function to include preview update
function showSection(currentSection, nextSection) {
    document.getElementById(currentSection).classList.remove('active');
    document.getElementById(nextSection).classList.add('active');

    if (nextSection === 'previewSection') {
        updatePreview();
    }
}

function captureSelfieWithTimestamp(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    const canvas = document.getElementById('selfieCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    reader.onload = function(e) {
        img.onload = function() {
            // Set canvas dimensions to match image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image
            ctx.drawImage(img, 0, 0);
            
            // Add timestamp
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
            
            ctx.font = '20px Arial';
            ctx.fillStyle = 'white';
            const timestamp = new Date().toLocaleString();
            ctx.fillText(timestamp, 10, canvas.height - 15);
            
            // Convert to data URL and show preview
            const dataUrl = canvas.toDataURL('image/jpeg');
            document.getElementById('selfiePreview').src = dataUrl;
            document.getElementById('selfiePreview').style.display = 'block';
            document.getElementById('selfieData').value = dataUrl;
        };
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
}