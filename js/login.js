$(document).ready(function () {
    // Select the login form
    const loginForm = $("#user");

    // Set up form submission handling
    loginForm.submit(function (e) {
        // Prevent the default form submission
        e.preventDefault();

        // Extract email and password from the form
        const email = $("#exampleInputEmail").val();
        const password = $("#exampleInputPassword").val();

        // Make an AJAX request using jQuery
        $.ajax({
            type: "POST",
            url: "php/login_validator.php",
            data: { Email: email, Password: password },
            dataType: "xml",
            success: function (xml) {
                // Parse the XML response
                const success = $(xml).find('success').text() === 'true';
                const message = $(xml).find('message').text();

                // Check if login was successful
                if (success) {
                    // Redirect to redirect.php on successful login
                    window.location.href = "php/redirect.php";
                } else {
                    // Display the error message in the HTML
                    $("#errorMessage").html(message);
                }
            },
            error: function (xhr, status, error) {
                // Log any errors that occur during the AJAX request
                console.error("XHR status: " + status);
                console.error("XHR error: " + error);
                console.error(xhr.responseText);
            }
        });
    });
});
