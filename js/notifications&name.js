// Function to update the notification dropdown with user information and notifications
function updateNotificationDropdown() {
  // Make an AJAX request to fetch notifications and user's name for the logged-in user
  $.ajax({
      type: 'POST',
      url: 'php/fetch-notifications&name.php',
      dataType: 'xml',
      success: function (xml) {
          // Select necessary HTML elements
          const notificationList = $('#notificationList');
          const notificationBadge = $('#notificationBadge');
          const userElement = $('#name');

          // Clear existing notifications
          notificationList.empty();

          // Parse XML response for user information
          const user = $(xml).find('user');
          const firstName = user.find('firstName').text();
          const lastName = user.find('lastName').text();

          // Update the user's name in the HTML
          userElement.html('<span class="mr-2 d-none d-lg-inline text-gray-600 small">' + firstName + ' ' + lastName + '</span>');

          // Parse XML response for notifications
          const notifications = $(xml).find('notification');

          notifications.each(function () {
              // Extract notification text
              const notificationText = $(this).text();

              // Create the 'a' element for the notification item
              const item = $('<a>')
                  .addClass('dropdown-item notification-item') // Apply the notification-item class
                  .attr('href', '#')
                  .text(notificationText);

              // Append the 'a' element to the notificationList
              notificationList.append(item);
          });

          // Update the notification badge count
          notificationBadge.text(notifications.length);
      },
      error: function (error) {
          console.error('Error fetching notifications:', error);
      }
  });
}

// Update notifications on page load
updateNotificationDropdown();
