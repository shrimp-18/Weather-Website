const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const createWeatherCard = (city, weatherData, index) => {
        if (index === 0) {
                return `
            <div class="details">
                <h2>${city} (${weatherData.dt_txt.split(" ")[0]})</h2>
                <h6>Temperature: ${(weatherData.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Wind: ${weatherData.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherData.main.humidity}%</h6>
            </div>
            <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png" alt="weather-icon">
                <h6>${weatherData.weather[0].description}</h6>
            </div>`;
        } else {
                return `
            <li class="card">
                <h3>(${weatherData.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png" alt="weather-icon">
                <h6>Temp: ${(weatherData.main.temp - 273.15).toFixed(2)}°C</h6>
                <h6>Wind: ${weatherData.wind.speed} M/S</h6>
                <h6>Humidity: ${weatherData.main.humidity}%</h6>
            </li>`;
        }
};

const getWeatherDetails = (city, lat, lon) => {
        const apiKey = "3d1241ac33426844d842f4a23052aa57";
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        
        fetch(url)
                .then(response => response.json())
                .then(data => {
                        const uniqueDates = [];
                        const filteredData = data.list.filter(item => {
                                const date = new Date(item.dt_txt).getDate();
                                if (!uniqueDates.includes(date)) {
                                        uniqueDates.push(date);
                                        return true;
                                }
                                return false;
                        });
                        
                        cityInput.value = '';
                        currentWeatherDiv.innerHTML = '';
                        weatherCardsDiv.innerHTML = '';
                        
                        filteredData.forEach((weatherData, index) => {
                                const weatherCard = createWeatherCard(city, weatherData, index);
                                if (index === 0) {
                                        currentWeatherDiv.insertAdjacentHTML("beforeend", weatherCard);
                                } else {
                                        weatherCardsDiv.insertAdjacentHTML("beforeend", weatherCard);
                                }
                        });
                })
                .catch(() => {
                        alert("!!!");
                });
};

const getCityCoordinates = () => {
        const cityName = cityInput.value.trim();
        if (cityName === '') return;
        
        const apiKey = "3d1241ac33426844d842f4a23052aa57"; 
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
        
        fetch(url)
                .then(response => response.json())
                .then(data => {
                        if (!data.length) {
                                alert(`!!! ${cityName}`);
                                return;
                        }
                        
                        const { lat, lon, name } = data[0];
                        getWeatherDetails(name, lat, lon);
                })
                .catch(() => {
                        alert("!!!");
                });
};

const getUserLocation = () => {
        if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                        (position) => {
                                const { latitude, longitude } = position.coords;
                                getWeatherDetails("Your Location", latitude, longitude);
                        },
                        () => {
                                alert("!");
                        }
                );
        } else {
                alert("!");
        }
};

searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserLocation);