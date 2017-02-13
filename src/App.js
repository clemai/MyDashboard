import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import settings from './settings.json';



function WeatherForceast(oWeatherData) {
	const oList = oWeatherData.list;
	var mGroupbyDate = [];
	oList.map((oItem) => {
		var sDate = new Date(oItem.dt_txt).toDateString();
		if (mGroupbyDate[sDate]) {
			mGroupbyDate[sDate].push(oItem);
		} else {
			mGroupbyDate[sDate] = [oItem];
		}
	}
	);
	var oRenderList = [];
	Object.keys(mGroupbyDate).forEach((sKey) => {
		oRenderList.push(<li key={mGroupbyDate[sKey][0].dt_txt} > {
			new Date(mGroupbyDate[sKey][0].dt_txt).toLocaleString(settings.locale, { weekday: 'long' })
		}: {
				mGroupbyDate[sKey].map((oItem) => {
					return oItem.main.temp + "°C";
				}).join(", ")}
		</li>)
	});
	return (<ul> {oRenderList} </ul>);
}



class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			weather: {},
			football: {}
		};
	}
	componentDidMount() {
		// TODO: fetch polyfill https://github.com/github/fetch
		// TODO: Limit API calls
		fetch('http://api.openweathermap.org/data/2.5/forecast?units=metric&id=' + settings.openweather.cityId + '&appid=' + settings.openweather.id)
			.then((response) => { return response.json() })
			.then((oWeatherData) => {
				this.setState({ weather: oWeatherData })
			});

		fetch('https://www.openligadb.de/api/getnextmatchbyleagueteam/' + settings.openliga.season + '/' + settings.openliga.team)
			.then((oResponse) => { return oResponse.json() })
			.then((oNextGameData) => {
				this.setState({
					football: oNextGameData
				})
			});
	}



	render() {

		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>My App</h2>
				</div>
				<p className="App-intro"></p>
				<b>Last Update:</b> {new Date().toString()} <br></br>
				<hr></hr>
				<b>Heidelberg weather:</b>
				{
					this.state.weather && this.state.weather.list && this.state.weather.list.length > 0 ? <WeatherForceast list={this.state.weather.list} /> : "Request failed"
				}
				<br></br>
				<hr></hr>
				<b>Next football game: </b>
				{
					this.state.football && this.state.football.Team1 && this.state.football.Team2 &&
					<div>
						<img src={this.state.football.Team1.TeamIconUrl}></img>{this.state.football.Team1.TeamName} vs.
							<img src={this.state.football.Team2.TeamIconUrl}></img>{this.state.football.Team2.TeamName} on {this.state.football.MatchDateTime}
					</div>
				}
			</div>
		);
	}
}

export default App;
