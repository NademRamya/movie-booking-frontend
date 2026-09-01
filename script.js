let allMovies = [];

const API_BASE_URL = "https://movie-ticket-booking-ga44.onrender.com";

/* =========================================
LOAD MOVIES FROM BACKEND
========================================= */

async function loadMovies() {


try {

    const response =
        await fetch(
            API_BASE_URL + "/movies"
        );

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

} else {

    filteredMovies =
        allMovies.filter(function(movie) {

            return movie.language
                .trim()
                .toLowerCase()
                === language.toLowerCase();

        });

}


displayMovies(filteredMovies);


document
    .getElementById("dropdownContent")
    .classList.remove("show");


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
