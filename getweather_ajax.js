let corsUrl = 'https://cors-anywhere.herokuapp.com/';
let weatherApiUrl = 'https://api.darksky.net/forecast/';
let weatherApiKey = '1a5dd3f32f0263c12b838a8de22df78c/';
let lat = '50.2025478';
let lon = '8.5770309';
let unitsParam = '?units=si';
// https://api.darksky.net/forecast/1a5dd3f32f0263c12b838a8de22df78c/50.2025478,8.5770309?units=si
//apiKey: 1a5dd3f32f0263c12b838a8de22df78c

let locApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
let locApiKey = 'AIzaSyBiF-k6CtGz-gwgd8o7hhd9C1GoWMKxLgU';
let locSearchTerm = 0;

var weatherData;
var locationData;

var epoch;
var weekday = [];

var skycons = new Skycons({"color": "white"});



function setup() {
  noCanvas();
  getWeather();
  eventListener();
}

function eventListener() {
    $(function() {
      $('.search_container').each(function() {
          $(this).find('input').keypress(function(e) {
              // Enter pressed?
              if(e.which == 10 || e.which == 13) {
                console.log('enter pressed');
                locSearchTerm = $('input[type=text][name=locSearch]').val();
                if(locSearchTerm != 0) {
                  console.log(locSearchTerm);
                  geocode();
                }
              }
          });
      });
    });
}

function geocode() {
  locSearchUrl = locApiUrl + locSearchTerm.replace(" ", '+') + '&key=' + locApiKey;
  console.log('request url: ' + locSearchUrl);

  loadJSON(locSearchUrl, function(data) {
    locationData = data;
    gotLocation();
  });
}

function getWeather() {
  let weatherUrl = corsUrl + weatherApiUrl + weatherApiKey + lat + ',' + lon + unitsParam;
  $.ajax({
    url: weatherUrl,
    type: "GET",
    dataType: "json",
    cache: true,
    success: function(data) {
      weatherData = data;
      //gotWeather();
      displayData();
    },
  });
}

function gotWeather(weather) {
  //console.log(weatherData);
  let currentEpoch = weatherData.currently.time;
  let currentDate = new Date(currentEpoch * 1000);
  document.getElementById("weatherInfo2").innerHTML = 'for ' + currentDate.toUTCString();
  document.getElementById("temp_current").innerHTML = weatherData.currently.temperature + ' °C';
  document.getElementById("temp_high_low").innerHTML = weatherData.daily.data[0].temperatureHigh + ' °C / ' + weatherData.daily.data[0].temperatureLow + ' °C';
}

function gotLocation() {
  console.log(locationData);
  $('#location_data').html(locationData.results[0].formatted_address);
  lat = locationData.results[0].geometry.location.lat;
  lon = locationData.results[0].geometry.location.lng;
  getWeather();
  $('#search_bar').val('');
}

function displayData() {

// figure out and display weekdays

  for(var i = 0; i < 7; i++) {
    epoch = new Date(weatherData.daily.data[i].time * 1000);
    weekday[i] = epoch.getDay();
    //console.log('weekday number of day ' + i + ': ' + weekday[i]);
    switch(weekday[i]) {
      case 0:
        weekday[i] = "Sun";
        break;
      case 1:
        weekday[i] = "Mon";
        break;
      case 2:
          weekday[i] = "Tue";
        break;
      case 3:
        weekday[i] = "Wed";
        break;
      case 4:
        weekday[i] = "Thu";
        break;
      case 5:
        weekday[i] = "Fri";
        break;
      case 6:
        weekday[i] = "Sat";
    }
    //console.log(weekday[i])
  }

  document.getElementById("day0").innerHTML = 'Today';  
  for(var j = 1; j < 7; j++) {
    document.getElementById('day' + j).innerHTML = weekday[j];
  }

  // figure out and display icons

  var clientTime = new Date();
  var clientHour = clientTime.getHours();
  //console.log(clientHour);
  for(var i = 0; i < 7; i++) {
    var requestedIcon = weatherData.daily.data[i].icon;
    //console.log(requestedIcon);
    if(i != 0 && requestedIcon == 'clear-night' || 'partly-cloudy-night') {
      if(requestedIcon == 'clear-night') {
        requestedIcon = 'clear-day';
        skycons.add(document.getElementById('day' + i + 'icon'), requestedIcon);
      }
      else if(requestedIcon == 'partly-cloudy-night') {
        requestedIcon = 'partly-cloudy-day';
        skycons.add(document.getElementById('day' + i + 'icon'), requestedIcon);
      }
    }
    skycons.add(document.getElementById('day' + i + 'icon'), requestedIcon);
  }
  skycons.play();

  // display temps
  
  for(var i = 0; i < 7; i++) {
    var highTemp = Math.round(weatherData.daily.data[i].temperatureHigh);
    document.getElementById('day' + i + 'highTemp').innerHTML = highTemp + '°C';

    var lowTemp = Math.round(weatherData.daily.data[i].temperatureLow);
    document.getElementById('day' + i + 'lowTemp').innerHTML = lowTemp + '°C';
  }

  for(var i = 0; i < 7; i++) {
    if(weatherData.daily.data[i].precipType != 'snow') {
      for(var j = 0; j < 7; j++) {
        $('#precip_right' + j).remove();
        $('#precip_left' + j).css({
          'width': '100%',
          'border': '0px',
          'text-align': 'center',
          'font-size': '100%',
        });
        var precipProbability = Math.round(weatherData.daily.data[j].precipProbability * 100);
        $('#day' + j + 'probab').html(precipProbability + '%');
      }
    }
    else if(weatherData.daily.data[i].precipType = 'snow') {
      for(var j = 0; j < 7; j++) {
        $('#day' + j + 'probab').css('font-size', '95%');
        $('#day' + j + 'amount').css('font-size', '95%'); 
        var precipProbability = Math.round(weatherData.daily.data[j].precipProbability * 100);
        $('#day' + j + 'probab').html(precipProbability + '%');

        var precipAmount = weatherData.daily.data[i].precipIntensity / 0.39370;
        if(precipAmount < 1) {
          $('#day' + j + 'amount').html('<1cm');
        }
        else {
          $('#day' + j + 'amount').html(Math.floor(precipAmount) + 'cm');
        }
      }
    } 
  }
}







/*




//  skycons.add(document.getElementById("day0icon"), Skycons.RAIN);



*/