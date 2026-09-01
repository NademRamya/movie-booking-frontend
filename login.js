/* =========================================
   LOGIN USER
========================================= */

const API_BASE_URL = "https://movie-ticket-booking-ga44.onrender.com";

document
    .getElementById("loginForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        const message =
            document.getElementById("message");

        message.innerText = "";

        try {

            const response =
                await fetch(
                    API_BASE_URL + "/users/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );

            if (!response.ok) {

                message.innerText =
                    "Invalid email or password";

                message.style.color = "red";

                return;
            }

            const user =
                await response.json();

            console.log(
                "Login successful:",
                user
            );

            /* Save user information */

            localStorage.setItem(
                "userId",
                user.id
            );

            localStorage.setItem(
                "userName",
                user.name
            );

            localStorage.setItem(
                "userEmail",
                user.email
            );

            /* IMPORTANT: Save complete user object
               for My Bookings page */

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );

            message.innerText =
                "Login successful!";

            message.style.color = "green";

            setTimeout(function() {

                window.location.href =
                    "index.html";

            }, 800);

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            message.innerText =
                "Unable to connect to server";

            message.style.color = "red";

        }

    });