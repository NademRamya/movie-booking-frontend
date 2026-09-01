/* =========================================
   LOGIN USER
========================================= */

document
    .getElementById("loginForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();


        // Get input values

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        const message =
            document.getElementById("message");


        // Clear previous message

        message.innerText = "";


        try {

            /* =========================================
               SEND LOGIN REQUEST TO SPRING BOOT
            ========================================= */

            const response =
                await fetch(
                    "http://localhost:8080/users/login",
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


            /* =========================================
               LOGIN FAILED
            ========================================= */

            if (!response.ok) {

                message.innerText =
                    "Invalid email or password";

                message.style.color = "red";

                return;
            }


            /* =========================================
               LOGIN SUCCESSFUL
            ========================================= */

            const user =
                await response.json();


            console.log(
                "Login successful:",
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


            /* =========================================
               SUCCESS MESSAGE
            ========================================= */

            message.innerText =
                "Login successful!";

            message.style.color = "green";


            /* =========================================
               GO TO HOME PAGE
            ========================================= */

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