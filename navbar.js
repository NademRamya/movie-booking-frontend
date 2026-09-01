/* =========================================================
   MOVIEBOOK NAVBAR
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelector(".nav-links");

    if (!navLinks) {
        return;
    }


    /* ===============================
       GET LOGGED-IN USER
    =============================== */

    const storedUser =
        localStorage.getItem("loggedInUser");


    /* ===============================
       USER IS LOGGED IN
    =============================== */

    if (storedUser) {

        try {

            const user =
                JSON.parse(storedUser);


            navLinks.innerHTML = `

                <a href="index.html">
                    Home
                </a>

                <a href="index.html#movies">
                    Movies
                </a>

                <a href="bookings.html">
                    Bookings
                </a>

                <span class="user-name">
                    👤 ${user.name}
                </span>

                <a href="#" id="logoutLink">
                    Logout
                </a>

            `;


            /* ===============================
               LOGOUT
            =============================== */

            document
                .getElementById("logoutLink")
                .addEventListener("click", function (event) {

                    event.preventDefault();


                    localStorage.removeItem(
                        "loggedInUser"
                    );


                    window.location.href =
                        "index.html";

                });


        } catch (error) {

            console.error(
                "User data error:",
                error
            );

            localStorage.removeItem(
                "loggedInUser"
            );

        }

    }

});