/* =====================================================
   MOVIEBOOK - MY BOOKINGS
===================================================== */


/* =====================================================
   LOAD BOOKINGS
===================================================== */

async function loadBookings() {

    const bookingsContainer =
        document.getElementById("bookingsContainer");


    /* ===============================
       CHECK LOGIN
    =============================== */

    const storedUser =
        localStorage.getItem("loggedInUser");


    if (!storedUser) {

        bookingsContainer.innerHTML = `

            <div class="no-bookings">

                <h2>
                    Please Login
                </h2>

                <p>
                    You need to login to view your bookings.
                </p>

                <button onclick="goToLogin()">
                    Login
                </button>

            </div>

        `;

        return;
    }


    /* ===============================
       GET LOGGED-IN USER
    =============================== */

    let user;

    try {

        user = JSON.parse(storedUser);

    } catch (error) {

        console.error(
            "User data error:",
            error
        );

        localStorage.removeItem(
            "loggedInUser"
        );

        window.location.href =
            "login.html";

        return;
    }


    console.log(
        "Logged-in user:",
        user
    );


    /* ===============================
       SHOW LOADING
    =============================== */

    bookingsContainer.innerHTML = `

        <div class="loading">
            Loading your bookings...
        </div>

    `;


    try {

        /* ===============================
           GET ALL BOOKINGS
        =============================== */

        const response =
            await fetch(
                "http://localhost:8080/bookings"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load bookings"
            );

        }


        const bookings =
            await response.json();


        console.log(
            "All bookings:",
            bookings
        );


        /* =================================================
           FILTER USER BOOKINGS
           
           IMPORTANT:
           This assumes your Booking response contains
           a user object such as:
           
           booking.user.id
           
           ================================================= */

        const userBookings =
            bookings.filter(function (booking) {

                return booking.user &&
                       booking.user.id === user.id;

            });


        console.log(
            "User bookings:",
            userBookings
        );


        /* ===============================
           NO BOOKINGS
        =============================== */

        if (userBookings.length === 0) {

            bookingsContainer.innerHTML = `

                <div class="no-bookings">

                    <div class="empty-icon">
                        🎟️
                    </div>

                    <h2>
                        No Bookings Yet
                    </h2>

                    <p>
                        You haven't booked any movie tickets yet.
                    </p>

                    <button onclick="goToMovies()">
                        Explore Movies
                    </button>

                </div>

            `;

            return;
        }


        /* ===============================
           DISPLAY BOOKINGS
        =============================== */

        bookingsContainer.innerHTML = "";


        userBookings.forEach(function (booking) {

            const bookingCard =
                document.createElement("div");


            bookingCard.classList.add(
                "booking-ticket"
            );


            /* ===============================
               BOOKING DATA
            =============================== */

            const movieName =
                booking.show &&
                booking.show.movie
                    ? booking.show.movie.title
                    : "Movie";


            const theatreName =
                booking.show &&
                booking.show.theatre
                    ? booking.show.theatre.name
                    : "Theatre";


            const showTime =
                booking.show &&
                booking.show.showTime
                    ? booking.show.showTime
                    : "Not available";


            const bookingDate =
                booking.bookingDate
                    ? booking.bookingDate
                    : "Not available";


            const status =
                booking.status
                    ? booking.status
                    : "CONFIRMED";


            let seatNumbers =
                "No seats";


            if (
                booking.seats &&
                booking.seats.length > 0
            ) {

                seatNumbers =
                    booking.seats
                        .map(function (seat) {

                            return seat.seatNumber;

                        })
                        .join(", ");

            }


            /* ===============================
               STATUS CLASS
            =============================== */

            let statusClass =
                "status-confirmed";


            if (
                status.toLowerCase()
                    .includes("cancel")
            ) {

                statusClass =
                    "status-cancelled";

            }


            /* ===============================
               CANCEL BUTTON
            =============================== */

            let cancelButton = "";


            if (
                !status.toLowerCase()
                    .includes("cancel")
            ) {

                cancelButton = `

                    <button
                        class="cancel-btn"
                        onclick="cancelBooking(${booking.id})">

                        Cancel Booking

                    </button>

                `;

            }


            /* ===============================
               CREATE TICKET
            =============================== */

            bookingCard.innerHTML = `

                <div class="ticket-top">

                    <div>

                        <span class="ticket-label">
                            MOVIEBOOK
                        </span>

                        <h2>
                            🎬 ${movieName}
                        </h2>

                    </div>

                    <div class="booking-id">

                        Booking ID

                        <strong>
                            #${booking.id}
                        </strong>

                    </div>

                </div>


                <div class="ticket-divider">
                </div>


                <div class="ticket-details">


                    <div class="ticket-detail">

                        <span>
                            THEATRE
                        </span>

                        <strong>
                            ${theatreName}
                        </strong>

                    </div>



                    <div class="ticket-detail">

                        <span>
                            SHOW TIME
                        </span>

                        <strong>
                            ${showTime}
                        </strong>

                    </div>



                    <div class="ticket-detail">

                        <span>
                            SEATS
                        </span>

                        <strong>
                            ${seatNumbers}
                        </strong>

                    </div>



                    <div class="ticket-detail">

                        <span>
                            BOOKING DATE
                        </span>

                        <strong>
                            ${bookingDate}
                        </strong>

                    </div>


                </div>


                <div class="ticket-bottom">


                    <span class="${statusClass}">

                        ${status}

                    </span>


                    <div class="ticket-actions">

                        ${cancelButton}

                    </div>


                </div>

            `;


            bookingsContainer.appendChild(
                bookingCard
            );

        });


    } catch (error) {

        console.error(
            "Bookings Error:",
            error
        );


        bookingsContainer.innerHTML = `

            <div class="no-bookings">

                <h2>
                    Unable to Load Bookings
                </h2>

                <p>
                    Please make sure the Spring Boot
                    backend is running.
                </p>

                <button onclick="loadBookings()">
                    Try Again
                </button>

            </div>

        `;

    }

}



/* =====================================================
   CANCEL BOOKING
===================================================== */

async function cancelBooking(bookingId) {


    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!confirmCancel) {

        return;

    }


    try {

        const response =
            await fetch(
                `http://localhost:8080/bookings/${bookingId}/cancel`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to cancel booking"
            );

        }


        alert(
            "Booking cancelled successfully!"
        );


        /* ===============================
           RELOAD BOOKINGS
        =============================== */

        loadBookings();


    } catch (error) {

        console.error(
            "Cancel Booking Error:",
            error
        );


        alert(
            "Unable to cancel booking."
        );

    }

}



/* =====================================================
   GO TO LOGIN
===================================================== */

function goToLogin() {

    window.location.href =
        "login.html";

}



/* =====================================================
   GO TO MOVIES
===================================================== */

function goToMovies() {

    window.location.href =
        "index.html#movies";

}



/* =====================================================
   INITIAL LOAD
===================================================== */

loadBookings();