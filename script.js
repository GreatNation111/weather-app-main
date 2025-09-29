// const form = document.getElementById("search-form");
// const input = document.getElementById("search-input");
// const searchBtn = document.getElementById("search-btn");
// const unitSelect = document.getElementById("unit-select");

// const cityEl = document.getElementById("city");
// const dateEl = document.getElementById("date");
// const tempEl = document.getElementById("temperature");
// const iconEl = document.getElementById("weather-icon");
// const feelsLikeEl = document.getElementById("feels-like");
// const humidityEl = document.getElementById("humidity");
// const windEl = document.getElementById("wind");
// const precipEl = document.getElementById("precipitation");

// const dailyForecastEl = document.getElementById("daily-forecast");
// const hourlyForecastEl = document.getElementById("hourly-forecast");
// const daySelectEl = document.getElementById("day-select");

// // Units
// let units = "metric"; // default

// // State UI Helpers
// function setLoadingState(isLoading) {
//   if (isLoading) {
//     searchBtn.disabled = true;
//     searchBtn.textContent = "Searching...";
//   } else {
//     searchBtn.disabled = false;
//     searchBtn.textContent = "Search";
//   }
// }

// function showError(message) {
//   cityEl.textContent = message;
//   dateEl.textContent = "";
//   tempEl.textContent = "--";
//   feelsLikeEl.textContent = "--";
//   humidityEl.textContent = "--";
//   windEl.textContent = "--";
//   precipEl.textContent = "--";
//   dailyForecastEl.innerHTML = "";
//   hourlyForecastEl.innerHTML = "";
// }

// async function fetchCoordinates(city) {
//   const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
//     city
//   )}&count=1`;
//   const res = await fetch(url);
//   const data = await res.json();
//   if (!data.results || data.results.length === 0) {
//     throw new Error("No results found");
//   }
//   return data.results[0]; // first match
// }

// async function fetchWeather(lat, lon) {
//   const tempUnit = units === "metric" ? "celsius" : "fahrenheit";
//   const windUnit = units === "metric" ? "kmh" : "mph";
//   const precUnit = units === "metric" ? "mm" : "inch";

//   const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weathercode&hourly=temperature_2m,weathercode&timezone=auto&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&precipitation_unit=${precUnit}`;

//   const res = await fetch(url);
//   if (!res.ok) throw new Error("API error");
//   return res.json();
// }

// function formatDate(dateStr) {
//   const date = new Date(dateStr);
//   return date.toLocaleDateString(undefined, {
//     weekday: "long",
//     month: "short",
//     day: "numeric",
//   });
// }

// // Update UI with fetched data
// function updateUI(data, cityName) {
//   const current = data.current;
//   const daily = data.daily;
//   const hourly = data.hourly;

//   // Current weather
//   cityEl.textContent = cityName;
//   dateEl.textContent = new Date().toLocaleDateString(undefined, {
//     weekday: "long",
//     month: "short",
//     day: "numeric",
//   });
//   tempEl.textContent = current.temperature_2m + "°";
//   feelsLikeEl.textContent = current.apparent_temperature + "°";
//   humidityEl.textContent = current.relative_humidity_2m + "%";
//   windEl.textContent = current.wind_speed_10m + (units === "metric" ? " km/h" : " mph");
//   precipEl.textContent = current.precipitation + (units === "metric" ? " mm" : " in");

//   // TODO: Weather icon mapping (we can map weathercode → icon later)

//   // Daily forecast
//   dailyForecastEl.innerHTML = "";
//   for (let i = 0; i < daily.time.length; i++) {
//     const card = document.createElement("div");
//     card.className = "forecast-card";
//     card.innerHTML = `
//       <p>${formatDate(daily.time[i])}</p>
//       <p>${daily.temperature_2m_max[i]}° / ${daily.temperature_2m_min[i]}°</p>
//     `;
//     dailyForecastEl.appendChild(card);
//   }

//   // Hourly forecast (default = first day)
//   updateHourlyForecast(hourly, daily.time[0]);
// }

// function updateHourlyForecast(hourly, selectedDay) {
//   hourlyForecastEl.innerHTML = "";

//   for (let i = 0; i < hourly.time.length; i++) {
//     const date = new Date(hourly.time[i]);
//     if (date.toISOString().startsWith(selectedDay)) {
//       const card = document.createElement("div");
//       card.className = "forecast-card";
//       card.innerHTML = `
//         <p>${date.getHours()}:00</p>
//         <p>${hourly.temperature_2m[i]}°</p>
//       `;
//       hourlyForecastEl.appendChild(card);
//     }
//   }
// }

