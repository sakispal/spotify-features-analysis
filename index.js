const fs = require ("fs");
const csv=require('csvtojson');
var SpotifyWebApi = require('spotify-web-api-node');
const Json2csvParser = require('json2csv').Parser;
require('dotenv').config();

// Require separate functions
const convertJSONtoCSV = require("./convertToCSV");
const createObjectParametersFromExcel = require("./createObjectParametersFromExcel");

//EDIT Rename the filename accordingly to read, AND write a new file
const fileName = "sheet2";

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.clientId,
  clientSecret : process.env.clientSecret
});


async function readQueryAndWrite(){
    //Read local .csv file && convert to JSON object
	let jsonObject = await readFromFile(fileName);
	// Give enough time to the Spotify access token to be created
	let token = await getToken();
	// Get IDs or Names from the object, search Spotify and return the desired results
	let finalObj = await createFinalList(jsonObject);
	//Write the audio features object to a local file 
	fs.writeFileSync(`./${fileName}-features.json`, JSON.stringify(finalObj.features, undefined, 4));
	//Write the sections object & id to a local file
	fs.writeFileSync(`./${fileName}-analysis.json`, JSON.stringify(finalObj.analysis, undefined, 4));
	//Convert the audio features object to .csv	
	convertJSONtoCSV(fileName, "features", false);
	// //Convert the id & sections object to .csv
	convertJSONtoCSV(fileName, "analysis", true);
};

// readQueryAndWrite();

function readFromFile(name){
	const csvFilePath=`./${name}.csv`;
	return new Promise((resolve, reject) => {
		csv()
		.fromFile(csvFilePath)
		.then((res) => {
			// console.log(`Read ${JSON.stringify(jsonObj, undefined, 4)}`);
			fs.writeFileSync(`${name}.json`, JSON.stringify(res, undefined, 4));
			resolve(res);
		})
		.catch((err) =>{
			reject("Error reading file" + err);
		});
	});
};

// Retrieve an access token, just once at the beginning. For really big queries, we might have to insert a .refreshToken somewhere.
function getToken(){
	return new Promise ((resolve, reject) => {
		spotifyApi.clientCredentialsGrant()
		.then((data) => {
			console.log('The access token expires in ' + data.body['expires_in']);
			console.log('The access token type is ' + data.body['token_type']);
			// console.log('The access token is ' + data.body['access_token']);
			// Save the access token so that it's used in future calls
			resolve(spotifyApi.setAccessToken(data.body['access_token']));
		})
		.catch((err) => {
			reject('Something went wrong when retrieving an access token ', err);
		});
	});
};

getToken();
debugger;

function createFinalList(jsonObject){
	return new Promise (async (resolve, reject) => {
		let finalFeatures = [];
		let finalAnalysis = [];
		let notFound = 0;
		let found = 0;
		//Loop through the JSON object
		for (let i = 0; i < jsonObject.length; i++){
			//Extract track name or ID's from the object
			let params = await createObjectParametersFromExcel(jsonObject[i]);
			//If track ID is not defined, search for track ID
			if (!params.id){
				var id = await searchTracks(params);
				//Save the track id to the object;
				params.id = id;
			}
			//Else, search based on the provided id from the params object
			else {
				var id = params.id;
			}		

			//If the spotify API returns good number, keep fetching data, but if"NOT FOUND", log it in
			if (id !== "NOT FOUND") {
				//New search for audio features - Occasionally the API decides to throw a ranodm error, hence the try catch block
				try {
					var features = await getAudioFeatures(id);
					var analysisSections = await getAudioAnalysis(id);	
				} catch (e){
					console.log(`Features couldn't be updated due to error ${e}`);
				}
				//Save ID & audio features inside the track object
			  	let featuresObject = await updateFeatures(features, params);
			  	let analysisObject = await updateFeatures(analysisSections, {id : params.id});

				finalFeatures.push(featuresObject);
				finalAnalysis.push(analysisObject);
				console.log(`Progress -- Logged song number ${found}`);
				found++;

			} else {
				params.id = "NOT FOUND";
				//Count the NOT FOUND logs
				notFound++;
				finalFeatures.push(params);
			}	
		}
		console.log(`Couldn't find ${notFound} songs`);
		resolve({
			features : finalFeatures,
			analysis : finalAnalysis
		});
	});
};


function searchTracks(params, specification){
	return new Promise((resolve,reject) => {

		const specification = {
			trackOnly : `track:${params.title}`,
			artistAndTrack : `track:${params.title} artist:${params.artist}`
		};

		let spotifyOptions = {
			//Necessary to pull back track IDs only	
			type : "track",
			limit : 1,
			//This searches in externally hosted content and maximizes the chances of a song being found
			include_external : "audio"
		};
		
	    spotifyApi.searchTracks(specification.artistAndTrack, spotifyOptions)
	    .then((res) => {
	    	// console.log("Pulled " + JSON.stringify(res.body, undefined , 4));
	    	//If no results, search again with track only!!!!!!!!
	    	if (res.statusCode === 200){
				if (res.body.tracks.total === 0){
					//New search
					spotifyApi.searchTracks(specification.trackOnly, spotifyOptions)
					.then((res) =>{
						// console.log("Second spotify search pulled " + JSON.stringify(res.body, undefined , 4));
						if ((res.body.tracks.total === 0)) {
							resolve("NOT FOUND");
						} else {
							resolve(res.body.tracks.items[0].id);
						}	
					})
					.catch((err) => {
						reject("Second spotify search failed " + err);
					});
				} else {
					//Return the track ID
					resolve(res.body.tracks.items[0].id);
				}
			} else {
				reject("searchTracks returned error response code " + res.statusCode + "Containing the error object " + JSON.stringify(res.body, undefined, 4));
			} 
	    })
	    .catch((err) => {
	    	reject("Search tracks function has returned error " + err);
	    });
	});
};

function getAudioFeatures(id){
	return new Promise((resolve,reject) => {
		spotifyApi.getAudioFeaturesForTrack(id)
		.then((res) => {
			if (res.statusCode === 200){
				// console.log(`Returned features ${JSON.stringify(res.body, undefined , 4)}`);
				resolve(res.body);	
			} else {
				reject("getAudioFeatures returned error response code " + res.statusCode + "Containing the error object " + JSON.stringify(res.body, undefined, 4));
			} 
		})
	    .catch((err) => {
	    	reject("Get features function has returned error " + err);
	    });
	});
};

function getAudioAnalysis(id){
	return new Promise((resolve,reject) => {
		spotifyApi.getAudioAnalysisForTrack(id)
		.then((res) => {
			if (res.statusCode === 200){
				// console.log(`Returned analysis ${JSON.stringify(res.body.sections, undefined , 4)}`);
				resolve(res.body);	
			} else {
				reject("getAudioAnalysis returned error response code " + res.statusCode + "Containing the error object " + JSON.stringify(res.body, undefined, 4));
			} 
		})
	    .catch((err) => {
	    	reject("getAudioAnalysis function has returned error " + err);
	    });
	});
};

function updateFeatures(features, params){
	return new Promise((resolve,reject) => {
		if (features.sections){
			params.sections = features.sections;
		} else {
			Object.keys(features).forEach((key) =>{
				params[key] = features[key];	
			});
		}	
		if (!features || !params){
			reject("Update features function has returned error " + err);
		}
		resolve(params);	    
	});
};


module.exports = readQueryAndWrite;