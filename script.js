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

// Search Functionality with Exact UI States
class SearchDropdown {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchDropdown = document.getElementById('search-dropdown');
        this.searchForm = document.getElementById('search-form');
        this.searchBtn = document.getElementById('search-btn');
        
        // State containers
        this.searchProgress = document.getElementById('search-progress-state');
        this.noResultsState = document.getElementById('no-results-state');
        this.errorState = document.getElementById('error-state');
        
        // Buttons
        this.noResultsRetryBtn = document.getElementById('no-results-retry-btn');
        this.errorRetryBtn = document.getElementById('error-retry-btn');
        this.errorCancelBtn = document.getElementById('error-cancel-btn');
        
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
        
        // Retry buttons
        this.noResultsRetryBtn.addEventListener('click', () => {
            this.hideState('noResults');
            this.searchInput.focus();
        });
        
        this.errorRetryBtn.addEventListener('click', () => {
            this.hideState('error');
            this.handleSearch(); // Retry the search
        });
        
        this.errorCancelBtn.addEventListener('click', () => {
            this.hideState('error');
            // Optionally reset to default state
            this.showState('weather');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.searchDropdown.contains(e.target)) {
                this.hideDropdown();
            }
        });
        
        // Set default suggestions
        this.showDefaultSuggestions();
    } 
    
    
    // ===== STATE MANAGEMENT =====
    
    showState(state) {
        // Hide all states first
        this.hideAllStates();
        
        switch(state) {
            case 'progress':
                this.searchProgress.classList.add('active');
                break;
            case 'noResults':
                this.noResultsState.classList.add('active');
                // Hide weather content but keep search visible
                document.querySelector('.weather-container').style.display = 'none';
                document.querySelector('.daily-forecast').style.display = 'none';
                document.querySelector('.hourly-forecast').style.display = 'none';
                break;
            case 'error':
                this.errorState.classList.add('active');
                // Hide EVERYTHING except header
                document.querySelector('.weather-container').style.display = 'none';
                document.querySelector('.daily-forecast').style.display = 'none';
                document.querySelector('.hourly-forecast').style.display = 'none';
                document.querySelector('.search-container').style.display = 'none';
                document.querySelector('.main-title').style.display = 'none';
                document.querySelector('.no-results-state').style.display = 'none';
                break;
            case 'weather':
                // Show everything (normal state)
                this.noResultsState.classList.remove('active');
                this.errorState.classList.remove('active');
                document.querySelector('.weather-container').style.display = 'flex';
                document.querySelector('.daily-forecast').style.display = 'block';
                document.querySelector('.hourly-forecast').style.display = 'block';
                document.querySelector('.search-container').style.display = 'flex';
                document.querySelector('.main-title').style.display = 'block';
                break;
        }
    }
    
   
    
    hideState(state) {
        switch(state) {
            case 'progress':
                this.searchProgress.classList.remove('active');
                break;
            case 'noResults':
                this.noResultsState.classList.remove('active');
                break;
            case 'error':
                this.errorState.classList.remove('active');
                // Restore normal view
                this.showState('weather');
                break;
        }
    }
    
    hideAllStates() {
        this.searchProgress.classList.remove('active');
        this.noResultsState.classList.remove('active');
        this.errorState.classList.remove('active');
    }
    
    // ===== SEARCH FUNCTIONALITY =====
    
    async handleSearch() {
        const searchTerm = this.searchInput.value.trim();
        
        if (!searchTerm) {
            this.searchInput.focus();
            return;
        }
        
        // Show progress state (under input)
        this.showState('progress');
        this.hideDropdown();
        
        try {
            // Simulate API call
            await this.simulateAPICall(searchTerm);
            
            // For demo - randomly show results or no results
            const hasResults = Math.random() > 0.5; // 50% chance of results
            
            if (hasResults) {
                this.hideAllStates();
                this.showSearchResults(this.getMockResults(searchTerm));
            } else {
                this.showState('noResults');
            }
            
        } catch (error) {
            // Show error state (full page)
            this.showState('error');
            console.error('Search error:', error);
        }
    }
    
    simulateAPICall(searchTerm) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate occasional errors
                if (Math.random() < 0.2) {
                    reject(new Error('API connection failed'));
                } else {
                    resolve();
                }
            }, 2000);
        });
    }
    
    // ===== DROPDOWN MANAGEMENT =====
    
    showDropdown() {
        this.searchDropdown.classList.add('active');
    }
    
    hideDropdown() {
        this.searchDropdown.classList.remove('active');
    }
    
    handleInput(searchTerm) {
        if (searchTerm.length > 0) {
            this.showDropdown();
            this.filterSuggestions(searchTerm);
        } else {
            this.showDefaultSuggestions();
        }
    }
    
    showDefaultSuggestions() {
        const defaultCities = [
            { name: 'Berlin', country: 'Germany' },
            { name: 'Paris', country: 'France' },
            { name: 'London', country: 'United Kingdom' },
            { name: 'Madrid', country: 'Spain' }
        ];
        this.updateDropdownItems(defaultCities);
    }
    
    filterSuggestions(searchTerm) {
        const defaultCities = [
            { name: 'Berlin', country: 'Germany' },
            { name: 'Paris', country: 'France' },
            { name: 'London', country: 'United Kingdom' },
            { name: 'Madrid', country: 'Spain' }
        ];
        
        const filtered = defaultCities.filter(city => 
            city.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filtered.length === 0) {
            this.showNoResultsInDropdown();
        } else {
            this.updateDropdownItems(filtered);
        }
    }
    
    showNoResultsInDropdown() {
        this.searchDropdown.innerHTML = `
            <div class="dropdown-item no-results-dropdown">
                <span>No results found</span>
            </div>
        `;
    }
    
    updateDropdownItems(cities) {
        this.searchDropdown.innerHTML = '';
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
                this.selectCity(city);
            });
            this.searchDropdown.appendChild(item);
        });
    }
    
    showSearchResults(cities) {
        console.log('Search results:', cities);
        // In real app, update weather display here
        alert(`Found ${cities.length} results!`);
    }
    
    selectCity(city) {
        this.searchInput.value = `${city.name}, ${city.country}`;
        this.hideDropdown();
        console.log('Selected city:', city);
    }
    
    getMockResults(searchTerm) {
        return [
            { name: searchTerm, country: 'Country' },
            { name: `${searchTerm} City`, country: 'Nation' }
        ];
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    new SearchDropdown();
});