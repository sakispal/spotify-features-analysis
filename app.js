const fs = require ("fs");
const request = require("request");
const csv=require('csvtojson');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require("ejs");
const SpotifyWebApi = require('spotify-web-api-node');

const readQueryAndWrite = require("./index");


//Configuration
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

//ROUTES
app.get("/", function(req,res){
	res.render("index.ejs");
});

app.post("/" , (req,res) => {
	let fileName = req.body.file;
	//Handle file upload
	let clientId = (req.body.clientId) ? req.body.clientId : null ;
	let clientSecret = (req.body.clientSecret) ? req.body.clientSecret : null;

	readQueryAndWrite(fileName, clientId, clientSecret);
	res.render("success.ejs");
})

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