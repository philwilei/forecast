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

var weekday = [];

var skycons = new Skycons({"color": "white"});



function setup() {
  noCanvas();
  getWeather();
  keypressListener();
  clickListener();
  $('#forecast_details').css('display', 'none');
}

function keypressListener() {
  $(function() {
    $('.search_container').each(function() {
        $(this).find('input').keypress(function(e) {
            // Enter pressed?
            if(e.which == 10 || e.which == 13) {
              //console.log('enter pressed');
              locSearchTerm = $('input[type=text][name=locSearch]').val();
              if(locSearchTerm != 0) {
                //console.log(locSearchTerm);
                geocode();
              }
            }
        });
    });
  });
}

function clickListener() {
  $('#forecast_item0').click(function() {
    console.log('clicked forecast_item 0');
    $(this).css('background', '#3b6689');
    clearDaySelection(0);
    $('#forecast_details').css('display', 'block');
  });
  $('#forecast_item1').click(function() {
    console.log('clicked forecast_item 1');
    $(this).css('background', '#3b6689');
    clearDaySelection(1);
  });
  $('#forecast_item2').click(function() {
    console.log('clicked forecast_item 2');
    $(this).css('background', '#3b6689');
    clearDaySelection(2);
  });
  $('#forecast_item3').click(function() {
    console.log('clicked forecast_item 3');
    $(this).css('background', '#3b6689');
    clearDaySelection(3);
  });
  $('#forecast_item4').click(function() {
    console.log('clicked forecast_item 4');
    $(this).css('background', '#3b6689');
    clearDaySelection(4);
  });
  $('#forecast_item5').click(function() {
    console.log('clicked forecast_item 5');
    $(this).css('background', '#3b6689');
    clearDaySelection(5);
  });
  $('#forecast_item6').click(function() {
    console.log('clicked forecast_item 6');
    $(this).css('background', '#3b6689');
    clearDaySelection(6);
  });
}

function clearDaySelection(selectedDay) {
  for(var i = 0; i < 7; i++) {
    if(i == selectedDay) {
      continue;
    }
    $('#forecast_item' + i).css('background', '#142635');
    $('#forecast_item' + i + ':hover').css({
      'background': '#3b6689',
      'opacity': '50%'
    });
  }
}

function geocode() {
  locSearchUrl = locApiUrl + locSearchTerm.replace(" ", '+') + '&key=' + locApiKey;
  //console.log('request url: ' + locSearchUrl);

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
      console.log(data);
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

  for(let i = 0; i < 7; i++) {
    var epoch = new Date(weatherData.daily.data[i].time * 1000);
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
  //console.log('client hour: ' + clientHour);
  for(let i = 0; i < 7; i++) {
    var requestedIcon = weatherData.daily.data[i].icon;
    //console.log(requestedIcon);
    if(i != 0 && requestedIcon == 'clear-night' || 'partly-cloudy-night') {
      if(requestedIcon == 'clear-night') {
        requestedIcon = 'clear-day';
        skycons.remove(document.getElementById('day' + i + 'icon')); 
        skycons.add(document.getElementById('day' + i + 'icon'), requestedIcon);         
      }
      else if(requestedIcon == 'partly-cloudy-night') {
        requestedIcon = 'partly-cloudy-day';
        skycons.remove(document.getElementById('day' + i + 'icon'));
        skycons.add(document.getElementById('day' + i + 'icon'), requestedIcon);
      }   
    }
    skycons.remove(document.getElementById('day' + i + 'icon'), requestedIcon);
    skycons.add(document.getElementById('day' + i + 'icon'), requestedIcon);
  }
  skycons.play();

  // display temps
  
  for(let i = 0; i < 7; i++) {
    var highTemp = Math.round(weatherData.daily.data[i].temperatureHigh);
    document.getElementById('day' + i + 'highTemp').innerHTML = highTemp + '°C';

    var lowTemp = Math.round(weatherData.daily.data[i].temperatureLow);
    document.getElementById('day' + i + 'lowTemp').innerHTML = lowTemp + '°C';
  }

  // display precipitation
/*
  for(let i = 0; i < 7; i++) {
    if(weatherData.daily.data[i].precipType == 'rain') {
      for(let j = 0; j < 7; j++) {
        $('#day' + j + 'amount').html('');
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
    else if(weatherData.daily.data[i].precipType == 'snow') {
        $('#precip_left' + i).css({
          'width': '50%',
          'border-right': '1px solid #aecbf9',
          'font-size': '95%',
        });
        $('#precip_right' + i).css({
          'flex-grow': '1',
          'color': '#aecbf9',
          'font-weight': 'normal',
          'font-size': '95%',
        });
        var precipProbability = Math.round(weatherData.daily.data[i].precipProbability * 100);
        $('#day' + i + 'probab').html(precipProbability + '%');

        console.log(weatherData.daily.data[i].precipAccumulation);
        var precipAmount = (weatherData.daily.data[i].precipAccumulation / 0.39370);
        if(precipAmount < 1) {
          $('#day' + i + 'amount').html('<1cm');
        }
        $('#day' + i + 'amount').html(Math.floor(precipAmount) + 'cm');
    }
    */

    // rain only

    for(var i = 0; i < 7; i++) {
      $('#precip_right' + i).remove();
      $('#precip_left' + i).css({
        'width': '100%',
        'border': '0px',
        'text-align': 'center',
        'font-size': '100%',
      });
      $('.precipContainer').css('text-align', 'center');
      var precipProbability = Math.round(weatherData.daily.data[i].precipProbability * 100);
      $('#day' + i + 'probab').html(precipProbability + '%');
    }
  }

/*



*/