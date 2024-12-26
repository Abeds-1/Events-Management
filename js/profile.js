$(document).ready(function () {
    // Fetch user information and events when the page loads
    $.ajax({
        url: 'php/profile.php',
        method: 'GET',
        success: function (response) {
            // Parse the JSON response
            var data = response;

            // Update the profile information on the page
            $('.profile-name').text(data.firstName + ' ' + data.lastName);
            $('.profile-email').text(data.email);

            // Update the registered events on the page
            var eventList = $('#event-list');
            eventList.empty();

            // Iterate through registered events and display them
            $.each(data.registeredEvents, function (index, event) {
                var eventItem = $('<div class="event-item"></div>');
                eventItem.html('<strong>Event Name:</strong> ' + event.EventName + '<br>' +
                    '<strong>Date:</strong> ' + event.EventDate + '<br>' +
                    '<strong>Location:</strong> ' + event.Location);

                eventList.append(eventItem);

                // Add a horizontal line between events
                var eventLine = $('<div class="event-item-line"></div>');
                eventList.append(eventLine);
            });
        },
        error: function (error) {
            console.error('Error fetching user profile: ', error);
        }
    });
});
