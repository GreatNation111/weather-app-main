
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

// OpenMeteo API Service - Add this NEW class
class WeatherAPI {
    constructor() {
        this.baseUrl = 'https://api.open-meteo.com/v1';
        this.geocodingUrl = 'https://geocoding-api.open-meteo.com/v1';
    }
    
   // In WeatherAPI class - ADD this method:
async getSunriseSunsetData(latitude, longitude) {
    try {
        const response = await fetch(
            `${this.baseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunrise,sunset&timezone=auto`
        );
        
        if (!response.ok) throw new Error('Sunrise/sunset API error');
        
        const data = await response.json();
        return data.daily;
        
    } catch (error) {
        console.error('Sunrise/sunset data fetch error:', error);
        throw error;
    }
}

    // Search for locations by name
    async searchLocations(query) {
        try {
            console.log('Searching for:', query);
            const response = await fetch(
                `${this.geocodingUrl}/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
            );
            
            if (!response.ok) throw new Error('Geocoding API error');
            
            const data = await response.json();
            return data.results || [];
            
        } catch (error) {
            console.error('Location search error:', error);
            throw error;
        }
    }
    
   

//  UPDATED the getWeatherData method to include sunrise/sunset:
async getWeatherData(latitude, longitude) {
    try {
        const response = await fetch(
            `${this.baseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&hourly=temperature_2m,weather_code&timezone=auto&forecast_days=7`
        );
        
        if (!response.ok) throw new Error('Weather API error');
        
        return await response.json();
        
    } catch (error) {
        console.error('Weather data fetch error:', error);
        throw error;
    }
}
    // Map weather codes to existing icons
    getWeatherIcon(code) {
        const iconMap = {
            0: 'icon-sunny.webp',
            1: 'icon-partly-cloudy.webp', 
            2: 'icon-partly-cloudy.webp',
            3: 'icon-overcast.webp',
            45: 'icon-fog.webp',
            48: 'icon-fog.webp',
            51: 'icon-drizzle.webp',
            53: 'icon-drizzle.webp',
            55: 'icon-drizzle.webp',
            61: 'icon-rain.webp',
            63: 'icon-rain.webp',
            65: 'icon-rain.webp',
            71: 'icon-snow.webp',
            73: 'icon-snow.webp',
            75: 'icon-snow.webp',
            80: 'icon-rain.webp',
            81: 'icon-rain.webp',
            82: 'icon-storm.webp',
            95: 'icon-storm.webp',
            96: 'icon-storm.webp',
            99: 'icon-storm.webp'
        };
        
        return iconMap[code] || 'icon-partly-cloudy.webp';
    }
    
    // Get weather description
    getWeatherDescription(code) {
        const weatherCodes = {
            0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            45: 'Fog', 48: 'Fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
            61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
            71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
            80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Heavy rain showers',
            95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
        };
        return weatherCodes[code] || 'Partly cloudy';
    }
}

// ===== FIXED SearchDropdown Class =====
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
        this.errorRetryBtn = document.getElementById('error-retry-btn');
    
        this.weatherAPI = new WeatherAPI();
        
            // FIX: Better error handling for BackgroundManager initialization
try {
    this.backgroundManager = new BackgroundManager();
    console.log('✅ BackgroundManager initialized successfully');
} catch (error) {
    console.error('❌ BackgroundManager initialization failed:', error);
    // Create a proper fallback
    this.backgroundManager = this.createFallbackBackgroundManager();
}
        
        // FIX: Store current weather data for unit conversions
        this.currentWeatherData = null;
        this.currentLocation = null;
        
        this.hourlyData = null;
        this.currentDayIndex = 0;

        this.init();
    }
createFallbackBackgroundManager() {
    return {
        updateBackground: function(weatherCode, isDaytime, currentTime) {
            console.log('Fallback background update:', { weatherCode, isDaytime });
            // Simple fallback - just set a basic background color
            const background = document.getElementById('weather-background');
            if (background) {
                background.style.background = isDaytime ? 
                    'linear-gradient(135deg, hsl(210, 100%, 85%), hsl(200, 100%, 70%))' :
                    'linear-gradient(135deg, hsl(240, 60%, 10%), hsl(260, 50%, 20%))';
            }
        },
        isDaytime: function(sunrise, sunset, currentTime) {
            // Simple fallback daytime detection
            const current = new Date(currentTime);
            const sunriseTime = new Date(sunrise);
            const sunsetTime = new Date(sunset);
            return current > sunriseTime && current < sunsetTime;
        },
        init: function() { console.log('Using fallback background manager'); }
    };
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
        
        // Error state button
        if (this.errorRetryBtn) {
            this.errorRetryBtn.addEventListener('click', () => {
                this.hideState('error');
                this.handleSearch();
            });
        }
        
        // Proper outside click detection
        document.addEventListener('click', (e) => {
            if (!this.searchContainer.contains(e.target)) {
                this.hideDropdown();
            }
        });
        
        // Set default suggestions
        this.showDefaultSuggestions();
    }


    // ===== STATE MANAGEMENT =====
    
    showState(state) {
        this.hideAllStates();
        
        switch(state) {
            case 'progress':
                this.searchProgress.classList.add('active');
                break;
            case 'noResults':
                this.noResultsState.classList.add('active');
                document.querySelector('.weather-container').style.display = 'none';
                document.querySelector('.daily-forecast').style.display = 'none';
                document.querySelector('.hourly-forecast').style.display = 'none';
                break;
            case 'error':
                this.errorState.classList.add('active');
                document.querySelector('.weather-container').style.display = 'none';
                document.querySelector('.daily-forecast').style.display = 'none';
                document.querySelector('.hourly-forecast').style.display = 'none';
                document.querySelector('.search-container').style.display = 'none';
                document.querySelector('.main-title').style.display = 'none';
                document.querySelector('.no-results-state').style.display = 'none';
                break;
            case 'weather':
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
                this.showState('weather');
                break;
        }
    }
    
    hideAllStates() {
        this.searchProgress.classList.remove('active');
        this.noResultsState.classList.remove('active');
        this.errorState.classList.remove('active');
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
            this.debouncedSearch(searchTerm);
        } else {
            this.showDefaultSuggestions();
        }
    }

    debouncedSearch(searchTerm) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        this.searchTimeout = setTimeout(async () => {
            await this.performLocationSearch(searchTerm);
        }, 300);
    }

    async performLocationSearch(searchTerm) {
        try {
            this.searchDropdown.innerHTML = `
                <div class="dropdown-item loading">
                    <span>Searching...</span>
                </div>
            `;
            
            const locations = await this.weatherAPI.searchLocations(searchTerm);
            
            if (locations.length === 0) {
                this.showNoResultsInDropdown();
            } else {
                this.updateDropdownItems(locations);
            }
            
        } catch (error) {
            console.error('Location search error:', error);
            this.showNoResultsInDropdown();
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
    
    showNoResultsInDropdown() {
        this.searchDropdown.innerHTML = `
            <div class="dropdown-item no-results-dropdown">
                <span>No results found</span>
            </div>
        `;
    }
    
    updateDropdownItems(locations) {
        this.searchDropdown.innerHTML = '';
        locations.forEach(location => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';
            item.innerHTML = `
                <svg class="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span class="city-name">${location.name}, ${location.country}</span>
            `;
            item.addEventListener('click', () => {
                this.selectCity({
                    name: location.name,
                    country: location.country,
                    latitude: location.latitude,
                    longitude: location.longitude
                });
            });
            this.searchDropdown.appendChild(item);
        });
    }

    // ===== WEATHER DATA MANAGEMENT =====
    
    async fetchAndDisplayWeather(location) {
        try {
            this.showState('progress');
            
            const weatherData = await this.weatherAPI.getWeatherData(
                location.latitude, 
                location.longitude
            );
            
            // FIX: Store the data for unit conversions
            this.currentWeatherData = weatherData;
            this.currentLocation = location;
            
            // Store hourly data for day selector
            if (weatherData.hourly) {
                this.storeHourlyData(weatherData.hourly);
            }
            
            this.updateWeatherUI(weatherData, location);
            
            // Update sunrise/sunset times
            if (weatherData.daily) {
                this.updateSunTimes(weatherData.daily, weatherData.current.time);
            }
            
            this.updateHourlyForecastForDay('monday');
            
            this.showState('weather');
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showMockWeather(location);
        }
    }

// In SearchDropdown class - UPDATE the updateWeatherUI method:
updateWeatherUI(weatherData, location) {
    const current = weatherData.current;
    const daily = weatherData.daily;
    
    console.log('Updating UI with real data:', current);
    
    // Update current weather with REAL data
    document.getElementById('city').textContent = `${location.name}, ${location.country}`;
    document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°`;
    document.getElementById('feels-like').textContent = `${Math.round(current.apparent_temperature)}°`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    document.getElementById('precipitation').textContent = `${current.precipitation || 0} mm`;
    
    // Update weather icon with REAL data
    const weatherIcon = document.getElementById('weather-icon');
    const iconFile = this.weatherAPI.getWeatherIcon(current.weather_code);
    weatherIcon.src = `assets/images/${iconFile}`;
    weatherIcon.alt = this.weatherAPI.getWeatherDescription(current.weather_code);
    
    // Update date with REAL data
    const currentDate = new Date(current.time);
    document.getElementById('date').textContent = currentDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Update daily forecast with REAL data
    if (daily && daily.time.length > 0) {
        this.updateDailyForecast(daily);
    }
    
    // FIX: Update sunrise/sunset times immediately
    if (daily && daily.sunrise && daily.sunset) {
        this.updateSunTimes(daily, current.time);
    }
    
 
    
    // FIX: Update background with real data (with better error handling)
   if (daily && daily.sunrise && daily.sunset && this.backgroundManager) {
    try {
        const isDaytime = this.backgroundManager.isDaytime(
            daily.sunrise[0], 
            daily.sunset[0], 
            current.time
        );
        
        this.backgroundManager.updateBackground(
            current.weather_code,
            isDaytime,
            current.time
        );
    } catch (error) {
        console.error('Background update error:', error);
        // Don't break the app - continue without background
    }
} else {
    console.log('Background update skipped - missing data or manager');
}

    console.log('Weather data updated with real API data!');
}
    updateDailyForecast(dailyData) {
        const forecastCards = document.querySelectorAll('.forecast-cards .forecast-card');
        
        forecastCards.forEach((card, index) => {
            if (dailyData.time[index]) {
                const dayElement = card.querySelector('.day');
                const highTempElement = card.querySelector('.high');
                const lowTempElement = card.querySelector('.low');
                const iconElement = card.querySelector('img');
                
                // Update day name
                const date = new Date(dailyData.time[index]);
                dayElement.textContent = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                // Update temperatures
                if (dailyData.temperature_2m_max[index]) {
                    highTempElement.textContent = `${Math.round(dailyData.temperature_2m_max[index])}°`;
                }
                if (dailyData.temperature_2m_min[index]) {
                    lowTempElement.textContent = `${Math.round(dailyData.temperature_2m_min[index])}°`;
                }
                
                // Update icon
                if (dailyData.weather_code[index]) {
                    const iconFile = this.weatherAPI.getWeatherIcon(dailyData.weather_code[index]);
                    iconElement.src = `assets/images/${iconFile}`;
                }
            }
        });
    }

    // FIXED: Unit conversion using stored real data
    convertUnits(system) {
        if (!this.currentWeatherData) {
            console.log('No weather data available for conversion');
            return;
        }
        
        const current = this.currentWeatherData.current;
        
        if (system === 'imperial') {
            // Convert to Imperial
            document.getElementById('temperature').textContent = `${Math.round((current.temperature_2m * 9/5) + 32)}°`;
            document.getElementById('feels-like').textContent = `${Math.round((current.apparent_temperature * 9/5) + 32)}°`;
            document.getElementById('wind').textContent = `${Math.round(current.wind_speed_10m / 1.609)} mph`;
            document.getElementById('precipitation').textContent = `${(current.precipitation * 0.0393701).toFixed(2)} in`;
        } else {
            // Convert to Metric
            document.getElementById('temperature').textContent = `${Math.round(current.temperature_2m)}°`;
            document.getElementById('feels-like').textContent = `${Math.round(current.apparent_temperature)}°`;
            document.getElementById('wind').textContent = `${Math.round(current.wind_speed_10m)} km/h`;
            document.getElementById('precipitation').textContent = `${current.precipitation || 0} mm`;
        }
        
        // Also convert forecast temperatures
        this.convertForecastTemperatures(system);
    }

    convertForecastTemperatures(system) {
        if (!this.currentWeatherData || !this.currentWeatherData.daily) return;
        
        const dailyData = this.currentWeatherData.daily;
        const dailyHighs = document.querySelectorAll('.forecast-card .high');
        const dailyLows = document.querySelectorAll('.forecast-card .low');
        const hourlyTemps = document.querySelectorAll('.hourly-forecast .temp');
        
        dailyHighs.forEach((element, index) => {
            if (dailyData.temperature_2m_max[index]) {
                const temp = dailyData.temperature_2m_max[index];
                element.textContent = system === 'imperial' 
                    ? `${Math.round((temp * 9/5) + 32)}°` 
                    : `${Math.round(temp)}°`;
            }
        });
        
        dailyLows.forEach((element, index) => {
            if (dailyData.temperature_2m_min[index]) {
                const temp = dailyData.temperature_2m_min[index];
                element.textContent = system === 'imperial' 
                    ? `${Math.round((temp * 9/5) + 32)}°` 
                    : `${Math.round(temp)}°`;
            }
        });
        
        // Convert hourly temperatures if available
        if (this.hourlyData && this.hourlyData.temperature_2m) {
            hourlyTemps.forEach((element, index) => {
                if (this.hourlyData.temperature_2m[index]) {
                    const temp = this.hourlyData.temperature_2m[index];
                    element.textContent = system === 'imperial' 
                        ? `${Math.round((temp * 9/5) + 32)}°` 
                        : `${Math.round(temp)}°`;
                }
            });
        }
    }

    storeHourlyData(hourlyData) {
        this.hourlyData = hourlyData;
        this.dailyHourlyData = this.groupHourlyDataByDay(hourlyData);
    }

    groupHourlyDataByDay(hourlyData) {
        if (!hourlyData || !hourlyData.time) return {};
        
        const dailyData = {};
        
        hourlyData.time.forEach((timestamp, index) => {
            const date = new Date(timestamp);
            const dayKey = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                timeZone: 'UTC' 
            }).toLowerCase();
            
            if (!dailyData[dayKey]) {
                dailyData[dayKey] = [];
            }
            
            dailyData[dayKey].push({
                time: timestamp,
                temperature: hourlyData.temperature_2m[index],
                weatherCode: hourlyData.weather_code[index],
                hour: date.getHours()
            });
        });
        
        return dailyData;
    }

    updateHourlyForecastForDay(day) {
        if (!this.dailyHourlyData || !this.dailyHourlyData[day]) {
            console.log('No hourly data available for:', day);
            return;
        }
        
        const dayData = this.dailyHourlyData[day];
        const hourlyCards = document.querySelectorAll('.hourly-forecast .forecast-card');
        
        console.log(`Updating ${day} with ${dayData.length} hours of data`);
        
        // Update with new data for all available hours
        dayData.forEach((hourData, index) => {
            if (hourlyCards[index]) {
                const hourElement = hourlyCards[index].querySelector('.hour');
                const tempElement = hourlyCards[index].querySelector('.temp');
                const iconElement = hourlyCards[index].querySelector('img');
                
                const time = new Date(hourData.time);
                const hour = time.getHours();
                const displayHour = hour === 0 ? '12 AM' : 
                                   hour < 12 ? `${hour} AM` : 
                                   hour === 12 ? '12 PM' : 
                                   `${hour - 12} PM`;
                
                hourElement.textContent = displayHour;
                tempElement.textContent = `${Math.round(hourData.temperature)}°`;
                
                const iconFile = this.weatherAPI.getWeatherIcon(hourData.weatherCode);
                iconElement.src = `assets/images/${iconFile}`;
                iconElement.alt = this.weatherAPI.getWeatherDescription(hourData.weatherCode);
            }
        });
    }

    // ===== SUNRISE/SUNSET FIXES =====
updateSunTimes(sunData, currentTime) {
    if (!sunData || !sunData.sunrise || !sunData.sunset || !sunData.sunrise[0] || !sunData.sunset[0]) {
        console.log('No valid sunrise/sunset data available:', sunData);
        return;
    }
    
    console.log('Sunrise/sunset data received:', {
        sunrise: sunData.sunrise[0],
        sunset: sunData.sunset[0]
    });
    
    try {
        // Format and display sunrise/sunset times
        const sunriseTime = this.formatTime(sunData.sunrise[0]);
        const sunsetTime = this.formatTime(sunData.sunset[0]);
        
        console.log('Formatted times:', { sunriseTime, sunsetTime });
        
        document.getElementById('sunrise-time').textContent = sunriseTime;
        document.getElementById('sunset-time').textContent = sunsetTime;
        
        // Update current time label
        this.updateCurrentTimeLabel(currentTime);
        
        // Update day progress
        this.updateDayProgress(sunData.sunrise[0], sunData.sunset[0], currentTime);
        
    } catch (error) {
        console.error('Error updating sun times:', error);
    }
}

    formatTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', {
            timeZone: 'UTC',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    updateCurrentTimeLabel(currentTimeIso) {
        const currentTimeElement = document.getElementById('current-time-label');
        if (!currentTimeElement) return;
        
        const apiTime = new Date(currentTimeIso);
        const apiTimeString = apiTime.toLocaleTimeString('en-US', {
            timeZone: 'UTC',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        currentTimeElement.textContent = `Current: ${apiTimeString}`;
    }

    updateDayProgress(sunriseIso, sunsetIso, currentTimeIso) {
        const sunrise = new Date(sunriseIso).getTime();
        const sunset = new Date(sunsetIso).getTime();
        const currentTime = new Date(currentTimeIso).getTime();
        
        if (currentTime < sunrise) {
            this.updateProgressElements(0, 'before-sunrise');
        } else if (currentTime > sunset) {
            this.updateProgressElements(100, 'after-sunset');
        } else {
            const dayDuration = sunset - sunrise;
            const timeSinceSunrise = currentTime - sunrise;
            const progressPercent = (timeSinceSunrise / dayDuration) * 100;
            this.updateProgressElements(progressPercent, 'daylight');
        }
        
        this.updateProgressText(sunrise, sunset, currentTime);
    }

    updateProgressElements(progressPercent, state) {
        const progressFill = document.getElementById('day-progress-fill');
        const currentMarker = document.getElementById('current-time-marker');
        
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
        
        if (currentMarker) {
            if (state === 'before-sunrise' || state === 'after-sunset') {
                currentMarker.style.display = 'none';
            } else {
                currentMarker.style.display = 'block';
                currentMarker.style.left = `${progressPercent}%`;
            }
        }
    }

    updateProgressText(sunrise, sunset, currentTime) {
        const progressTimeElement = document.getElementById('progress-time');
        if (!progressTimeElement) return;
        
        const now = new Date(currentTime);
        const sunsetTime = new Date(sunset);
        
        if (now < sunsetTime) {
            const timeUntilSunset = sunsetTime - now;
            const hours = Math.floor(timeUntilSunset / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntilSunset % (1000 * 60 * 60)) / (1000 * 60));
            progressTimeElement.textContent = `Daylight: ${hours}h ${minutes}m remaining`;
        } else {
            const nextSunrise = new Date(sunrise);
            nextSunrise.setDate(nextSunrise.getDate() + 1);
            const timeUntilSunrise = nextSunrise - now;
            const hours = Math.floor(timeUntilSunrise / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntilSunrise % (1000 * 60 * 60)) / (1000 * 60));
            progressTimeElement.textContent = `Night: ${hours}h ${minutes}m until sunrise`;
        }
    }

    // ===== SEARCH FUNCTIONALITY =====
    
    async handleSearch() {
        const searchTerm = this.searchInput.value.trim();
        
        if (!searchTerm) {
            this.searchInput.focus();
            return;
        }
        
        this.showState('progress');
        this.hideDropdown();
        
        try {
            const locations = await this.weatherAPI.searchLocations(searchTerm);
            
            if (locations.length === 0) {
                this.showState('noResults');
            } else {
                const firstLocation = locations[0];
                await this.fetchAndDisplayWeather(firstLocation);
            }
            
        } catch (error) {
            this.showState('error');
            console.error('Search error:', error);
        }
    }

    async selectCity(city) {
        this.searchInput.value = `${city.name}, ${city.country}`;
        this.hideDropdown();
        
        // Cache the selected location
        cacheLastSearchedLocation(city);
        
        try {
            this.showState('progress');
            
            if (city.latitude && city.longitude) {
                await this.fetchAndDisplayWeather(city);
            } else {
                const locations = await this.weatherAPI.searchLocations(city.name);
                if (locations.length > 0) {
                    const locationWithCoords = {
                        ...locations[0],
                        name: city.name,
                        country: city.country
                    };
                    cacheLastSearchedLocation(locationWithCoords);
                    await this.fetchAndDisplayWeather(locationWithCoords);
                } else {
                    this.showMockWeather(city);
                }
            }
            
        } catch (error) {
            this.showState('error');
            console.error('Weather fetch error:', error);
        }
    }

// UPDATE showMockWeather method:
showMockWeather(city) {
    document.getElementById('city').textContent = `${city.name}, ${city.country}`;
    document.getElementById('temperature').textContent = '20°';
    document.getElementById('feels-like').textContent = '18°';
    document.getElementById('humidity').textContent = '46%';
    document.getElementById('wind').textContent = '14 km/h';
    document.getElementById('precipitation').textContent = '0 mm';
    
    // Mock sunrise/sunset data
    document.getElementById('sunrise-time').textContent = '6:45 AM';
    document.getElementById('sunset-time').textContent = '6:30 PM';
    
    // Mock progress
    const progressFill = document.getElementById('day-progress-fill');
    const currentMarker = document.getElementById('current-time-marker');
    if (progressFill) progressFill.style.width = '50%';
    if (currentMarker) currentMarker.style.left = '50%';
    
    document.getElementById('progress-time').textContent = 'Daylight: 6h 15m remaining';
    
    // FIX: Set default background with error handling
    if (this.backgroundManager) {
        try {
            this.backgroundManager.updateBackground(0, true, new Date());
        } catch (error) {
            console.error('Background update error in mock:', error);
        }
    }
    
    this.showState('weather');
}

get searchContainer() {
    // FIX: Return the actual search container element
    const container = document.querySelector('.search-container');
    if (!container) {
        console.warn('Search container not found');
        // Create a fallback element to prevent errors
        return document.createElement('div');
    }
    return container;
}
}


// ENHANCED: Location Detection Function
function detectUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
            return;
        }

        // Try to get cached location first
        const cachedLocation = getCachedLocation();
        if (cachedLocation && isLocationFresh(cachedLocation.timestamp)) {
            console.log('Using cached location:', cachedLocation);
            resolve(cachedLocation);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    
                    // Use multiple geocoding services for better accuracy
                    const locationData = await enhancedReverseGeocoding(latitude, longitude);
                    
                    const userLocation = {
                        latitude,
                        longitude,
                        name: locationData.city || locationData.locality || 'Unknown City',
                        country: locationData.countryName || locationData.country || 'Unknown Country',
                        timestamp: Date.now()
                    };
                    
                    // Cache the location
                    cacheLocation(userLocation);
                    
                    resolve(userLocation);
                    
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                // User denied location or error occurred
                let errorMessage = 'Unable to detect your location.';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied.';
                        // Try to get last searched location
                        const lastLocation = getLastSearchedLocation();
                        if (lastLocation) {
                            console.log('Using last searched location:', lastLocation);
                            resolve(lastLocation);
                            return;
                        }
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                
                reject(new Error(errorMessage));
            },
            {
                timeout: 15000, // Increased timeout
                enableHighAccuracy: true, // Request high accuracy
                maximumAge: 300000 // Accept cached position up to 5 minutes old
            }
        );
    });

}

