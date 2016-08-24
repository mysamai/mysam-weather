import 'simpleweather';

export function template(weather) {
  return `<div class="mysam-weather animated fadeIn">
    <h1>
      <i class="weather-${weather.code}"></i>
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

export function geoLocation() {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(
      (position, error) => error ? reject(error) : resolve(position)
    )
  );
}

export default function({ $ }) {
  const app = this;
  
  app.learn('weather', {
    description: 'Tell the weather',
    tags: ['location']
  });

  app.action('weather', function(el, classification) {
    let requestedLocation = classification.extracted.location ?
      classification.extracted.location : null;

    el = $(el);

    el.html(`<p style="text-align: center">
      <i class="fa fa-spinner fa-spin placeholder"></i>
    </p>`);
    
    let loadWeather = (location, woeid) => {
      $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'c',
        success(weather) {
          el.html(template(weather));
        },
        error(error) {
          el.html(`<p>${error}</p>`);
        }
      });
    };


    if (requestedLocation) {
      loadWeather(requestedLocation, '');
    } else {
      geoLocation().then(position =>
        loadWeather(`${position.coords.latitude},${position.coords.longitude}`));
    }

    // Teardown
    return function() {
      el.empty();
    };
  });
}
