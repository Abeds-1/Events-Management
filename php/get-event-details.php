<?php
// Database connection
$servername = "localhost";
$username = "eventsorganizerapp";
$password = "events1234";
$database = "eventsorganizer";

// Create connection
$connection = new mysqli($servername, $username, $password, $database);

// Check connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

if (isset($_GET['eventID'])) {
    $eventID = $_GET['eventID'];
    
    // Fetch event details from the database
    $query = "SELECT * FROM events WHERE EventID = $eventID";
    $result = mysqli_query($connection, $query);

    if ($result) {
        $eventDetails = mysqli_fetch_assoc($result);
        echo json_encode($eventDetails);
    } else {
        echo json_encode(['error' => 'Failed to fetch event details.']);
    }
} else {
    echo json_encode(['error' => 'EventID parameter not provided.']);
}

// Close the database connection
$connection->close();
?>
