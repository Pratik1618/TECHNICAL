api=getBaseUrl();
token = localStorage.getItem('authToken');
function showSection(currentSection, nextSection) {
    document.getElementById(currentSection).classList.remove('active');
    document.getElementById(nextSection).classList.add('active');
    if (nextSection === 'previewSection') {
        updatePreview();
    }
}


// Form Submission
document.getElementById('ppmForm').addEventListener('submit', function(e) {
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
            ${Array.from(document.querySelectorAll('#halfyearlyPpm tbody tr')).map(row => {
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

   
    const previewTables = document.getElementById('previewTables');
    previewTables.innerHTML = '';

    // Add sections with proper headers
    const addSection = (title, table) => {
        const header = document.createElement('h3');
        header.textContent = title;
        previewTables.appendChild(header);
        previewTables.appendChild(table);
    };

    addSection('Quaterly PPM Checklist', quaterlyTable);
  
}
