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

// Get the current date
$currentDate = date("Y-m-d");

// Get the user ID from the cookie
$userId = $_COOKIE['userID'];

// Retrieve events that are still active, not already registered by the user, and not created by the user
$query = "SELECT * FROM events
          WHERE EventDate >= '$currentDate'
          AND EventID NOT IN (SELECT EventID FROM registeredevents WHERE UserID = '$userId')
          AND CreatorID != '$userId'";

$result = $conn->query($query);

$events = array();
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

// Send the JSON response back to the JavaScript
echo json_encode($events);

// Close the database connection
$conn->close();
?>
