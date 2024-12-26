// Get references to the DOM elements (cards container, search input, and submit button)
const cardData = document.getElementById("card-data");
const btnsearch = document.getElementById("search");
const btnsubmit = document.getElementById("submit");

// Async function to fetch weather data for a given location
async function getData(lat,lon) {
    try {
        // Fetching weather data from the API for the specified location (3-day forecast)
        const row = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=107967fb950640699cf222544240712&q=${lat},${lon}&days=3&aqi=yes&alerts=yes`);

        // Converting the API response to JSON format
        const data = await row.json();

        // Returning the weather data to be used elsewhere
        return data;
    } catch (error) {
        // Log any error that occurs during the fetch process
        console.error("Error fetching data:", error);
    }
}

// Function to display weather data in the card format on the page
async function displayData(lat , lon) {
    const weatherData = await getData(lat , lon);
    // Clear the existing weather cards before rendering new ones
    cardData.innerHTML = "";

    // Check if the weather data and forecast exist
    if (weatherData && weatherData.forecast) {
        // Loop through each day's weather forecast data
        weatherData.forecast.forecastday.forEach(day => {
            // Create a Date object from the forecast day date
            const dayDate = new Date(day.date);

            // Extract the full name of the day (e.g., "Monday") using the 'weekday' option
            const dayweek = { weekday: 'long' };
            const dayName = dayDate.toLocaleDateString('en-US', dayweek);

            // Format the date to show the day and month (e.g., "7 Dec")
            const options = { day: 'numeric', month: 'short' };
            const dateResult = new Intl.DateTimeFormat('en-US', options).format(dayDate);

            // Create the HTML structure for each weather card
            const cartona = `
                <div class="shadow-lg mx-1 col-lg-4 col-md-6 col-12 card bg-sec-color rounded-4">
                    <div class="haed-content rounded-4 px-2 text-secondary w-100 d-flex align-items-center bg-color py-2 px-1 justify-content-between">
                        <h4 class="px-1 fs-5">${dayName}</h4> <!-- Display the day name -->
                        <span class="fs-5">${dateResult}</span> <!-- Display the formatted date (day/month) -->
                    </div>
                    <div class="card-body">
                        <h5 class="text-white card-title">${weatherData.location.name}</h5> <!-- Display the location name -->
                        <p class="text-white card-text degree fw-bold">
                            ${day.day.avgtemp_c} <sup>o</sup>c <!-- Display the average temperature -->
                        </p>
                       
                        <p class="text-info card-text fw-lighter"> <img src="${day.day.condition.icon}" width="100" alt="Weather icon" /> <!-- Display the weather condition icon -->  ${day.day.condition.text}</p> <!-- Display the weather description -->
                    </div>
                    <div class="card-footer">
                        <!-- Display additional weather details such as rain chance, wind speed, and humidity -->
                        <ul class="list-unstyled d-flex gap-2">
                            <li class="pe-2 text-decoration-none text-white">
                                <i class=" fa-solid fa-umbrella fa-2xs  text-secondary"></i>  ${day.day.daily_chance_of_rain}% <!-- Chance of rain -->
                            </li>
                            <li class="pe-2 text-decoration-none text-white">
                                <i class=" fa-solid fa-wind fa-2xs text-secondary "></i>  ${day.day.maxwind_kph} km/h <!-- Max wind speed -->
                            </li>
                            <li class="pe-2 text-decoration-none text-white">
                                <i class=" fa-regular fa-compass fa-2xs text-secondary "></i>  ${day.day.avghumidity}% <!-- Average humidity -->
                            </li>
                        </ul>
                    </div>
                </div>
            `;

            // Append the generated card HTML to the cardData container
            cardData.innerHTML += cartona;
        });
    } else {
        // If the API request fails, display an error message
        cardData.innerHTML = `<p class="text-white text-center fs-5">Error: Unable
        to retrieve weather data.</p>`;

    }
}

// Event listener for the submit button, triggers display of weather data based on the input location
btnsubmit.addEventListener("click", function() {
    const location = document.getElementById("search").value;
    displayData(location);
});

// Event listener for real-time input changes in the search field, updates weather data as the user types
btnsearch.addEventListener("input", function() {
    const location = document.getElementById("search").value;
    displayData(location);
});

// Automatically display the weather data for the default location when the page loads
document.addEventListener("DOMContentLoaded", function() {
    // Automatically display the weather for the user's current location
    window.navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            displayData(lat, lon);
        },
        (error) => {
            console.error("Error getting location:", error);
            cardData.innerHTML = `<p class="text-white mx-auto text-center m-auto fs-5">Unable to retrieve your location.</p>`;
        }
    );
});
