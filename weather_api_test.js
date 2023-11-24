const apiKey = 'bab5915f023f7655f2aa18da9b2dbe4e';

async function getWeatherDataByCoordinates(latitude, longitude) {
    const baseUrl = 'http://api.openweathermap.org/data/2.5/weather';
    const params = `lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    try {
        const response = await fetch(`${baseUrl}?${params}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function displayWeatherData(data) {
    if (data && 'main' in data) {
        console.log(data);  // Display the full data for reference

        // Extract relevant information from the API response
        const temperature = data.main.temp - 273;
        const weatherDescription = data.weather[0].description;

        // Display the weather information
        console.log(`Temperature: ${temperature}°C`);
        console.log(`Weather: ${weatherDescription}`);

        // Graphics rendering based on weather
        setBackgroundColor(weatherDescription);
    }
}

function setBackgroundColor(weatherDescription) {
    // Set background color based on weather description
    const canvas = document.getElementById('weatherCanvas');
    const context = canvas.getContext('2d');

    if (typeof weatherDescription === 'string') {
        if (weatherDescription.toLowerCase().includes('clear')) {
            context.fillStyle = 'lightblue';  // Light Blue for clear sky
        } else if (weatherDescription.toLowerCase().includes('cloud')) {
            context.fillStyle = 'silver';  // Silver for cloudy
        } else if (weatherDescription.toLowerCase().includes('rain')) {
            context.fillStyle = 'darkblue';  // Dark Blue for rain
        } else if (weatherDescription.toLowerCase().includes('haze')) {
            context.fillStyle = 'rgb(255, 255, 127)';
        } else {
            context.fillStyle = 'white';  // White for other conditions
        }
    } else {
        console.error('Invalid weather description:', weatherDescription);
        // Handle the case where weatherDescription is not a string
        context.fillStyle = 'white';  // Default to white for other conditions
    }

    context.fillRect(0, 0, canvas.width, canvas.height);
}

async function main() {
    // Set up the graphical window
    const canvas = document.createElement('canvas');
    canvas.id = 'weatherCanvas';
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    // Coordinates for Surabaya
    const latitude = -7.288131;
    const longitude = 112.802896;

    // Fetch weather data and update graphics
    const weatherData = await getWeatherDataByCoordinates(latitude, longitude);
    displayWeatherData(weatherData);

    // You may want to use setInterval or other techniques to update the weather regularly

    // Note: In a complete application, you would likely use a front-end framework like React, Angular, or Vue.js for a more structured approach.
}

if (typeof window !== 'undefined') {
    // Ensure the script is run only in a browser environment
    main();
}