// enhancedReverseGeocoding
async function enhancedReverseGeocoding(latitude, longitude) {
    console.log('Geocoding coordinates:', latitude, longitude);
    
    try {
        // Primary: BigDataCloud API with better parameters for Nigeria
        const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&localityLevel=city`
        );
        
        if (response.ok) {
            const data = await response.json();
            console.log('BigDataCloud result:', data);
            
            // For Nigeria, try to get more specific location names
            let cityName = data.city;
            
            // If we're in Lagos area but getting Abuja, try to get more local name
            if (data.countryName === 'Nigeria' && data.locality) {
                // Check if we're in Lagos state area (rough coordinates)
                if (latitude > 6.3 && latitude < 6.7 && longitude > 2.8 && longitude < 4.0) {
                    cityName = data.locality || data.city || 'Lagos Area';
                    console.log('Detected Lagos area, using locality:', data.locality);
                }
            }
            
            return {
                city: cityName || data.locality || 'Unknown City',
                country: data.countryName || data.country || 'Unknown Country',
                locality: data.locality,
                principalSubdivision: data.principalSubdivision // State/province
            };
        }
    } catch (error) {
        console.log('Primary geocoding failed:', error);
    }
    
    // Fallback: OpenStreetMap with better Nigerian location detection
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=16`
        );
        
        if (response.ok) {
            const data = await response.json();
            console.log('OpenStreetMap result:', data);
            
            const address = data.address;
            
            // Better location detection for Nigerian cities
            let cityName = address.city || address.town || address.municipality;
            
            // For Ikorodu area specifically
            if (!cityName && address.suburb) {
                cityName = address.suburb;
            }
            
            // If in Lagos state but no specific city, use locality
            if (!cityName && address.state === 'Lagos' && address.county) {
                cityName = address.county;
            }
            
            return {
                city: cityName || address.state || 'Lagos Area',
                country: address.country,
                countryName: address.country,
                state: address.state
            };
        }
    } catch (error) {
        console.log('OpenStreetMap geocoding failed:', error);
    }
    
    // Final fallback: Manual detection for Lagos area
    if (latitude > 6.3 && latitude < 6.7 && longitude > 2.8 && longitude < 4.0) {
        console.log('Manual detection: Lagos area');
        return {
            city: 'Lagos Area',
            country: 'Nigeria',
            locality: 'Lagos'
        };
    }
    
    return {
        city: 'Unknown Location',
        country: 'Unknown Country'
    };
}

