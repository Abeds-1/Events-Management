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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['eventID'], $_POST['feedbackName'], $_POST['feedbackMessage'])) {
        $eventID = $_POST['eventID'];
        $feedbackName = $_POST['feedbackName'];
        $feedbackMessage = $_POST['feedbackMessage'];

        // Assuming you have the UserID available through the cookie
        $userID = $_COOKIE['userID'];

        // Insert the feedback into the database
        $query = "INSERT INTO feedbacks (UserID, EventID, FeedbackText) 
                  VALUES ($userID, $eventID, '$feedbackMessage')";
        $result = mysqli_query($connection, $query);

        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['error' => 'Failed to submit feedback.']);
        }
    } else {
        echo json_encode(['error' => 'Incomplete parameters for feedback submission.']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method.']);
}
?>