// // Search handler
// form.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   const query = input.value.trim();
//   if (!query) return;

//   setLoadingState(true);

//   try {
//     const coords = await fetchCoordinates(query);
//     const weather = await fetchWeather(coords.latitude, coords.longitude);
//     updateUI(weather, `${coords.name}, ${coords.country}`);
//   } catch (err) {
//     console.error(err);
//     showError(err.message);
//   } finally {
//     setLoadingState(false);
//   }
// });

// // Unit toggle
// unitSelect.addEventListener("change", (e) => {
//   units = e.target.value;
//   form.dispatchEvent(new Event("submit")); // refetch with new units
// });

// // Default load (Lagos for example)
// (async function init() {
//   try {
//     const coords = await fetchCoordinates("Lagos");
//     const weather = await fetchWeather(coords.latitude, coords.longitude);
//     updateUI(weather, `${coords.name}, ${coords.country}`);
//   } catch (err) {
//     console.error(err);
//     showError("Failed to load default location");
//   }
// })();

// Custom Dropdown Functionality
class CustomDropdown {
    constructor(dropdownId) {
        this.dropdown = document.getElementById(dropdownId);
        this.trigger = this.dropdown.querySelector('.dropdown-trigger');
        this.menu = this.dropdown.querySelector('.dropdown-menu');
        this.systemButton = this.dropdown.querySelector('#system-switch-btn');
        this.items = this.dropdown.querySelectorAll('.dropdown-item');
        
        this.currentSystem = 'metric'; // 'metric' or 'imperial'
        this.currentUnits = {
            temperature: 'celsius',
            wind: 'kmh',
            precipitation: 'mm'
        };
        
        this.init();
    }
    
    init() {
        // Trigger click event
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        // System switch button event
        this.systemButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.switchSystem();
        });
        
        // Item selection
        this.items.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectItem(item);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.close();
        });
        
        // Prevent menu click from closing dropdown
        this.menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Set initial state
        this.setInitialState();
    }
    
    setInitialState() {
        this.updateSystemButton();
        this.updateActiveItems();
    }
    
    toggle() {
        this.menu.classList.toggle('active');
        this.trigger.classList.toggle('active');
    }
    
    open() {
        this.menu.classList.add('active');
        this.trigger.classList.add('active');
    }
    
    close() {
        this.menu.classList.remove('active');
        this.trigger.classList.remove('active');
    }
    
    switchSystem() {
        // Toggle between metric and imperial
        this.currentSystem = this.currentSystem === 'metric' ? 'imperial' : 'metric';
        
        // Auto-select appropriate units when switching systems
        if (this.currentSystem === 'metric') {
            this.currentUnits.temperature = 'celsius';
            this.currentUnits.wind = 'kmh';
            this.currentUnits.precipitation = 'mm';
        } else {
            this.currentUnits.temperature = 'fahrenheit';
            this.currentUnits.wind = 'mph';
            this.currentUnits.precipitation = 'in';
        }
        
        this.updateSystemButton();
        this.updateActiveItems();
        
        // For future API integration
        this.dropdown.dispatchEvent(new CustomEvent('systemChange', {
            detail: { 
                system: this.currentSystem,
                units: this.getCurrentUnits()
            }
        }));
        
        console.log(`Switched to ${this.currentSystem} system`);
    }
    
    selectItem(item) {
        const type = item.getAttribute('data-type');
        const value = item.getAttribute('data-value');
        
        // Update current unit for this type
        this.currentUnits[type] = value;
        
        // Auto-update system based on unit selection
        if ((type === 'temperature' && value === 'fahrenheit') || 
            (type === 'wind' && value === 'mph') ||
            (type === 'precipitation' && value === 'in')) {
            this.currentSystem = 'imperial';
        } else if ((type === 'temperature' && value === 'celsius') || 
                   (type === 'wind' && value === 'kmh') ||
                   (type === 'precipitation' && value === 'mm')) {
            this.currentSystem = 'metric';
        }
        
        this.updateSystemButton();
        this.updateActiveItems();
        
        // For future API integration
        this.dropdown.dispatchEvent(new CustomEvent('unitChange', {
            detail: { 
                system: this.currentSystem,
                units: this.getCurrentUnits()
            }
        }));
        
        console.log(`Selected: ${type} - ${value}`);
    }
    
    updateSystemButton() {
        this.systemButton.textContent = this.currentSystem === 'metric' 
            ? 'Switch to Imperial' 
            : 'Switch to Metric';
    }
    
    updateActiveItems() {
        // Remove active class from all items
        this.items.forEach(item => {
            item.classList.remove('active');
            const checkIcon = item.querySelector('.check-icon');
            if (checkIcon) {
                checkIcon.style.display = 'none';
            }
        });
        
        // Add active class to current selected items
        this.items.forEach(item => {
            const type = item.getAttribute('data-type');
            const value = item.getAttribute('data-value');
            
            if (this.currentUnits[type] === value) {
                item.classList.add('active');
                const checkIcon = item.querySelector('.check-icon');
                if (checkIcon) {
                    checkIcon.style.display = 'block';
                }
            }
        });
    }
    
    getCurrentUnits() {
        return {
            temperature: this.currentUnits.temperature === 'celsius' ? '°C' : '°F',
            wind: this.currentUnits.wind === 'kmh' ? 'km/h' : 'mph',
            precipitation: this.currentUnits.precipitation === 'mm' ? 'mm' : 'in'
        };
    }
}

