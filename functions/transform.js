function transformAnalysis(object){
	return new Promise ((resolve, reject) => {
		if (!object){
			reject("transform can't be perfmored due to error");
		} else {
			var transformedObj = [
				{},
			];
			//Iterate throught the recived object with k to access individual songs
			for (k = 0; k < object.length; k++){
				//Iterate through the individual song sections
				for (i = 0; i < (object[k].sections.length); i++){
					transformedObj.push({
						id : object[k].id,
						"sections-start" : object[k].sections[i].start,
						"sections-duration" : object[k].sections[i].duration,
						"sections-confidence" : object[k].sections[i].confidence,
						"sections-loudness" : object[k].sections[i].loudness,
						"sections-tempo" : object[k].sections[i].tempo,
						"sections-tempo_confidence" : object[k].sections[i].tempo_confidence,
						"sections-key" : object[k].sections[i].key,
						"sections-key_confidence" : object[k].sections[i].key_confidence,
						"sections-mode" : object[k].sections[i].mode,
						"sections-mode_confidence" : object[k].sections[i].mode_confidence,
						"sections-time_signature" : object[k].sections[i].time_signature,
						"sections-time_signature_confidence" : object[k].sections[i].time_signature_confidence
					});		
				};	
			}
			resolve(transformedObj);
		} 
	});
};

module.exports = transformAnalysis;