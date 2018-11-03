# To Do

# Comments

# How to run the script for a new spreadsheet
## - First, generate your own Spotify developer credentials
	* - Go to https://developer.spotify.com/dashboard/login and login with your account
	* - Register a new application, and get clientId and client secret
	* - Open the file 'index.js' with any text editor, in 
		```
		var spotifyApi = new SpotifyWebApi({
  		clientId : process.env.clientId,
  		clientSecret : process.env.clientSecret
		});
		```
		replace the 'process.env.clientId' with your clientId and 'process.env.clientSecret' with your client secret
	* - Keep these credentials secret!!
## - Prepare the .csv file
	* - Download the spreadsheet from Google Sheets as .csv and make sure it is in the same directory as the index.js
	* - Make sure that the song column is titled "Song Title" and the artist column is titled "Artist"
## - Select the filename in the script
	* - Open the file 'index.js' with any text editor and locate the line
	>'const fileName = "sheet2";'
	Replace "sheet2" with the name of the file you want to run, i.e. if the file is test.csv, do 
	>'const fileName = "test";'
## - Run the file
	* - In the console, type "npm start", hit enter, and enjoy. For large files it can take quite a while.	
