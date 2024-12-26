<?php
// Function to log out and redirect based on the presence of the cookie
function logoutAndRedirect() {
    // Check if the cookie is set
    if (isset($_COOKIE['userID'])) {
        // If the cookie is set, destroy it
        setcookie('userID', '', time() - 3600, '/');
        unset($_COOKIE['userID']);
        
        // Redirect to a specific page after logout (e.g., the home page)
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
}

// Call the logoutAndRedirect function when the user initiates a logout action
// For example, when the user clicks on a "Logout" button
logoutAndRedirect();
?>