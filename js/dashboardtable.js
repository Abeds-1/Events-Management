function populateEventsTable() {
  var tableBody = document.getElementById("dataTableBody");
  tableBody.innerHTML = "";
  // Fetch registered events for the user using AJAX
  $.ajax({
      type: 'POST',
      url: 'php/dashboard_table_fetch.php',
      // Remove the data field since we are not passing userID in the data
      contentType: 'xml', // Set content type to XML
      success: function (response) {
          var $xml = $(response);
          var eventsData = [];
          var eventCount = 0;
          // Extract data from XML
          $xml.find('event').each(function () {
              var eventName = $(this).find('EventName').text();
              var eventDate = $(this).find('EventDate').text();
              var loc = $(this).find('Location').text();
              if (eventName != null && eventDate != null && loc != null) {
                  var event = {
                      name: eventName,
                      date: eventDate,
                      location: loc,
                      status: 'Registered'
                  };
                  eventsData.push(event);
              }
          });
          // Extract event count from XML
          eventCount = parseInt($xml.find('eventCount').text());
          // Update the HTML element with the event count
          var eventCountElement = document.getElementById('counter');
          eventCountElement.textContent = eventCount + ' Registered Events';
          // Populate the table with fetched data
          eventsData.forEach(function (event) {
              var row = `<tr>
                  <td>${event.name}</td>
                  <td>${event.date}</td>
                  <td>${event.location}</td>
                  <td>${event.status}</td>
              </tr>`;
              tableBody.innerHTML += row;
          });
      },
      error: function (error) {
          console.error('Error fetching registered events:', error);
      }
  });
}

// Call the function to populate the table
populateEventsTable();
