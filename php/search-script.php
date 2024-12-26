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

// Check if the searchQuery is set
if (isset($_POST['searchQuery'])) {
    $searchQuery = $_POST['searchQuery'];

    // Retrieve events based on the search query
    $query = "SELECT * FROM events
              WHERE EventDate >= '$currentDate'
              AND EventID NOT IN (SELECT EventID FROM registeredevents WHERE UserID = '$userId')
              AND EventName LIKE '%$searchQuery%'"; // Assuming EventName is the column name for event names

    $result = $conn->query($query);

    $events = array();
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }

    // Send the JSON response back to the JavaScript
    echo json_encode($events);
} else {
    // Handle the case when no search query is provided

    // Retrieve events without search
    $query = "SELECT * FROM events
              WHERE EventDate >= '$currentDate'
              AND EventID NOT IN (SELECT EventID FROM registeredevents WHERE UserID = '$userId')";

    $result = $conn->query($query);

    $events = array();
    while ($row = $result->fetch_assoc()) {
        $events[] = $row;
    }

    // Send the JSON response back to the JavaScript
    echo json_encode($events);
}

// Close the database connection
$conn->close();
?>
