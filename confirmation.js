const API_BASE_URL = "https://movie-ticket-booking-ga44.onrender.com";

async function loadBookingConfirmation() {

    const bookingId = localStorage.getItem("bookingId");

    if (!bookingId) {
        alert("Booking not found!");
        window.location.href = "index.html";
        return;
    }

    try {

        const response = await fetch(
            API_BASE_URL + "/bookings/" + bookingId
        );

        if (!response.ok) {
            throw new Error("Unable to load booking details");
        }

        const booking = await response.json();

        document.getElementById("bookingId").innerText =
            "#" + booking.id;

        document.getElementById("qrBookingId").innerText =
            "Booking ID #" + booking.id;

        document.getElementById("movieName").innerText =
            booking.show.movie.title;

        document.getElementById("theatreName").innerText =
            booking.show.theatre.name;

        document.getElementById("showTime").innerText =
            booking.show.showTime;

        document.getElementById("seatNumbers").innerText =
            booking.seats
                .map(seat => seat.seatNumber)
                .join(", ");

        document.getElementById("bookingDate").innerText =
            booking.bookingDate;

        document.getElementById("bookingStatus").innerText =
            booking.status;

        const qrContainer =
            document.getElementById("qrcode");

        qrContainer.innerHTML = "";

        const qrData =
            "MovieBook Ticket\n" +
            "Booking ID: #" + booking.id + "\n" +
            "Movie: " + booking.show.movie.title + "\n" +
            "Theatre: " + booking.show.theatre.name + "\n" +
            "Show Time: " + booking.show.showTime + "\n" +
            "Seats: " +
            booking.seats
                .map(seat => seat.seatNumber)
                .join(", ") +
            "\nDate: " + booking.bookingDate +
            "\nStatus: " + booking.status;

        new QRCode(qrContainer, {
            text: qrData,
            width: 160,
            height: 160
        });

    } catch (error) {

        console.error("Confirmation Error:", error);

        alert("Unable to load booking details");
    }
}


function printTicket() {
    window.print();
}


function goHome() {
    localStorage.removeItem("bookingId");
    window.location.href = "index.html";
}


loadBookingConfirmation();