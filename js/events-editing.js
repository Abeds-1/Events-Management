// Function to render the list of events on the page
function renderEvents(events) {
    // Get the event list container
    var eventList = $("#event-list");
    // Clear existing content in the event list
    eventList.empty();

    // Iterate through each event and create a card for it
    events.each(function () {
        // Get the current event
        var event = $(this);
        // Set the context to "edit"
        context = "edit";

        // Create a card with event details and buttons
        var card = $("<div>").addClass("card event-card")
            .html(`
                <div class="card-header event-card-header">
                    ${event.find('EventName').text()}
                    <!-- Button to remove the event with confirmation -->
                    <button class="btn btn-danger btn-sm float-end" onclick="confirmDeleteEvent(${event.find('EventID').text()})">Remove</button>
                </div>
                <div class="card-body">
                    Date: ${event.find('EventDate').text()}
                    <!-- Button to view event details -->
                    <a href="event-page.html?eventID=${event.find('EventID').text()}&context=${context}" class="btn btn-secondary btn-sm float-end">View Details</a>
                </div>
            `);
        // Append the card to the event list
        eventList.append(card);
    });
}

// Function to confirm the deletion of an event
function confirmDeleteEvent(eventId) {
    // Display a confirmation modal
    var modal = new bootstrap.Modal(document.getElementById('confirmationModal'), {
        keyboard: false
    });

    // Set up the delete button click event inside the modal
    var deleteButton = document.getElementById('deleteButton');
    deleteButton.onclick = function () {
        // Call the removeEvent function when the user confirms
        removeEvent(eventId);
        // Close the modal after deletion
        modal.hide();
    };

    // Show the confirmation modal
    modal.show();
}

// Function to remove an event by making a server request
function removeEvent(eventId) {
    // Send a request to the server to delete the event
    $.ajax({
        type: 'POST',
        url: 'php/delete-event.php',
        data: { eventID: eventId },
        dataType: 'xml', // Expect XML response
        success: function (data) {
            // Parse the XML response
            var xmlDoc = $(data);
            // Check if the deletion was successful
            if (xmlDoc.find('success').text() === 'true') {
               // Reload the page after successful deletion
               location.reload();
            } else {
                // Log an error message if deletion fails
                console.error('Failed to delete event:', xmlDoc.find('message').text());
            }
        },
        error: function (error) {
            // Log an error message if the server request fails
            console.error('Error:', error);
        }
    });
}

// Function to fetch registered events from the server
function fetchRegisteredEvents() {
    // Fetch registered events from the server
    $.ajax({
        type: 'GET',
        url: 'php/dashboard_table_fetch.php',
        dataType: 'xml', // Expect XML response
        success: function (data) {
            // Parse the XML response
            var xmlDoc = $(data);
            // Get the count of registered events
            var eventCount = parseInt(xmlDoc.find('eventCount').text());

            // Get the event list container
            var eventList = $("#event-list");
            // Clear existing content in the event list
            eventList.empty();

            // Check if there are no registered events
            if (eventCount === 0) {
                // Display a centered, red, and larger message when no events are registered
                eventList.append("<p style='text-align: center; color: red; font-size: 20px;'>No events are registered yet.</p>");
            } else {
                // Get the list of events and render them on the page
                var events = xmlDoc.find('event');
                renderEvents(events);
            }
        },
        error: function (error) {
            // Log an error message if the server request fails
            console.error('Error:', error);
        }
    });
}

// Initial fetch of registered events when the page loads
fetchRegisteredEvents();
