/* =========================================
REGISTER USER
========================================= */

const API_BASE_URL = "https://movie-ticket-booking-ga44.onrender.com";

document
.getElementById("registerForm")
.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name =
        document.getElementById("name")
            .value
            .trim();

    const email =
        document.getElementById("email")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value;

    const confirmPassword =
        document.getElementById("confirmPassword")
            .value;

    const message =
        document.getElementById("message");

    message.innerText = "";


    if (password !== confirmPassword) {

        message.innerText =
            "Passwords do not match.";

        message.style.color = "red";

        return;
    }


    try {

        const response =
            await fetch(
                API_BASE_URL + "/users",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Registration failed:",
                errorText
            );

            message.innerText =
                "Unable to create account.";

            message.style.color = "red";

            return;
        }


        const user =
            await response.json();

        console.log(
            "Registered user:",
            user
        );


        message.innerText =
            "Account created successfully!";

        message.style.color = "green";


        setTimeout(function() {

            window.location.href =
                "login.html";

        }, 1000);


    } catch (error) {

        console.error(
            "Registration Error:",
            error
        );

        message.innerText =
            "Unable to connect to server.";

        message.style.color = "red";

    }

});

