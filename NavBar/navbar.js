// navbar.js
$(function() {
  $("#navbar-placeholder").load("../NavBar/navbar.html", function() {
    setActiveTab(); 
  });
});

function setActiveTab() {
  const path = window.location.pathname.split('/').pop(); // Get the current file name
  $(".nav-link").each(function() {
    if ($(this).attr('href').includes(path)) {
      $(this).addClass('active'); // Add 'active' class to matching link
    }
  });
}


