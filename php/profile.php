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

// Initialize response array
$response = [];

// Get userID from the cookie
if (isset($_COOKIE['userID'])) {
    $userID = $_COOKIE['userID'];

    // Retrieve user information from the database
    $userQuery = "SELECT * FROM users WHERE UserID = $userID";
    $userResult = $conn->query($userQuery);

    if ($userResult->num_rows > 0) {
        $user = $userResult->fetch_assoc();
        $response['firstName'] = $user['FirstName'];
        $response['lastName'] = $user['LastName'];
        $response['email'] = $user['Email'];

        // Retrieve registered events for the user from the database
        $eventsQuery = "SELECT events.EventName, events.EventDate, events.Location 
                        FROM registeredevents 
                        INNER JOIN events ON registeredevents.EventID = events.EventID 
                        WHERE registeredevents.UserID = $userID";

        $eventsResult = $conn->query($eventsQuery);
        $registeredEvents = [];

        if ($eventsResult->num_rows > 0) {
            while ($event = $eventsResult->fetch_assoc()) {
                $registeredEvents[] = $event;
            }
        }

        $response['registeredEvents'] = $registeredEvents;
    }
}

// Close the database connection
$conn->close();

// Send JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>
