$(document).ready(function() {
    // Submit form using AJAX
    $('#contactForm').submit(function(e) {
        e.preventDefault(); // Prevent the form from submitting in the traditional way
        // Get form data
        var formData = {
            name: $('#contactForm input[name="Your Name"]').val(),
            email: $('#contactForm input[name="Your Email"]').val(),
            message: $('#contactForm textarea[name="Your Message"]').val()
        };

        // Send AJAX request
        $.ajax({
            type: 'POST',
            url: 'php/process-contact.php', // Replace with the actual file handling the form submission
            data: formData,
            success: function(response) {
                // Handle success, e.g., display a success message
                console.log(response);
                location.reload();
            },
            error: function(error) {
                // Handle errors, e.g., display an error message
                console.error(error);
            }
        });
    });
});
