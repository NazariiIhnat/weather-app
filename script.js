const weatherApiKey = "4994c6d047fcd34481fdda640bf387f2";
const cityAutocompleteApiKey = "46285a33571b4253b2b9c5ac3d9e2a95";
const currrentWeatherRequest = `https://api.openweathermap.org/data/2.5/weather?appid=${weatherApiKey}&units=metric`;
const hourlyWeatherForecastReqiest = `https://api.openweathermap.org/data/2.5/forecast?appid=${weatherApiKey}&ctn=40&units=metric`;
const reverseGeolocationRequest = `http://api.openweathermap.org/geo/1.0/reverse?appid=${weatherApiKey}`;
const cityAutocompleteRequest = `https://api.geoapify.com/v1/geocode/autocomplete?apiKey=${cityAutocompleteApiKey}&type=city&text=`;
const searchEl = document.querySelector(".search");

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
  const data = await getWeatherOfCity(theCity);
  if (!data.weather) {
    alert(data.message);
    return;
  }
  const { icon: iconID, description: weatherDescription } = data.weather[0];
  const { temp, humidity } = data.main;
  const { name: city } = data;
  const country = data.sys.country;
  const { deg: windDirection, speed: windSpeed } = data.wind;
  const clouds = data.clouds.all;
  const weatherObj = {
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
  setDataToWeatherCard(weatherObj);
}

async function getWeatherOfCity(city) {
  const response = await fetch(`${currrentWeatherRequest}&q=${city}`);
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
