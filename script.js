const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const unitSelect = document.getElementById("unit-select");

const cityEl = document.getElementById("city");
const dateEl = document.getElementById("date");
const tempEl = document.getElementById("temperature");
const iconEl = document.getElementById("weather-icon");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const precipEl = document.getElementById("precipitation");

const dailyForecastEl = document.getElementById("daily-forecast");
const hourlyForecastEl = document.getElementById("hourly-forecast");
const daySelectEl = document.getElementById("day-select");

// Units
let units = "metric"; // default

// State UI Helpers
function setLoadingState(isLoading) {
  if (isLoading) {
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";
  } else {
    searchBtn.disabled = false;
    searchBtn.textContent = "Search";
  }
}

function showError(message) {
  cityEl.textContent = message;
  dateEl.textContent = "";
  tempEl.textContent = "--";
  feelsLikeEl.textContent = "--";
  humidityEl.textContent = "--";
  windEl.textContent = "--";
  precipEl.textContent = "--";
  dailyForecastEl.innerHTML = "";
  hourlyForecastEl.innerHTML = "";
}

async function fetchCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("No results found");
  }
  return data.results[0]; // first match
}

async function fetchWeather(lat, lon) {
  const tempUnit = units === "metric" ? "celsius" : "fahrenheit";
  const windUnit = units === "metric" ? "kmh" : "mph";
  const precUnit = units === "metric" ? "mm" : "inch";

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precUnit}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

// Update UI with fetched data
function updateUI(data, cityName) {
  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;

  // Current weather
  cityEl.textContent = cityName;
  dateEl.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  tempEl.textContent = current.temperature_2m + "°";
  feelsLikeEl.textContent = current.apparent_temperature + "°";
  humidityEl.textContent = current.relative_humidity_2m + "%";
  windEl.textContent = current.wind_speed_10m + (units === "metric" ? " km/h" : " mph");
  precipEl.textContent = current.precipitation + (units === "metric" ? " mm" : " in");

  // TODO: Weather icon mapping (we can map weathercode → icon later)

  // Daily forecast
  dailyForecastEl.innerHTML = "";
  for (let i = 0; i < daily.time.length; i++) {
    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <p>${formatDate(daily.time[i])}</p>
      <p>${daily.temperature_2m_max[i]}° / ${daily.temperature_2m_min[i]}°</p>
    `;
    dailyForecastEl.appendChild(card);
  }

  // Hourly forecast (default = first day)
  updateHourlyForecast(hourly, daily.time[0]);
}

function updateHourlyForecast(hourly, selectedDay) {
  hourlyForecastEl.innerHTML = "";

  for (let i = 0; i < hourly.time.length; i++) {
    const date = new Date(hourly.time[i]);
    if (date.toISOString().startsWith(selectedDay)) {
      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <p>${date.getHours()}:00</p>
        <p>${hourly.temperature_2m[i]}°</p>
      `;
      hourlyForecastEl.appendChild(card);
    }
  }
}

// Search handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = input.value.trim();
  if (!query) return;

  setLoadingState(true);

  try {
    const coords = await fetchCoordinates(query);
    const weather = await fetchWeather(coords.latitude, coords.longitude);
    updateUI(weather, `${coords.name}, ${coords.country}`);
  } catch (err) {
    console.error(err);
    showError(err.message);
  } finally {
    setLoadingState(false);
  }
});

// Unit toggle
unitSelect.addEventListener("change", (e) => {
  units = e.target.value;
  form.dispatchEvent(new Event("submit")); // refetch with new units
});

// Default load (Lagos for example)
(async function init() {
  try {
    const coords = await fetchCoordinates("Lagos");
    const weather = await fetchWeather(coords.latitude, coords.longitude);
    updateUI(weather, `${coords.name}, ${coords.country}`);
  } catch (err) {
    console.error(err);
    showError("Failed to load default location");
  }
})();
