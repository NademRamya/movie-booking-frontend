const movieId = localStorage.getItem("selectedMovieId");

let selectedSeats = [];
let selectedShowId = null;


/* ================================
   LOAD SELECTED MOVIE
================================ */

async function loadSelectedMovie() {

    try {

        console.log("Selected Movie ID:", movieId);

        const response = await fetch(
            `http://localhost:8080/movies/${movieId}`
        );

        if (!response.ok) {
            throw new Error("Movie not found");
        }

        const movie = await response.json();

        console.log("Selected Movie:", movie);

        document.getElementById("selectedMovie").innerText =
            "Selected Movie: " + movie.title;

    } catch (error) {

        console.error("Movie Error:", error);

        document.getElementById("selectedMovie").innerText =
            "Movie not found";
    }
}


/* ================================
   LOAD THEATRES
================================ */

async function loadTheatres() {

    try {

        const response = await fetch(
            "http://localhost:8080/theatres"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch theatres");
        }

        const theatres = await response.json();

        console.log("All Theatres:", theatres);

        const theatreSelect =
            document.getElementById("theatre");


        theatres.forEach(function (theatre) {

            const option =
                document.createElement("option");

            option.value = theatre.id;

            option.textContent =
                theatre.name + " - " +
                theatre.location;

            theatreSelect.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Theatre Error:",
            error
        );

    }
}


/* ================================
   LOAD SHOWS
================================ */

async function loadShows() {

    const theatreId =
        document.getElementById("theatre").value;

    const showSelect =
        document.getElementById("showTime");

    const seatContainer =
        document.getElementById("seatContainer");


    console.log("Selected Theatre ID:", theatreId);
    console.log("Selected Movie ID:", movieId);


    // Reset show dropdown

    showSelect.innerHTML =
        `<option value="">Select Show Time</option>`;


    // Reset seats

    seatContainer.innerHTML =
        "<p>Please select a show first</p>";


    selectedSeats = [];

    selectedShowId = null;

    updateSelectedSeats();


    if (theatreId === "") {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:8080/shows"
            );


        console.log(
            "Shows Response Status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load shows"
            );

        }


        const shows =
            await response.json();


        console.log(
            "ALL SHOWS:",
            shows
        );


        /* Filter shows based on
           selected movie + theatre */

        const filteredShows =
            shows.filter(function (show) {

                console.log(
                    "Checking:",
                    "Movie =", show.movie?.id,
                    "Theatre =", show.theatre?.id
                );


                return (

                    show.movie &&
                    show.theatre &&

                    Number(show.movie.id) ===
                    Number(movieId)

                    &&

                    Number(show.theatre.id) ===
                    Number(theatreId)

                );

            });


        console.log(
            "FILTERED SHOWS:",
            filteredShows
        );


        if (filteredShows.length === 0) {

            console.log(
                "NO MATCHING SHOWS FOUND"
            );


            showSelect.innerHTML =
                `<option value="">
                    No shows available
                </option>`;

            return;

        }


        // Add matching show times

        filteredShows.forEach(function (show) {

            console.log(
                "Adding Show:",
                show.showTime
            );


            const option =
                document.createElement("option");


            option.value =
                show.id;


            option.textContent =
                show.showTime;


            showSelect.appendChild(
                option
            );

        });


    } catch (error) {

        console.error(
            "SHOW ERROR:",
            error
        );

        showSelect.innerHTML =
            `<option value="">
                Error loading shows
            </option>`;

    }

}


/* ================================
   LOAD SEATS
================================ */

