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

// Get data from the AJAX request
$data = json_decode(file_get_contents("php://input"));

// Sanitize the data to prevent SQL injection
$eventName = $conn->real_escape_string($data->eventName);
$eventDate = $conn->real_escape_string($data->eventDate);
$eventTime = $conn->real_escape_string($data->eventTime);
$eventType = $conn->real_escape_string($data->eventType);
$eventLocation = $conn->real_escape_string($data->eventLocation);
$eventDescription = $conn->real_escape_string($data->eventDescription);
$userID = $_COOKIE['userID'];

// Insert the event into the database
$sql = "INSERT INTO events (EventName, EventDate, event_time, Location, description, CreatorID) 
        VALUES ('$eventName', '$eventDate', '$eventTime', '$eventLocation', '$eventDescription', '$userID')";

if ($conn->query($sql) === TRUE) {
    // Return success message or any other response as needed
    echo json_encode(["status" => "success", "message" => "Event created successfully"]);
} else {
    // Return error message if the insertion fails
    echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
}

// Close the database connection
$conn->close();
?>
