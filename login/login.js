const apiUrl=getBaseUrl();
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const mobileNumber = document.getElementById("phoneNumber").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

	//const Url = getBaseUrl();
    // Send login request to the backend
    fetch(`${apiUrl}/login/`, { // Replace with your backend login URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mobileNumber, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token && data.id && data.userName&&data.role) {
            // Store the token and user ID in localStorage
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userId', data.id);
            localStorage.setItem('UserName',data.userName)
            localStorage.setItem("userRole",data.role)
            if(data.role==="TECHNICIAN"){
                window.location.href ="../Main/inspectionList.html"
            }else{
            window.location.href = "../Sheduling/sheduling.html"; // Example redirect
            }
        } else {
            // Show error message if token or ID is not returned
            errorMessage.textContent = "Invalid username or password.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.textContent = "An error occurred. Please try again.";
    });
});
