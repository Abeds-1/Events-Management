function renderEvents() {
    $.ajax({
        type: "GET",
        url: "php/get-all-events.php",
        success: function (response) {
            var events = JSON.parse(response);
            var eventList = document.getElementById("event-list");
            eventList.innerHTML = "";

            if (events.length === 0) {
                // Display a message when there are no events
                var noEventsMessage = document.createElement("div");
                noEventsMessage.classList.add("text-center", "text-danger", "mt-3");
                noEventsMessage.textContent = "No events available.";
                eventList.appendChild(noEventsMessage);
            } else {
                // Render events
                events.forEach(function (event) {
                    context = "explore";
                    var card = document.createElement("div");
                    card.classList.add("card", "event-card");
                    card.innerHTML = `
                        <div class="card-header event-card-header">
                            ${event.EventName}
                            <button class="btn btn-primary btn-sm float-end" onclick="openRegistrationModal(${event.EventID}, '${event.EventName}')">Register</button>
                        </div>
                        <div class="card-body">
                            Date: ${event.EventDate}
                            <a href="event-page.html?eventID=${event.EventID}&context=${context}" class="btn btn-secondary btn-sm float-end">View Details</a>
                        </div>
                    `;
                    eventList.appendChild(card);
                });
            }
        }
    });
}

function openRegistrationModal(eventId, eventName) {
    var modal = new bootstrap.Modal(document.getElementById('registrationModal'), {
        keyboard: false
    });
    document.getElementById('eventName').textContent = eventName;

    var registerButton = document.getElementById('registerButton');
    registerButton.onclick = function() {
        registerForEvent(eventId);
        modal.hide();
    };

    modal.show();
}

function registerForEvent(eventId) {
    $.ajax({
        type: "POST",
        url: "php/register-events.php",
        data: { eventId: eventId },
        success: function (response) {
            response = JSON.parse(response);
            if (response.success) {
                alert("Successfully registered for the event!");
                location.reload();
            } else {
                console.log(response.error);
                alert("Failed to register for the event. Please try again.");
            }
        }
    });
}

// Load events on page load
renderEvents();
