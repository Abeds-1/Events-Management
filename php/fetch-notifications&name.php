<?php

// php/fetch_notifications.php

// Get user ID from cookie
$userID = $_COOKIE['userID'];

// Check if the user ID is set and not empty
if ($userID) {
    // Establish a database connection
    $servername = "localhost";
    $username = "eventsorganizerapp";
    $password = "events1234";
    $database = "eventsorganizer";

    $conn = new mysqli($servername, $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Fetch user's name from the users table
    $nameQuery = "SELECT FirstName, LastName FROM users WHERE UserID = $userID";
    $nameResult = $conn->query($nameQuery);
    
    if ($nameResult->num_rows > 0) {
        $nameRow = $nameResult->fetch_assoc();
        $firstName = $nameRow['FirstName'];
        $lastName = $nameRow['LastName'];

        // Output user's name and notifications in XML format
        header('Content-Type: text/xml');
        echo '<?xml version="1.0" encoding="UTF-8"?><data>';

        // Output user's name
        echo '<user>';
        echo '<firstName>' . htmlspecialchars($firstName) . '</firstName>';
        echo '<lastName>' . htmlspecialchars($lastName) . '</lastName>';
        echo '</user>';

        // Fetch notifications for the user from the notifications table
        $sql = "SELECT NotificationText FROM notifications WHERE UserID = $userID";
        $result = $conn->query($sql);

        // Output notifications
        echo '<notifications>';
        while ($row = $result->fetch_assoc()) {
            echo '<notification>' . htmlspecialchars($row['NotificationText']) . '</notification>';
        }
        echo '</notifications>';

        echo '</data>';
    }

    // Close the database connection
    $conn->close();
} else {
    // Handle the case where the user ID is not set or empty
    echo 'Invalid user ID';
}

?>
