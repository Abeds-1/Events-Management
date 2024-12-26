document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        validateForm();
    });

    function validateForm() {
        const eventName = document.getElementById('eventName');
        const eventDate = document.getElementById('eventDate');
        const eventTime = document.getElementById('eventTime');
        const eventType = document.getElementById('eventType');
        const eventLocation = document.getElementById('eventLocation');
        const eventDescription = document.getElementById('eventDescription');

        clearValidationMessages();
        let isValid = true;

        if (!eventName.value.trim()) {
            displayError(eventName, 'Event Name is required');
            isValid = false;
        }

        if (!eventDate.value) {
            displayError(eventDate, 'Event Date is required');
            isValid = false;
        }

        if (!eventTime.value) {
            displayError(eventTime, 'Event Time is required');
            isValid = false;
        }

        if (eventType.selectedIndex === 0) {
            displayError(eventType, 'Please select an Event Type');
            isValid = false;
        }

        if (!eventLocation.value.trim()) {
            displayError(eventLocation, 'Event Location is required');
            isValid = false;
        }

        if (!eventDescription.value.trim()) {
            displayError(eventDescription, 'Event Description is required');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // If all validations pass, submit the form
        submitForm();
    }

    function displayError(element, message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'text-danger';
        errorContainer.innerText = message;

        element.parentNode.appendChild(errorContainer);
    }

    function clearValidationMessages() {
        const errorMessages = document.querySelectorAll('.text-danger');
        errorMessages.forEach(function (errorMessage) {
            errorMessage.remove();
        });
    }

    function submitForm() {
        // Get UserID from PHP and insert the event using a single AJAX call
        $.ajax({
            url: 'php/insert-event.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                eventName: document.getElementById('eventName').value,
                eventDate: document.getElementById('eventDate').value,
                eventTime: document.getElementById('eventTime').value,
                eventType: document.getElementById('eventType').value,
                eventLocation: document.getElementById('eventLocation').value,
                eventDescription: document.getElementById('eventDescription').value,
            }),
            success: function (response) {
                // Redirect to the dashboard page
                window.location.href = 'dashboard.html';
                // Show success alert
                alert('Event created successfully! Redirecting to the dashboard.');
            },
            error: function (error) {
                console.error('Error:', error);
            }
        });
    }

});
