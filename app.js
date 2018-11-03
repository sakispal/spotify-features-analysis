const fs = require ("fs");
const request = require("request");
const csv=require('csvtojson');
const express = require('express');
const app = express();
const ejs = require("ejs");
var SpotifyWebApi = require('spotify-web-api-node');

var fetchData = require("./fetchData");


//Configuration
app.use(express.static("public"));
//ROUTES
app.get("/", function(req,res){
	res.render("index.ejs");
});

app.get("/login", function(req,res){
	res.redirect(authorizeURL);
})


//Methods

// fetchData();


// START THE SERVER
if (process.env.NODE_ENV === "development"){
	app.listen(3000, () => {
		console.log("Listening to local port 3000!");
	});
} else { 
	//Listen to heroku's default port
	app.listen(process.env.PORT, () => {
		console.log("Listening to whatever heroku set");
	});
}