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

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $userID = $_COOKIE['userID'];

    // Fetch events created by the user that are after the current date
    $currentDate = date('Y-m-d');
    $query = "SELECT * FROM events WHERE CreatorID = $userID AND EventDate > '$currentDate'";
    $result = mysqli_query($conn, $query);

    if ($result) {
        // Create a new SimpleXMLElement to build the XML response
        $xml = new SimpleXMLElement('<events/>');

        // Loop through each row in the result set and add event details to the XML
        while ($row = mysqli_fetch_assoc($result)) {
            $event = $xml->addChild('event');
            $event->addChild('EventID', $row['EventID']);
            $event->addChild('EventName', $row['EventName']);
            $event->addChild('EventDate', $row['EventDate']);
            // Add other event details as needed
        }

        // Add eventCount to the XML
        $xml->addChild('eventCount', mysqli_num_rows($result));

        // Set the Content-type header to indicate XML response
        header('Content-type: text/xml');

        // Output the XML content
        echo $xml->asXML();
    } else {
        // Output an error message if there's an issue with the database query
        echo "<error>Error fetching events: " . mysqli_error($conn) . "</error>";
    }
} else {
    // Output an error message for invalid request method
    echo "<error>Invalid request</error>";
}
?>
