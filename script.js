const apiKey = "4994c6d047fcd34481fdda640bf387f2";
const request = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
const searchEl = document.querySelector(".search");

searchEl.addEventListener("click", async function (e) {
  if (e.target.tagName === "IMG" || e.target.tagName === "BUTTON") setWeather();
});

searchEl.addEventListener("keypress", function (e) {
  if (e.key === "Enter") setWeather();
});

async function setWeather() {
  const cityName = searchEl.querySelector("input").value;
  const data = await getWeatherOfCity(cityName);
  if (!data.weather) {
    alert(data.message);
    return;
  }
  setDataToWeatherCard(data);
}

async function getWeatherOfCity(city) {
  const response = await fetch(`${request}&q=${city}`);
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
