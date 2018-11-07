const fs = require ("fs");
const request = require("request");
const csv=require('csvtojson');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require("ejs");
const SpotifyWebApi = require('spotify-web-api-node');
const fileUpload = require('express-fileupload');

//Set a global variable that warns about server status before calling the main function
global.serverStatus = true;
const readQueryAndWrite = require("./index");

//Configuration
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());


//ROUTES
app.get("/", function(req,res){
	res.render("index.ejs");
});

app.post("/" , (req,res) => {
	//We need a 10min timeout because the process takes ages
	res.setTimeout(60*10*1000);
	//Handle file upload
	global.file = req.files.csv;
	console.log(`Successfully uploaded file ${file.name}`);
	//Set spotify API credentials
	let clientId = req.body.clientId || null ;
	let clientSecret = req.body.clientSecret || null;

	readQueryAndWrite(file, clientId, clientSecret)
	.then((files) =>{
		res.render("success.ejs");
	})
	.catch((err)=>{
		res.send(`Error ${err}`)
	});
})

app.get("/features" , (req , res) =>{
	res.sendFile(`${file.name.replace(".csv", "")}-features.csv` , {root : __dirname});
});

app.get("/analysis" , (req , res) =>{
	res.sendFile(`${file.name.replace(".csv", "")}-analysis.csv` , {root : __dirname});
});

// START THE SERVER
if (process.env.NODE_ENV === "development"){
	app.listen(3000, () => {
		console.log("Listening to local port 3000!");
	});
} else { 
	//Listen to heroku's default port
	app.listen(process.env.PORT, () => {
		console.log("Listening to whatever the client set");
	});
}