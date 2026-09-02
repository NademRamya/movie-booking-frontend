const movieId = localStorage.getItem("selectedMovieId");

let selectedSeats = [];
let selectedShowId = null;
let allShows = [];
let showsLoaded = false;

const API_BASE_URL =
    "https://movie-ticket-booking-ga44.onrender.com";


/* =====================================================
   LOAD SELECTED MOVIE
===================================================== */

async function loadSelectedMovie() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/movies/${movieId}`
            );

        if (!response.ok) {
            throw new Error("Movie not found");
        }

        const movie =
            await response.json();

        document.getElementById("selectedMovie").innerText =
            "Selected Movie: " + movie.title;

    } catch (error) {

        console.error("Movie loading failed:", error);

        document.getElementById("selectedMovie").innerText =
            "Movie not found";
    }
}


/* =====================================================
   LOAD THEATRES
===================================================== */

async function loadTheatres() {

    const theatreSelect =
        document.getElementById("theatre");

    // Disable theatre until shows are loaded
    theatreSelect.disabled = true;

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/theatres`
            );

        if (!response.ok) {
            throw new Error("Failed to fetch theatres");
        }

        const theatres =
            await response.json();

        theatreSelect.innerHTML =
            `<option value="">Select Theatre</option>`;

        theatres.forEach(function (theatre) {

            const option =
                document.createElement("option");

            option.value =
                theatre.id;

            option.textContent =
                theatre.name +
                " - " +
                theatre.location;

            theatreSelect.appendChild(option);

        });

        // Enable only after shows are ready
        if (showsLoaded) {
            theatreSelect.disabled = false;
        }

    } catch (error) {

        console.error(
            "Theatre loading failed:",
            error
        );

        theatreSelect.innerHTML =
            `<option value="">Unable to load theatres</option>`;
    }
}


/* =====================================================
   LOAD ALL SHOWS ONCE
===================================================== */

