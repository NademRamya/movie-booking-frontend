/* ================================
   PAYMENT PAGE
================================ */

const API_BASE_URL =
    "https://movie-ticket-booking-ga44.onrender.com";


/* ================================
   GET PAYMENT DETAILS
================================ */

const movie =
    localStorage.getItem("paymentMovie");

const theatre =
    localStorage.getItem("paymentTheatre");

const showTime =
    localStorage.getItem("paymentShowTime");

const showId =
    localStorage.getItem("paymentShowId");

const selectedSeats =
    JSON.parse(
        localStorage.getItem("paymentSeats")
    ) || [];


/* ================================
   DISPLAY BOOKING DETAILS
================================ */

document.getElementById("paymentMovie").innerText =
    movie || "-";

document.getElementById("paymentTheatre").innerText =
    theatre || "-";

document.getElementById("paymentShowTime").innerText =
    showTime || "-";

document.getElementById("paymentSeats").innerText =
    selectedSeats
        .map(seat => seat.seatNumber)
        .join(", ") || "-";


/* ================================
   CALCULATE TOTAL AMOUNT
================================ */

const ticketPrice = 200;

const totalAmount =
    selectedSeats.length * ticketPrice;

document.getElementById("totalAmount").innerText =
    "₹" + totalAmount;


/* ================================
   MAKE PAYMENT
================================ */

async function makePayment() {

    const selectedPayment =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (!selectedPayment) {

        alert("Please select a payment method");

        return;

    }


    if (selectedSeats.length === 0) {

        alert("No seats selected");

        return;

    }


    /* ================================
       CHECK LOGGED-IN USER
    ================================= */

    const userId =
        localStorage.getItem("userId");


    if (!userId) {

        alert("Please login first");

        window.location.href =
            "login.html";

        return;

    }


    const paymentMethod =
        selectedPayment.value;


    const payButton =
        document.querySelector(".confirm-btn");


    payButton.disabled = true;

    payButton.innerText =
        "Processing Payment...";


    try {

        /* ================================
           AUTOMATIC BOOKING DATE
        ================================= */

        const today =
            new Date();


        const bookingDate =
            today
                .toISOString()
                .split("T")[0];


        /* ================================
           CREATE BOOKING DATA
        ================================= */

        const bookingData = {

            bookingDate: bookingDate,

            status: "BOOKED",

            user: {
                id: Number(userId)
            },

            show: {
                id: Number(showId)
            },

            seats: selectedSeats.map(
                function (seat) {

                    return {
                        id: seat.id
                    };

                }
            )

        };


        console.log(
            "Booking Data:",
            bookingData
        );


        /* ================================
           SAVE BOOKING
        ================================= */

        const response =
            await fetch(
                `${API_BASE_URL}/bookings`,
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
            movie
        );


        localStorage.setItem(
            "bookingTheatre",
            theatre
        );


        localStorage.setItem(
            "bookingShowTime",
            showTime
        );


        localStorage.setItem(
            "bookingSeats",
            selectedSeats
                .map(
                    seat => seat.seatNumber
                )
                .join(", ")
        );


        localStorage.setItem(
            "paymentMethod",
            paymentMethod
        );


        localStorage.setItem(
            "paymentAmount",
            totalAmount
        );


        localStorage.setItem(
            "paymentStatus",
            "SUCCESS"
        );


        alert(
            "Payment Successful! 🎉"
        );


        window.location.href =
            "confirmation.html";


    } catch (error) {

        console.error(
            "Payment Error:",
            error
        );


        alert(
            "Payment failed! " +
            error.message
        );


        payButton.disabled = false;

        payButton.innerText =
            "Pay Now";

    }

}