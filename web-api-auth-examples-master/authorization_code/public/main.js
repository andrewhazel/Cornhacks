/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

class Response{
  constructor(temp, wind, precip, weatherPic, weatherSummary, weatherNow, weatherPlaylist){
      this.temp = temp;
      this.wind = wind;
      this.precip = precip;
      this.weatherPic = weatherPic;
      this.weatherSummary = weatherSummary;
      this.weatherNow = weatherNow;
      this.weatherPlaylist = weatherPlaylist;
  }

  get currentWeatherForecast(){
      return this.weatherNow;
  }

}

function calculateWeather(list){
  $.ajax({
    url: 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/9a4d1c2917194941aa3da679d3e40262/40.8136, -96.7026',
    async: false,
    success: function(response) {
      let weather = weatherCase(list, response)
      let htmlSongList = document.getElementById('song-list');
      const songs = []
      for (const song of weather.weatherPlaylist) {
        songs.push(song.id)
      }
      $.ajax({
        url: "https://api.spotify.com/v1/tracks",
        data: {"ids" : songs.join()},
        async: false,
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
      success: function(response) {
        songIds = []
        for (let i = 0; i < response.tracks.length ; i++) {
          songIds.push(response.tracks[i].uri)
          let element = document.createElement("li")
          var myImage = new Image(100, 100);
          myImage.src = response.tracks[i].album.images[0].url;
          myImage.style.padding = "5px 5px 5px 5px"
          element.appendChild(myImage);

          //img.appendTo(element); 
          var a = document.createElement('a');
          var link = document.createTextNode(response.tracks[i].name);
          a.appendChild(link);
          a.href = response.tracks[i].external_urls.spotify;
          a.target="_blank";
          a.style.color= "white";
          
          element.appendChild(a);
          htmlSongList.insertAdjacentElement("beforeend", element)
        }

        $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            const playlistData = JSON.stringify({
              "name": "Your TuneCast Playlist",
              "description": "Music for your weather.",
              "public": false
            })
            user_id = response.id
            $.ajax({
              type: "POST",
              url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
              data: playlistData,
              contentType: 'application/json',
              headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                  const songData = JSON.stringify({"uris" : songIds})
                  console.log(songIds)
                  playlist_id = response.id
                  $.ajax({
                    type: "POST",
                    url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
                    data: songData,
                    contentType: 'application/json',
                    headers: {
                        'Authorization': 'Bearer ' + access_token
                      },
                      success: function(response) {
                        
                      }
                  })
                }
            })
          }
      });

      }})

  }
})}


function weatherCase(list, jsonDump){
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
  const description = document.getElementById('description')

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
      description.textContent = "A clear Night Calls for a Highly Dancable Playlist - Jessie."
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
      if (songList[i][trackFeature] >= lowerThreshold && songList[i][trackFeature] <= upperThreshold){
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


var userProfileSource = document.getElementById('user-profile-template').innerHTML,
    userProfileTemplate = Handlebars.compile(userProfileSource),
    userProfilePlaceholder = document.getElementById('user-profile');

var oauthSource = document.getElementById('oauth-template').innerHTML,
    oauthTemplate = Handlebars.compile(oauthSource),
    oauthPlaceholder = document.getElementById('oauth');

var params = getHashParams();

var access_token = params.access_token,
    refresh_token = params.refresh_token,
    error = params.error;

let user_id;

let playlist_id;

const song_list = new Array()

const playlist_list = [];

if (error) {
  alert('There was an error during the authentication');
} else {
  if (access_token) {
    // render oauth info
    oauthPlaceholder.innerHTML = oauthTemplate({
      access_token: access_token,
      refresh_token: refresh_token
    });

    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          user_id = response.id
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);

          $('#login').hide();
          $('#loggedin').show();
        }
    });
  } else {
      // render initial screen
      $('#login').show();
      $('#loggedin').hide();
  }

  document.getElementById('top-artists').addEventListener('click', function() {
      $.ajax({
          url: 'https://api.spotify.com/v1/me/top/tracks',
          data: {"limit": 50},
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            let list = document.getElementById('song-list');
            
            for(let i = 0; i < 50; i++) {
              song_list.push(response.items[i].id)
            }
            $.ajax({
              url: "https://api.spotify.com/v1/audio-features",
              data: {"ids" : song_list.join()},
              async: false,
              headers: {
                'Authorization': 'Bearer ' + access_token
              },
            success: function(response) {
              calculateWeather(response.audio_features)
            }})
          }
      })
    })
}
