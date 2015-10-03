var debug = require('debug')('mysam:weather');

module.exports = function (sam) {
  var actions = sam.service('actions');

  actions.find({ query: {type: 'weather'} }, function (error, data) {
    if (!data.length) {
      debug('Adding mysam-weather training data');
      actions.create({
        "text": "what's the weather in Vancouver",
        "action": {"type": "weather"},
        "tags": [{
          "label": "location",
          "start": 6,
          "end": -1
        }]
      }, function(error, action) {
        debug('Added training data `' + action.text + '` (' + action.id + ')');
      });
    }
  });
};
