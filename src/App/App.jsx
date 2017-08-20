var React = require('react');
const LOGO_URL = 'logo.svg';
var settings = require('../settings.json');

// General
function formatDate(sDate) {
	// Node.js supports only 'en'
	return new Date(sDate).toLocaleString(settings.locale, { weekday: 'long' })
}

function ImageWithText(oProps) {
	return <div className="ImageWithText"> <img role="presentation" src={oProps.oImage} /> {oProps.oText} </div>
}

// Weather Forecast
function WeatherForceastRow(oProps) {
	var aElements = [];
	oProps.aItems.forEach((oItem) => {
		aElements.push(<ImageWithText key={oItem.dt_txt} oImage={"https://openweathermap.org/img/w/" + oItem.weather[0].icon + ".png"}
			oText={Math.round(oItem.main.temp) + "°C"}>
		</ImageWithText>);
	});
	return <div className="ForeCastRow">{aElements}</div>;
}

function WeatherForceast(oProps) {
	var mGroupbyDate = [];
	var oRenderList = [];

	oProps.aWeatherList.forEach((oItem) => {
		var sDate = new Date(oItem.dt_txt).toDateString();
		if (mGroupbyDate[sDate]) {
			mGroupbyDate[sDate].push(oItem);
		} else {
			mGroupbyDate[sDate] = [oItem];
		}
	});

	Object.keys(mGroupbyDate).forEach((sKey) => {
		oRenderList.push(<li key={mGroupbyDate[sKey][0].dt_txt} > {
			formatDate(mGroupbyDate[sKey][0].dt_txt)
		}: <WeatherForceastRow aItems={mGroupbyDate[sKey]} key={mGroupbyDate[sKey][0].dt_txt}></WeatherForceastRow>
		</li>)
	});
	return <ul> {oRenderList} </ul>;
}

// Football Matches
function FootballMatchRow(oProps) {
	var mGoalScorers = new Map();
	var aScore = [0, 0];

	oProps.oMatch.Goals.forEach((oGoal) => {
		if (oGoal.MatchMinute) {
			aScore = [oGoal.ScoreTeam1, oGoal.ScoreTeam2];
			if (!oGoal.GoalGetterName) {
				oGoal.GoalGetterName = "No Name";
			}
			if (mGoalScorers.has(oGoal.GoalGetterName)) {
				mGoalScorers.set(oGoal.GoalGetterName, mGoalScorers.get(oGoal.GoalGetterName) + " " + oGoal.MatchMinute + ".");
			} else {
				mGoalScorers.set(oGoal.GoalGetterName, oGoal.MatchMinute + ".");
			}
		}
	});
var aScoreBoard = [];
mGoalScorers.forEach((value, key) => {
	aScoreBoard.push(value + " " + key);
});

return <div className="FootballMatchRow">
	<img width="20" height="20" role="presentation" src={oProps.oMatch.Team1.TeamIconUrl} /> {aScore[0]} : {aScore[1] + " "}
	<img width="20" height="20" role="presentation" src={oProps.oMatch.Team2.TeamIconUrl} />
	{mGoalScorers.size ? "(" : ""}{aScoreBoard.join(", ")}{mGoalScorers.size ? ")" : ""}
</div>
}

function FootballMatchDay(oProps) {
	var oRenderList = [];
	oProps.aItems.forEach((oItem) => {
		oRenderList.push(<FootballMatchRow key={oItem.MatchID} oMatch={oItem}></FootballMatchRow>)
	});
	return <div className="FootballMatchDay"> {oRenderList} </div>;
}

function FootballMatches(oProps) {
	var mGroupbyDate = [];
	var oRenderList = [];

	oProps.aMatches.forEach((oItem) => {
		var sDate = new Date(oItem.MatchDateTime).toDateString();
		if (mGroupbyDate[sDate]) {
			mGroupbyDate[sDate].push(oItem);
		} else {
			mGroupbyDate[sDate] = [oItem];
		}
	});

	Object.keys(mGroupbyDate).forEach((sKey) => {
		oRenderList.push(<li key={mGroupbyDate[sKey][0].MatchDateTime} > {
			formatDate(mGroupbyDate[sKey][0].MatchDateTime)
		}: <FootballMatchDay aItems={mGroupbyDate[sKey]} key={mGroupbyDate[sKey][0].MatchDateTime}></FootballMatchDay>
		</li>)
	});
	return <ul> {oRenderList} </ul>;
}

class App extends React.Component {

	constructor(oProps) {
		super(oProps);
		this.state = {
			weather: oProps.weather,
			football: oProps.football
		};
	}

	componentDidMount() {
	}

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={LOGO_URL} className="App-logo" alt="logo" />
					<h2>My App</h2>
				</div>
				<p className="App-intro"></p>
				<b>Weather forecast for {this.state.weather && this.state.weather.city ? this.state.weather.city.name : ""}:</b>
				{
					this.state.weather && this.state.weather.list && this.state.weather.list.length > 0 ? <WeatherForceast aWeatherList={this.state.weather.list} /> : "No Data."
				}
				<br></br>
				<hr></hr>
				<b>Football matches: </b>
				{
					this.state.football ? <FootballMatches aMatches={this.state.football}></FootballMatches> : "No Data."
				}
				<hr></hr>
				<b>Last Update:</b> {new Date().toString()} <br></br>
			</div>
		);
	}
}

module.exports = App;
