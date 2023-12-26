# webSocket

**Angular - Websocket - DF data**

This project consistes of both a backend and front End for a small DF example. The backend is a nodejs/express
mongo interface that is used for digitial factory. You must have a connection and some data in a Mongo repository.
You can do this one of two ways.
1) Set up the "env" string for Prod or Dev Digital Factory
2) Install MongoDB with Mongoose, then import some data (this is how I tested)

**To Run this project**

1) Run npm install in the main websocket directory
2) Run npm install in the app_public/src/app/ directory - for the Angular project
3) Start the backend from the websocket direcory with "npm start" (this is a script in the package json file)
4) Start the FE in the app_public/src/app/ direcory with "npm start" - this is also a script in the package json 
5) Go to the webpage localhost:4200 to see the user interface
6) Select on the various links to see tag data .. you may have to update the search bar be remvoing a character
7) You can view the terminal from code to see websocket data, and/or the webpage with the "F12" key

