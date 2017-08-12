
// Framework
var React = require('react');
const ReactDOMServer = require('react-dom/server');

// App
var App = require('./App');
var settings = require('../settings.json');
var fetch = require('node-fetch');

var SiteGenerator = {

	createContent: function() {
		var getWeatherData = function() {
			return fetch('http://api.openweathermap.org/data/2.5/forecast?units=metric&id=' + settings.openweather.cityId + '&appid=' + settings.openweather.id)
				.then((oResponse) => { return oResponse.json() })
				.then((oWeatherData) => {
					return oWeatherData
				});
		};
		var getFootballData = function() {
			return fetch('https://www.openligadb.de/api/getmatchdata/' + settings.openliga.league)
				.then((oResponse) => { return oResponse.json() })
				.then((oMatchData) => {
					return oMatchData;
				})
		};

		return Promise.all([
			getWeatherData(),
			getFootballData()
		]).then(([oWeatherData, oMatchData]) => {
			return ReactDOMServer.renderToString(
				<App weather={oWeatherData} football={oMatchData} />
			);
		});
	}
}

module.exports = SiteGenerator;