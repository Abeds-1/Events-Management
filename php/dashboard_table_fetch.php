<?php
// Database connection
$servername = "localhost";
$username = "eventsorganizerapp";
$password = "events1234";
$database = "eventsorganizer";

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get userID from the cookie
$userID = $_COOKIE['userID'];

// Fetch registered events for the user from the database, excluding events created by the user
$sql = "SELECT e.EventID, e.EventName, e.EventDate, e.Location
        FROM events e
        INNER JOIN registeredevents re ON e.EventID = re.EventID
        WHERE re.UserID = $userID
        AND e.CreatorID != $userID";

$result = mysqli_query($conn, $sql);

// Fetch the count of registered events for the user, excluding events created by the user
$countSql = "SELECT COUNT(*) AS eventCount
              FROM events e
              INNER JOIN registeredevents re ON e.EventID = re.EventID
              WHERE re.UserID = $userID
              AND e.CreatorID != $userID";

$countResult = mysqli_query($conn, $countSql);
$countRow = mysqli_fetch_assoc($countResult);
$eventCount = $countRow['eventCount'];

// Set content type to XML
header('Content-Type: application/xml');

// Output the XML declaration
echo '<?xml version="1.0" encoding="UTF-8"?>';

// Start the root element
echo '<events>';

while ($row = mysqli_fetch_assoc($result)) {
    // Output XML elements for each event
    echo '<event>';
    echo '<EventName>' . htmlspecialchars($row['EventName']) . '</EventName>';
    echo '<EventDate>' . htmlspecialchars($row['EventDate']) . '</EventDate>';
    echo '<Location>' . htmlspecialchars($row['Location']) . '</Location>';
    echo '<EventID>' . htmlspecialchars($row['EventID']) . '</EventID>';
    echo '</event>';
}

// Output the count of registered events
echo '<eventCount>' . htmlspecialchars($eventCount) . '</eventCount>';

// End the root element
echo '</events>';

// Close the database connection
mysqli_close($conn);
?>
