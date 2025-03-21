api=getBaseUrl();
token = localStorage.getItem('authToken');



document.addEventListener('DOMContentLoaded', function () {
var calendarEl = document.getElementById('calendar');

// Define colors for different types
const typeColors = {
'PPM': 'violet',
'INSPECTION': 'darkgoldenrod', // dark yellow color
'BREAKDOWN': 'red',
'MST':'#2b81bf'
};

// Initialize FullCalendar
var calendar = new FullCalendar.Calendar(calendarEl, {
initialView: 'dayGridMonth',
selectable: true,
events: [], // Events will be added dynamically
eventClick: function (info) {
  openEventDetails(info.event.extendedProps);
}
});

// Fetch data from the backend
fetch(`${api}/schedule/`,{headers: { 'Authorization': `${token}`}})
.then(response => response.json()) // Parse JSON response
.then(data => {
  // Assuming the data structure contains an array of tasks
  data.forEach(task => {
    // Determine the color based on the type and status
    const eventColor = task.status === 'TICKET CLOSED' ? 'green' : (typeColors[task.scheduleFor] || 'blue'); // Default to blue if type is unknown

    // Add each task as an event to FullCalendar
    calendar.addEvent({
      title: `${task.client.clientName} - ${task.store.storeCode + " - " + task.store.storeName}-${task.tikitNumber}`, // Short title display
      start: task.date,  // Date field from backend
      allDay: true,
      backgroundColor: eventColor, // Set the background color
      extendedProps: {
        tikitNumber:task.tikitNumber,
        clientName: task.client.clientName,
        storeName: task.store.storeCode + " - " + task.store.storeName,
        type: task.scheduleFor,
        address: task.store.address,
        technicianName: task.user.userName,
        technicianNumber: task.user.mobileNumber,
        technicianEmail: task.user.email,
        status: task.status
      }
    });
  });
  calendar.render(); // Render the calendar with the fetched events
})
.catch(error => console.error('Error fetching tasks:', error));

// Open event details modal
function openEventDetails(props) {
document.getElementById('eventTicketNumber').textContent='Ticket Number: '+props.tikitNumber;
document.getElementById('eventClientName').textContent = 'Client Name: ' + props.clientName;
document.getElementById('eventStoreName').textContent = 'Store Name: ' + props.storeName;
document.getElementById('eventType').textContent = 'Type: ' + props.type;
document.getElementById('eventAddress').textContent = 'Address: ' + props.address;
document.getElementById('eventTechnicianName').textContent = 'Technician Name: ' + props.technicianName;
document.getElementById('eventTechnicianNumber').textContent = 'Technician Number: ' + props.technicianNumber;
document.getElementById('eventTechnicianEmail').textContent = 'Technician Email: ' + props.technicianEmail;
document.getElementById('eventStatus').textContent = 'Status: ' + props.status; // Fixed typo here
document.getElementById('eventDetailsModal').style.display = 'block';
}

// Close event details modal
document.getElementById('closeEventDetails').onclick = function () {
document.getElementById('eventDetailsModal').style.display = 'none';
};
});