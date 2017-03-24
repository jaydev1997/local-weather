var currentUnit = 'F';

var iconMap = {};
iconMap['clear-day'] = 'wi-forecast-io-clear-day';
iconMap['clear-night'] = 'wi-forecast-io-clear-night';
iconMap['rain'] = 'wi-forecast-io-rain';
iconMap['snow'] = 'wi-forecast-io-snow';
iconMap['sleet'] = 'wi-forecast-io-sleet';
iconMap['wind'] = 'wi-forecast-io-wind';
iconMap['fog'] = 'wi-forecast-io-fog';
iconMap['cloudy'] = 'wi-forecast-io-cloudy';
iconMap['partly-cloudy-day'] = 'wi-forecast-io-partly-cloudy-day';
iconMap['partly-cloudy-night'] = 'wi-forecast-io-partly-cloudy-night';
iconMap['hail'] = 'wi-forecast-io-hail';
iconMap['thunderstorm'] = 'wi-forecast-io-thunderstorm';
iconMap['tornado'] = 'wi-forecast-io-tornado';

function getPosition() {

  return $.Deferred(deferred => navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject));

};

function getWeather(position) {

  const url = `https://api.forecast.io/forecast/83f436fc1b093e004912f28e87f08d9e/${position.coords.latitude},${position.coords.longitude}?callback=?`;

  return $.getJSON(url).then((data) => data);

}

function getLocationName(position) {

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyChcQU2s3VYM45zsGpXJ1-IIKRpTv0j-aM`;

  return $.getJSON(url).then((data) => data);

}

function celsiusToFarenheit(celsius) {
  return celsius * 1.8 + 32;
}

function farenheitToCelsius(farenheit) {
  return (farenheit - 32) / 1.8;
}

function convert(fromUnit, toUnit) {

  var currentVal = $('#temperature').text();
  var newVal;

  if (fromUnit === 'farenheit') {
    newVal = Math.round(farenheitToCelsius(currentVal));
    $('#unit').text('\xB0C');
    currentUnit = 'C';
  } else {
    newVal = Math.round(celsiusToFarenheit(currentVal));
    $('#unit').text('\xB0F');
    currentUnit = 'F';
  }

  $('#temperature').text(newVal);

}

$(document).ready(function() {
  
  $('.inner-container').hide();
  $('.loader').show();
  
  //FETCH WEATHER
  getPosition()

  .then(position => $.when(getWeather(position), getLocationName(position)), function(err) {
    var codePenURL = 'https://codepen.io/jaydevs/pen/vxRObV';
    var errorMessage = `${err.message} Try <a href="${codePenURL}" target="_blank">${codePenURL}</a>.`;
    $('#errorMessage').html(errorMessage);
    $('.loader').hide();
  })

  .then(function(weatherData, locationData) {

    $('#userLocation').text(locationData.results[3].formatted_address);
    $('#weatherDescription').text(weatherData.currently.summary);
    $('#temperature').text(Math.round(weatherData.currently.temperature));
    $('#unit').text('\xB0F');
    $('#weatherIcon').addClass(iconMap[weatherData.currently.icon]);

    $('.loader').hide();
    $('.inner-container').fadeIn(3000);

  });

  //EVENT LISTENERS
  $('#settings').click(function() {
    $('.options').slideToggle();
  });

  $('body').on('click', '#celsius', function() {
    $('.options').slideToggle();
    if (currentUnit != 'C') {
      convert('farenheit', 'celsius');
    }
  });

  $('body').on('click', '#farenheit', function() {
    $('.options').slideToggle();
    if (currentUnit != 'F') {
      convert('celsius', 'farenheit');
    }
  });

});

function startTime() {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    ap = (hr < 12) ? "<span>AM</span>" : "<span style='margin-left:95%'>PM</span>";
    hr = (hr == 0) ? 12 : hr;
    hr = (hr > 12) ? hr - 12 : hr;
    //Add a zero in front of numbers<10
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    document.getElementById("clock").innerHTML = hr + ":" + min + ":" + sec + " " + ap;
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var curWeekDay = days[today.getDay()];
    var curDay = today.getDate();
    var curMonth = months[today.getMonth()];
    var curYear = today.getFullYear();
    var date = curWeekDay+", "+curDay+" "+curMonth+" "+curYear;
    document.getElementById("date").innerHTML = date;
    
    var time = setTimeout(function(){ startTime() }, 500);
}
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
