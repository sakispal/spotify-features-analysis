const json2xls = require('json2xls');
const fs = require ('fs');


// const fileName = 'final-analysis'

function convertJSONtoXls(fileName, argument){
	const json = JSON.parse(fs.readFileSync(`${fileName}-${argument}.json`, 'utf-8'));
	const xls = json2xls(json);
	fs.writeFileSync(`${fileName}-${argument}.xlsx`, xls, 'binary');
}

// convertJSONtoXls(fileName);

module.exports = convertJSONtoXls;