// ADD this function to clear cached locations:
function clearLocationCache() {
    try {
        localStorage.removeItem('weatherApp_userLocation');
        localStorage.removeItem('weatherApp_lastSearched');
        console.log('Location cache cleared');
    } catch (error) {
        console.log('Failed to clear location cache:', error);
    }
}

// Location Caching Utilities
function cacheLocation(location) {
    try {
        localStorage.setItem('weatherApp_userLocation', JSON.stringify(location));
    } catch (error) {
        console.log('Failed to cache location:', error);
    }
}

function getCachedLocation() {
    try {
        const cached = localStorage.getItem('weatherApp_userLocation');
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.log('Failed to get cached location:', error);
        return null;
    }
}

function isLocationFresh(timestamp) {
    // Consider location fresh if it's less than 1 hour old
    return Date.now() - timestamp < 3600000; // 1 hour in milliseconds
}

function cacheLastSearchedLocation(location) {
    try {
        localStorage.setItem('weatherApp_lastSearched', JSON.stringify({
            name: location.name,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.log('Failed to cache last searched location:', error);
    }
}

function getLastSearchedLocation() {
    try {
        const lastSearched = localStorage.getItem('weatherApp_lastSearched');
        return lastSearched ? JSON.parse(lastSearched) : null;
    } catch (error) {
        console.log('Failed to get last searched location:', error);
        return null;
    }
}

// ===== SIMPLIFIED Background Manager Class =====
class BackgroundManager {
    constructor() {
        console.log('Initializing BackgroundManager...');
        
        this.background = document.getElementById('weather-background');
        
        // Check if background element exists
        if (!this.background) {
            console.error('Background element not found! Creating fallback...');
            this.createBackgroundElement();
        }
        
        this.currentCondition = '';
        this.isDaytime = true;
        
        console.log('BackgroundManager initialized successfully');
    }
    
    createBackgroundElement() {
        // Create background element if it doesn't exist
        const bg = document.createElement('div');
        bg.id = 'weather-background';
        bg.className = 'weather-background';
        bg.innerHTML = `
            <div class="background-elements">
                <div class="celestial-body" id="celestial-body">
                    <div class="celestial-glow"></div>
                </div>
                <div class="cloud cloud-1"></div>
                <div class="cloud cloud-2"></div>
                <div class="cloud cloud-3"></div>
                <div class="stars-container" id="stars-container"></div>
                <div class="rain-container" id="rain-container"></div>
                <div class="snow-container" id="snow-container"></div>
                <div class="fog-container" id="fog-container"></div>
            </div>
        `;
        document.body.insertBefore(bg, document.body.firstChild);
        this.background = bg;
    }
    
    updateBackground(weatherCode, isDaytime, currentTime) {
        if (!this.background) {
            console.warn('Background element not available');
            return;
        }
        
        this.isDaytime = isDaytime;
        this.currentCondition = this.getConditionFromCode(weatherCode);
        
        console.log('Updating background to:', this.currentCondition, isDaytime ? 'day' : 'night');
        
        // Update background class
        this.background.className = 'weather-background';
        this.background.classList.add(this.currentCondition);
        
        if (!isDaytime) {
            this.background.classList.add('night');
        }
        
        // Simple visual update for now
        this.updateVisualEffects(weatherCode, isDaytime);
    }
    
    getConditionFromCode(weatherCode) {
        const conditionMap = {
            0: 'clear', 1: 'partly-cloudy', 2: 'partly-cloudy', 3: 'cloudy',
            45: 'foggy', 48: 'foggy', 51: 'rainy', 53: 'rainy', 55: 'rainy',
            61: 'rainy', 63: 'rainy', 65: 'rainy', 71: 'snowy', 73: 'snowy', 75: 'snowy',
            80: 'rainy', 81: 'rainy', 82: 'stormy', 95: 'stormy', 96: 'stormy', 99: 'stormy'
        };
        
        return conditionMap[weatherCode] || 'partly-cloudy';
    }
    
    updateVisualEffects(weatherCode, isDaytime) {
        // Simple effect updates - we'll enhance this later
        const celestialBody = document.getElementById('celestial-body');
        if (celestialBody) {
            celestialBody.className = isDaytime ? 'celestial-body sun' : 'celestial-body moon';
        }
        
        // Show/hide clouds based on weather
        const clouds = document.querySelectorAll('.cloud');
        clouds.forEach(cloud => {
            if (this.currentCondition.includes('cloudy') || 
                this.currentCondition.includes('rainy') || 
                this.currentCondition.includes('stormy')) {
                cloud.style.display = 'block';
            } else {
                cloud.style.display = 'none';
            }
        });
    }
    
    isDaytime(sunrise, sunset, currentTime) {
        try {
            const current = new Date(currentTime);
            const sunriseTime = new Date(sunrise);
            const sunsetTime = new Date(sunset);
            
            return current > sunriseTime && current < sunsetTime;
        } catch (error) {
            console.error('Error in isDaytime:', error);
            return true; // Default to daytime
        }
    }
}

// ===== THEME MANAGER CLASS =====
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-btn');
        this.currentTheme = this.getSavedTheme() || this.getSystemTheme();
        
        this.init();
    }
    
    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);
        
        // Add event listener
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Listen for system theme changes
        this.watchSystemTheme();
        
        console.log('ThemeManager initialized with theme:', this.currentTheme);
    }
    
    getSystemTheme() {
        // Check if user prefers dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    getSavedTheme() {
        return localStorage.getItem('weatherApp-theme');
    }
    
    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('weatherApp-theme', theme);
        
        // Update background for light theme
        this.updateBackgroundForTheme(theme);
        
        console.log('Theme set to:', theme);
    }
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add animation class for fun
        this.themeToggle.classList.add('theme-changing');
        setTimeout(() => {
            this.themeToggle.classList.remove('theme-changing');
        }, 300);
    }
    
    updateBackgroundForTheme(theme) {
        // Update weather background colors for light theme
        const background = document.getElementById('weather-background');
        if (!background) return;
        
        if (theme === 'light') {
            // Adjust background colors for light theme
            background.style.filter = 'brightness(1.2) saturate(0.8)';
        } else {
            // Reset for dark theme
            background.style.filter = 'none';
        }
    }
    
    watchSystemTheme() {
        // Watch for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!localStorage.getItem('weatherApp-theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    // Method to check if it's appropriate for dark theme based on time
    shouldUseDarkTheme() {
        const hour = new Date().getHours();
        // Dark theme from 6 PM to 6 AM
        return hour >= 18 || hour < 6;
    }
    
    // Auto theme based on time of day
    enableAutoTheme() {
        const shouldBeDark = this.shouldUseDarkTheme();
        if (!localStorage.getItem('weatherApp-theme')) {
            this.setTheme(shouldBeDark ? 'dark' : 'light');
        }
    }
}

// ===== PWA MANAGER =====
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        
        this.init();
    }
    
    init() {
        // Register service worker
        this.registerServiceWorker();
        
        // Listen for install prompt
        this.listenForInstallPrompt();
        
        // Create install button
        this.createInstallButton();
        
        console.log('PWA Manager initialized');
    }
    
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('./sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('Service Worker update found:', newWorker);
                    });
                })
                .catch((error) => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }
    
    listenForInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Show install button
            this.showInstallButton();
            console.log('PWA install prompt available');
        });
        
        // Listen for app installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallButton();
            this.deferredPrompt = null;
        });
    }
    
    createInstallButton() {
        const button = document.createElement('button');
        button.id = 'install-btn';
        button.className = 'install-btn';
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Install App
        `;
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--accent-color);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
        `;
        
        button.addEventListener('click', () => this.installApp());
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 25px rgba(0,0,0,0.4)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        });
        
        document.body.appendChild(button);
        this.installButton = button;
    }
    
    showInstallButton() {
        if (this.installButton) {
            this.installButton.style.opacity = '1';
            this.installButton.style.transform = 'translateY(0)';
        }
    }
    
    hideInstallButton() {
        if (this.installButton) {
            this.installButton.style.opacity = '0';
            this.installButton.style.transform = 'translateY(20px)';
        }
    }
    
    async installApp() {
        if (!this.deferredPrompt) {
            return;
        }
        
        // Show the install prompt
        this.deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt since it can't be used again
        this.deferredPrompt = null;
        this.hideInstallButton();
    }
    
    // Check if app is running in standalone mode
    isRunningStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }
    
    // Get current display mode
    getDisplayMode() {
        if (this.isRunningStandalone()) {
            return 'standalone';
        }
        if (window.matchMedia('(display-mode: fullscreen)').matches) {
            return 'fullscreen';
        }
        return 'browser';
    }
}
// In the DOMContentLoaded event listener - UPDATE the initialization:
document.addEventListener('DOMContentLoaded', function() {
    const loadingSkeleton = document.getElementById('loading-skeleton');
    
    // Initialize all components
    const unitsDropdown = new CustomDropdown('units-dropdown');
    const searchDropdown = new SearchDropdown();
    const daySelector = new DaySelector('day-selector');
    const themeManager = new ThemeManager(); 

    const pwaManager = new PWAManager(); // NEW
    
     window.searchDropdown = searchDropdown;
    
      // FIX: Make sure day selector event is properly connected
    document.getElementById('day-selector').addEventListener('dayChange', function(e) {
        console.log('Day changed to:', e.detail.day);
        searchDropdown.updateHourlyForecastForDay(e.detail.day);
    });
    
    // Handle unit conversions
    document.getElementById('units-dropdown').addEventListener('systemChange', function(e) {
        searchDropdown.convertUnits(e.detail.system);
    });
    
    // Global outside click handler
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#units-dropdown')) {
            unitsDropdown.close();
        }
        
        if (!e.target.closest('#day-selector')) {
            daySelector.close();
        }
        
        if (!e.target.closest('.search-container')) {
            searchDropdown.hideDropdown();
        }
    });
    
    // Enhanced loading sequence with skeleton
    setTimeout(async () => {
        // Start fade out
        loadingSkeleton.classList.add('hidden');
        
        // Remove after fade completes
        setTimeout(() => {
            loadingSkeleton.style.display = 'none';
        }, 1000);
        
           // ENHANCED: Smart location detection with fallbacks
    try {
        const userLocation = await detectUserLocation();
        console.log('Using detected/cached location:', userLocation);
        searchDropdown.fetchAndDisplayWeather(userLocation);
        
    } catch (locationError) {
        console.log('All location methods failed:', locationError.message);
        
        // Final fallback: Try last searched location
        const lastSearched = getLastSearchedLocation();
        if (lastSearched) {
            console.log('Using last searched location as fallback:', lastSearched);
            searchDropdown.fetchAndDisplayWeather(lastSearched);
        } else {
            // Ultimate fallback: Berlin
            console.log('Using default Berlin location');
            const defaultCity = { 
                name: 'Berlin', 
                country: 'Germany', 
                latitude: 52.52, 
                longitude: 13.405 
            };
            searchDropdown.fetchAndDisplayWeather(defaultCity);
        }
    }
}, 3000); // Show skeleton for 3 seconds (adjust as needed)
});
    
    // Listen for other events
    document.getElementById('units-dropdown').addEventListener('unitChange', function(e) {
        console.log('Unit changed in system:', e.detail.system);
        console.log('Current units:', e.detail.units);
    });
    
    // UPDATE the debugBackground function:
