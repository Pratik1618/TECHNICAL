api = getBaseUrl();
token = localStorage.getItem('authToken');
function showSection(currentSection, nextSection) {
    // Stop camera when leaving selfie section
    if (currentSection === 'selfieSection') {
        stopCamera();
    }

    document.getElementById(currentSection).classList.remove('active');
    document.getElementById(nextSection).classList.add('active');

    // Initialize camera when entering selfie section
    if (nextSection === 'selfieSection') {
        initializeCamera();
    }

    if (nextSection === 'previewSection') {
        updatePreview();
    }
}


// Form Submission
document.getElementById('yearlyppmForm').addEventListener('submit', function (e) {
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
async function uploadPhoto(photoInputIdOrFile, backendName, previewImgId, dtoKeyId = '') {
    let file;

    // Handle both input ID string and File object
    if (typeof photoInputIdOrFile === 'string') {
        const photoInput = document.getElementById(photoInputIdOrFile);
        file = photoInput.files[0];
    } else if (photoInputIdOrFile instanceof File) {
        file = photoInputIdOrFile;
    } else {
        throw new Error('Invalid input type for uploadPhoto');
    }

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
        }

        const data = await response.json();
        console.log('Upload successful:', data);

        // Update preview
        const preview = document.getElementById(previewImgId);
        if (preview) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = 'block';
        }

        // Set photo ID in hidden field
        if (dtoKeyId) {
            document.getElementById(dtoKeyId).value = data.id;
        }

        return data.id;

    } catch (error) {
        console.error('Upload error:', error);
        alert('Error: ' + error.message);
        throw error;
    }
}


function updatePreview() {
    // Company Details
    document.getElementById('previewCompanyName').textContent =
        document.getElementById('companyName').value;
    document.getElementById('previewCompanyAddress').textContent =
        document.getElementById('storeName').value;

    // Monthly PPM Table
    const quaterlyTable = document.createElement('table');
    quaterlyTable.innerHTML = `
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
            ${Array.from(document.querySelectorAll('#yearlyPPM tbody tr')).map(row => {
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
    const selfiePreview = document.getElementById('selfiePreview');
    if (selfiePreview.src) {
        const selfieSection = document.createElement('div');
        selfieSection.innerHTML = `
            <h3>Selfie with Timestamp</h3>
            <img src="${selfiePreview.src}" style="max-width: 300px;">
        `;
        previewTables.appendChild(selfieSection);
    }

    addSection('Quaterly PPM Checklist', quaterlyTable);

}









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

document.getElementById('yearlyppmForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const storeData = {
        mainControlPanel: document.getElementById("mainControlPanel").value,
        mainControlPanelComment: document.getElementById("mainControlPanelComment").value,

        busDuct: document.getElementById("busDuct").value,
        busDuctComment: document.getElementById("busDuctComment").value,

        earthPits: document.getElementById("EarthPits").value,
        earthPitsComment: document.getElementById("EarthPitsComment").value,
        earthPitsPhotoID: document.getElementById("EarthPitsPhotoID").value,

        earthPits2: document.getElementById("EarthPits2").value,
        earthPits2Comment: document.getElementById("EarthPits2Comment").value,

        capacitorPanel: document.getElementById("CapacitorPanel").value,
        capacitorPanelComment: document.getElementById("CapacitorPanelComment").value,

        general: document.getElementById("General").value,
        generalComment: document.getElementById("GeneralComment").value,
        generalPhotoID: document.getElementById("GeneralPhotoID").value
    };
    console.log('formData', storeData)

    try {
        // Here you would typically send the data to your backend
        console.log('Form Data:', storeData);

        // Show success message
        document.getElementById('success-message').innerHTML =
            '<p style="color: green;">Form submitted successfully!</p>';

        // Optionally reset the form
        setTimeout(() => {
            document.getElementById('yearlyppmForm').reset();
            window.location.href = 'ppminscpectionList.html';
        }, 2000);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').innerHTML =
            '<p style="color: red;">Error submitting form. Please try again.</p>';
    }
});

let videoStream = null;
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const ctx = canvasElement.getContext('2d');

// Initialize camera when entering selfie section
async function initializeCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" } // Front camera
        });
        videoElement.srcObject = videoStream;
    } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Camera access denied. Please enable camera permissions to continue.');
    }
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
}

async function captureSelfie() {
    if (!videoStream) {
        alert('Camera not initialized. Please allow camera access.');
        return;
    }

    // Set canvas dimensions
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    // Draw current video frame
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Add timestamp
    const now = new Date();
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText(now.toLocaleString(), 10, canvasElement.height - 10);

    // Convert to blob
    canvasElement.toBlob(async (blob) => {
        const file = new File([blob], `selfie_${Date.now()}.jpg`, {
            type: 'image/jpeg'
        });

        try {
            // Use modified uploadPhoto with File object
            await uploadPhoto(
                file,          // File object
                'file',        // backendName
                'selfiePreview', // previewImgId
                'selfiePhotoID'  // dtoKeyId
            );

        } catch (error) {
            console.error('Selfie upload failed:', error);
        }
    }, 'image/jpeg');
}

// Modified uploadPhoto function to handle File objects
