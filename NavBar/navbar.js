// navbar.js
// userrole=localStorage.getItem("userRole");
// console.log("userrole"+userrole);

// if (userrole !== 'ADMIN') {
//   // Hide the ZONE, STATE, and CITY tabs
//   document.getElementById('tab-zone').style.display = 'none';
//   document.getElementById('tab-state').style.display = 'none';
//   document.getElementById('tab-city').style.display = 'none';
// }


$(document).ready(function() {
  if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      window.location.href = '../login/login.html';
  } else {
      $("#navbar-placeholder").load("../NavBar/navbar.html", function() {
          setActiveTab();
          setupLogoutHandler();
      });
  }
});

function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  return token !== null && token !== 'null';
}

function setActiveTab() {
  const path = window.location.pathname.split('/').pop();
  $(".nav-link").each(function() {
      if ($(this).attr('href').includes(path)) {
          $(this).addClass('active'); 
      }
  });
}

function setupLogoutHandler() {
  $('#logout-link').on('click', function(event) {
      event.preventDefault();
     
      alert('You have been logged out.');

   
      localStorage.removeItem('authToken'); 

    
      window.location.href = '../login/login.html'; 
  });
}
