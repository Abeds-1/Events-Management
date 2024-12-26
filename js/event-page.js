$(document).ready(function () {
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Fetch event details using AJAX
    var eventID = getParameterByName('eventID');
    var context = getParameterByName('context');

    if (eventID) {
        $.ajax({
            type: "GET",
            url: "php/get-event-details.php",
            data: { eventID: eventID },
            success: function (response) {
                var eventDetails = JSON.parse(response);
                populateEventDetails(eventDetails, context);
                renderFeedbacks(eventID);
            }
        });

        // Function to populate event details on the page
        function populateEventDetails(eventDetails, context) {
            var eventCard = $("#eventDetailsContainer");

            eventCard.html(`
                <div class="card event-card">
                    <div class="card-header event-card-header">
                        <h2>${eventDetails.EventName}</h2>
                        <button class="btn btn-primary btn-sm float-end" id="editButton"></button>
                    </div>
                    <div class="card-body">
                        <p>Date: ${eventDetails.EventDate}</p>
                        <p>Time: ${eventDetails.EventTime}</p>
                        <p>Location: ${eventDetails.Location}</p>
                        <p>Description: ${eventDetails.Description}</p>
                        <p>Created by: ${eventDetails.CreatorName}</p>
                    </div>
                </div>
            `);

            var actionButton = $("#editButton");
            // Set up the register or delete button based on the context
            if (context === "explore") {
                actionButton.text("Register");
                actionButton.removeClass("btn-danger").addClass("btn-primary");
                actionButton.on("click", function () {
                    openRegistrationModal(eventDetails.EventID, eventDetails.EventName);
                });
            } else if (context === "edit") {
                actionButton.text("Delete");
                actionButton.removeClass("btn-primary").addClass("btn-danger");
                actionButton.on("click", function () {
                    confirmDeleteEvent(eventDetails.EventID);
                });
            } else if(context == "deletemyevent"){
                actionButton.text("Delete");
                actionButton.removeClass("btn-primary").addClass("btn-danger");
                actionButton.on("click", function () {
                    confirmDeleteCreatedEvent(eventDetails.EventID);
                });
            }
        }

        function confirmDeleteCreatedEvent(eventId) {
            // Display a confirmation modal
            var modal = new bootstrap.Modal(document.getElementById('confirmationModal'), {
                keyboard: false
            });
        
            // Set up the delete button click event inside the modal
            var deleteButton = document.getElementById('deleteButton');
            deleteButton.onclick = function () {
                // Call the removeEvent function when the user confirms
                removeCreatedEvent(eventId);
                modal.hide(); // Close the modal after deletion
            };
        
            modal.show();
        }

        function removeCreatedEvent(eventId) {
            // Send a request to the server to delete the event
            $.ajax({
                type: 'GET',
                url: 'php/delete-my-event.php',
                data: { eventID: eventId},
                dataType: 'json', // Expect JSON response
                success: function (response) {
                    if (response.success) {
                        location.reload();
                    } else {
                        console.error('Failed to delete event:', response.message);
                    }
                },
                error: function (error) {
                    console.error('Error:', error);
                }
            });
        }
        

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
                modal.hide(); // Close the modal after deletion
            };

            modal.show();
        }

        function removeEvent(eventId) {
            // Send a request to the server to delete the event
            $.ajax({
                type: 'POST',
                url: 'php/delete-event.php',
                data: { eventID: eventId },
                dataType: 'xml', // Expect XML response
                success: function (data) {
                    var xmlDoc = $(data);
                    if (xmlDoc.find('success').text() === 'true') {
                        window.location.href = "events-editing.html";
                    } else {
                        console.error('Failed to delete event:', xmlDoc.find('message').text());
                    }
                },
                error: function (error) {
                    console.error('Error:', error);
                }
            });
        }

        function openRegistrationModal(eventId, eventName) {
            var modal = new bootstrap.Modal(document.getElementById('registrationModal'), {
                keyboard: false
            });
            // Set the event details in the modal
            document.getElementById('eventName').textContent = eventName;

            // Set up the register button click event inside the modal
            var registerButton = document.getElementById('registerButton'); // Change the ID to match the HTML
            registerButton.onclick = function () {
                // Call the register function when the user confirms
                registerForEvent(eventId, eventName);
                modal.hide(); // Close the modal after registration
            };

            modal.show();
        }

        function registerForEvent(eventId, eventName) {
            // Use jQuery to make an Ajax request to register the user for the event
            $.ajax({
                type: "POST",
                url: "php/register-events.php", // Update with your PHP file handling registration
                data: { eventId: eventId },
                success: function (response) {
                    response = JSON.parse(response);
                    if (response.success) {
                        // Optionally, you can update the UI to reflect the registration
                        alert("Successfully registered for the event!");
                        // Reload the page after a successful registration
                        window.location.href = "explore-events.html";
                    } else {
                        console.log(response.error);
                        alert("Failed to register for the event. Please try again.");
                    }
                }
            });
        }

        // Function to render feedbacks on the page
        function renderFeedbacks(eventID) {
            $.ajax({
                type: "GET",
                url: "php/get-event-feedbacks.php", // Update with your PHP file retrieving feedbacks
                data: { eventID: eventID },
                success: function (response) {
                    var feedbackList = $("#feedbackListContainer");
                    feedbackList.html(""); // Clear previous feedbacks

                    var feedbacks = JSON.parse(response);

                    if (feedbacks.length === 0) {
                        // Display a centered message when there are no feedbacks
                        var noFeedbackMessage = $("<div>").addClass("text-center mt-3");
                        noFeedbackMessage.text("No feedbacks yet.");
                        feedbackList.append(noFeedbackMessage);
                    } else {
                        // Render feedbacks
                        feedbacks.forEach(function (feedback) {
                            var feedbackCard = $("<div>").addClass("feedback-card");
                            feedbackCard.html(`
                                <p><strong>${feedback.UserName}:</strong> ${feedback.FeedbackText}</p>
                            `);
                            feedbackList.append(feedbackCard);
                        });
                    }
                }
            });
        }

        // Submit feedback form
        $("#feedbackForm").submit(function (e) {
            e.preventDefault();

            var feedbackName = $("#feedbackName").val();
            var feedbackMessage = $("#feedbackMessage").val();

            $.ajax({
                type: "POST",
                url: "php/submit-feedback.php", // Update with your PHP file handling feedback submission
                data: {
                    eventID: eventID,
                    feedbackName: feedbackName,
                    feedbackMessage: feedbackMessage
                },
                success: function (response) {
                    response = JSON.parse(response);
                    if (response.success) {
                        // Optionally, you can update the UI to reflect the new feedback
                        alert("Feedback submitted successfully!");
                        // Reload the page after a successful feedback submission
                        location.reload();
                    } else {
                        console.log(response.error);
                        alert("Failed to submit feedback. Please try again.");
                    }
                }
            });
        });
    } else {
        console.error("EventID not provided.");
    }
});
