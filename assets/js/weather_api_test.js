import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const apiKey = 'bab5915f023f7655f2aa18da9b2dbe4e';

const loader = new GLTFLoader();

const canvas = document.getElementById('3dCanvas-1');

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);

const controls = new OrbitControls( camera, renderer.domElement );

const directionalLight = new THREE.DirectionalLight(0xffff00, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

camera.position.z = 7;
camera.position.y = 1;
camera.position.x = 1;

let gender = 'lk';

document.addEventListener('DOMContentLoaded', function() {
    // Mendapatkan elemen checkbox
    const checkbox = document.getElementById("gender");
    const resultContent = document.getElementById('resultGender');
    console.log(checkbox);

    // Menambahkan event listener untuk memantau perubahan status checkbox
    

    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            gender = 'lk';
            resultContent.textContent = `Laki - Laki`;
            resultContent.style.display = 'block';

            searchCity();
        } else {
            gender = 'pr';
            resultContent.textContent = `Perempuan`;
            resultContent.style.display = 'block';

            searchCity();
        }
    });
});

function levenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i === 0) {
                dp[i][j] = j;
            } else if (j === 0) {
                dp[i][j] = i;
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j - 1] + (str1[i - 1] !== str2[j - 1] ? 1 : 0),
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1
                );
            }
        }
    }

    return dp[m][n];
}
// Function to load CSV file asynchronously
async function loadCSVFile(path) {
    const response = await fetch(path);
    const data = await response.text();
    return data;
}

