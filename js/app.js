window.addEventListener('load', ()=> {
  let longitude;
  let latitude;
  let temperatureSection = document.querySelector(".temperature-section");
  let temperatureSymbol = document.querySelector(".temperature-section .symbol");
  let currentTimezone = document.querySelector(".current-timezone");
  let currentTemp = document.querySelector(".current-temp");
  let currentSummary = document.querySelector(".current-summary");
  let currentDate = document.querySelector(".current-date");
  let currentDay = document.querySelector(".current-day");
  let weekView = document.querySelector(".next5days");

  // Gather geolocation data
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      longitude = position.coords.longitude;
      latitude = position.coords.latitude;

      // Set proxy to access API from local host
      const proxy = "https://cors-anywhere.herokuapp.com/";
      // DarkSky API for weather and time data
      const api = `${proxy}https://api.darksky.net/forecast/0fa31b8d79b6e313b6cc260f43853d42/${latitude},${longitude}`;

      // Fetch the data from the API
      fetch(api)
          .then(response =>{
            // Convert to JSON data
            return response.json();
          })
          .then(data =>{
            console.log(data);

            //////// Data for CURRENT day ///////////
            const { temperature, summary, icon, time } = data.currently;

              // Set DOM elements from api
            currentTemp.textContent = Math.floor(temperature);
            currentSummary.textContent = summary;
            currentTimezone.textContent = data.timezone;

              // Set the current weather icon
            setIcons(icon, document.querySelector(".current-icon"));

              // Change Temperature to Celcius/Farenheit on click
            temperatureSection.addEventListener("click", () => {
              changeDegrees(temperature);
            });

              // Get current date from UNIX time
            let date = new Date(time*1000);

              // Get the current day of the week
            let options1 = { weekday: 'long'};
            let dayOfWeek = new Intl.DateTimeFormat('en-US', options1).format(date);

              // Get the current day number and month
            let dayNumber = date.getDate();
            let options2 = { month: 'long'};
            let month = new Intl.DateTimeFormat('en-US', options2).format(date);

            currentDate.textContent = `${dayNumber} ${month}`;
            currentDay.textContent = dayOfWeek;


            //////// Data for WEEK view ///////////
            var daysOfWeek = weekView.getElementsByTagName("li");

            // Loops through the next 5 days.
            for (i = 0; i < 5; i++ ) {
              let {time, apparentTemperatureHigh, icon} = data.daily.data[i+1];
              let dayDate = new Date(time*1000);

              // Convert date to day name
              let options3 = { weekday: 'long'};
              let weekDay = new Intl.DateTimeFormat('en-US', options3).format(dayDate);

              // Select the day and set new text
              let htmlDay = daysOfWeek[i].querySelector(".day-name");
              htmlDay.textContent = weekDay;

              // Select the temperature and set new text
              let htmlTemp = daysOfWeek[i].querySelector(".temperature");
              htmlTemp.textContent = Math.floor(apparentTemperatureHigh);

              // Select the icon and set new icon
              let htmlIcon = daysOfWeek[i].querySelector(".icon-day");
              setIcons(icon, htmlIcon);
            }
          });
    });
  }

  function changeDegrees(temperature) {
    // Formula for conversion
    let celcius = Math.floor((temperature - 32) * (5/9));

    if(temperatureSymbol.textContent === "F"){
      temperatureSymbol.textContent = "C";
      currentTemp.textContent = celcius;
    } else {
      temperatureSymbol.textContent = "F";
      currentTemp.textContent = Math.floor(temperature);
    }
  }

  function setIcons(icon, iconID) {
    const skycons = new Skycons({color: "white"});
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
});
