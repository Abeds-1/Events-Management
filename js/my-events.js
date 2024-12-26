// Function to render events created by the user
function renderMyEvents(events) {
    // Get the event list container
    var eventList = $("#event-list");
    // Clear existing content in the event list
    eventList.empty();

    // Iterate through each user-created event and create a card for it
    events.each(function () {
        // Get the current event
        var event = $(this);
        // Set the context to "deletemyevent"
        context = "deletemyevent";

        // Create a card with event details and remove button
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

// Function to confirm the deletion of a user-created event
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

// Function to remove a user-created event
function removeEvent(eventId) {
    // Send a request to the server to delete the event
    $.ajax({
        type: 'GET',
        url: 'php/delete-my-event.php',
        data: { eventID: eventId },
        dataType: 'json', // Expect JSON response
        success: function (response) {
            console.log(response);
            if (response.success) {
                // Reload the page after successful deletion
                location.reload();
            } else {
                // Log an error message if deletion fails
                console.error('Failed to delete event:', response.message);
            }
        },
        error: function (error, xhr, status) {
            // Log an error message if the server request fails
            console.error('Error:', error);
        }
    });
}

// Function to fetch events created by the user from the server
function fetchMyEvents() {
    // Fetch events created by the user from the server
    $.ajax({
        type: 'GET',
        url: 'php/my-events-fetch.php',
        dataType: 'xml', // Expect XML response
        success: function (data) {
            // Parse the XML response
            var xmlDoc = $(data);
            // Get the count of user-created events
            var eventCount = parseInt(xmlDoc.find('eventCount').text());

            // Get the event list container
            var eventList = $("#event-list");
            // Clear existing content in the event list
            eventList.empty();

            // Check if the user has not created any events
            if (eventCount === 0) {
                // Display a centered, red, and larger message when no events are created
                eventList.append("<p style='text-align: center; color: red; font-size: 20px;'>You haven't created any events yet.</p>");
            } else {
                // Get the list of user-created events and render them on the page
                var events = xmlDoc.find('event');
                renderMyEvents(events);
            }
        },
        error: function (error) {
            // Log an error message if the server request fails
            console.error('Error:', error);
        }
    });
}

// Initial fetch of user's created events when the page loads
fetchMyEvents();
