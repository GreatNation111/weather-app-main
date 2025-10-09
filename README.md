# 🌦️ Weather App — Frontend Mentor Challenge

## Overview

🔗 **Live Demo:** [https://greatnation111.github.io/weather-app-main/](https://greatnation111.github.io/weather-app-main/)

This project is a responsive Weather App built from scratch as part of a **Frontend Mentor challenge**.  
The app uses the **Open-Meteo API** to display real-time weather data for any searched city and provides daily and hourly forecasts.  
All features and interface elements were implemented with **pure HTML, CSS, and JavaScript** — no frameworks or libraries.

---

## 💡 Key Features

- **Search by location:** Users can search for any city to view current weather data.  
- **Current conditions:** Displays temperature, “feels like,” humidity, wind speed, and precipitation.  
- **7-day forecast:** Shows upcoming daily high/low temperatures with weather icons.  
- **Hourly forecast:** Scrollable hourly cards that update dynamically per day.  
- **Units toggle:** Switch between Metric and Imperial units (°C/°F, km/h/mph, mm/in).  
- **Responsive design:** Optimized for mobile (375px) and desktop (1440px) with flexible layouts.  
- **Loading and error states:** Custom UI for searching, loading, API errors, and no results.

---

## 🧠 My Process

I started by analyzing the design requirements and breaking the app into small, buildable sections:

- **HTML structure:** Created clear semantic containers for the current weather, daily forecast, and hourly forecast.  
- **CSS styling:** Used the provided color palette and typography guide to build a flexible layout that adapts across screen sizes. The forecast cards were designed first to match the reference mockup exactly.  
- **API integration:** Used the free Open-Meteo API via JavaScript `fetch()` to retrieve live weather data and update the UI dynamically.  
- **State management:** Added “loading,” “no results,” “searching,” and “API error” states to make the user experience smoother and more realistic.  
- **Enhancements:** Implemented hover animations, icon sets for various weather conditions, and custom dropdowns for a polished interface.

Throughout the build, I tested responsiveness manually and refined details like spacing, card alignment, and accessibility labels.

---

## ⚙️ Built With

- **HTML5**  
- **CSS3 (Flexbox & Grid)**  
- **Vanilla JavaScript (ES6+)**  
- **Open-Meteo API**

---

## 🚀 Future Improvements

- Add geolocation detection to automatically show local weather on first visit.  
- Implement “favorite locations” to quickly revisit common searches.  
- Add animated backgrounds that change with current conditions.  
- Introduce light/dark mode based on system or time of day.  
- Convert the project into a Progressive Web App (PWA) for mobile installation.

---

## 🧩 What I Learned

- Structuring a scalable UI purely with semantic HTML.  
- Working with APIs that return multiple data arrays (daily, hourly, current).  
- Managing multiple UI states cleanly in JavaScript.  
- Writing clean, maintainable CSS for responsive components.  
- Handling units conversion logic (metric ↔ imperial) without external libraries.

---

## 💬 Challenges Faced

- Ensuring hourly forecasts updated correctly when a new day was selected.  
- Designing dropdowns that look consistent across browsers.  
- Handling API errors and invalid search inputs gracefully.  
- Keeping performance smooth while dynamically injecting forecast cards.

---

## 🙌 Acknowledgments

- Challenge by **Frontend Mentor**  
- Weather data from **Open-Meteo API**  
- Fonts from **Google Fonts**

---

📍 **Live Project:** [WeatherNow](https://greatnation111.github.io/weather-app-main/)  
🛠️ Built with ❤️ by **Great Nation**
