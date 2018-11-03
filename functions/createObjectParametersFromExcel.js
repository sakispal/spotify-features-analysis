function createObjectParametersFromExcel(jsonObject){
	return new Promise ((resolve, reject) => {

		let obj = {};
		//Check if it has empty spreadsheet titles, or app-generated titles
		if (jsonObject["Song Title"]){
			obj.title = jsonObject["Song Title"];
			obj.artist = jsonObject["Artist"];
			if (jsonObject["Composer"]){
				obj.composer = jsonObject["Composer"];
				obj.lyricist= jsonObject["Lyricist"];
				obj.year = jsonObject["Year"];
				obj.genre = jsonObject["Genre"];
			}
		} else {
			obj.title = jsonObject.title;
			obj.artist = jsonObject.artist;
			//Check if the file has include composer which means that it has lyricist & year, etc.
			if (jsonObject.composer){
				obj.composer = jsonObject.composer;
				obj.lyricist= jsonObject.lyricist;
				obj.year = jsonObject.year;
				obj.genre = jsonObject.genre;
			}
		}
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