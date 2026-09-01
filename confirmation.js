/* =========================================================
   LOAD BOOKING CONFIRMATION
========================================================= */

async function loadBookingConfirmation() {


    const bookingId =
        localStorage.getItem("bookingId");


    /* =====================================================
       CHECK BOOKING ID
    ===================================================== */

    if (!bookingId) {

        alert("Booking not found!");

        window.location.href =
            "index.html";

        return;
    }



    try {


        /* =================================================
           GET BOOKING FROM BACKEND
        ================================================= */

        const response =
            await fetch(
                `http://localhost:8080/bookings/${bookingId}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load booking details"
            );

        }



        const booking =
            await response.json();


        console.log(
            "Booking Details:",
            booking
        );



        /* =================================================
           BOOKING ID
        ================================================= */

        document.getElementById(
            "bookingId"
        ).innerText =
            "#" + booking.id;



        document.getElementById(
            "qrBookingId"
        ).innerText =
            "Booking ID #" + booking.id;



        /* =================================================
           MOVIE NAME
        ================================================= */

        document.getElementById(
            "movieName"
        ).innerText =
            booking.show.movie.title;



        /* =================================================
           THEATRE NAME
        ================================================= */

        document.getElementById(
            "theatreName"
        ).innerText =
            booking.show.theatre.name;



        /* =================================================
           SHOW TIME
        ================================================= */

        document.getElementById(
            "showTime"
        ).innerText =
            booking.show.showTime;



        /* =================================================
           SEAT NUMBERS
        ================================================= */

        document.getElementById(
            "seatNumbers"
        ).innerText =

            booking.seats
                .map(function (seat) {

                    return seat.seatNumber;

                })
                .join(", ");



        /* =================================================
           BOOKING DATE
        ================================================= */

        document.getElementById(
            "bookingDate"
        ).innerText =
            booking.bookingDate;



        /* =================================================
           BOOKING STATUS
        ================================================= */

        document.getElementById(
            "bookingStatus"
        ).innerText =
            booking.status;



        /* =================================================
           GENERATE QR CODE
        ================================================= */

        const qrContainer =
            document.getElementById("qrcode");


        /* Clear old QR */

        qrContainer.innerHTML = "";



        /* QR CONTENT */

        const qrData =

            "MovieBook Ticket\n" +

            "Booking ID: #" + booking.id + "\n" +

            "Movie: " +
            booking.show.movie.title + "\n" +

            "Theatre: " +
            booking.show.theatre.name + "\n" +

            "Show Time: " +
            booking.show.showTime + "\n" +

            "Seats: " +
            booking.seats
                .map(function (seat) {
                    return seat.seatNumber;
                })
                .join(", ") + "\n" +

            "Date: " +
            booking.bookingDate + "\n" +

            "Status: " +
            booking.status;



        /* Generate QR */

        new QRCode(
            qrContainer,
            {
                text: qrData,
                width: 160,
                height: 160
            }
        );


    }


    catch (error) {


        console.error(
            "Confirmation Error:",
            error
        );


        alert(
            "Unable to load booking details"
        );

    }

}



/* =========================================================
   PRINT TICKET
========================================================= */

function printTicket() {

    window.print();

}



/* =========================================================
   GO TO HOME
========================================================= */

function goHome() {


    localStorage.removeItem(
        "bookingId"
    );


    window.location.href =
        "index.html";

}



/* =========================================================
   INITIAL LOAD
========================================================= */

loadBookingConfirmation();