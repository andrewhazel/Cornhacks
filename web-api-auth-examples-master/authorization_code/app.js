/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */


var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '924b28619c6f43d091edad8ce03154ee'; // Your client id
var client_secret = 'f7de96d0f2b24dbda3618d9ee680bec3'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-top-read playlist-modify-private playlist-modify-public';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  };
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
      console.log('final');
    }
  });
});


console.log('Listening on 8888');
app.listen(8888);

/*
This section of code uses DarkSky API to develop a forecast, or an object containing relevant weather data.
*/

class Response{
  constructor(temp, wind, precip, weatherPic, weatherSummary, weatherNow, weatherPlaylist){
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
  fetch('https://api.darksky.net/forecast/9a4d1c2917194941aa3da679d3e40262/40.8136, -96.7026')
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
  let weatherSongList;

  //Determine type of weather for display. 
  switch (currentWeather) {
    case "rain" :
      weatherPicture = weatherPictures.rain;
      weatherSongList = songSort(list, 'acoutisticness', 0.5, 1.0);
      break;
    case "clear-day" :
      weatherPicture = weatherPictures.sunny;
      weatherSongList = songSort(list, 'valence', 0.6, 1.0);
      break;
    case "cloudy" :
      weatherPicture = weatherPictures.cloudy;
      weatherSongList = songSort(list, 'energy', 0.3, 0.6);
      break;
    case "clear-night":
      weatherPicture = weatherPictures.clearNight;
      weatherSongList = songSort(list, 'danceability', 0.6, 1.0);
      break;
    case "snow":
      weatherPicture = weatherPictures.snow;
      weatherSongList = songSort(list, 'acousticness', 0.3, 0.7);
      break;
    case "sleet":
      weatherPicture = weatherPictures.sleet;
      weatherSongList = songSort(list, 'acousticness', 0.3, 0.7);
      break;
    case "wind":
      weatherPicture = weatherPictures.wind;
      weatherSongList = songSort(list, 'energy', 0.4, 0.7);
      break;
    case "fog":
      weatherPicture = weatherPictures.fog;
      weatherSongList = songSort(list, 'energy', 0.0, 0.3);
      break;
    case "partly-cloudy-night":
      weatherPicture = weatherPictures.partlyCloudyNight;
      weatherSongList = songSort(list, 'danceability', 0.5, 0.8);
      break;
    case "partly-cloudy-day":
      weatherPicture = weatherPictures.partlyCloudyDay;
      weatherSongList = songSort(list, 'valence', 0.4, 0.9);
      break;
    case "hail":
      weatherPicture = weatherPictures.hail;
      weatherSongList = songSort(list, 'acousticness', 0.0, 0.5);
      break;
    case "thunderstorm":
      weatherPicture = weatherPictures.thunderstorm;
      weatherSongList = songSort(list, 'acousticness', 0.0, 0.5);
      break;
    case "tornado":
      weatherPicture = weatherPictures.tornado;
      weatherSongList = songSort(list, 'acousticness', 0.0, 0.5);
      break;
    default:
      weatherPicture = weatherPictures.sunny;
      weatherSongList = songSort(list, 'energy', 0.5, 1.0);

  }
  return new Response(temperature, windSpeed, precipChance, weatherPicture, summary, currentWeather, weatherSongList);

}

function songSort(songList, trackFeature, lowerThreshold, upperThreshold){
  const PLAYLIST_MAX_SIZE = 10;

  const curatedPlaylist = [];
  let maxSizeReached = false;
  for (i = 0; i < songList.length; ++i){
    if (curatedPlaylist.length !== PLAYLIST_MAX_SIZE){
      if (songList[i].trackFeature >= lowerThreshold && songList[i].trackFeature <= upperThreshold){
        curatedPlaylist.push(songList[i]);
        maxSizeReached = true;
      }
    }else{
      break;
    }
  } if (!maxSizeReached){
    //#stub
  }

  return curatedPlaylist;
  
}



