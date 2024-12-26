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
$firstName = $_POST['FirstName'];
$lastName = $_POST['LastName'];

// Start building the XML response
$response = '<?xml version="1.0" encoding="UTF-8"?>';
$response .= '<response>';
$response .= '<success>false</success>';
$response .= '<message></message>';

// Individual field validations
if (!isset($firstName) || trim($firstName) === "") {
    $response .= '<firstNameError>First Name is required.</firstNameError>';
}

if (!isset($lastName) || trim($lastName) === "") {
    $response .= '<lastNameError>Last Name is required.</lastNameError>';
}

if (!isset($email) || trim($email) === "") {
    $response .= '<emailError>Email is required.</emailError>';
} elseif (!isValidEmail($email)) {
    $response .= '<emailError>Invalid email format.</emailError>';
}

if (!isset($password) || trim($password) === "") {
    $response .= '<passwordError>Password is required.</passwordError>';
} elseif (!isValidPassword($password)) {
    $response .= '<passwordError>At least 8 characters including 1 uppercase, 1 lowercase, 1 digit.</passwordError>';
}

// Check if the user exists in the database
$sql = "SELECT * FROM users WHERE Email = '$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $response .= '<emailError>Email already exists.</emailError>';
}

$response .= '</response>';

// If there are no errors, proceed with account creation
if (substr_count($response, '<') == 7) { // Counting the opening '<' tags
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $sqlInsert = "INSERT INTO users (FirstName, LastName, Password, Email) VALUES ('$firstName', '$lastName', '$hashedPassword', '$email')";

    if ($conn->query($sqlInsert) === TRUE) {
        $sql = "SELECT * FROM users WHERE Email = '$email'";
        $result = $conn->query($sql);
        $row = $result->fetch_assoc();
        setCookieWithUserID($row["UserID"]);
        $response = '<?xml version="1.0" encoding="UTF-8"?><response><success>true</success><message>Account created successfully.</message></response>';
    } else {
        $response = '<?xml version="1.0" encoding="UTF-8"?><response><success>false</success><message>Error creating account: ' . $conn->error . '</message></response>';
    }
}

echo $response;

$conn->close();
?>