// Initialize dropdown when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const unitsDropdown = new CustomDropdown('units-dropdown');
    
    // Listen for system changes (for future API integration)
    document.getElementById('units-dropdown').addEventListener('systemChange', function(e) {
        console.log('Measurement system changed to:', e.detail.system);
        console.log('Current units:', e.detail.units);
    });
    
    // Listen for unit changes (for future API integration)
    document.getElementById('units-dropdown').addEventListener('unitChange', function(e) {
        console.log('Unit changed in system:', e.detail.system);
        console.log('Current units:', e.detail.units);
    });
});
// Day Selector Dropdown Functionality
class DaySelector {
    constructor(dropdownId) {
        this.dropdown = document.getElementById(dropdownId);
        this.trigger = this.dropdown.querySelector('.dropdown-trigger');
        this.menu = this.dropdown.querySelector('.dropdown-menu');
        this.activeDayElement = this.dropdown.querySelector('.active-day');
        this.dayItems = this.dropdown.querySelectorAll('.dropdown-item');
        
        this.currentDay = 'monday'; // Default day
        
        this.init();
    }
    
    init() {
        // Trigger click event
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        // Day selection
        this.dayItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectDay(item);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.close();
        });
        
        // Prevent menu click from closing dropdown
        this.menu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Set initial selection
        this.setInitialDay();
    }
    
    toggle() {
        this.menu.classList.toggle('active');
        this.trigger.classList.toggle('active');
    }
    
    open() {
        this.menu.classList.add('active');
        this.trigger.classList.add('active');
    }
    
    close() {
        this.menu.classList.remove('active');
        this.trigger.classList.remove('active');
    }
    
    selectDay(item) {
        const day = item.getAttribute('data-day');
        const dayLabel = item.querySelector('.day-label').textContent;
        
        // Update current day
        this.currentDay = day;
        
        // Update trigger text
        this.activeDayElement.textContent = dayLabel;
        
        // Update active states
        this.updateActiveStates();
        
        // Close dropdown
        this.close();
        
        // Dispatch event for day change (for future API integration)
        this.dropdown.dispatchEvent(new CustomEvent('dayChange', {
            detail: { 
                day: day,
                dayLabel: dayLabel
            }
        }));
        
        console.log(`Selected day: ${dayLabel}`);
    }
    
    setInitialDay() {
        // Set Monday as default active
        const mondayItem = this.dropdown.querySelector('[data-day="monday"]');
        if (mondayItem) {
            this.selectDay(mondayItem);
        }
    }
    
    updateActiveStates() {
        // Remove active class from all items
        this.dayItems.forEach(item => {
            item.classList.remove('active');
            const checkIcon = item.querySelector('.check-icon');
            if (checkIcon) {
                checkIcon.style.display = 'none';
            }
        });
        
        // Add active class to current day
        const currentItem = this.dropdown.querySelector(`[data-day="${this.currentDay}"]`);
        if (currentItem) {
            currentItem.classList.add('active');
            const checkIcon = currentItem.querySelector('.check-icon');
            if (checkIcon) {
                checkIcon.style.display = 'block';
            }
        }
    }
    
    // Method to programmatically set day (for future use)
    setDay(day) {
        const item = this.dropdown.querySelector(`[data-day="${day}"]`);
        if (item) {
            this.selectDay(item);
        }
    }
}

// Initialize day selector when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const daySelector = new DaySelector('day-selector');
    
    // Listen for day changes (for future API integration)
    document.getElementById('day-selector').addEventListener('dayChange', function(e) {
        console.log('Day changed to:', e.detail.dayLabel);
        // When API is integrated, this is where you'll fetch new hourly data
        // fetchHourlyForecast(e.detail.day);
    });
});

