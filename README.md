# hapchatmain

1) Install node modules using 'npm install' in the project directory
2) The channel that we have created in Agora console needs a token that will be re-generated for every 24 hours for our project. The channel name and appid remains the same as in the code
3) First make a simple http server with the command with whatever port we want the code to be run on(here used 8080) - python3 -m http.server 8080
4) Then run 'ngrok http 8080' in another terminal to get a public link generated for the app. (The generated link can be used to join by any participant)
5) To become the host , one has to enter 'host' along with the name (Example - sindhuhost, pranhost etc)
