function createObjectParametersFromExcel(jsonObject){
	return new Promise ((resolve, reject) => {

		let obj = {};
		//Check if it has empty spreadsheet titles, or app-generated titles
		obj.title = jsonObject["Song Title"] || jsonObject.title;
		obj.artist = jsonObject["Artist"] || jsonObject.artist;
		obj['Artist Update'] = jsonObject['Artist Update'] || null;
		obj.composer = jsonObject["Composer"] || jsonObject.composer;
		obj.lyricist= jsonObject["Lyricist"] || jsonObject.lyricist;
		obj.year = jsonObject["Year"] || jsonObject.year;
		obj.genre = jsonObject["Genre"] || jsonObject.genre;
		
		// IF there is a previosly found ID, keep it instead of searching all over again
		if (jsonObject.id && jsonObject.id !== "" && jsonObject.id !== "NOT FOUND"){
			obj.id = jsonObject.id
		} 
		resolve(obj);
		//Error check
		if (!jsonObject){
			reject("createObjectParametersFromExcel received non-object as argument");
		}
	});
};

module.exports = createObjectParametersFromExcel;