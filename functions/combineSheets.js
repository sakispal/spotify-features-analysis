const fs = require ("fs");
const csv = require('csvtojson');
const Json2csvParser = require('json2csv').Parser;

const file1 = 'sheet1-round1-dontExist.xls';
const file2 = 'sheet1-round2-dontExist.xls';

async function combineSheets(file1, file2, argument){
	//Read files and convert to JSON
	json1 = await read(file1);
	json2 = await read(file2);
	// console.log(JSON.stringify(json1, undefined, 4))
	//Push the object from one array to the other
	let count = 0;
	json2.forEach((obj) => {
		json1.push(obj)
		console.log(`pushing ${count}`);
		count++;
	});
	//Re-write one csv file
	var parser = new Json2csvParser({});
	const csv = parser.parse(json1);
	fs.writeFileSync(`final-${argument}.xls`, csv);
}

// combineSheets(file1, file2, "dontExist");

function read(file){
	return new Promise((resolve, reject) => {
		csv()
		.fromFile(file)
		.then((res) => {
			// console.log(`Read ${JSON.stringify(jsonObj, undefined, 4)}`);
			resolve(res);
		})
		.catch((err) =>{
			reject("Error reading file" + err);
		});
	});	
}

