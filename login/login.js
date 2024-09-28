document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const mobileNumber = document.getElementById("phoneNumber").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Send login request to the backend
    fetch('http://localhost:8083/login/', { // Replace with your backend login URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mobileNumber, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            // Store the token in localStorage
            localStorage.setItem('authToken', data.token);

            // Redirect to another page after successful login
            window.location.href = "../Sheduling/sheduling.html"; // Example redirect
        } else {
            // Show error message if token is not returned
            errorMessage.textContent = "Invalid username or password.";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.textContent = "An error occurred. Please try again.";
    });
});



