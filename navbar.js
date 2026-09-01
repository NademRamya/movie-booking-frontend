/* MOVIEBOOK NAVBAR */

document.addEventListener("DOMContentLoaded", function () {


var navLinks = document.querySelector(".nav-links");

if (navLinks === null) {
    return;
}

var storedUser = localStorage.getItem("loggedInUser");

if (storedUser !== null) {

    try {

        var user = JSON.parse(storedUser);

        navLinks.innerHTML =
            '<a href="index.html">Home</a>' +
            '<a href="index.html#movies">Movies</a>' +
            '<a href="bookings.html">Bookings</a>' +
            '<span class="user-name">User: ' + user.name + '</span>' +
            '<a href="#" id="logoutLink">Logout</a>';

        var logoutLink = document.getElementById("logoutLink");

        if (logoutLink !== null) {

            logoutLink.addEventListener("click", function (event) {

                event.preventDefault();

                localStorage.removeItem("loggedInUser");
                localStorage.removeItem("userId");
                localStorage.removeItem("userName");
                localStorage.removeItem("userEmail");

                window.location.href = "index.html";

            });

        }

    } catch (error) {

        console.error("User data error:", error);

        localStorage.removeItem("loggedInUser");

    }

}


});
