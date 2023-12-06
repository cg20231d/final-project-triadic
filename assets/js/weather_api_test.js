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
        // console.log(data);  // Display the full data for reference

        // Extract relevant information from the API response
        const temperature = data.main.temp - 273;
        const weatherDescription = data.weather[0].description;

        // Display the weather information
        console.log(`Temperature: ${temperature}°C`);
        console.log(`Weather: ${weatherDescription}`);

        // Display the weather information
        updateWeatherDescription(weatherDescription);

        // Graphics rendering based on weather
        setBackgroundColor(weatherDescription);
    }
}

function setBackgroundColor(weatherDescription) {
    // Set background image based on weather description
    const canvas = document.getElementById('weatherCanvas');
    const context = canvas.getContext('2d');
    
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (typeof weatherDescription === 'string') {
        let imagePath;

        if (weatherDescription.toLowerCase().includes('clear')) {
            imagePath = 'assets/images/sun.png';  // Path to clear sky image
        } else if (weatherDescription.toLowerCase().includes('cloud')) {
            imagePath = 'assets/images/clouds.png';  // Path to cloudy image
        } else if (weatherDescription.toLowerCase().includes('rain')) {
            imagePath = 'assets/images/rain.png';  // Path to rainy image
        } else if (weatherDescription.toLowerCase().includes('haze')) {
            imagePath = 'assets/images/few_clouds.jpg';  // Path to haze image
        } else {
            console.error('Invalid weather description:', weatherDescription);
            // Handle the case where weatherDescription is not recognized
            imagePath = 'assets/images/rainbow.png';  // Path to a default image
        }

        // Load and draw the image on the canvas
        const image = new Image();
        image.src = imagePath;

        image.onload = function () {
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
    } else {
        console.error('Invalid weather description:', weatherDescription);
        // Handle the case where weatherDescription is not a string
        context.fillStyle = 'white';  // Default to white for other conditions
        context.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function updateWeatherDescription(description) {
    // Set the content of the weather description element
    const weatherDescriptionElement = document.getElementById('weatherDescription');

    if (weatherDescriptionElement) {
        // Create an h2 element
        const headingElement = document.createElement('h2');
        headingElement.style.margin = '100px';
        
        // Set the text content of the h2 element
        headingElement.textContent = `Weather: ${description}`;
        
        // Append the h2 element to the weatherDescriptionElement
        weatherDescriptionElement.appendChild(headingElement);
    }
    
}

async function main() {
    const canvas = document.getElementById('weatherCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create an element to display the weather description
    const weatherContainer = document.createElement('div');
    weatherContainer.id = 'weatherContainer';
    canvas.appendChild(weatherContainer);

    const weatherDescriptionElement = document.createElement('div');
    weatherDescriptionElement.id = 'weatherDescription';
    weatherContainer.appendChild(weatherDescriptionElement);

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
