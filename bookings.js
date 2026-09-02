/* =====================================================
   MOVIEBOOK - MY BOOKINGS
===================================================== */

const API_BASE_URL =
    "https://movie-ticket-booking-ga44.onrender.com";


/* =====================================================
   LOAD BOOKINGS
===================================================== */

async function loadBookings() {

    const bookingsContainer =
        document.getElementById("bookingsContainer");


    // CHECK LOGIN
    const storedUser =
        localStorage.getItem("loggedInUser");


    if (!storedUser) {

        bookingsContainer.innerHTML = `
            <div class="no-bookings">

                <h2>Please Login</h2>

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


    // GET LOGGED-IN USER
    let user;

    try {

        user =
            JSON.parse(storedUser);

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


    // CHECK USER ID
    if (!user.id) {

        bookingsContainer.innerHTML = `
            <div class="no-bookings">

                <h2>User information missing</h2>

                <p>
                    Please login again.
                </p>

                <button onclick="goToLogin()">
                    Login
                </button>

            </div>
        `;

        return;
    }


    // SHOW LOADING
    bookingsContainer.innerHTML = `
        <div class="loading">
            Loading your bookings...
        </div>
    `;


    try {

        /*
           GET ONLY THIS USER'S BOOKINGS
        */

        const response =
            await fetch(
                `${API_BASE_URL}/bookings/user/${user.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load bookings"
            );
        }


        const userBookings =
            await response.json();


        console.log(
            "User bookings:",
            userBookings
        );


        // NO BOOKINGS
        if (
            !userBookings ||
            userBookings.length === 0
        ) {

            bookingsContainer.innerHTML = `
                <div class="no-bookings">

                    <div class="empty-icon">
                        🎟️
                    </div>

                    <h2>
                        No Bookings Yet
                    </h2>

                    <p>
                        You haven't booked any movie
                        tickets yet.
                    </p>

                    <button onclick="goToMovies()">
                        Explore Movies
                    </button>

                </div>
            `;

            return;
        }


        // CLEAR CONTAINER
        bookingsContainer.innerHTML = "";


        // DISPLAY BOOKINGS
        userBookings.forEach(
            function (booking) {

                const bookingCard =
                    document.createElement("div");

                bookingCard.classList.add(
                    "booking-ticket"
                );


                // MOVIE NAME
                const movieName =
                    booking.show &&
                    booking.show.movie
                        ? booking.show.movie.title
                        : "Movie";


                // THEATRE NAME
                const theatreName =
                    booking.show &&
                    booking.show.theatre
                        ? booking.show.theatre.name
                        : "Theatre";


                // SHOW TIME
                const showTime =
                    booking.show &&
                    booking.show.showTime
                        ? booking.show.showTime
                        : "Not available";


                // BOOKING DATE
                const bookingDate =
                    booking.bookingDate
                        ? booking.bookingDate
                        : "Not available";


                // STATUS
                const status =
                    booking.status
                        ? booking.status
                        : "CONFIRMED";


                // SEAT NUMBERS
                let seatNumbers =
                    "No seats";


                if (
                    booking.seats &&
                    booking.seats.length > 0
                ) {

                    seatNumbers =
                        booking.seats
                            .map(
                                function (seat) {

                                    return seat.seatNumber;

                                }
                            )
                            .join(", ");

                }


                // STATUS CLASS
                let statusClass =
                    "status-confirmed";


                if (
                    status
                        .toLowerCase()
                        .includes("cancel")
                ) {

                    statusClass =
                        "status-cancelled";

                }


                // CANCEL BUTTON
                let cancelButton = "";


                if (
                    !status
                        .toLowerCase()
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


                // CREATE BOOKING CARD
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


                    <div class="ticket-divider"></div>


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

            }
        );

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
                    Please try again.
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

async function cancelBooking(
    bookingId
) {

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

                `${API_BASE_URL}/bookings/${bookingId}/cancel`,

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