// This function will be called when the second page is closed or navigated away
function reloadFirstPage() {
    location.reload(true); // Reloads the page from the server
}

// Attach the function to the onunload event
window.onunload = reloadFirstPage;

function searchEvents() {
    var searchQuery = document.getElementById("searchInput").value;

    $.ajax({
        type: "POST",
        url: "php/search-script.php",
        data: { searchQuery: searchQuery },
        dataType: "json",
        success: function (response) {
            var searchResultsDropdown = $("#searchResultsDropdown");
            searchResultsDropdown.empty(); // Clear previous results

            if (response.length > 0) {
                // If there are events, create HTML elements
                var resultList = $('<ul>', { class: 'event-list dropdown-list' });

                $.each(response, function (index, event) {
                    var listItem = $('<li>', { class: 'event-item dropdown-item' });
                    var eventLink = $('<a>', {
                        href: "event-page.html?eventID=" + event.EventID + "&context=explore",
                        class: "event-link",
                        text: event.EventName
                    });

                    listItem.append(eventLink);
                    resultList.append(listItem);
                });

                searchResultsDropdown.append(resultList);
                searchResultsDropdown.show(); // Show the dropdown
            } else {
                searchResultsDropdown.hide(); // Hide the dropdown if no events found
            }
        },
        error: function (error) {
            console.error("Error fetching events:", error);
        }
    });
}

// Add a blur event listener to hide the dropdown when focus is removed
$("#searchInput").blur(function () {
    $("#searchResultsDropdown").hide();
});

// Add a focus event listener to show the dropdown when the input is focused
$("#searchInput").focus(function () {
    searchEvents(); // Show the dropdown with existing search results
});
