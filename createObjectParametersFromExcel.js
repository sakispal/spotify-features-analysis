function createObjectParametersFromExcel(jsonObject){
	return new Promise ((resolve, reject) => {

		let obj = {};
		//Check if it has empty spreadsheet titles, or app-generated titles
		if (jsonObject["Song Title"]){
			obj.title = jsonObject["Song Title"];
			obj.composer = jsonObject["Composer"];
			obj.lyricist= jsonObject["Lyricist"];
			obj.artist = jsonObject["Artist"];
			obj.year = jsonObject["Year"];
			obj.genre = jsonObject["Genre"];
		} else {
			obj.title = jsonObject.title
			obj.composer = jsonObject.composer;
			obj.lyricist= jsonObject.lyricist;
			obj.artist = jsonObject.artist;
			obj.year = jsonObject.year;
			obj.genre = jsonObject.genre;
		}
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