#TuneCast 
****The utimate playlist for when the weather has you "*...feeling some type of way*".****

### Description
Despite the freedom that streaming platforms like Spotify provide with their ***create a playlist*** option, it can often be difficult to find music that you enjoy listening to on a daily basis. Additionally, it is apparent that weather phenoma often has a great impact on the daily behaviors and moods in our lives; a sudden thunderstorm can sour the mood of a businessman leaving lunch in a full suit. These seemingly unrelated subjects find tangential ground with **TuneCast**, a browser application that connects to Spotify in order to curate a playlist of songs that you most commonly frequent with the attributes of the weather.

***What exactly does this mean?***

Has the sudden arrival of radiant sunshine ever given you a boost in energy? What about a clear summer night and the prospect of dancing the night away with friends? These associative feelings we hold towards the weather can act as stimulant for the expression of emotions. Coupled with the inherently expressive nature of music listening and consumption, Tunecast represents the intersection of what we are feeling and hearing in our daily lives.

**TuneCast is a personalized listening experience unlike any other.**

###Architecture

-**Javascript/node.js**
-**HTML/CSS**
-**REST-based DarkSky and Spotify APIs**
-**Authentication layers provided via Spotify for Developers**

###Dependencies

-**node.js**
-**node_modules**
-**node_fetch**
-**SpotifyAPI**
-**DarkSky API**

###Instructions
1). Ensure that your machine has  `node.js` frameworks installed.
2). In order for this application to process REST-based requests, ensure that a `node_modules` directory exists within the `authorization_code` directory in the project repository.
3). After changing into the `authorization_code` directory, run the command 
`node app.js`
4). Open up a browser and type `localhost:8888` into the address bar - this should direct you to the pre-authentication page.
5). Upon successful authentication, you will be directed to a page where you can generate a playlist.
6). This playlist will now appear in your Spotify account and clicking on any song will redirect you to the Spotify web browser.