// Search Dropdown Functionality
class SearchDropdown {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchDropdown = document.getElementById('search-dropdown');
        this.searchForm = document.getElementById('search-form');
        this.dropdownItems = this.searchDropdown.querySelectorAll('.dropdown-item');
        
        this.init();
    }
    
    init() {
        // Input focus event
        this.searchInput.addEventListener('focus', () => {
            this.showDropdown();
        });
        
        // Input typing event
        this.searchInput.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
        
        // Form submission
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });
        
        // Dropdown item selection
        this.dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                this.selectCity(item);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchDropdown.contains(e.target)) {
                this.hideDropdown();
            }
        });
        
        // Keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }
    
    showDropdown() {
        this.searchDropdown.classList.add('active');
    }
    
    hideDropdown() {
        this.searchDropdown.classList.remove('active');
    }
    
    handleInput(searchTerm) {
        if (searchTerm.length > 0) {
            this.showDropdown();
            
            // For now, just filter the existing dummy data
            // Later, this will make API calls
            this.filterSuggestions(searchTerm);
            
            // Simulate API call delay (remove this in production)
            console.log('Searching for:', searchTerm);
            
        } else {
            // Show default suggestions when input is empty
            this.showDefaultSuggestions();
        }
    }
    
    filterSuggestions(searchTerm) {
        const items = this.searchDropdown.querySelectorAll('.dropdown-item');
        const searchLower = searchTerm.toLowerCase();
        let hasVisibleItems = false;
        
        items.forEach(item => {
            const cityName = item.querySelector('.city-name').textContent.toLowerCase();
            if (cityName.includes(searchLower)) {
                item.style.display = 'flex';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show no results message if no items match
        this.toggleNoResults(!hasVisibleItems);
    }
    
    showDefaultSuggestions() {
        const items = this.searchDropdown.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            item.style.display = 'flex';
        });
        this.toggleNoResults(false);
    }
    
    toggleNoResults(show) {
        let noResults = this.searchDropdown.querySelector('.no-results');
        
        if (show && !noResults) {
            noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No cities found';
            this.searchDropdown.appendChild(noResults);
        } else if (!show && noResults) {
            noResults.remove();
        }
    }
    
    selectCity(item) {
        const cityName = item.querySelector('.city-name').textContent;
        this.searchInput.value = cityName;
        this.hideDropdown();
        
        // Dispatch event for city selection (for future API integration)
        this.searchForm.dispatchEvent(new CustomEvent('citySelect', {
            detail: { 
                city: cityName
            }
        }));
        
        console.log('Selected city:', cityName);
    }
    
    handleSearch() {
        const searchTerm = this.searchInput.value.trim();
        if (searchTerm) {
            // Dispatch event for search (for future API integration)
            this.searchForm.dispatchEvent(new CustomEvent('citySearch', {
                detail: { 
                    query: searchTerm
                }
            }));
            
            console.log('Searching for city:', searchTerm);
            this.hideDropdown();
        }
    }
    
    handleKeyboard(e) {
        const visibleItems = Array.from(this.dropdownItems).filter(item => 
            item.style.display !== 'none'
        );
        
        if (e.key === 'ArrowDown' && visibleItems.length > 0) {
            e.preventDefault();
            // Add keyboard navigation logic here
        } else if (e.key === 'Escape') {
            this.hideDropdown();
        }
    }
    
    // Method to update suggestions (for future API integration)
    updateSuggestions(cities) {
        const dropdown = this.searchDropdown;
        dropdown.innerHTML = ''; // Clear existing items
        
        if (cities.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No cities found';
            dropdown.appendChild(noResults);
            return;
        }
        
        cities.forEach(city => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerHTML = `
                <svg class="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span class="city-name">${city.name}, ${city.country}</span>
            `;
            
            item.addEventListener('click', () => {
                this.selectCity(item);
            });
            
            dropdown.appendChild(item);
        });
        
        this.dropdownItems = dropdown.querySelectorAll('.dropdown-item');
    }
}

// Initialize search dropdown when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const searchDropdown = new SearchDropdown();
    
    // Listen for city selection (for future API integration)
    document.getElementById('search-form').addEventListener('citySelect', function(e) {
        console.log('City selected:', e.detail.city);
        // When API is integrated: fetchWeatherData(e.detail.city);
    });
    
    // Listen for search (for future API integration)
    document.getElementById('search-form').addEventListener('citySearch', function(e) {
        console.log('Search query:', e.detail.query);
        // When API is integrated: searchCities(e.detail.query);
    });
});