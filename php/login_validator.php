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

// Function to validate email format
function isValidEmail($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Function to validate password
function isValidPassword($password)
{
    // For example, at least one uppercase letter, one lowercase letter, and one digit
    return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/', $password) && strlen($password) >= 8;
}

// Function to set the cookie with the user ID
function setCookieWithUserID($userID) {
    $expirationTime = time() + (7 * 24 * 60 * 60); // Set expiration time to one week

    // Set the cookie with the user ID
    setcookie('userID', $userID, $expirationTime, '/');
}


// Validate email and password from POST request
$email = $_POST['Email'];
$password = $_POST['Password'];

if (empty($email) || empty($password)) {
    echo "<response><success>false</success><message>Email and password cannot be empty.</message></response>";
} elseif (!isValidEmail($email)) {
    echo "<response><success>false</success><message>Invalid email format.</message></response>";
} elseif (!isValidPassword($password)) {
    echo "<response><success>false</success><message>Password must have at least one uppercase letter, one lowercase letter, and one digit, and be at least 8 characters long.</message></response>";
} else {
    // Check if the user exists in the database
    $sql = "SELECT * FROM users WHERE Email = '$email'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // User found, now verify the password
        $row = $result->fetch_assoc();
        $storedHashedPassword = $row['Password'];

        if (password_verify($password, $storedHashedPassword)) {
            setCookieWithUserID($row["UserID"]);
            echo "<response><success>true</success><message>Login successful.</message></response>";
        } else {
            echo "<response><success>false</success><message>Invalid email or password.</message></response>";
        }
    } else {
        echo "<response><success>false</success><message>Invalid email or password.</message></response>";
    }
}

$conn->close();
?>