async function loadAllShows() {

    const showSelect =
        document.getElementById("showTime");

    showSelect.innerHTML =
        `<option value="">Loading show times...</option>`;

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/shows`
            );

        if (!response.ok) {
            throw new Error("Unable to load shows");
        }

        allShows =
            await response.json();

        showsLoaded = true;

        showSelect.innerHTML =
            `<option value="">Select Show Time</option>`;

        // Enable theatre after shows are ready
        const theatreSelect =
            document.getElementById("theatre");

        if (theatreSelect) {
            theatreSelect.disabled = false;
        }

    } catch (error) {

        console.error(
            "Show loading failed:",
            error
        );

        allShows = [];

        showsLoaded = false;

        showSelect.innerHTML =
            `<option value="">Unable to load shows</option>`;
    }
}


/* =====================================================
   LOAD SHOWS FOR SELECTED THEATRE
===================================================== */

function loadShows() {

    const theatreId =
        document.getElementById("theatre").value;

    const showSelect =
        document.getElementById("showTime");

    const seatContainer =
        document.getElementById("seatContainer");


    /* ---------------------------------------------
       WAIT UNTIL SHOWS ARE LOADED
    --------------------------------------------- */

    if (!showsLoaded) {

        showSelect.innerHTML =
            `<option value="">Loading show times...</option>`;

        return;
    }


    /* ---------------------------------------------
       RESET
    --------------------------------------------- */

    showSelect.innerHTML =
        `<option value="">Select Show Time</option>`;

    seatContainer.innerHTML =
        "<p>Please select a show first</p>";

    selectedSeats = [];

    selectedShowId = null;

    updateSelectedSeats();


    if (theatreId === "") {
        return;
    }


    /* ---------------------------------------------
       FILTER SHOWS
    --------------------------------------------- */

    const filteredShows =
        allShows.filter(function (show) {

            return (
                show.movie &&
                show.theatre &&
                Number(show.movie.id) === Number(movieId) &&
                Number(show.theatre.id) === Number(theatreId)
            );

        });


    /* ---------------------------------------------
       NO SHOWS
    --------------------------------------------- */

    if (filteredShows.length === 0) {

        showSelect.innerHTML =
            `<option value="">No shows available</option>`;

        return;
    }


    /* ---------------------------------------------
       DISPLAY SHOW TIMES
    --------------------------------------------- */

    filteredShows.forEach(function (show) {

        const option =
            document.createElement("option");

        option.value =
            show.id;

        option.textContent =
            show.showTime;

        showSelect.appendChild(option);

    });
}


/* =====================================================
   LOAD SEATS
===================================================== */

async function loadSeats() {

    const theatreId =
        document.getElementById("theatre").value;

    const showSelect =
        document.getElementById("showTime");

    const seatContainer =
        document.getElementById("seatContainer");


    selectedShowId =
        showSelect.value;


    seatContainer.innerHTML = "";

    selectedSeats = [];

    updateSelectedSeats();


    if (theatreId === "") {

        seatContainer.innerHTML =
            "<p>Please select a theatre first</p>";

        return;
    }


    if (selectedShowId === "") {

        seatContainer.innerHTML =
            "<p>Please select a show first</p>";

        return;
    }


    try {

        /* ---------------------------------------------
           LOAD THEATRE SEATS + BOOKED SEATS TOGETHER
        --------------------------------------------- */

        const [
            seatResponse,
            bookedResponse
        ] = await Promise.all([

            fetch(
                `${API_BASE_URL}/seats/theatre/${theatreId}`
            ),

            fetch(
                `${API_BASE_URL}/bookings/show/${selectedShowId}/booked-seats`
            )

        ]);


        if (!seatResponse.ok) {

            throw new Error(
                "Unable to load seats"
            );
        }


        if (!bookedResponse.ok) {

            throw new Error(
                "Unable to load booked seats"
            );
        }


        const theatreSeats =
            await seatResponse.json();

        const bookedSeatIds =
            await bookedResponse.json();


        /* ---------------------------------------------
           NO SEATS
        --------------------------------------------- */

        if (theatreSeats.length === 0) {

            seatContainer.innerHTML =
                "<p>No seats available</p>";

            return;
        }


        /* ---------------------------------------------
           DISPLAY SEATS
        --------------------------------------------- */

        theatreSeats.forEach(function (seat) {

            const seatButton =
                document.createElement("button");

            seatButton.innerText =
                seat.seatNumber;

            seatButton.classList.add(
                "seat"
            );


            /* BOOKED SEAT */

            if (
                bookedSeatIds.includes(seat.id)
            ) {

                seatButton.classList.add(
                    "booked-seat"
                );

                seatButton.disabled = true;

            }


            /* AVAILABLE SEAT */

            else {

                seatButton.onclick =
                    function () {

                        selectSeat(
                            seat.id,
                            seat.seatNumber,
                            seatButton
                        );

                    };
            }


            seatContainer.appendChild(
                seatButton
            );

        });


    } catch (error) {

        console.error(
            "Seat loading failed:",
            error
        );

        seatContainer.innerHTML =
            "<p>Unable to load seats</p>";
    }
}


/* =====================================================
   SELECT SEAT
===================================================== */

function selectSeat(
    seatId,
    seatNumber,
    button
) {

    const index =
        selectedSeats.findIndex(
            function (seat) {

                return seat.id === seatId;

            }
        );


    if (index !== -1) {

        selectedSeats.splice(
            index,
            1
        );

        button.classList.remove(
            "selected-seat"
        );

    } else {

        selectedSeats.push({

            id: seatId,

            seatNumber: seatNumber

        });

        button.classList.add(
            "selected-seat"
        );
    }


    updateSelectedSeats();
}


/* =====================================================
   UPDATE SELECTED SEATS
===================================================== */

function updateSelectedSeats() {

    const selectedSeatsDiv =
        document.getElementById(
            "selectedSeatsText"
        );


    if (selectedSeats.length === 0) {

        selectedSeatsDiv.innerText =
            "Selected Seats: None";

    } else {

        const seatNumbers =
            selectedSeats.map(
                function (seat) {

                    return seat.seatNumber;

                }
            );


        selectedSeatsDiv.innerText =
            "Selected Seats: " +
            seatNumbers.join(", ");
    }
}


/* =====================================================
   PROCEED TO PAYMENT
===================================================== */

function proceedToPayment() {

    const theatre =
        document.getElementById("theatre");

    const showTime =
        document.getElementById("showTime");


    if (theatre.value === "") {

        alert(
            "Please select a theatre"
        );

        return;
    }


    if (showTime.value === "") {

        alert(
            "Please select a show"
        );

        return;
    }


    if (selectedSeats.length === 0) {

        alert(
            "Please select at least one seat"
        );

        return;
    }


    localStorage.setItem(
        "paymentMovieId",
        movieId
    );


    localStorage.setItem(
        "paymentMovie",
        document.getElementById(
            "selectedMovie"
        )
        .innerText
        .replace(
            "Selected Movie: ",
            ""
        )
    );


    localStorage.setItem(
        "paymentTheatre",
        theatre.options[
            theatre.selectedIndex
        ].text
    );


    localStorage.setItem(
        "paymentShowId",
        selectedShowId
    );


    localStorage.setItem(
        "paymentShowTime",
        showTime.options[
            showTime.selectedIndex
        ].text
    );


    localStorage.setItem(
        "paymentSeats",
        JSON.stringify(selectedSeats)
    );


    window.location.href =
        "payment.html";
}


/* =====================================================
   INITIAL LOAD
===================================================== */

async function initializeBookingPage() {

    await Promise.all([

        loadSelectedMovie(),

        loadTheatres(),

        loadAllShows()

    ]);

}


initializeBookingPage();