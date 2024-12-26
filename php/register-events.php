<?php
// Database connection
$servername = "localhost";
$username = "eventsorganizerapp";
$password = "events1234";
$database = "eventsorganizer";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the user is logged in
if (isset($_COOKIE['userID'])) {
    $userId = $_COOKIE['userID'];
    // Get the event ID from the Ajax request
    $eventId = $_POST['eventId'];

    // Perform the registration in the database
    // Insert the data into the registered events table
    $query = "INSERT INTO registeredevents (UserID, EventID) VALUES ('$userId', '$eventId')";

    $response = array();
    $result = $conn->query($query);
    if ($result) {
        // Registration successful
        $response['success'] = true;
    } else {
        // Registration failed
        $response['success'] = false;
    }
} else {
    // User not logged in
    $response['success'] = false;
}

// Send the JSON response back to the JavaScript
echo json_encode($response);

// Close the database connection
$conn->close();
?>
