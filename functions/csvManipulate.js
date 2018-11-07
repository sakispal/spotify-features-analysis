const fs = require('fs');
const csv = require('csvtojson');
const convertJSONtoCSV = require ('./convertToCSV');

//Manipulate the CSV
// const fileName = 'sheet2-features'

function readFromFile(name){
	const csvFilePath=`./${name}.csv`;
	return new Promise((resolve, reject) => {
		csv()
		.fromFile(csvFilePath)
		.then((res) => {
			// console.log(`Read ${JSON.stringify(jsonObj, undefined, 4)}`);
			// fs.writeFileSync(`${name}.json`, JSON.stringify(res, undefined, 4));
			resolve(res);
		})
		.catch((err) =>{
			reject("Error reading file" + err);
		});
	});
};

//Loop throught the json
async function manipulate(fileName){
	const json = await readFromFile(fileName);
	let notfoundObj = [];
	let toRunAgainObj = [];
	let toRecheckObj = [];
	//Keep all the artist & track fields in file 1
	for (let i = 0; i < json.length; i++){
		let newObj = {
			title : json[i].title,
			composer : json[i].composer,
			lyricist : json[i].lyricist,
			artist : json[i].artist,
			'Artist Update' : json[i]['Artist'],
			year : json[i].year,
			genre : json[i].genre,
			id : json[i].id

		};
		//Check if the ID is not found, if yes -> save them in separate file 2
		if (newObj.id === "Not Found"){
			notfoundObj.push(newObj);
		} else if (newObj.id !== "Not Found" ){
			//Take out the fields where results have been pulled, and save them in a high quality file
			toRunAgainObj.push(newObj);
		};	
	};

	fs.writeFileSync (`./${fileName}-dontExist.json`, JSON.stringify(notfoundObj, undefined, 4));
	fs.writeFileSync (`./${fileName}-toRunAgain.json`, JSON.stringify(toRunAgainObj, undefined, 4));
	// fs.writeFileSync (`./${fileName}-toExperiment.json`, JSON.stringify(toExperimentObj, undefined, 4));	
};

async function manipulatePopulated(fileName){
	let json = await readFromFile(fileName);
	let notfoundObj = [];
	let highQualityObj = [];
	console.log(`Read ${JSON.stringify(json, undefined, 4)}`);
	//Keep all the artist & track fields in file 1
	for (let i = 0; i < json.length; i++){
		let newObj = {
		};
		for (key in json[i]){
			newObj[key] = json[i][key];
		}
		//Check if the ID is not found, if yes -> save them in separate file 2
		if (newObj.id === "NOT FOUND" ){
			notfoundObj.push(newObj);
		} else {
			highQualityObj.push(newObj);
		};		
	};

	fs.writeFileSync(`./${fileName}-notfound.json`, JSON.stringify(notfoundObj, undefined, 4));
	fs.writeFileSync(`./${fileName}-highQuality.json`, JSON.stringify(highQualityObj, undefined, 4));
};


// manipulate('sheet1-rectified');
// manipulatePopulated();
	
// convertJSONtoCSV('sheet1-rectified', 'dontExist', false);	
// convertJSONtoCSV('sheet1-rectified', 'toRunAgain', false);	

