const cityCoordinates = {
    "New York": { latitude: 40.71, longitude: -74.01 },
    "Los Angeles": { latitude: 34.05, longitude: -118.25 },
    "Chicago": { latitude: 41.87, longitude: -87.62 },
    "Houston": { latitude: 29.76, longitude: -95.36 },
    "Phoenix": { latitude: 33.45, longitude: -112.07 },
    "Philadelphia": { latitude: 39.95, longitude: -75.17 },
    "San Antonio": { latitude: 29.42, longitude: -98.49 },
    "San Diego": { latitude: 32.72, longitude: -117.16 },
    "Dallas": { latitude: 32.78, longitude: -96.81 },
    "San Jose": { latitude: 37.33, longitude: -121.89 },
    "Austin": { latitude: 30.27, longitude: -97.74 },
    "Jacksonville": { latitude: 30.33, longitude: -81.65 },
    "Fort Worth": { latitude: 32.75, longitude: -97.33 },
    "Columbus": { latitude: 39.96, longitude: -82.99 },
    "San Francisco": { latitude: 37.77, longitude: -122.42 },
    "Charlotte": { latitude: 35.23, longitude: -80.84 },
    "Indianapolis": { latitude: 39.76, longitude: -86.15 },
    "Seattle": { latitude: 47.61, longitude: -122.33 },
    "Denver": { latitude: 39.74, longitude: -104.99 },
    "Washington, D.C.": { latitude: 38.90, longitude: -77.03 },
    "Boston": { latitude: 42.36, longitude: -71.06 },
    "Raleigh": { latitude: 35.78, longitude: -78.64 },
};

// Populate dropdown
const citySelect = document.getElementById('city-select');
for (const city in cityCoordinates) {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
}

document.getElementById('get-weather').addEventListener('click', () => {
    const city = citySelect.value;

    if (city) {
        const coordinates = cityCoordinates[city];
        fetchWeather(coordinates.latitude, coordinates.longitude);
    } else {
        displayError('Please select a city.');
    }
});

async function fetchWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        displayError(error.message);
    }
}

function displayWeather(data) {
    const { current_weather } = data; // Ensure current_weather is available
    if (current_weather) {
        const temperatureC = current_weather.temperature; // Get temperature in Celsius
        const weatherCode = current_weather.weathercode; // Get weather code

        // Convert Celsius to Fahrenheit
        const temperatureF = (temperatureC * 9 / 5) + 32;

        // Map weather codes to conditions
        const weatherConditions = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Fog",
            61: "Rain showers",
            63: "Rain",
            80: "Rain showers",
            81: "Rain",
            82: "Rain",
            95: "Thunderstorms",
            96: "Thunderstorms",
            99: "Thunderstorms",
        };

        const weatherCondition = weatherConditions[weatherCode] || "Unknown";

        const weatherResult = document.getElementById('weather-result');
        weatherResult.innerHTML = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperatureF.toFixed(2)}°F</p>
            <p>Condition: ${weatherCondition}</p>
        `;
    } else {
        displayError('Weather data is not available.');
    }
}

function displayError(message) {
    const weatherResult = document.getElementById('weather-result');
    weatherResult.innerHTML = `<p style="color: red;">${message}</p>`;
}