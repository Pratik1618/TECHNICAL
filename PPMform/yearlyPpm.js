const api = "http://localhost:5000";
const token = localStorage.getItem("token");
// Global variables
let currentSection = "companyDetails";
let cameraStream = null;


async function uploadPhoto(
  photoInputIdOrFile,

  previewImgId,
  dtoKeyId = ""
) {
  let file;

  // Handle both input ID string and File object
  if (typeof photoInputIdOrFile === "string") {
    const photoInput = document.getElementById(photoInputIdOrFile);
    file = photoInput.files[0];
  } else if (photoInputIdOrFile instanceof File) {
    file = photoInputIdOrFile;
  } else {
    throw new Error("Invalid input type for uploadPhoto");
  }

  if (!file) {
    alert("Please select a photo to upload.");
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${api}/inspectionPhoto/create`, {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Photo upload failed");
    }

    const data = await response.json();
    console.log("Upload successful:", data);

    // Update preview
    const preview = document.getElementById(previewImgId);
    if (preview) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
    }

    // Set photo ID in hidden field
    if (dtoKeyId) {
      document.getElementById(dtoKeyId).value = data.id;
    }

    return data.id;
  } catch (error) {
    console.error("Upload error:", error);
    alert("Error: " + error.message);
    throw error;
  }
}
// Initialize form
document.addEventListener("DOMContentLoaded", function () {
  // Set up event listeners for photo uploads
  setupPhotoUpload('earthPitsPhoto', 'earthPitsPreview', 'earthPitsPhotoId');
setupPhotoUpload('GeneralPhoto', 'GeneralPhotoPreview', 'GeneralPhotoId');
  // Initialize camera when selfie section is shown
  document
    .getElementById("selfieSection")
    .addEventListener("show", initCamera);
  document
    .getElementById("selfieSection")
    .addEventListener("hide", stopCamera);

  // Form submission
  document
    .getElementById("yearlyppmForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      submitForm();
    });
});

// Section navigation
function showSection(from, to) {
  document.getElementById(from).classList.remove("active");
  document.getElementById(to).classList.add("active");

  // Trigger custom events
  document.getElementById(from).dispatchEvent(new Event("hide"));
  document.getElementById(to).dispatchEvent(new Event("show"));

  currentSection = to;
}

// Validation functions
function validateCompanyDetails() {
  const ticketNumber = document
    .getElementById("ticketNumber")
    .value.trim();
  const companyName = document.getElementById("companyName").value;
  const storeName = document.getElementById("storeName").value;

  if (!ticketNumber || !companyName || !storeName) {
    alert("Please fill in all company details before proceeding.");
    return;
  }

  showSection("companyDetails", "yearlyPpm");
}

function validateChecklist() {
  // Check if all required fields are filled
  let isValid = true;
  document.querySelectorAll(".status-select").forEach((select) => {
    if (!select.value) {
      select.classList.add("error-field");
      isValid = false;
    } else {
      select.classList.remove("error-field");
    }
  });

  if (!isValid) {
    alert("Please select a status for all checklist items.");
    return;
  }

  showSection("yearlyPpm", "selfieSection");
}

function validateSelfie() {
  const selfiePreview = document.getElementById("selfiePreview");

  if (selfiePreview.style.display === "none") {
    document.getElementById("selfieError").style.display = "block";
    return;
  }

  document.getElementById("selfieError").style.display = "none";
  updatePreview();
  showSection("selfieSection", "previewSection");
}

// Photo upload handling
function setupPhotoUpload(inputId, previewId, photoIdField) {
const input = document.getElementById(inputId);
const preview = document.getElementById(previewId);

input.addEventListener('change', async function() {
  if (this.files && this.files[0]) {
      try {
          // Show loading state
          preview.src = '';
          preview.style.display = 'block';
          preview.alt = 'Uploading...';
          
          // Call uploadPhoto function
          await uploadPhoto(inputId, previewId, photoIdField);
          
          // Make preview clickable
          preview.onclick = function() {
              showImageModal(preview.src);
          };
      } catch (error) {
          preview.style.display = 'none';
          input.value = ''; // Reset input
      }
  }
});
}

// Camera functions
function initCamera() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(function (stream) {
      const video = document.getElementById("video");
      video.srcObject = stream;
      cameraStream = stream;
    })
    .catch(function (err) {
      console.error("Camera error: ", err);
      alert(
        "Could not access the camera. Please ensure you've granted camera permissions."
      );
    });
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
    cameraStream = null;
  }
}

function captureSelfie() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const preview = document.getElementById("selfiePreview");
  const selfiePhotoId = document.getElementById('selfiePhotoId');
  // Set canvas size to video size
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw current video frame to canvas
  const context = canvas.getContext("2d");
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Add timestamp
  context.font = "20px Arial";
  context.fillStyle = "white";
  context.strokeStyle = "black";
  context.lineWidth = 2;
  const timestamp = new Date().toLocaleString();

  // Measure text width for background
  const textWidth = context.measureText(timestamp).width;

  // Draw background for text
  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  context.fillRect(10, canvas.height - 40, textWidth + 20, 30);

  // Draw text
  context.fillStyle = "white";
  context.fillText(timestamp, 20, canvas.height - 20);

  // Convert to data URL and display preview
  const imageData = canvas.toDataURL("image/jpeg");
  preview.src = imageData;
  preview.style.display = "block";
  preview.onclick = function () {
    showImageModal(imageData);
  };

  // Hide error message if shown
  document.getElementById("selfieError").style.display = "none";

  canvas.toBlob(async function(blob) {
  const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
  
  try {
      const photoId = await uploadPhoto(file, 'selfie', 'selfiePreview', 'selfiePhotoId');
     selfiePhotoId.value = photoId; // Set the photo ID in the hidden field
      document.getElementById('selfieError').style.display = 'none';
  } catch (error) {
      document.getElementById('selfieError').style.display = 'block';
      preview.style.display = 'none';
      selfiePhotoId.value = ''; // Clear photo ID on error
  }
}, 'image/jpeg');
}


// Preview generation
function updatePreview() {
  // Company info
  document.getElementById("previewTicketNumber").textContent =
    document.getElementById("ticketNumber").value;
  document.getElementById("previewCompanyName").textContent =
    document.getElementById("companyName").options[
      document.getElementById("companyName").selectedIndex
    ].text;
  document.getElementById("previewStoreName").textContent =
    document.getElementById("storeName").options[
      document.getElementById("storeName").selectedIndex
    ].text;

  // Checklist items
  const previewTable = document
    .getElementById("previewChecklistTable")
    .getElementsByTagName("tbody")[0];
  previewTable.innerHTML = "";

  // Add each checklist item to the preview
  const items = [
    { id: "mainControlPanel", desc: "Ensure tightness of the bus", hasPhoto: false },
    {
      id: "busDuct",
      desc: "Ensure tightness of the bus",
      hasPhoto: false,
    },
    {
      id: "earthPits",
      desc: "Perform ER Test and submit Report",
      hasPhoto: true,
      previewId: "earthPitsPreview",
    },
    { id: "earthPits2", desc: "Ensure the tightness of bolts & nuts", hasPhoto: false },
    {
      id: "CapacitorPanel",
      desc: "Ensure tightness of the bus",
      hasPhoto: false,
    },
    {
      id: "General",
      desc: "Perform IR Test and submit report",
      hasPhoto: true,
      previewId: "GeneralPhotoPreview",
    },
  
  ];

  items.forEach((item) => {
    const statusSelect = document.getElementById(`${item.id}Status`);
    const comment = document.getElementById(`${item.id}Comment`).value;

    if (statusSelect) {
      const row = previewTable.insertRow();

      // Equipment
      const cell1 = row.insertCell(0);
      cell1.textContent = statusSelect.id
        .replace("Status", "")
        .replace(/([A-Z])/g, " $1")
        .trim();

      // Description
      const cell2 = row.insertCell(1);
      cell2.textContent = item.desc;

      // Status
      const cell3 = row.insertCell(2);
      const statusText =
        statusSelect.options[statusSelect.selectedIndex].text;
      const statusClass =
        statusSelect.value === "ok"
          ? "status-ok"
          : statusSelect.value === "not-ok"
          ? "status-not-ok"
          : "status-na";

      cell3.innerHTML = `<span class="status-indicator ${statusClass}"></span>${statusText}`;

      // Comments
      const cell4 = row.insertCell(3);
      cell4.textContent = comment || "N/A";

      // Photo
      const cell5 = row.insertCell(4);
      if (item.hasPhoto) {
        const preview = document.getElementById(item.previewId);
        if (preview && preview.style.display !== "none") {
          const img = document.createElement("img");
          img.src = preview.src;
          img.className = "photo-preview";
          img.onclick = function () {
            showImageModal(preview.src);
          };
          cell5.appendChild(img);
        } else {
          cell5.textContent = "No photo";
        }
      } else {
        cell5.textContent = "N/A";
      }
    }
  });

  // Selfie preview
  const selfiePreview = document.getElementById("selfiePreview");
  if (selfiePreview.style.display !== "none") {
    const previewSelfie = document.getElementById("previewSelfie");
    previewSelfie.src = selfiePreview.src;
    previewSelfie.style.display = "block";
    previewSelfie.onclick = function () {
      showImageModal(selfiePreview.src);
    };
  }
}

// Modal image view
function showImageModal(src) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");

  modal.style.display = "flex";
  modalImg.src = src;
}

function closeModal() {
  document.getElementById("imageModal").style.display = "none";
}

// Form submission
function submitForm() {
  const submitBtn = document.getElementById("submitForm");
  const errorMsg = document.getElementById("error-message");
  const successMsg = document.getElementById("success-message");

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="spinner"></i> Submitting...';
  errorMsg.style.display = "none";
  successMsg.style.display = "none";

  // Simulate form submission (replace with actual AJAX call)
  setTimeout(function () {
    // This is where you would normally make an AJAX call
    // For demonstration, we'll simulate a successful submission

    submitBtn.innerHTML = "Submit Checklist";
    submitBtn.disabled = false;

    successMsg.textContent = "Checklist submitted successfully!";
    successMsg.style.display = "block";

    // Scroll to show success message
    successMsg.scrollIntoView({ behavior: "smooth" });

    // Optionally reset form after successful submission
    // document.getElementById('halfyearlyppmForm').reset();
  }, 2000);
}

// Close modal when clicking outside the image
window.onclick = function (event) {
  const modal = document.getElementById("imageModal");
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

document.getElementById('yearlyppmForm').addEventListener('submit',async(e)=>{
  e.preventDefault();
  const storeId = 123;
  selfiePhotoId=document.getElementById('selfiePhotoId').value;
  const ppmFormData =[
    {
      ppmFormDataId:18,
      status:document.getElementById('mainControlPanelStatus').value,
      comment:document.getElementById('mainControlPanelComment').value,
    },
    {
      ppmFormDataId:19,
      status:document.getElementById('mainControlPanel2Status').value,
      comment:document.getElementById('mainControlPanel2Comment').value,
    },
    {
      ppmFormDataId:20,
      status:document.getElementById('distributionBoardsStatus').value,
      comment:document.getElementById('distributionBoardsComment').value,
      photoId:document.getElementById('distributionBoardsPhotoId').value,
    },
    {
      ppmFormDataId:21,
      status:document.getElementById('busDuctStatus').value,
      comment:document.getElementById('busDuctComment').value,
    },
    {
      ppmFormDataId:22,
      status:document.getElementById('CapacitorPanelStatus').value,
      comment:document.getElementById('CapacitorPanelComment').value,
      photoId:document.getElementById('CapacitorPanelPhotoId').value,
    },
    {
      ppmFormDataId:23,
      status:document.getElementById('CapacitorPanel2Status').value,
      comment:document.getElementById('CapacitorPanel2Comment').value,
      photoId:Number(document.getElementById('CapacitorPanel2PhotoId').value),
    },
    {
      ppmFormDataId:24,
      status:document.getElementById('electricMotorsStatus').value,
      comment:document.getElementById('electricMotorsComment').value,

    }
  ]

  const data ={
    storeId:storeId,
    ppmFormData:ppmFormData,
    selfiePhotoId:selfiePhotoId,
  };
  console.log('check',data);

  try {
    const response = await fetch(`${api}/ppmForm/save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log('Submission result:', result);
    alert('PPM Form submitted successfully!');
} catch (error) {
    console.error('Error submitting form:', error);
    alert('Submission failed. Please try again.');
}
})
