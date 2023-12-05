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
async function searchCity() {
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
        const locationName = values[2].toLowerCase();
        const cityName = locationName.slice(locationName.indexOf(' ') + 1, -1);
        return levenshteinDistance(cityName, searchInput) < 3;
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
            console.log("asjdas");
            document.getElementById('result').textContent = `City: ${originalInput}, Found: ${foundCity}, Latitude: ${latitude}, Longitude: ${longitude}`;
            document.getElementById('result').style.display = 'block';
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
            document.getElementById('result').textContent = `City: ${originalInput}, Found: ${foundCity}, Latitude: ${latitude}, Longitude: ${longitude}`;
            document.getElementById('result').style.display = 'block';
        } else {
            document.getElementById('result').textContent = `City not found.`;
            document.getElementById('result').style.display = 'block';
        }
    }
}