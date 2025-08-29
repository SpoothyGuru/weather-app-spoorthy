// Put your API key here
const apiKey = "37ef762b53274cb94deece86f32c7bfa"; // ← replace with your OpenWeather key

// Enter / Click support
document.getElementById('searchBtn').addEventListener('click', getWeather);
document.getElementById('city').addEventListener('keyup', function(e){
  if (e.key === 'Enter') getWeather();
});

async function getWeather() {
  const input = document.getElementById('city');
  const cityRaw = input.value.trim();
  const result = document.getElementById('result');
  result.innerHTML = ""; // clear previous

  if (!cityRaw) {
    result.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  // helpful mapping for common local names -> API-friendly names
  const cityMap = {
    "mysuru": "Mysore",
    "bengaluru": "Bangalore",
    "bangalore": "Bangalore",
    "bengalur": "Bangalore"
    // add more if you like
  };
  const city = cityMap[cityRaw.toLowerCase()] || cityRaw;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  try {
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.cod === 200) {
      const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

      // each measurement is its own <p> so every line is on a separate row
      result.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${iconUrl}" alt="${data.weather[0].description}" />
        <p>🌡️ Temperature: ${data.main.temp}°C</p>
        <p>🧊 Feels like: ${data.main.feels_like}°C</p>
        <p>🔼 Max: ${data.main.temp_max}°C | 🔽 Min: ${data.main.temp_min}°C</p>
        <p>☁️ Condition: ${data.weather[0].main} — ${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
        <p>🌅 Sunrise: ${sunrise}</p>
        <p>🌇 Sunset: ${sunset}</p>
        <p>🕒 Last update: ${new Date().toLocaleString()}</p>
      `;
    } else {
      // show full error message to help debug
      result.innerHTML = `<p>❌ ${data.message} (code: ${data.cod})</p>`;
      console.log(data);
    }
  } catch (err) {
    console.log(err);
    result.innerHTML = "<p>Error fetching data. Check console.</p>";
  }
}