async function loadSeats() {

    const theatreId =
        document.getElementById("theatre").value;


    const showSelect =
        document.getElementById("showTime");


    const seatContainer =
        document.getElementById("seatContainer");


    selectedShowId =
        showSelect.value;


    console.log(
        "Selected Show ID:",
        selectedShowId
    );


    // Clear previous seats

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

        /* ================================
           GET THEATRE SEATS
        ================================= */

        const seatResponse =
            await fetch(
                `http://localhost:8080/seats/theatre/${theatreId}`
            );


        if (!seatResponse.ok) {

            throw new Error(
                "Unable to load seats"
            );

        }


        const theatreSeats =
            await seatResponse.json();


        /* ================================
           GET BOOKED SEATS
        ================================= */

        const bookedResponse =
            await fetch(
                `http://localhost:8080/bookings/show/${selectedShowId}/booked-seats`
            );


        if (!bookedResponse.ok) {

            throw new Error(
                "Unable to load booked seats"
            );

        }


        const bookedSeatIds =
            await bookedResponse.json();


        console.log(
            "THEATRE SEATS:",
            theatreSeats
        );


        console.log(
            "BOOKED SEAT IDs:",
            bookedSeatIds
        );


        if (theatreSeats.length === 0) {

            seatContainer.innerHTML =
                "<p>No seats available</p>";

            return;

        }


        /* ================================
           DISPLAY SEATS
        ================================= */

        theatreSeats.forEach(function (seat) {

            const seatButton =
                document.createElement("button");


            seatButton.innerText =
                seat.seatNumber;


            seatButton.classList.add(
                "seat"
            );


            /* Check if seat is booked */

            if (bookedSeatIds.includes(seat.id)) {

                seatButton.classList.add(
                    "booked-seat"
                );

                seatButton.disabled = true;

            } else {

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
            "Seat Error:",
            error
        );


        seatContainer.innerHTML =
            "<p>Unable to load seats</p>";

    }

}


/* ================================
   SELECT SEAT
================================ */

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

        // Remove seat

        selectedSeats.splice(
            index,
            1
        );


        button.classList.remove(
            "selected-seat"
        );

    } else {

        // Add seat

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


/* ================================
   UPDATE SELECTED SEATS
================================ */

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


/* ================================
   CONFIRM BOOKING
================================ */

async function confirmBooking() {

    const theatre =
        document.getElementById("theatre");


    const showTime =
        document.getElementById("showTime");


    // Validation

    if (theatre.value === "") {

        alert("Please select a theatre");

        return;
    }


    if (showTime.value === "") {

        alert("Please select a show");

        return;
    }


    if (selectedSeats.length === 0) {

        alert("Please select at least one seat");

        return;
    }


    // Get current date

    const today = new Date();

    const bookingDate =
        today.toISOString().split("T")[0];


    // Prepare booking data

    const bookingData = {

        bookingDate: bookingDate,

        status: "BOOKED",

        user: {
            id: 9
        },

        show: {
            id: Number(selectedShowId)
        },

        seats: selectedSeats.map(function (seat) {

            return {
                id: seat.id
            };

        })

    };


    console.log(
        "Booking Data:",
        bookingData
    );


    try {

        const response =
            await fetch(
                "http://localhost:8080/bookings",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            bookingData
                        )

                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText
            );

        }


        const booking =
            await response.json();


        console.log(
            "Booking Successful:",
            booking
        );


        /* ================================
           SAVE BOOKING DETAILS
        ================================= */

        localStorage.setItem(
            "bookingId",
            booking.id
        );


        localStorage.setItem(
            "bookingMovie",
            document.getElementById("selectedMovie")
                .innerText
                .replace("Selected Movie: ", "")
        );


        localStorage.setItem(
            "bookingTheatre",
            theatre.options[
                theatre.selectedIndex
            ].text
        );


        localStorage.setItem(
            "bookingShowTime",
            showTime.options[
                showTime.selectedIndex
            ].text
        );


        localStorage.setItem(
            "bookingSeats",
            selectedSeats.map(
                seat => seat.seatNumber
            ).join(", ")
        );


        /* ================================
           REDIRECT TO CONFIRMATION PAGE
        ================================= */

        window.location.href =
            "confirmation.html";


    } catch (error) {

        console.error(
            "Booking Error:",
            error
        );


        alert(
            "Booking failed! " +
            error.message
        );

    }

}


/* ================================
   INITIAL LOAD
================================ */

loadSelectedMovie();

loadTheatres();