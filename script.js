const weatherApiKey = "4994c6d047fcd34481fdda640bf387f2";
const cityAutocompleteApiKey = "46285a33571b4253b2b9c5ac3d9e2a95";
const currrentWeatherRequest = `https://api.openweathermap.org/data/2.5/weather?appid=${weatherApiKey}&units=metric`;
const hourlyWeatherForecastReqiest = `https://api.openweathermap.org/data/2.5/forecast?appid=${weatherApiKey}&ctn=40&units=metric`;
const reverseGeolocationRequest = `http://api.openweathermap.org/geo/1.0/reverse?appid=${weatherApiKey}`;
const cityAutocompleteRequest = `https://api.geoapify.com/v1/geocode/autocomplete?apiKey=${cityAutocompleteApiKey}&type=city&text=`;

const searchEl = document.querySelector(".search");

let weatherOfDateRendered;
let chart;

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
  const data = await getCurrentWeatherOfCity(theCity);
  if (!data.weather) {
    alert(data.message);
    return;
  }
  const weatherObj = getWeatherObjFromData(data);
  setDataToWeatherCard(weatherObj);
  weatherOfDateRendered = new Date();
  const fiveDaysThreeHourWeatherForecastData = await getHourlyWeatherOfCity(
    theCity
  );
  const todayThreeHourWeatherForecastData =
    fiveDaysThreeHourWeatherForecastData.list.filter((forecast) => {
      const weatherForecastDate = new Date(forecast.dt_txt);
      return weatherOfDateRendered.getDate() === weatherForecastDate.getDate();
    });
  const hours = todayThreeHourWeatherForecastData.map(
    (forecast) => `${new Date(forecast.dt_txt).getHours()}:00`
  );
  const temps = todayThreeHourWeatherForecastData.map((forecast) =>
    Math.round(+forecast.main.temp)
  );
  const iconsID = todayThreeHourWeatherForecastData.map(
    (forecast) => forecast.weather[0].icon
  );
  renderTempsLineChart(hours, temps, iconsID);
}

function getWeatherObjFromData(data, index) {
  const { icon: iconID, description: weatherDescription } = index
    ? data.list[index].weather[0]
    : data.weather[0];
  const { temp, humidity } = index ? data.list[index].main : data.main;
  const { name: city } = index ? data.city : data;
  const country = index ? data.city.country : data.sys.country;
  const { deg: windDirection, speed: windSpeed } = index
    ? data.list[index].wind
    : data.wind;
  const clouds = index ? data.list[index].clouds.all : data.clouds.all;
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
  const chartEL = document.querySelector(".temp-chart").getContext("2d");
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
    options: {
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

            function getBody(bodyItem) {
              return bodyItem.lines;
            }

            // Set Text
            if (tooltipModel.body) {
              const pointIndex = tooltipModel.dataPoints[0].parsed.x;

              const html = `
              
              `;
              // let innerHtml = "<thead>";
              // titleLines.forEach(function (title) {
              //   innerHtml += "<tr><th>" + title + "</th></tr>";
              // });
              // innerHtml += "</thead><tbody>";

              // bodyLines.forEach(function (body, i) {
              //   const colors = tooltipModel.labelColors[i];
              //   let style = "background:" + colors.backgroundColor;
              //   style += "; border-color:" + colors.borderColor;
              //   style += "; border-width: 2px";
              //   const span = '<span style="' + style + '">' + body + "</span>";
              //   innerHtml += "<tr><td>" + span + "</td></tr>";
              // });
              // innerHtml += "</tbody>";

              // let tableRoot = tooltipEl.querySelector("table");
              // tableRoot.innerHTML = innerHtml;
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
  Chart.defaults.elements.point.radius = 2;
  Chart.defaults.elements.arc.backgroundColor = "#ffffff";
  if (chart) chart.destroy();
  chart = new Chart(chartEL, config);
}
