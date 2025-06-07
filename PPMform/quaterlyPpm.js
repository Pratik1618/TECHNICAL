api=getBaseUrl();
token = localStorage.getItem('authToken');
let videoStream = null;
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const ctx = canvasElement.getContext('2d');
let dynamicStoreId = null

function validateCompanyDetails() {
    let isValid = true;

    // Get values
    const ticketNumber = document.getElementById('ticketNumber').value;
    const companyName = document.getElementById('companyName').value;
    const storeName = document.getElementById('storeName').value;


    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    // Validate each field
    if (!ticketNumber) {
        document.getElementById('ticketNumberError').textContent = 'Ticket number is required';
        isValid = false;
    }

    if (!companyName) {
        document.getElementById('companyNameError').textContent = 'Company name is required';
        isValid = false;
    }

    if (!storeName) {
        document.getElementById('storeNameError').textContent = 'Store name is required';
        isValid = false;
    }

 if (!isValid) {
        alert("enter ticket no");
    }

    return isValid;
}

function showSection(currentSection, nextSection) {
    
    if (currentSection === 'companyDetails' && nextSection === 'quaterlyPPM') {
        if (!validateCompanyDetails()) {
            return;
        }
    }

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
        const response = await fetch(`${api}/ppmPhoto/create`, {
            method: 'POST',
            headers: {
                'Authorization': `${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Photo upload failed');
        }
        else{
            alert('Photo Upload Successfully')
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
            ${Array.from(document.querySelectorAll('#quaterlyPPM tbody tr')).map(row => {
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
document.addEventListener("DOMContentLoaded", function () {
    const clientSelect = document.getElementById("companyName");
    const storeSelect = document.getElementById("storeName");
    const ticketInput = document.getElementById("ticketNumber");
    const frequencySelect = document.getElementById("frequency");

    // Function to fetch client and store data based on the ticket number
    function fetchDataByTicketNumber(ticketInput) {
        // Fetch data for the ticket
        fetch(`${api}/schedule/ticket/${ticketInput}`, { headers: { 'Authorization': `${token}` } }) // Update URL as necessary
            .then((response) => response.json())
            .then((data) => {
                console.log("Ticket data:", data); // Log data for debugging

                if (data) {
                    if (data.scheduleFor === "Quarterly") {
                        if (data.store && data.store.id) {
                            dynamicStoreId = data.store.id;
                        }
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
                        if (data.scheduleFor) {
                            frequencySelect.innerHTML = `<option value="${data.store.id}">${data.scheduleFor}</option>`;
                        } else {
                            frequencySelect.innerHTML =
                                '<option value="">Select a frequency</option>';
                        }
                    } else {
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
});


document.getElementById('quaterlyppmForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    

    const storeId =dynamicStoreId;
    const ppmFormData=[
        {
            ppmFormDataId:9,
            status:document.getElementById("mainControlPanel").value,
            comment:document.getElementById('mainControlPanelComment').value,
            photoId:document.getElementById('mainControlPanelPhotoID').value,
        },
        {
            ppmFormDataId:10,
            status:document.getElementById('distributionBoards').value,
            comment:document.getElementById('distributionBoardsComment').value,
        },
        {ppmFormDataId:11,
            status:document.getElementById('distributionBoards2').value,
            comment:document.getElementById('distributionBoards2Comment').value,
        },
        {
            ppmFormDataId:12,
            status:document.getElementById('busDuct').value,
            comment:document.getElementById('busDuctComment').value,
        },
        {
            ppmFormDataId:13,
            status:document.getElementById('EarthPits').value,
            comment:document.getElementById('EarthPitsComment').value,
            photoId:document.getElementById('EarthPitsPhotoID').value,
        },
        {
            ppmFormDataId:14,
            status:document.getElementById('EarthPits2').value,
            comment:document.getElementById('EarthPits2Comment').value,
            photoId:document.getElementById('EarthPits2PhotoID').value,
        },
        {
            ppmFormDataId:15,
            status:document.getElementById('CapacitorPanel').value,
            comment:document.getElementById('CapacitorPanelComment').value,
        },
        {
            ppmFormDataId:16,
            status:document.getElementById('electricMotors').value,
            comment:document.getElementById('electricMotorsComment').value,
        },
        {
            ppmFormDataId:17,
            status:document.getElementById('electricMotors2').value,
            comment:document.getElementById('electricMotors2Comment').value,

        }
    ]
   const data = {
    storeId:storeId,
    ppmFormData: ppmFormData
   }
    console.log('formData',data)
    
 try {
    const response = await fetch(`${api}/ppmForm/save`, {
        method: 'POST',
        headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const contentType = response.headers.get('content-type') || '';
    let result;

    if (contentType.includes('application/json')) {
        result = await response.json();
    } else {
        // If not JSON, parse as text to avoid error
        const text = await response.text();
        console.warn('Non-JSON response:', text);
        result = { message: text };
    }

    console.log('Response:', result);
    alert('Form submitted successfully!');

} catch (error) {
    console.error('Error:', error);
    alert('Submission failed. Please try again.');
}
});



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