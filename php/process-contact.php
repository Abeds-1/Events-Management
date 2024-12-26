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

// Get form data from AJAX request
$name = $_POST['name'];
$email = $_POST['email'];
$message = $_POST['message'];

// Insert data into the contactus table
$sql = "INSERT INTO contactus (name, email, message) VALUES ('$name', '$email', '$message')";

// Check if the query was executed successfully
if ($conn->query($sql) === TRUE) {
    // If successful, echo a success message
    echo "Form submitted successfully!";
} else {
    // If an error occurred, echo an error message along with details
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Close the database connection
$conn->close();
?>
