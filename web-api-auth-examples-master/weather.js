class forecast{
    constructor(temp, wind, precip, weatherPic, weatherSummary, weatherNow){
        this.temp = temp;
        this.wind = wind;
        this.precip = precip;
        this.weatherPic = weatherPic;
        this.weatherSummary = weatherSummary;
        this.weatherNow = weatherNow;
    }

    get currentWeatherForecast(){
        return this.weatherNow;
    }

}
function link() {
    const fetch = require("node-fetch");
    fetch('https://api.darksky.net/forecast/9a4d1c2917194941aa3da679d3e40262/37.8267,-122.4233')
    .then((resp) => resp.json())
    .then(function(data) {
      forecast = weatherCase(data);
      console.log(forecast);
      return forecast;
    })
    .catch(()=>{
        console.log('Unable to recieve weather data.');
    })
  }
  
  function weatherCase(jsonDump){
    let weatherPicture;
    const currentDay = new Date().getDay()
    const weatherPictures = {
      rain : "url('https://i.pinimg.com/originals/23/d8/ab/23d8ab1eebc72a123cebc80ce32b43d8.jpg')",
      sunny: "url('https://i.imgur.com/Klia7QY.jpg')",
      cloudy: "url('https://images.wallpaperscraft.com/image/field_grass_clouds_cloudy_119502_1920x1080.jpg')",
      clearNight: "url(https://hdqwalls.com/download/clear-stars-sky-night-rock-5k-h6-1920x1080.jpg)",
      clearDay: "url('https://hoodline.imgix.net/uploads/story/image/486108/istock__..featured_image_1..sunny_3.jpg.jpg?auto=format')",
      snow: "url('https://blog.mystart.com/wp-content/uploads/shutterstock_238248124-e1520010671722.jpg')",
      sleet: "url('https://s7d2.scene7.com/is/image/TWCNews/2016-02-15_17_16_30_Freezing_rain_and_sleet_on_a_car_in_Sterling,_Virginia')",
      wind: "url('https://www.archive.inform.kz/fotoarticles/20180803232026.jpg')",
      fog: "url('https://p0.pxfuel.com/preview/711/542/477/mountain-lake-mist-sunrise.jpg')",
      partlyCloudyNight: "url('https://us.123rf.com/450wm/mpz/mpz1711/mpz171100052/90419690-dark-cloudy-night-sky-with-stars.jpg?ver=6')",
      partlyCloudyDay: "url('https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fspecials-images.forbesimg.com%2Fdam%2Fimageserve%2F965694882%2F960x0.jpg')",
      hail: "url('https://gantins.com/wp-content/uploads/2016/05/Fotolia_105332852_Subscription_XL.jpg')",
      thunderstorm: "url('https://www.vmcdn.ca/f/files/halifaxtoday/images/weather/072919-thunderstorm-adobestock_224367109.jpeg;w=960')",
      tornado: "url('https://www.washingtonpost.com/resizer/hGdr2HjUwg5j_jFu_s5e9K7cxB0=/1484x0/arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/BZXBEUIQFFG3HFH45HLE7T6GKY.jpg')"

    }
    
    //Fill out weather information.
    const temperature = Math.round(jsonDump.currently.temperature);
    const windSpeed = jsonDump.currently.windSpeed;
    const precipChance = Math.round(jsonDump.currently.precipProbability * 100);
    const summary = jsonDump.daily.summary;
    currentWeather = jsonDump.currently.icon;
  
    //Determine type of weather for display. 
    switch (currentWeather) {
      case "rain" :
        weatherPicture = weatherPictures.rain;
        break;
      case "clear-day" :
        weatherPicture = weatherPictures.sunny;
        break;
      case "cloudy" :
        weatherPicture = weatherPictures.cloudy;
        break;
      case "clear-night":
        weatherPicture = weatherPictures.clearNight;
        break;
      case "snow":
        weatherPicture = weatherPictures.snow;
        break;
      case "sleet":
        weatherPicture = weatherPictures.sleet;
        break;
      case "wind":
        weatherPicture = weatherPictures.wind;
        break;
      case "fog":
        weatherPicture = weatherPictures.fog;
        break;
      case "partly-cloudy-night":
        weatherPicture = weatherPictures.partlyCloudyNight;
        break;
      case "partly-cloudy-day":
        weatherPicture = weatherPictures.partlyCloudyDay;
        break;
      case "hail":
        weatherPicture = weatherPictures.hail;
        break;
      case "thunderstorm":
        weatherPicture = weatherPictures.thunderstorm;
        break;
      case "tornado":
        weatherPicture = weatherPictures.tornado;
        break;
      default:
        weatherPicture = weatherPictures.sunny;
  
    }
    return new forecast(temperature, windSpeed, precipChance, weatherPicture, summary, currentWeather);

  }

link();

