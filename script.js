let allMovies = [];


/* =========================================
   LOAD MOVIES FROM BACKEND
========================================= */

async function loadMovies() {

    try {

        const response =
            await fetch("https://movie-ticket-booking-backend-22r7.onrender.com/movies");


        if (!response.ok) {

            throw new Error(
                "Failed to fetch movies"
            );

        }


        allMovies =
            await response.json();


        console.log(
            "All movies:",
            allMovies
        );


        // Initially display all movies

        displayMovies(allMovies);


    } catch (error) {

        console.error(
            "Error:",
            error
        );


        document.getElementById(
            "movieContainer"
        ).innerHTML = `

            <div class="movie-card">

                <h3>
                    Unable to load movies
                </h3>

                <p>
                    Please check whether
                    the backend server is running.
                </p>

            </div>

        `;

    }

}


/* =========================================
   DISPLAY MOVIES
========================================= */

function displayMovies(movies) {

    const movieContainer =
        document.getElementById(
            "movieContainer"
        );


    movieContainer.innerHTML = "";


    if (movies.length === 0) {

        movieContainer.innerHTML = `

            <div class="movie-card">

                <h3>
                    No movies found
                </h3>

                <p>
                    No movies available
                    for this language.
                </p>

            </div>

        `;

        return;

    }


    movies.forEach(function(movie) {


        const movieCard =
            document.createElement("div");


        movieCard.classList.add(
            "movie-card"
        );


        movieCard.innerHTML = `

            <div>

                <h3>
                    ${movie.title}
                </h3>

                <p>
                    Genre: ${movie.genre}
                </p>

                <p>
                    Language: ${movie.language}
                </p>

                <p>
                    Duration: ${movie.duration} mins
                </p>

                <p>
                    Rating: ⭐ ${movie.rating}
                </p>

            </div>


            <button
                onclick="bookMovie(${movie.id})">

                Book Now

            </button>

        `;


        movieContainer.appendChild(
            movieCard
        );

    });

}


/* =========================================
   OPEN / CLOSE MOVIES DROPDOWN
========================================= */

function toggleDropdown() {

    document
        .getElementById("dropdownContent")
        .classList.toggle("show");

}


/* =========================================
   FILTER MOVIES BY LANGUAGE
========================================= */

function filterMovies(language) {

    let filteredMovies;


    if (language === "All") {

        filteredMovies = allMovies;

    }

    else {

        filteredMovies =
            allMovies.filter(function(movie) {

                return movie.language
                    .trim()
                    .toLowerCase()
                    === language.toLowerCase();

            });

    }


    displayMovies(
        filteredMovies
    );


    // Close dropdown

    document
        .getElementById("dropdownContent")
        .classList.remove("show");

}


/* =========================================
   BOOK MOVIE
========================================= */

function bookMovie(movieId) {

    // Save selected movie ID

    localStorage.setItem(
        "selectedMovieId",
        movieId
    );


    // Open booking page

    window.location.href =
        "booking.html";

}


/* =========================================
   SCROLL TO MOVIES
========================================= */

function scrollToMovies() {

    document
        .getElementById("movies")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================
   LOAD MOVIES WHEN PAGE OPENS
========================================= */

loadMovies();