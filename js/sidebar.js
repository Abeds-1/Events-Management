document.addEventListener("DOMContentLoaded", function() {
    // Get references to DOM elements
    var sidebar = document.getElementById('accordionSidebar');
    var contentWrappers = document.getElementsByClassName('content-wrapper');
    var sidebarToggleButton = document.getElementById('sidebarToggleTop');

    // Function to adjust sidebar and content wrapper widths
    function adjustSidebar() {
        var sidebarWidth = sidebar.offsetWidth;
        if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
            for (var i = 0; i < contentWrappers.length; i++) {
                contentWrappers[i].style.marginLeft = sidebarWidth + 'px';
            }
        } else {
            sidebar.classList.add('collapsed');
            for (var i = 0; i < contentWrappers.length; i++) {
                contentWrappers[i].style.marginLeft = '0';
            }
        }
    }

    // Event listener for sidebar toggle button
    sidebarToggleButton.addEventListener('click', function() {
        adjustSidebar();
    });

    var t = false;
    // Event listener for window resize
    window.addEventListener('resize', function(){
        if (!t && window.innerWidth <= 650) {
            t = true;
            sidebar.classList.add('collapsed');
            for (var i = 0; i < contentWrappers.length; i++) {
                contentWrappers[i].style.marginLeft = '0';  
            }
        } else if (t && window.innerWidth > 650) {
            t = false;
            sidebar.classList.remove('collapsed');
            var sidebarWidth = sidebar.offsetWidth;
            for (var i = 0; i < contentWrappers.length; i++) {
                contentWrappers[i].style.marginLeft = sidebarWidth + 'px';
            }
        }
    });
});
