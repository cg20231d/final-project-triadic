import pygame
import requests

# OpenWeatherMap API key
api_key = 'bab5915f023f7655f2aa18da9b2dbe4e'

def get_weather_data_by_coordinates(latitude, longitude):
    base_url = 'http://api.openweathermap.org/data/2.5/weather'
    params = {'lat': latitude, 'lon': longitude, 'appid': api_key}

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()  # Raise an HTTPError for bad responses
        data = response.json()
        return data
    except requests.exceptions.HTTPError as errh:
        print(f"HTTP Error: {errh}")
    except requests.exceptions.ConnectionError as errc:
        print(f"Error Connecting: {errc}")
    except requests.exceptions.Timeout as errt:
        print(f"Timeout Error: {errt}")
    except requests.exceptions.RequestException as err:
        print(f"Request Error: {err}")
    return None

def display_weather_data(data):
    if data and 'main' in data:
        print(data, "\n")  # Display the full data for reference

        # Extract relevant information from the API response
        temperature = data['main']['temp'] - 273
        weather_description = data['weather'][0]['description']

        # Display the weather information
        print(f'Temperature: {temperature}C')
        print(f'Weather: {weather_description}')

        # Graphics rendering based on weather
        set_background_color(weather_description)

def set_background_color(weather_description):
    # Set background color based on weather description
    if 'clear' in weather_description.lower():
        screen.fill((135, 206, 250))  # Light Blue for clear sky
    elif 'cloud' in weather_description.lower():
        screen.fill((192, 192, 192))  # Silver for cloudy
    elif 'rain' in weather_description.lower():
        screen.fill((0, 0, 139))  # Dark Blue for rain
    elif 'haze' in weather_description.lower():
        screen.fill((255, 255, 127))
    else:
        screen.fill((255, 255, 255))  # White for other conditions

def main():
    pygame.init()

    # Set up the graphical window
    window_size = (800, 600)
    global screen
    screen = pygame.display.set_mode(window_size)
    pygame.display.set_caption('Weather Visualization')

    running = True
    # Surabaya
    # latitude = -7.2575
    # longitude = 112.7521
    
    # Jeddah
    latitude = 21.492500
    longitude = 39.177570

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        # Fetch weather data
        weather_data = get_weather_data_by_coordinates(latitude, longitude)

        # Display weather data and update graphics
        display_weather_data(weather_data)

        pygame.display.flip()

    pygame.quit()

if __name__ == "__main__":
    main()