// Function to search for city in CSV and get coordinates
export async function searchCity() {
    const originalInput = document.getElementById('searchInput').value;
    const searchInput = originalInput.toLowerCase();
    // Load CSV data asynchronously
    const csvData = await loadCSVFile('assets/csv/listOfCities.csv');
    const csvDataV2 = await loadCSVFile('assets/csv/listOfCitiesV2.csv');
    

    const lines = csvData.split('\n').map(line => line.trim());
    const linesV2 = csvDataV2.split('\n').map(line => line.trim());

    // Search for the input city in the first CSV data
    let result = lines.slice(1).find(line => {
        const values = line.split(',');
        try {
            console.log(searchInput.split(' '));
            if (searchInput.split(' ').length > 1){
                const cityName = values[2].toLowerCase();
                
                return levenshteinDistance(cityName, searchInput) < 3;
            }
            else {
                const locationName = values[2].toLowerCase();
                const cityName = locationName.slice(locationName.indexOf(' ') + 1, -1);
                return levenshteinDistance(cityName, searchInput) < 3;
            }
        } catch {
          return;
        }

    });

    // Display the result for the first CSV
    if (result) {
            const values = result.split(',');
            const latitude = values[5];
            const longitude = values[6];
            const foundCity = values[2];
            document.getElementById('resultLocation').textContent = `City: ${originalInput}, Found: ${foundCity}, Latitude: ${latitude}, Longitude: ${longitude}`;
            document.getElementById('resultLocation').style.display = 'block';

            // Fetch weather data and update graphics
            const lat = parseFloat(latitude.replace(/"/g, ''));
            const long = parseFloat(longitude.replace(/"/g, ''));
            const weatherData = await getWeatherDataByCoordinates(lat, long);
            displayWeatherData(weatherData);
        } else {
        // If not found in the first CSV, search in the second CSV
        result = linesV2.slice(1).find(line => {
            const values = line.split(',');
            try {
            const cityName = values[1].toLowerCase();
            return levenshteinDistance(cityName, searchInput) < 3;
            } catch {
                return;
            }
        });

        // Display the result for the second CSV
        if (result) {
            const values = result.split(',');
            const latitude = values[2];
            const longitude = values[3];
            const foundCity = values[1];
            document.getElementById('resultLocation').textContent = `City: ${originalInput}, Found: ${foundCity}, Latitude: ${latitude}, Longitude: ${longitude}`;
            document.getElementById('resultLocation').style.display = 'block';

            // Fetch weather data and update graphics
            const lat = parseFloat(latitude.replace(/"/g, ''));
            const long = parseFloat(longitude.replace(/"/g, ''));
            const weatherData = await getWeatherDataByCoordinates(lat, long);
            displayWeatherData(weatherData);
        } else {
            document.getElementById('resultLocation').textContent = `City not found.`;
            document.getElementById('resultLocation').style.display = 'block';
        }
    }
}

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

        // Extract relevant information from the API response
        const temperature = data.main.temp - 273;
        const weatherDescription = data.weather[0].description;

        // Display the weather information
        console.log(`Temperature: ${temperature}°C`);
        console.log(`Weather: ${weatherDescription}`);
        console.log(data);

        // Display the weather information
        // updateWeatherDescription(weatherDescription);

        // Graphics rendering based on weather
        setBackgroundColor(weatherDescription);
    }
}

function setBackgroundColor(weatherDescription) {
    // Set background image based on weather description
    const canvasWeither = document.getElementById('weatherCanvas');
    const context = canvasWeither.getContext('2d');
    
    // Clear the canvasWeither
    context.clearRect(0, 0, canvasWeither.width, canvasWeither.height);

    if (typeof weatherDescription === 'string') {
        let imagePath;

        let modelUrlTop;
        let modelUrlMid;
        let modelUrlBot;

        if (weatherDescription.toLowerCase().includes('clear')) {
            if (gender === 'lk'){
                modelUrlTop = 'assets/models/male/top/other/long_sleeve_shirt.gltf';
                modelUrlMid = 'assets/models/male/middle/clear/Shorts.gltf'
                modelUrlBot = 'assets/models/male/bottom/other/slipper.gltf'

                imagePath = 'assets/images/sun.png';
            } else {
                modelUrlTop = 'assets/models/female/top/other/blouse_2.gltf';
                modelUrlMid = 'assets/models/female/middle/other/girl_skirt.gltf'
                modelUrlBot = 'assets/models/female/bottom/other/heels.gltf'

                imagePath = 'assets/images/sun.png';
            }
        } else if (weatherDescription.toLowerCase().includes('cloud')) {
            if (gender === 'lk'){
                modelUrlTop = 'assets/models/male/top/other/long_sleeve_shirt.gltf';
                modelUrlMid = 'assets/models/male/middle/other/jeans.gltf'
                modelUrlBot = 'assets/models/male/bottom/other/flip_flops.gltf'

                imagePath = 'assets/images/clouds.png';
            } else {
                modelUrlTop = 'assets/models/female/top/other/blouse_2.gltf';
                modelUrlMid = 'assets/models/female/middle/other/girl_skirt.gltf'
                modelUrlBot = 'assets/models/female/bottom/other/slipper.gltf'

                imagePath = 'assets/images/clouds.png';
            }
        } else if (weatherDescription.toLowerCase().includes('rain')) {
            if (gender === 'lk'){
                modelUrlTop = 'assets/models/male/top/rain/long_sleeve_t_shirt.gltf';
                modelUrlMid = 'assets/models/male/middle/other/jeans.gltf'
                modelUrlBot = 'assets/models/male/bottom/rain/boots.gltf'

                imagePath = 'assets/images/rain.png';
            } else {
                modelUrlTop = 'assets/models/female/top/rain/jacket.gltf';
                modelUrlMid = 'assets/models/female/middle/rain/jeans.gltf'
                modelUrlBot = 'assets/models/female/bottom/rain/Winter_Boots.gltf'

                imagePath = 'assets/images/rain.png';
            }
        } else if (weatherDescription.toLowerCase().includes('haze')) {
            if (gender === 'lk'){
                modelUrlTop = 'assets/models/male/top/other/long_sleeve_shirt.gltf';
                modelUrlMid = 'assets/models/male/middle/other/jeans.gltf'
                modelUrlBot = 'assets/models/male/bottom/other/converse_obj.gltf'

                imagePath = 'assets/images/few_clouds.png';
            } else {
                modelUrlTop = 'assets/models/female/top/other/blouse_2.gltf';
                modelUrlMid = 'assets/models/female/middle/other/girl_skirt.gltf'
                modelUrlBot = 'assets/models/female/bottom/other/Sandals.gltf'

                imagePath = 'assets/images/few_clouds.png';
            }
        } else {
            if (gender === 'lk'){
                modelUrlTop = 'assets/models/male/top/other/long_sleeve_shirt.gltf';
                modelUrlMid = 'assets/models/male/middle/other/jeans.gltf'
                modelUrlBot = 'assets/models/male/bottom/other/Shoes.gltf'

                imagePath = 'assets/images/rainbow.png';
            } else {
                modelUrlTop = 'assets/models/female/top/other/blouse_2.gltf';
                modelUrlMid = 'assets/models/female/middle/other/girl_skirt.gltf'
                modelUrlBot = 'assets/models/female/bottom/other/converse_obj.gltf'

                imagePath = 'assets/images/rainbow.png';
            }
        }

        // Load and draw the image on the canvasWeither
        const image = new Image();
        image.src = imagePath;

        image.onload = function () {
            context.drawImage(image, 0, 0, canvasWeither.width, canvasWeither.height);
        };

        loader.load('assets/models/environment.gltf', (gltf) => {
            const environment = gltf.scene;
            environment.scale.set(5, 5, 5); // Scale the environment
            environment.position.set(0, -3, 0); // Set the position of the environment
        
            // scene.add(environment);
            console.log('Environment glTF model loaded:', gltf);
        }, undefined, (error) => {
            console.error('Error loading environment glTF model:', error);
        });

        loader.load(modelUrlMid, (gltf) => {
            const model1 = gltf.scene;
            model1.position.y = 0;
            scene.add(model1);

            console.log('3D model loaded:', gltf);
        }, undefined, (error) => {
            console.error('Error loading 3D model:', error);
        });

        loader.load(modelUrlTop, (gltf) => {
            const model2 = gltf.scene;
            model2.scale.set(0.1, 0.1, 0.1);
            model2.position.y = 2;
            scene.add(model2);

            console.log('3D model loaded:', gltf);
        }, undefined, (error) => {
            console.error('Error loading 3D model:', error);
        });

        loader.load(modelUrlBot, (gltf) => {
            const model3 = gltf.scene;
            model3.position.y = -2;
            scene.add(model3);

            console.log('3D model loaded:', gltf);
        }, undefined, (error) => {
            console.error('Error loading 3D model:', error);
        });
        
        const animate = () => {
            requestAnimationFrame(animate);
        
            // Add any animation or interaction logic here
        
            renderer.render(scene, camera);
        };
        
        animate();

    } else {
        console.error('Invalid weather description:', weatherDescription);
        // Handle the case where weatherDescription is not a string
        context.fillStyle = 'white';  // Default to white for other conditions
        context.fillRect(0, 0, canvasWeither.width, canvasWeither.height);
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
    const canvasWeither = document.getElementById('weatherCanvas');
    canvasWeither.width = 600;
    canvasWeither.height = 400;
    canvasWeither.style.margin = '100px';

    // Create an element to display the weather description
    const weatherContainer = document.createElement('div');
    weatherContainer.id = 'weatherContainer';
    canvasWeither.appendChild(weatherContainer);

    const weatherDescriptionElement = document.createElement('div');
    weatherDescriptionElement.id = 'weatherDescription';
    weatherContainer.appendChild(weatherDescriptionElement);

    // You may want to use setInterval or other techniques to update the weather regularly

    // Note: In a complete application, you would likely use a front-end framework like React, Angular, or Vue.js for a more structured approach.
}

if (typeof window !== 'undefined') {
    // Ensure the script is run only in a browser environment
    main();
}
