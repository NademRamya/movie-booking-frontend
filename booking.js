const movieId = localStorage.getItem("selectedMovieId");

let selectedSeats = [];
let selectedShowId = null;

// Render Backend URL
const API_BASE_URL = "https://movie-ticket-booking-ga44.onrender.com";


/* ================================
LOAD SELECTED MOVIE
================================ */

async function loadSelectedMovie() {

    try {

        console.log("Selected Movie ID:", movieId);

        const response = await fetch(
            `${API_BASE_URL}/movies/${movieId}`
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
            `${API_BASE_URL}/theatres`
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
                `${API_BASE_URL}/shows`
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

            showSelect.innerHTML =
                `<option value="">
                    No shows available
                </option>`;

            return;

        }


        // Add matching show times

        filteredShows.forEach(function (show) {

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

        // GET THEATRE SEATS

        const seatResponse =
            await fetch(
                `${API_BASE_URL}/seats/theatre/${theatreId}`
            );


        if (!seatResponse.ok) {

            throw new Error(
                "Unable to load seats"
            );

        }


        const theatreSeats =
            await seatResponse.json();


        // GET BOOKED SEATS

        const bookedResponse =
            await fetch(
                `${API_BASE_URL}/bookings/show/${selectedShowId}/booked-seats`
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


        // DISPLAY SEATS

        theatreSeats.forEach(function (seat) {

            const seatButton =
                document.createElement("button");


            seatButton.innerText =
                seat.seatNumber;


            seatButton.classList.add(
                "seat"
            );


            // Check if seat is booked

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
PROCEED TO PAYMENT
================================ */

function proceedToPayment() {

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


    // SAVE BOOKING DETAILS TEMPORARILY

    localStorage.setItem(
        "paymentMovieId",
        movieId
    );


    localStorage.setItem(
        "paymentMovie",
        document.getElementById("selectedMovie")
            .innerText
            .replace("Selected Movie: ", "")
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


    // REDIRECT TO PAYMENT PAGE

    window.location.href =
        "payment.html";

}


/* ================================
INITIAL LOAD
================================ */

loadSelectedMovie();

loadTheatres();