const weatherApiKey = "4994c6d047fcd34481fdda640bf387f2";
const cityAutocompleteApiKey = "AIzaSyDsMlT5Ub3at7ifuCuYrEBK4M7UwZecgsw";
const currrentWeatherRequest = `https://api.openweathermap.org/data/2.5/weather?appid=${weatherApiKey}&units=metric`;
const hourlyWeatherForecastReqiest = `https://api.openweathermap.org/data/2.5/forecast?appid=${weatherApiKey}&ctn=40&units=metric`;
const reverseGeolocationRequest = `http://api.openweathermap.org/geo/1.0/reverse?appid=${weatherApiKey}`;
const cityAutocompleteRequest = `https://api.geoapify.com/v1/geocode/autocomplete?apiKey=${cityAutocompleteApiKey}&type=city&text=`;

const searchEl = document.querySelector(".search");

let chart;
let currentWeatherData;
let hourlyWeatherData;

(async function () {
  var input = searchEl.querySelector("input");
  var options = {
    types: ["geocode"],
  };
  var autocomplete = new google.maps.places.Autocomplete(input, options);
})();

const successCallback = async (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const res = await fetch(`${reverseGeolocationRequest}&lat=${lat}&lon=${lon}`);
  const data = await res.json();
  const city = data[0].name;
  setWeather(city);
};
const pos = navigator.geolocation.getCurrentPosition(successCallback);

searchEl.addEventListener("click", async function (e) {
  if (e.target.tagName === "IMG" || e.target.tagName === "BUTTON") setWeather();
});

searchEl.addEventListener("keypress", function (e) {
  if (e.key === "Enter") setWeather();
});

async function setWeather(cityName) {
  let theCity;
  cityName
    ? (theCity = cityName)
    : (theCity = searchEl.querySelector("input").value);
  currentWeatherData = await getCurrentWeatherOfCity(theCity);
  if (!currentWeatherData.weather) {
    alert(currentWeatherData.message);
    return;
  }
  const weatherObj = getWeatherObjFromData(currentWeatherData);
  setDataToWeatherCard(weatherObj);
  hourlyWeatherData = await getHourlyWeatherOfCity(theCity);
  const hours = hourlyWeatherData.list.map(
    (forecast) => `${new Date(forecast.dt_txt).getHours()}:00`
  );
  const temps = hourlyWeatherData.list.map((forecast) =>
    Math.round(+forecast.main.temp)
  );
  const iconsID = hourlyWeatherData.list.map(
    (forecast) => forecast.weather[0].icon
  );
  renderTempsLineChart(hours, temps, iconsID);
}

function getWeatherObjFromData(data, index) {
  const { icon: iconID, description: weatherDescription } =
    index >= 0 ? data.list[index].weather[0] : data.weather[0];
  const { temp, humidity } = index >= 0 ? data.list[index].main : data.main;
  const { name: city } = index >= 0 ? data.city : data;
  const country = index >= 0 ? data.city.country : data.sys.country;
  const { deg: windDirection, speed: windSpeed } =
    index >= 0 ? data.list[index].wind : data.wind;
  const clouds = index >= 0 ? data.list[index].clouds.all : data.clouds.all;
  return {
    iconID,
    weatherDescription,
    temp,
    humidity,
    city,
    country,
    windDirection,
    windSpeed,
    clouds,
  };
}

async function getCurrentWeatherOfCity(city) {
  const response = await fetch(`${currrentWeatherRequest}&q=${city}`);
  return response.ok ? response.json() : new Error(`City ${city} not found!`);
}

async function getHourlyWeatherOfCity(city) {
  const response = await fetch(`${hourlyWeatherForecastReqiest}&q=${city}`);
  return response.ok ? response.json() : new Error(`City ${city} not found!`);
}

function setDataToWeatherCard(data) {
  document.querySelector(".weather .icon img").src = `icon/${data.iconID}.png`;
  document.querySelector(".weather .description").textContent =
    data.weatherDescription;
  document.querySelector(".temp .value").textContent = Math.round(+data.temp);
  document.querySelector(
    ".weather .location"
  ).textContent = `${data.city}, ${data.country}`;
  document.querySelector(".wind .value").textContent = data.windSpeed;
  document.querySelector(".wind .arrow").style.transform = `rotate(${
    data.windDirection > 180
      ? -Math.abs(360 - data.windDirection)
      : data.windDirection
  }deg)`;
  document.querySelector(".humidity .value").textContent = data.humidity;
  document.querySelector(".clouds .value").textContent = data.clouds;
}

function renderTempsLineChart(hours, temps, icons) {
  const chartEL = document.querySelector(".chart").getContext("2d");
  const config = {
    type: "line",
    data: {
      labels: hours,
      datasets: [
        {
          label: "My First dataset",
          data: temps,
          borderColor: "white",
          backgroundColor: "white",
          borderWidth: 1,
        },
      ],
    },
    responsive: true,
    options: {
      maintainAspectRatio: false,
      onHover: function (event, chartElement) {
        event.native.target.style.cursor = chartElement[0]
          ? "pointer"
          : "default";
      },

      onClick: function (event, elements, chart) {
        if (elements[0]) {
          const index = elements[0].index;
          const selectedHourWeather = getWeatherObjFromData(
            hourlyWeatherData,
            index
          );
          setDataToWeatherCard(selectedHourWeather);

          //Paint clicked point
          const dataset = chart.data.datasets[0];
          dataset.pointBackgroundColor = dataset.data.map((v, i) =>
            i == elements[0]?.index ? "black" : "white"
          );
          chart.update();
        }
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: function (context) {
            // Tooltip Element
            let tooltipEl = document.getElementById("chartjs-tooltip");

            // Create element on first render
            if (!tooltipEl) {
              tooltipEl = document.createElement("div");
              tooltipEl.id = "chartjs-tooltip";
              // tooltipEl.innerHTML = "<table></table>";
              document.body.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            const tooltipModel = context.tooltip;
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = 0;
              return;
            }

            // Set caret Position
            tooltipEl.classList.remove("above", "below", "no-transform");
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add("no-transform");
            }

            // Set html
            if (tooltipModel.body) {
              const { dataIndex } = context.tooltip.dataPoints[0];

              const html = `
              <div class="card-small card-pretty">
                <h3 class="time">${hours[dataIndex]}</h3>
                <img src="icon/${icons[dataIndex]}.png" alt="weather icon" />
                <div class="temp">
                  <span class="value">${temps[dataIndex]}</span>
                  <span class="units">°C</span>
                </div>
              </div>
              `;
              tooltipEl.innerHTML = html;
            }

            const position = context.chart.canvas.getBoundingClientRect();
            const bodyFont = Chart.helpers.toFont(
              tooltipModel.options.bodyFont
            );

            // Display, position, and set styles for font
            tooltipEl.style.opacity = 1;
            tooltipEl.style.position = "absolute";
            tooltipEl.style.left =
              position.left + window.pageXOffset + tooltipModel.caretX + "px";
            tooltipEl.style.top =
              position.top + window.pageYOffset + tooltipModel.caretY + "px";
            tooltipEl.style.font = bodyFont.string;
            tooltipEl.style.padding =
              tooltipModel.padding + "px " + tooltipModel.padding + "px";
            tooltipEl.style.pointerEvents = "none";
          },
        },
      },
    },
  };

  Chart.defaults.color = "white";
  Chart.defaults.elements.point.radius = 3;
  Chart.defaults.elements.point.hoverRadius = 5;
  Chart.defaults.elements.arc.backgroundColor = "#ffffff";
  if (chart) chart.destroy();
  chart = new Chart(chartEL, config);
}
