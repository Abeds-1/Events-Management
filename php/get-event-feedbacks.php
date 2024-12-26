<?php
// Database connection
$servername = "localhost";
$username = "eventsorganizerapp";
$password = "events1234";
$database = "eventsorganizer";

$connection = new mysqli($servername, $username, $password, $database);

// Check connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

if (isset($_GET['eventID'])) {
    $eventID = $_GET['eventID'];

    // Fetch feedbacks for the event from the database
    $query = "SELECT feedbacks.*, users.FirstName as UserName 
              FROM feedbacks 
              JOIN users ON feedbacks.UserID = users.UserID 
              WHERE EventID = $eventID";
    $result = mysqli_query($connection, $query);

    if ($result) {
        $feedbacks = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $feedbacks[] = $row;
        }
        echo json_encode($feedbacks);
    } else {
        echo json_encode(['error' => 'Failed to fetch feedbacks.']);
    }
} else {
    echo json_encode(['error' => 'EventID parameter not provided.']);
}

// Close the database connection
$connection->close();
?>
