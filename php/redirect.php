<?php
// Function to check if the user is logged in and redirect accordingly
function checkLoginAndRedirect() {
    // Check if the cookie is set
    if (isset($_COOKIE['userID'])) {
        // If the cookie is set, redirect to a page for logged-in users (e.g., dashboard)
        header('Location: ../dashboard.html');
        exit(); // Ensure no further code is executed after the redirection
    } else {
        // If the cookie is not set, redirect to a page for non-logged-in users (e.g., login page)
        header('Location: ../login.html');
        exit();
    }
}

// Call the checkLoginAndRedirect function at the beginning of your web app
// This could be in your index.php or another entry point for your application
checkLoginAndRedirect();
?>
