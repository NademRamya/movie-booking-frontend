let allMovies = [];

const API_BASE_URL = "https://movie-ticket-booking-ga44.onrender.com";


/* =========================================
   LOAD MOVIES FROM BACKEND
========================================= */

async function loadMovies() {

    try {

        console.log("Fetching movies...");

        const response = await fetch(
            `${API_BASE_URL}/movies`
        );

        console.log(
            "Response Status:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                "Failed to fetch movies"
            );

        }

        allMovies = await response.json();

        console.log(
            "All Movies:",
            allMovies
        );

        displayMovies(allMovies);

    } catch (error) {

        console.error(
            "Error loading movies:",
            error
        );

        document.getElementById(
            "movieContainer"
        ).innerHTML = `

            <div class="movie-card">

                <h3>Unable to load movies</h3>

                <p>
                    Please try again later.
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
        document.getElementById("movieContainer");


    movieContainer.innerHTML = "";


    if (movies.length === 0) {

        movieContainer.innerHTML = `

            <div class="movie-card">

                <h3>No movies found</h3>

                <p>
                    No movies available for this language.
                </p>

            </div>

        `;

        return;

    }


    movies.forEach(function (movie) {

        const movieCard =
            document.createElement("div");


        movieCard.classList.add(
            "movie-card"
        );


        movieCard.innerHTML = `

            <div>

                <h3>${movie.title}</h3>

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


            <button onclick="bookMovie(${movie.id})">

                Book Now

            </button>

        `;


        movieContainer.appendChild(
            movieCard
        );

    });

}


/* =========================================
   FILTER MOVIES BY LANGUAGE
========================================= */

function filterMovies(language) {

    let filteredMovies;


    if (language === "All") {

        filteredMovies = allMovies;

    } else {

        filteredMovies =
            allMovies.filter(function (movie) {

                return (
                    movie.language &&
                    movie.language
                        .trim()
                        .toLowerCase() ===
                    language.toLowerCase()
                );

            });

    }


    displayMovies(filteredMovies);

}


/* =========================================
   BOOK MOVIE
========================================= */

function bookMovie(movieId) {

    localStorage.setItem(
        "selectedMovieId",
        movieId
    );


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