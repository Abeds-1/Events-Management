<?php
header('Content-Type: application/json');

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

// Check if it's a POST request and 'eventID' is set
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_GET['eventID'])) {
    // Sanitize user input
    $eventID = intval($_GET['eventID']);
    $userID = isset($_COOKIE['userID']) ? $_COOKIE['userID'] : null;

    // Fetch event name
    $eventNameQuery = $conn->query("SELECT EventName FROM events WHERE EventID = $eventID");

    if ($eventNameQuery) {
        $eventNameRow = $eventNameQuery->fetch_assoc();
        $eventName = $eventNameRow['EventName'];

        // Fetch participants of the event using direct query
        $participantsQuery = $conn->query("SELECT UserID FROM registeredevents WHERE EventID = $eventID");

        if ($participantsQuery) {
            // Notify participants
            $notificationText = "The event '$eventName' has been deleted by the creator.";

            // Insert notifications into the notifications table for each participant
            while ($participantRow = $participantsQuery->fetch_assoc()) {
                $participantID = $participantRow['UserID'];

                // Insert notification using prepared statement
                $insertNotificationQuery = $conn->prepare("INSERT INTO notifications (UserID, NotificationText) VALUES (?, ?)");
                $insertNotificationQuery->bind_param("is", $participantID, $notificationText);
                $insertNotificationQuery->execute();

                if (!$insertNotificationQuery) {
                    echo json_encode(['success' => false, 'message' => 'Error inserting notifications: ' . $conn->error]);
                    exit();
                }
            }

            // Delete the event from registeredevents table using direct query
            $deleteRegisteredEventQuery = $conn->query("DELETE FROM registeredevents WHERE EventID = $eventID");

            if (!$deleteRegisteredEventQuery) {
                echo json_encode(['success' => false, 'message' => 'Error deleting from registeredevents: ' . $conn->error]);
            } else {
                // Perform the deletion in the events table using direct query
                $deleteEventQuery = $conn->query("DELETE FROM events WHERE EventID = $eventID AND CreatorID = $userID AND EventDate > CURDATE()");

                if (!$deleteEventQuery) {
                    echo json_encode(['success' => false, 'message' => 'Error deleting event: ' . $conn->error]);
                } else {
                    echo json_encode(['success' => true]);
                }
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error fetching participants: ' . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error fetching event name: ' . $conn->error]);
    }
}
?>
