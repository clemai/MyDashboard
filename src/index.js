
const fs = require('fs');

var React = require('./App/SiteGenerator.js');

React.createContent().then((sAppContent)=>{
	var sBaseHtml = fs.readFileSync("static/base.html", "utf8");
	var sAppHTML = sBaseHtml.replace('RENDERED_CONTENT',sAppContent);
	fs.writeFileSync("static/index.html", sAppHTML, { encoding: "utf8"});
})
