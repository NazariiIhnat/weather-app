<h1 style="font-weight: bold;">Weather Application README</h1>
<h2 style="font-weight: bold;">Overview</h2>
This is a simple weather application built using HTML, CSS, and JavaScript. The application allows users to check the weather forecast for different cities and provides various interactive features to enhance the user experience.

<h2 style="font-weight: bold;">Try it</h2>
<a href="https://5days-weather-app.netlify.app/">https://5days-weather-app.netlify.app/</a>

<h2 style="font-weight: bold;">Features</h2>
<ol>
<li>Weather Data Retrieval: The application fetches weather data using the OpenWeather 5days/3hours API to provide detailed weather forecasts.</li>

<li><span style="font-weight: bold;">City Autocomplete:</span> Utilizing the Google Autocomplete API, the app offers a convenient city autocomplete feature, making it easier for users to input the city they want to check the weather for.</li>

<li><span style="font-weight: bold;">Interactive Line Chart:</span> The application uses the ChartJS library to create interactive line charts that display the temperature changes over each 3-hour period. Users can hover over specific points to see temperature and weather icons.</li>

<li><span style="font-weight: bold;">Geolocation Support:</span> Upon the user's first visit, the app requests permission to access their geolocation. It then displays the weather information for the user's current location.</li>

<li><span style="font-weight: bold;">User-Friendly Interface:</span> The interface is designed to provide essential weather information at a glance, including city name, weather description, icon, wind speed and direction, line chart, and days of the week.</li>

<li><span style="font-weight: bold;">Interactive Chart Interaction:</span> Users can hover over specific points on the line chart to view detailed temperature and weather icon information for the chosen day and hour.</li>

<li><span style="font-weight: bold;">Detailed Day View:</span> By clicking on a specific point on the line chart, the app loads and displays weather data relative to that day and hour. The selected day is also highlighted at the bottom of the chart.</li>

<li><span style="font-weight: bold;">Day Navigation:</span> Users can click on a specific day at the bottom of the line chart. This action scrolls the chart to the point related to the chosen day and 0:00 hour. Weather data for that day and time is loaded and shown in a dedicated frame.</li>
</ol>

<h2>Dependencies</h2>
<ol>
  <li><a href="https://openweathermap.org/forecast5">5 day weather forecast API</a></li>
  <li><a href="https://openweathermap.org/current">Current weather data API</a></li>
  <li><a href="https://openweathermap.org/api/geocoding-api">Geocoding API</a></li>
  <li><a href="https://developers.google.com/maps/documentation/places/web-service/autocomplete">Places autocomplete API</a></li>
  <li><a href="https://www.chartjs.org/">Chart.js library</a></li>
</ol>

<h2>Screenshots</h2>
<ol>
  <li>
    <span>Autocomplete example</span>
    <img src="https://github.com/NazariiIhnat/weather-app/blob/master/screenshot/1.png" alt="Weather app screenshot 1">
  </li>
  <li>
    <span>When hover on point of line chart small div apears with hour, temperature and weather icon related to point day and hour</span>
    <img src="https://github.com/NazariiIhnat/weather-app/blob/master/screenshot/2.png" alt="Weather app screenshot 2">
  </li>
  <li>
    <span>Weather displayed by clicking on specific point on line chart Also day name highlighted.</span></li>
    <img src="https://github.com/NazariiIhnat/weather-app/blob/master/screenshot/3.png" alt="Weather app screenshot 3">
  </li>
  <li>
    <span>When click on specific day under the line chart the weather forecast of this day and 0:00 hour will be displayed.
  Also line chart will be scrooled to relative point and this point will be highlighted.</span>
    <img src="https://github.com/NazariiIhnat/weather-app/blob/master/screenshot/4.png"  alt="Weather app screenshot 4">
  </li>
</ol>
