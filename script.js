const weatherApiKey = "4994c6d047fcd34481fdda640bf387f2";
const cityAutocompleteApiKey = "46285a33571b4253b2b9c5ac3d9e2a95";
const weatherRequest = `https://api.openweathermap.org/data/2.5/weather?appid=${weatherApiKey}&units=metric`;
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

async function setWeather(city) {
  let cityName;
  city ? (cityName = city) : (cityName = searchEl.querySelector("input").value);
  const data = await getWeatherOfCity(cityName);
  if (!data.weather) {
    alert(data.message);
    return;
  }
  setDataToWeatherCard(data);
}

async function getWeatherOfCity(city) {
  const response = await fetch(`${weatherRequest}&q=${city}`);
  return response.ok ? response.json() : new Error(`City ${city} not found!`);
}

function setDataToWeatherCard(data) {
  const iconID = data.weather[0].icon;
  const weatherDescription = data.weather[0].description;
  const temp = Math.round(+data.main.temp);
  const city = data.name;
  const country = data.sys.country;
  const windSpeed = data.wind.speed;
  const windDirection = data.wind.deg;
  const humidity = data.main.humidity;
  const clouds = data.clouds.all;

  document.querySelector(".weather .icon img").src = `icon/${iconID}.png`;
  document.querySelector(".weather .description").textContent =
    weatherDescription;
  document.querySelector(".temp .value").textContent = temp;
  document.querySelector(
    ".weather .location"
  ).textContent = `${city}, ${country}`;
  document.querySelector(".wind .value").textContent = windSpeed;
  document.querySelector(".wind .arrow").style.transform = `rotate(${
    windDirection > 180 ? -Math.abs(360 - windDirection) : windDirection
  }deg)`;
  document.querySelector(".humidity .value").textContent = humidity;
  document.querySelector(".clouds .value").textContent = clouds;
}
