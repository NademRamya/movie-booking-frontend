/* =========================================
   REGISTER USER
========================================= */

const API_BASE_URL =
    "https://movie-ticket-booking-ga44.onrender.com";


document
    .getElementById("registerForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        const name =
            document
                .getElementById("name")
                .value
                .trim();


        const email =
            document
                .getElementById("email")
                .value
                .trim();


        const password =
            document
                .getElementById("password")
                .value;


        const confirmPassword =
            document
                .getElementById("confirmPassword")
                .value;


        const message =
            document.getElementById("message");


        const registerButton =
            document.querySelector(
                'button[type="submit"]'
            );


        message.innerText = "";


        /* =========================================
           VALIDATION
        ========================================= */

        if (
            name === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === ""
        ) {

            message.innerText =
                "Please fill all fields.";

            message.style.color =
                "red";

            return;
        }


        if (password !== confirmPassword) {

            message.innerText =
                "Passwords do not match.";

            message.style.color =
                "red";

            return;
        }


        /* =========================================
           SHOW LOADING
        ========================================= */

        registerButton.disabled = true;

        registerButton.innerText =
            "Creating Account...";

        message.innerText =
            "Connecting to server...";

        message.style.color =
            "#555";


        try {

            /* =========================================
               CREATE USER
            ========================================= */

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


            /* =========================================
               HANDLE ERROR
            ========================================= */

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    "Registration failed:",
                    response.status,
                    errorText
                );


                message.innerText =
                    "Unable to create account.";

                message.style.color =
                    "red";


                registerButton.disabled =
                    false;

                registerButton.innerText =
                    "Create Account";


                return;
            }


            /* =========================================
               GET CREATED USER
            ========================================= */

            const user =
                await response.json();


            console.log(
                "Registered user:",
                user
            );


            /* =========================================
               SAVE USER INFORMATION
            ========================================= */

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

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );


            /* =========================================
               SUCCESS
            ========================================= */

            message.innerText =
                "Account created successfully!";

            message.style.color =
                "green";


            registerButton.innerText =
                "Account Created ✓";


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
                "Server is waking up. Please try again.";

            message.style.color =
                "red";


            registerButton.disabled =
                false;

            registerButton.innerText =
                "Create Account";

        }

    });