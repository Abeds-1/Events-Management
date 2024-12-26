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

// Get eventID from the POST data, ensuring it is an integer
$eventID = intval($_POST['eventID']);

// Delete the event from the database
$sql = "DELETE FROM registeredevents WHERE UserID = $userID AND EventID = $eventID";

$xmlString = '<response>';
if ($conn->query($sql) === TRUE) {
    // Event deleted successfully
    $xmlString .= '<success>true</success>';
} else {
    // Failed to delete event
    $xmlString .= '<success>false</success>';
    $xmlString .= '<message>' . htmlspecialchars($conn->error) . '</message>';
}
$xmlString .= '</response>';

// Output the XML response as plain text
header('Content-Type: text/xml');
echo $xmlString;

// Close the database connection
mysqli_close($conn);
?>
