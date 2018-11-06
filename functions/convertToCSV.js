const fs = require ("fs");
const csv = require('csvtojson');
const Json2csvParser = require('json2csv').Parser;
const transformAnalysis = require("./transform");

async function convertJSONtoCSV(fileName, argument, unwind){
	let myData = JSON.parse(fs.readFileSync(`${fileName}-${argument}.json`, "utf-8"));
	try {
	  	if (unwind){
	  		myData = await transformAnalysis(myData); 
	  		var parser = new Json2csvParser({
	  			unwindBlank : true
	  		});
		} else {
	  		var parser = new Json2csvParser({});
		}		
		const csv = parser.parse(myData);
	    fs.writeFileSync(`./${fileName}-${argument}.xls`, csv);
	} catch (err) {
	  console.error(err);
	}
};

// convertJSONtoCSV("sheet2", "features", false);
// convertJSONtoCSV("sheet2","analysis", true);

module.exports = convertJSONtoCSV;