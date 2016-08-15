import 'simpleweather';

export function template(weather) {
  return `<div class="mysam-weather animated fadeIn">
    <h1>
      <i class="icon-${weather.code}"></i>
      ${weather.temp}&deg;
      ${weather.units.temp}
    </h1>
    <ul>
      <li>${weather.city} ${weather.region}</li>
      <li class="currently">${weather.currently}</li>
      <li>${weather.alt.temp} &deg;F</li>
    </ul>
  </div>`;
}

export default function(sam, { $ }) {
  let geoLocation = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(function (position, error) {
      if(error) {
        reject(error);
      } else {
        resolve(position);
      }
    });
  });

  sam.learn('weather', {
    description: 'Tell the weather',
    tags: ['location']
  });

  sam.action('weather', function(el, classification) {
    let requestedLocation = classification.extracted.location ?
      classification.extracted.location : null;

    el = $(el);
    
    let loadWeather = (location, woeid) => {
      $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'c',
        success: function (weather) {
          el.html(template(weather));
        },
        error: function (error) {
          el.html(`<p>${error}</p>`);
        }
      });
    };


    if (requestedLocation) {
      loadWeather(requestedLocation, '');
    } else {
      geoLocation.then(position =>
        loadWeather(`${position.coords.latitude},${position.coords.longitude}`));
    }
  });
}