function debugBackground() {
    console.log('=== BACKGROUND DEBUG ===');
    const bg = document.getElementById('weather-background');
    const search = window.searchDropdown;
    
    console.log('Background element:', bg);
    console.log('Current classes:', bg?.className);
    console.log('BackgroundManager instance:', search?.backgroundManager);
    console.log('BackgroundManager type:', typeof search?.backgroundManager);
    console.log('isDaytime method exists:', typeof search?.backgroundManager?.isDaytime);
    console.log('updateBackground method exists:', typeof search?.backgroundManager?.updateBackground);
    
    if (search?.currentWeatherData) {
        const current = search.currentWeatherData.current;
        const daily = search.currentWeatherData.daily;
        
        console.log('Weather code:', current.weather_code);
        
        if (search.backgroundManager && typeof search.backgroundManager.isDaytime === 'function') {
            console.log('Is daytime:', search.backgroundManager.isDaytime(
                daily.sunrise[0], 
                daily.sunset[0], 
                current.time
            ));
        } else {
            console.log('Cannot check daytime - backgroundManager not properly initialized');
        }
    }
}
// Test 1: Check if BackgroundManager works
function testBackgroundManager() {
    console.log('=== TESTING BACKGROUND MANAGER ===');
    const search = window.searchDropdown;
    console.log('BackgroundManager exists:', !!search?.backgroundManager);
    
    if (search?.backgroundManager) {
        console.log('isDaytime method:', typeof search.backgroundManager.isDaytime);
        console.log('updateBackground method:', typeof search.backgroundManager.updateBackground);
        
        // Test with sample data
        const testSunrise = new Date();
        testSunrise.setHours(6, 0, 0);
        const testSunset = new Date();
        testSunset.setHours(18, 0, 0);
        const testCurrent = new Date();
        testCurrent.setHours(12, 0, 0);
        
        console.log('Test isDaytime:', search.backgroundManager.isDaytime(
            testSunrise.toISOString(),
            testSunset.toISOString(),
            testCurrent.toISOString()
        ));
    }
}

// Test 2: Check search container
function testSearchContainer() {
    console.log('=== TESTING SEARCH CONTAINER ===');
    const search = window.searchDropdown;
    const container = search?.searchContainer;
    console.log('Search container:', container);
    console.log('Container contains method:', typeof container?.contains);
}

// Run both tests
testBackgroundManager();
testSearchContainer();