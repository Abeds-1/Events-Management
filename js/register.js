$(document).ready(function () {
    // Submit event handler for user registration form
    $("#user").submit(function (event) {
        event.preventDefault();

        // Extract form field values
        var firstName = $("#exampleFirstName").val();
        var lastName = $("#exampleLastName").val();
        var email = $("#exampleInputEmail").val();
        var password = $("#exampleInputPassword").val();
        var repeatPassword = $("#exampleRepeatPassword").val();

        // Clear previous error messages
        $(".error-message").empty();

        // Validate if passwords match
        if (password !== repeatPassword) {
            $("#repeatPasswordError").text('Passwords do not match.');
            return; // Do not proceed with the request if passwords don't match
        }

        // Make an AJAX request to register the user
        $.ajax({
            type: "POST",
            url: "php/register_validator.php",
            data: {
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Password: password
            },
            dataType: "xml",
            success: function (response) {
                var $xml = $(response);
                var success = $xml.find('success').text();

                if (success === 'true') {
                    // Successful registration
                    alert("Account created successfully.");
                    window.location.href = "php/redirect.php";
                } else {
                    // Display field-specific error messages
                    $xml.find('*').filter(function() {
                        return $(this).prop("tagName").toLowerCase().includes('error');
                    }).each(function () {
                        var fieldName = $(this).prop("tagName");
                        var errorMessage = $(this).text();
                        $("#" + fieldName).text(errorMessage).css('color', 'red');
                    });
                }
            },
            error: function(xhr, status, error) {
                // Log any errors that occur during the AJAX request
                console.error("XHR status: " + status);
                console.error("XHR error: " + error);
                console.error(xhr.responseText);
            }
        });
    });
});
