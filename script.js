// python3 -m http.server 8080     - to serve on the port 8080 of localhost - accessible at http://localhost:8080/
// To create public link - ngrok http 8080 - USE THE GENERATED LINK
// sudo nano /home/bobby/snap/ngrok/226/.config/ngrok/ngrok.yml

/*
The command python3 -m http.server 8080 is used to start a simple HTTP server using Python. Here's what each part of the command does:

python3: This specifies that Python version 3 should be used to run the command.
-m: This flag tells Python to run a module as a script.
http.server: This is the Python module that sets up a basic HTTP server.
8080: This specifies the port number on which the server will run (8080 in this case). If no port is specified, the default is 8000.
What Happens When You Run This?
Starts a Web Server:

It creates a web server in the directory where the command is executed.
The server will serve the files in that directory and its subdirectories over HTTP.
Access Files Through a Browser:

You can view the files by opening a web browser and navigating to http://localhost:8080 (or http://127.0.0.1:8080).
Purpose:

Useful for testing or hosting static files (e.g., HTML, CSS, JS) locally.
No special setup or installation of web server software is required.
Example: If you run this command in a directory containing index.html:

Accessing http://localhost:8080 in your browser will display the index.html file.
Other files (e.g., script.js or images) will also be accessible from the browser.
It’s a convenient tool for quick testing or debugging of web projects.
*/

/*
Running ngrok http 8080 creates a secure, public URL that tunnels traffic from the internet to your local machine’s HTTP server running on port 8080. Here's what happens:

Step-by-Step Explanation:
Command Breakdown:

ngrok: The command-line tool that creates secure tunnels to your localhost.
http: Specifies the protocol (HTTP) to tunnel traffic for.
8080: The local port where your HTTP server is running.
What ngrok Does:

ngrok starts a tunnel that forwards traffic from an external, public URL to your localhost server running on port 8080.
It provides a randomly generated public URL, such as https://abcd1234.ngrok.io.
Access Your Server Publicly:

The public URL can be shared with others, and they can access your local server over the internet.
For example, if your server is hosting index.html, anyone with the ngrok URL can view it.
Why Use ngrok?:

To test how your application behaves with real external traffic.
Share your localhost project with others for demo purposes, without deploying to a public hosting service.
Security Features:

ngrok uses HTTPS, so the connection to your localhost is secure.
It also logs requests and provides a dashboard (accessible locally at http://127.0.0.1:4040) to monitor traffic and debug issues.
When Does it Stop?:

The tunnel will stop if you close the terminal where ngrok is running.
Public URLs are temporary and will change every time you restart ngrok unless you're using a paid plan with a custom subdomain.
Example Workflow:
Start your HTTP server: python3 -m http.server 8080.
Start ngrok: ngrok http 8080.
Copy the public URL provided by ngrok, e.g., https://abcd1234.ngrok.io.
Share the URL or use it for testing external integrations like webhooks or APIs.
This makes ngrok an incredibly powerful tool for testing and sharing locally-hosted applications.
*/


/*

//#1
let client = AgoraRTC.createClient({mode:'rtc', codec:"vp8"})

//#2
let config = {
    appid:'155aadd29b0b4ef7add28dc890b8adb2',
    token:'007eJxTYKhWe1nV6V71weDeIXnlORpS/fO2BPYwfIi6/OTlDm773w8VGAxNTRMTU1KMLJMMkkxS08xBbIuUZAtLgySLxJQko2naNukNgYwMef9sGRihEMRnZSgoSswrZmAAANTdIXs=',
    uid:null,
    channel:'prans',
}

//#3 - Setting tracks for when user joins
let localTracks = {
    audioTrack:null,
    videoTrack:null
}

//#4 - Want to hold state for users audio and video so user can mute and hide
let localTrackState = {
    audioTrackMuted:false,
    videoTrackMuted:false
}

//#5 - Set remote tracks to store other users
let remoteTracks = {}


document.getElementById('join-btn').addEventListener('click', async () => {
    config.uid = document.getElementById('username').value
    await joinStreams()
    document.getElementById('join-wrapper').style.display = 'none'
    document.getElementById('footer').style.display = 'flex'
})

document.getElementById('mic-btn').addEventListener('click', async () => {
    //Check if what the state of muted currently is
    //Disable button
    if(!localTrackState.audioTrackMuted){
        //Mute your audio
        await localTracks.audioTrack.setMuted(true);
        localTrackState.audioTrackMuted = true
        document.getElementById('mic-btn').style.backgroundColor ='rgb(255, 80, 80, 0.7)'
    }else{
        await localTracks.audioTrack.setMuted(false)
        localTrackState.audioTrackMuted = false
        document.getElementById('mic-btn').style.backgroundColor ='#1f1f1f8e'

    }

})



document.getElementById('camera-btn').addEventListener('click', async () => {
    //Check if what the state of muted currently is
    //Disable button
    if(!localTrackState.videoTrackMuted){
        //Mute your audio
        await localTracks.videoTrack.setMuted(true);
        localTrackState.videoTrackMuted = true
        document.getElementById('camera-btn').style.backgroundColor ='rgb(255, 80, 80, 0.7)'
    }else{
        await localTracks.videoTrack.setMuted(false)
        localTrackState.videoTrackMuted = false
        document.getElementById('camera-btn').style.backgroundColor ='#1f1f1f8e'

    }

})



document.getElementById('leave-btn').addEventListener('click', async () => {
    //Loop threw local tracks and stop them so unpublish event gets triggered, then set to undefined
    //Hide footer
    for (trackName in localTracks){
        let track = localTracks[trackName]
        if(track){
            track.stop()
            track.close()
            localTracks[trackName] = null
        }
    }

    //Leave the channel
    await client.leave()
    document.getElementById('footer').style.display = 'none'
    document.getElementById('user-streams').innerHTML = ''
    document.getElementById('join-wrapper').style.display = 'block'

})





//Method will take all my info and set user stream in frame
let joinStreams = async () => {
    //Is this place hear strategicly or can I add to end of method?
    
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);


    client.enableAudioVolumeIndicator(); // Triggers the "volume-indicator" callback event every two seconds.
    client.on("volume-indicator", function(evt){
        for (let i = 0; evt.length > i; i++){
            let speaker = evt[i].uid
            let volume = evt[i].level
            if(volume > 0){
                document.getElementById(`volume-${speaker}`).src = './assets/volume-on.svg'
            }else{
                document.getElementById(`volume-${speaker}`).src = './assets/volume-off.svg'
            }
            
        
            
        }
    });

    //#6 - Set and get back tracks for local user
    [config.uid, localTracks.audioTrack, localTracks.videoTrack] = await  Promise.all([
        client.join(config.appid, config.channel, config.token ||null, config.uid ||null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()

    ])
    
    //#7 - Create player and add it to player list
    let player = `<div class="video-containers" id="video-wrapper-${config.uid}">
                        <p class="user-uid"><img class="volume-icon" id="volume-${config.uid}" src="./assets/volume-on.svg" /> ${config.uid}</p>
                        <div class="video-player player" id="stream-${config.uid}"></div>
                  </div>`

    document.getElementById('user-streams').insertAdjacentHTML('beforeend', player);
    //#8 - Player user stream in div
    localTracks.videoTrack.play(`stream-${config.uid}`)
    

    //#9 Add user to user list of names/ids

    //#10 - Publish my local video tracks to entire channel so everyone can see it
    await client.publish([localTracks.audioTrack, localTracks.videoTrack])

}


let handleUserJoined = async (user, mediaType) => {
    console.log('Handle user joined')

    //#11 - Add user to list of remote users
    remoteTracks[user.uid] = user

    //#12 Subscribe ro remote users
    await client.subscribe(user, mediaType)
   
    
    if (mediaType === 'video'){
        let player = document.getElementById(`video-wrapper-${user.uid}`)
        console.log('player:', player)
        if (player != null){
            player.remove()
        }
 
        player = `<div class="video-containers" id="video-wrapper-${user.uid}">
                        <p class="user-uid"><img class="volume-icon" id="volume-${user.uid}" src="./assets/volume-on.svg" /> ${user.uid}</p>
                        <div  class="video-player player" id="stream-${user.uid}"></div>
                      </div>`
        document.getElementById('user-streams').insertAdjacentHTML('beforeend', player);
        user.videoTrack.play(`stream-${user.uid}`)


        

          
    }
    

    if (mediaType === 'audio') {
        user.audioTrack.play();
      }
}




let handleUserLeft = (user) => {
    console.log('Handle user left!')
    //Remove from remote users and remove users video wrapper
    delete remoteTracks[user.uid]
    document.getElementById(`video-wrapper-${user.uid}`).remove()
}
*/

/*HOST SHOULD BE HANDLED HERE (BUT ONLY JOIN STREAMS IS THERE)*/

// HOST IS FIXED - BUT SHOULD ENTER LIKE SINDHUHOST ETC
// BAROMETER GRAPH IS ALSO ADDED
/*
let client = AgoraRTC.createClient({mode:'rtc', codec:"vp8"})

let config = {
    appid: '155aadd29b0b4ef7add28dc890b8adb2',
    token: '007eJxTYJjDtb5gdu6L6UtXGqVGBzf9fqb2ObGs+2b8VecMVvWPGtUKDIampomJKSlGlkkGSSapaeYgtkVKsoWlQZJFYkqS0ZJAh/SGQEaGC0c/sDIyQCCIz8pQUJSYV8zAAADg9yIV',
    uid: null,
    channel: 'prans',
};

let localTracks = {
    audioTrack: null,
    videoTrack: null,
};

let localTrackState = {
    audioTrackMuted: false,
    videoTrackMuted: false,
};

let remoteTracks = {};

let hostUid = null; // To track the host
let hostName = ""; // To store the host's display name

let moodBarometerChart = null; // Chart instance
let moodBarometerActive = false; // Flag to track if the barometer is active
let remoteEmotionData = {}; // Store emotion counts for remote participants


document.getElementById('join-btn').addEventListener('click', async () => {
    config.uid = document.getElementById('username').value;
    await joinStreams();
    document.getElementById('join-wrapper').style.display = 'none';
    document.getElementById('footer').style.display = 'flex';
});

document.getElementById('mic-btn').addEventListener('click', async () => {
    if (!localTrackState.audioTrackMuted) {
        await localTracks.audioTrack.setMuted(true);
        localTrackState.audioTrackMuted = true;
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)';
    } else {
        await localTracks.audioTrack.setMuted(false);
        localTrackState.audioTrackMuted = false;
        document.getElementById('mic-btn').style.backgroundColor = '#1f1f1f8e';
    }
});

document.getElementById('camera-btn').addEventListener('click', async () => {
    if (!localTrackState.videoTrackMuted) {
        await localTracks.videoTrack.setMuted(true);
        localTrackState.videoTrackMuted = true;
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)';
    } else {
        await localTracks.videoTrack.setMuted(false);
        localTrackState.videoTrackMuted = false;
        document.getElementById('camera-btn').style.backgroundColor = '#1f1f1f8e';
    }
});

document.getElementById('leave-btn').addEventListener('click', async () => {
    for (let trackName in localTracks) {
        let track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            localTracks[trackName] = null;
        }
    }

    await client.leave();
    document.getElementById('footer').style.display = 'none';
    document.getElementById('user-streams').innerHTML = '';
    document.getElementById('join-wrapper').style.display = 'block';
});


let logTracks = () => {
    console.log("Local Tracks:", localTracks);
    console.log("Remote Tracks:", remoteTracks);
};


let joinStreams = async () => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    [config.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
        client.join(config.appid, config.channel, config.token || null, config.uid || null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
    ]);

    // Check if "host" is included in config.uid (case-insensitive)
    let isHost = config.uid.toLowerCase().includes("host");

    let player = `<div class="video-containers" id="video-wrapper-${config.uid}">
                  <div class="video-overlay">
                      <p class="user-feedback" id="feedback-${config.uid}">Detecting feedback...</p>
                      <p class="user-uid" id="username-${config.uid}">
                          ${config.uid} ${isHost ? `<span class="host-tag">Host</span>` : ""}
                      </p>
                  </div>
                  <video class="video-player player" id="stream-${config.uid}" autoplay></video>
              </div>`;

    document.getElementById('user-streams').insertAdjacentHTML('beforeend', player);

    localTracks.videoTrack.play(`stream-${config.uid}`);
    await client.publish([localTracks.audioTrack, localTracks.videoTrack]);
    
    if (isHost) {
        document.getElementById("mood-barometer-wrapper").style.display = "flex";
    }

    startEmotionRecognition();
    
    updateHostDisplay();
    logTracks();
};

let initializeMoodBarometerChart = () => {
    if (moodBarometerChart) {
        console.log('Mood Barometer Chart is already initialized.');
        return;
    }
    
    const ctx = document.getElementById('mood-barometer-chart').getContext('2d');
    moodBarometerChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral', 'Disgusted', 'Fearful'],
            datasets: [
                {
                    label: 'Emotion Counts',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)', // Light Red
                        'rgba(54, 162, 235, 0.7)', // Light Blue
                        'rgba(255, 206, 86, 0.7)', // Yellow
                        'rgba(75, 192, 192, 0.7)', // Teal
                        'rgba(153, 102, 255, 0.7)', // Lavender
                        'rgba(255, 159, 64, 0.7)', // Orange
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)', 
                        'rgba(54, 162, 235, 1)', 
                        'rgba(255, 206, 86, 1)', 
                        'rgba(75, 192, 192, 1)', 
                        'rgba(153, 102, 255, 1)', 
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
    
    console.log('Mood Barometer Chart initialized:', moodBarometerChart);
};

// Start tracking remote emotions
let startRemoteEmotionTracking = async () => {
    moodBarometerActive = true;
    document.getElementById('mood-barometer-chart').style.display = 'block';

    // Initialize emotion detection models
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models');

    // Set up periodic detection
    const emotionFeedbackMap = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'disgusted', 'fearful'];

    const updateChart = () => {
        if (!moodBarometerChart) {
	    console.error('Mood Barometer Chart is not initialized.');
	    return;
        }

        const counts = emotionFeedbackMap.map((emotion) => remoteEmotionData[emotion] || 0);
        moodBarometerChart.data.datasets[0].data = counts;
        moodBarometerChart.update();
     };


    const intervalId = setInterval(async () => {
        if (!moodBarometerActive) {
            clearInterval(intervalId);
            return;
        }

        // Reset emotion data for aggregation
        remoteEmotionData = emotionFeedbackMap.reduce((acc, emotion) => ({ ...acc, [emotion]: 0 }), {});

        for (let uid in remoteTracks) {
            const videoElementId = `stream-${uid}`;
            const videoElement = document.getElementById(videoElementId);

            if (videoElement) {
                try {
                    const detections = await faceapi
                        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
                        .withFaceExpressions();

                    if (detections) {
                        const emotions = detections.expressions;
                        const maxEmotion = Object.keys(emotions).reduce((a, b) =>
                            emotions[a] > emotions[b] ? a : b
                        );

                        remoteEmotionData[maxEmotion] = (remoteEmotionData[maxEmotion] || 0) + 1;
                    }
                } catch (error) {
                    console.error(`Error detecting emotions for user ${uid}:`, error);
                }
            }
        }

        updateChart();
    }, 1000);
};

document.getElementById('mood-barometer-btn').addEventListener('click', () => {
    if (!moodBarometerActive) {
        if (!moodBarometerChart) {
            initializeMoodBarometerChart(); // Ensure chart is initialized
        }
        startRemoteEmotionTracking();
    } else {
        moodBarometerActive = false;
        document.getElementById('mood-barometer-chart').style.display = 'none';
    }
});


let handleUserJoined = async (user, mediaType) => {
    remoteTracks[user.uid] = user;

    await client.subscribe(user, mediaType);

    let isHost = user.uid.toLowerCase().includes('host') ? "Host" : "";

    if (mediaType === 'video') {
        let isHost = user.uid === hostUid ? "Host" : "";
        let player = `<div class="video-containers" id="video-wrapper-${user.uid}">
                          <div class="video-overlay">
                              <p class="user-uid" id="emotion-${user.uid}">
                                  ${user.uid} <span class="host-tag">${isHost}</span>
                              </p>
                          </div>
                          <video class="video-player player" id="stream-${user.uid}"></video>
                      </div>`;
        document.getElementById('user-streams').insertAdjacentHTML('beforeend', player);
        user.videoTrack.play(`stream-${user.uid}`);
    }

    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
    
    updateHostDisplay();
    logTracks();
};

let updateHostDisplay = () => {
    Object.keys(remoteTracks).forEach(uid => {
        const userElement = document.getElementById(`emotion-${uid}`);
        if (userElement) {
            // Check if the user's uid contains "host"
            const isHost = uid.toLowerCase().includes('host') ? "Host" : "";
            const hostTag = userElement.querySelector('.host-tag');
            if (hostTag) {
                hostTag.innerText = isHost; // Update the host tag
            }
        }
    });
};



let startEmotionRecognition = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models');

    const videoElement = document.getElementById(`stream-${config.uid}`);

    const emotionFeedbackMap = {
        happy: "You are engaged - keep going!",
        sad: "You are looking dull.",
        angry: "Try to stay calm.",
        surprised: "You look surprised!",
        neutral: "You look composed.",
        disgusted: "Is something bothering you?",
        fearful: "Don't worry, stay confident!"
    };

    setInterval(async () => {
        try {
            const detections = await faceapi
                .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (detections) {
                const emotions = detections.expressions;
                const maxEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);

                // Retrieve feedback for the detected emotion
                const feedback = emotionFeedbackMap[maxEmotion] || "Detecting...";

                // Update the feedback display
                document.getElementById(`feedback-${config.uid}`).innerText = feedback;
            }
        } catch (error) {
            console.error("Error detecting emotion:", error);
        }
    }, 1000);
};



let handleUserLeft = (user) => {
    delete remoteTracks[user.uid];
    document.getElementById(`video-wrapper-${user.uid}`).remove();
    
    updateHostDisplay();
    logTracks();

};
*/

// AVATARS ADDED
/*
let client = AgoraRTC.createClient({mode:'rtc', codec:"vp8"})

let config = {
    appid: '155aadd29b0b4ef7add28dc890b8adb2',
    token: '007eJxTYJjDtb5gdu6L6UtXGqVGBzf9fqb2ObGs+2b8VecMVvWPGtUKDIampomJKSlGlkkGSSapaeYgtkVKsoWlQZJFYkqS0ZJAh/SGQEaGC0c/sDIyQCCIz8pQUJSYV8zAAADg9yIV',
    uid: null,
    channel: 'prans',
};

let localTracks = {
    audioTrack: null,
    videoTrack: null,
};

let localTrackState = {
    audioTrackMuted: false,
    videoTrackMuted: false,
};

let remoteTracks = {};

let hostUid = null; // To track the host
let hostName = ""; // To store the host's display name

let moodBarometerChart = null; // Chart instance
let moodBarometerActive = false; // Flag to track if the barometer is active
let remoteEmotionData = {}; // Store emotion counts for remote participants


document.getElementById('join-btn').addEventListener('click', async () => {
    config.uid = document.getElementById('username').value;
    await joinStreams();
    document.getElementById('join-wrapper').style.display = 'none';
    document.getElementById('footer').style.display = 'flex';
});

document.getElementById('mic-btn').addEventListener('click', async () => {
    if (!localTrackState.audioTrackMuted) {
        await localTracks.audioTrack.setMuted(true);
        localTrackState.audioTrackMuted = true;
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)';
    } else {
        await localTracks.audioTrack.setMuted(false);
        localTrackState.audioTrackMuted = false;
        document.getElementById('mic-btn').style.backgroundColor = '#1f1f1f8e';
    }
});

document.getElementById('camera-btn').addEventListener('click', async () => {
    if (!localTrackState.videoTrackMuted) {
        await localTracks.videoTrack.setMuted(true);
        localTrackState.videoTrackMuted = true;
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)';
    } else {
        await localTracks.videoTrack.setMuted(false);
        localTrackState.videoTrackMuted = false;
        document.getElementById('camera-btn').style.backgroundColor = '#1f1f1f8e';
    }
});

document.getElementById('leave-btn').addEventListener('click', async () => {
    for (let trackName in localTracks) {
        let track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            localTracks[trackName] = null;
        }
    }

    await client.leave();
    document.getElementById('footer').style.display = 'none';
    document.getElementById('user-streams').innerHTML = '';
    document.getElementById('join-wrapper').style.display = 'block';
});


let logTracks = () => {
    console.log("Local Tracks:", localTracks);
    console.log("Remote Tracks:", remoteTracks);
};


let joinStreams = async () => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    [config.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
        client.join(config.appid, config.channel, config.token || null, config.uid || null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
    ]);

    // Check if "host" is included in config.uid (case-insensitive)
    let isHost = config.uid.toLowerCase().includes("host");

    let player = `<div class="video-containers" id="video-wrapper-${config.uid}">
                  <div class="video-overlay">
		    <p class="user-feedback" id="feedback-${config.uid}">Detecting feedback...</p>
		    <p class="user-uid" id="username-${config.uid}">
			${config.uid} ${isHost ? `<span class="host-tag">Host</span>` : ""}
		    </p>
		    <img id="emotion-avatar-${config.uid}" class="emotion-avatar" src="./avatars/neutral.png">
		</div>

                  <video class="video-player player" id="stream-${config.uid}" autoplay></video>
              </div>`;

    document.getElementById('user-streams').insertAdjacentHTML('beforeend', player);

    localTracks.videoTrack.play(`stream-${config.uid}`);
    await client.publish([localTracks.audioTrack, localTracks.videoTrack]);
    
    if (isHost) {
        document.getElementById("mood-barometer-wrapper").style.display = "flex";
    }

    startEmotionRecognition();
    
    updateHostDisplay();
    logTracks();
};

let initializeMoodBarometerChart = () => {
    if (moodBarometerChart) {
        console.log('Mood Barometer Chart is already initialized.');
        return;
    }
    
    const ctx = document.getElementById('mood-barometer-chart').getContext('2d');
    moodBarometerChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral', 'Disgusted', 'Fearful'],
            datasets: [
                {
                    label: 'Emotion Counts',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)', // Light Red
                        'rgba(54, 162, 235, 0.7)', // Light Blue
                        'rgba(255, 206, 86, 0.7)', // Yellow
                        'rgba(75, 192, 192, 0.7)', // Teal
                        'rgba(153, 102, 255, 0.7)', // Lavender
                        'rgba(255, 159, 64, 0.7)', // Orange
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)', 
                        'rgba(54, 162, 235, 1)', 
                        'rgba(255, 206, 86, 1)', 
                        'rgba(75, 192, 192, 1)', 
                        'rgba(153, 102, 255, 1)', 
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
    
    console.log('Mood Barometer Chart initialized:', moodBarometerChart);
};

// Start tracking remote emotions
let startRemoteEmotionTracking = async () => {
    moodBarometerActive = true;
    document.getElementById('mood-barometer-chart').style.display = 'block';

    // Initialize emotion detection models
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models');

    // Set up periodic detection
    const emotionFeedbackMap = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'disgusted', 'fearful'];

    const updateChart = () => {
        if (!moodBarometerChart) {
	    console.error('Mood Barometer Chart is not initialized.');
	    return;
        }

        const counts = emotionFeedbackMap.map((emotion) => remoteEmotionData[emotion] || 0);
        moodBarometerChart.data.datasets[0].data = counts;
        moodBarometerChart.update();
     };


    const intervalId = setInterval(async () => {
        if (!moodBarometerActive) {
            clearInterval(intervalId);
            return;
        }

        // Reset emotion data for aggregation
        remoteEmotionData = emotionFeedbackMap.reduce((acc, emotion) => ({ ...acc, [emotion]: 0 }), {});

        for (let uid in remoteTracks) {
            const videoElementId = `stream-${uid}`;
            const videoElement = document.getElementById(videoElementId);

            if (videoElement) {
                try {
                    const detections = await faceapi
                        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
                        .withFaceExpressions();

                    if (detections) {
                        const emotions = detections.expressions;
                        const maxEmotion = Object.keys(emotions).reduce((a, b) =>
                            emotions[a] > emotions[b] ? a : b
                        );

                        remoteEmotionData[maxEmotion] = (remoteEmotionData[maxEmotion] || 0) + 1;
                    }
                } catch (error) {
                    console.error(`Error detecting emotions for user ${uid}:`, error);
                }
            }
        }

        updateChart();
    }, 1000);
};

document.getElementById('mood-barometer-btn').addEventListener('click', () => {
    if (!moodBarometerActive) {
        if (!moodBarometerChart) {
            initializeMoodBarometerChart(); // Ensure chart is initialized
        }
        startRemoteEmotionTracking();
    } else {
        moodBarometerActive = false;
        document.getElementById('mood-barometer-chart').style.display = 'none';
    }
});


let handleUserJoined = async (user, mediaType) => {
    remoteTracks[user.uid] = user;

    await client.subscribe(user, mediaType);

    let isHost = user.uid.toLowerCase().includes('host') ? "Host" : "";

    if (mediaType === 'video') {
        let isHost = user.uid === hostUid ? "Host" : "";
        let player = `<div class="video-containers" id="video-wrapper-${user.uid}">
                          <div class="video-overlay">
                              <p class="user-uid" id="emotion-${user.uid}">
                                  ${user.uid} <span class="host-tag">${isHost}</span>
                              </p>
                          </div>
                          <video class="video-player player" id="stream-${user.uid}"></video>
                      </div>`;
        document.getElementById('user-streams').insertAdjacentHTML('beforeend', player);
        user.videoTrack.play(`stream-${user.uid}`);
    }

    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
    
    updateHostDisplay();
    logTracks();
};

let updateHostDisplay = () => {
    Object.keys(remoteTracks).forEach(uid => {
        const userElement = document.getElementById(`emotion-${uid}`);
        if (userElement) {
            // Check if the user's uid contains "host"
            const isHost = uid.toLowerCase().includes('host') ? "Host" : "";
            const hostTag = userElement.querySelector('.host-tag');
            if (hostTag) {
                hostTag.innerText = isHost; // Update the host tag
            }
        }
    });
};



let startEmotionRecognition = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models');

    const videoElement = document.getElementById(`stream-${config.uid}`);

    const emotionFeedbackMap = {
        happy: "You are engaged - keep going!",
        sad: "You are looking dull.",
        angry: "Try to stay calm.",
        surprised: "You look surprised!",
        neutral: "You look composed.",
        disgusted: "Is something bothering you?",
        fearful: "Don't worry, stay confident!"
    };

    // Map emotions to their corresponding avatars
    const emotionAvatarMap = {
        happy: './avatars/happy.png', // Replace with actual paths to your avatar images
        sad: './avatars/sad.png',
        angry: './avatars/angry.png',
        surprised: './avatars/surprised.png',
        neutral: './avatars/neutral.png',
        disgusted: './avatars/disgusted.png',
        fearful: './avatars/fearful.png'
    };

    setInterval(async () => {
        try {
            const detections = await faceapi
                .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (detections) {
                const emotions = detections.expressions;
                const maxEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);

                // Retrieve feedback for the detected emotion
                const feedback = emotionFeedbackMap[maxEmotion] || "Detecting...";

                // Update the feedback display
                document.getElementById(`feedback-${config.uid}`).innerText = feedback;

                // Update the avatar display based on the detected emotion
                const avatarImage = document.getElementById(`emotion-avatar-${config.uid}`);
                if (avatarImage) {
                    avatarImage.src = emotionAvatarMap[maxEmotion]; // Set the new avatar image
                }
            }
        } catch (error) {
            console.error("Error detecting emotion:", error);
        }
    }, 1000);
};




let handleUserLeft = (user) => {
    delete remoteTracks[user.uid];
    document.getElementById(`video-wrapper-${user.uid}`).remove();
    
    updateHostDisplay();
    logTracks();

};
*/

// YELLOW ONE CHECKING



let client = AgoraRTC.createClient({mode:'rtc', codec:"vp8"})

let config = {
    appid: '155aadd29b0b4ef7add28dc890b8adb2',
    token: '007eJxTYPAVOGbsx3m694ZjzaGTPOWXpsjlTDPLeLFUPDxN9Nm+vIUKDIampomJKSlGlkkGSSapaeYgtkVKsoWlQZJFYkqSkW22Y3pDICPDpWR2BkYoBPFZGQqKEvOKGRgAPCsfOw==',
    uid: null,
    channel: 'prans',
};

let localTracks = {
    audioTrack: null,
    videoTrack: null,
};

let localTrackState = {
    audioTrackMuted: false,
    videoTrackMuted: false,
};

let remoteTracks = {};

let hostUid = null; // To track the host
let hostName = ""; // To store the host's display name

let moodBarometerChart = null; // Chart instance
let moodBarometerActive = false; // Flag to track if the barometer is active
let remoteEmotionData = {}; // Store emotion counts for remote participants


document.getElementById('join-btn').addEventListener('click', async () => {
    config.uid = document.getElementById('username').value;
    await joinStreams();
    document.getElementById('join-wrapper').style.display = 'none';
    document.getElementById('footer').style.display = 'flex';
});

document.getElementById('mic-btn').addEventListener('click', async () => {
    if (!localTrackState.audioTrackMuted) {
        await localTracks.audioTrack.setMuted(true);
        localTrackState.audioTrackMuted = true;
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)';
    } else {
        await localTracks.audioTrack.setMuted(false);
        localTrackState.audioTrackMuted = false;
        document.getElementById('mic-btn').style.backgroundColor = '#1f1f1f8e';
    }
});

document.getElementById('camera-btn').addEventListener('click', async () => {
    if (!localTrackState.videoTrackMuted) {
        await localTracks.videoTrack.setMuted(true);
        localTrackState.videoTrackMuted = true;
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)';
    } else {
        await localTracks.videoTrack.setMuted(false);
        localTrackState.videoTrackMuted = false;
        document.getElementById('camera-btn').style.backgroundColor = '#1f1f1f8e';
    }
});

document.getElementById('leave-btn').addEventListener('click', async () => {
    for (let trackName in localTracks) {
        let track = localTracks[trackName];
        if (track) {
            track.stop();
            track.close();
            localTracks[trackName] = null;
        }
    }

    await client.leave();
    document.getElementById('footer').style.display = 'none';
    document.getElementById('user-streams').innerHTML = '';
    document.getElementById('join-wrapper').style.display = 'block';
});


let logTracks = () => {
    console.log("Local Tracks:", localTracks);
    console.log("Remote Tracks:", remoteTracks);
};


let joinStreams = async () => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    [config.uid, localTracks.audioTrack, localTracks.videoTrack] = await Promise.all([
        client.join(config.appid, config.channel, config.token || null, config.uid || null),
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
    ]);

    // Check if "host" is included in config.uid (case-insensitive)
    let isHost = config.uid.toLowerCase().includes("host");

    let player = `<div class="video-containers" id="video-wrapper-${config.uid}">
                  <div class="video-overlay">
		    <p class="user-uid" id="username-${config.uid}">
			${config.uid} ${isHost ? `<span class="host-tag">Host</span>` : ""}
		    </p>
		    ${
                !isHost
                    ? `<p class="user-feedback" id="feedback-${config.uid}">Detecting feedback...</p>
                       <img id="emotion-avatar-${config.uid}" class="emotion-avatar" src="./avatars/neutral.png">`
                    : ""
            }
		</div>

                  <video class="video-player player" id="stream-${config.uid}" autoplay></video>
              </div>`;

    document.getElementById('user-streams').insertAdjacentHTML('beforeend', player);

    localTracks.videoTrack.play(`stream-${config.uid}`);
    await client.publish([localTracks.audioTrack, localTracks.videoTrack]);
    
    if (isHost) {
        document.getElementById("mood-barometer-wrapper").style.display = "flex";
    } else {
	startEmotionRecognition();

}

    
    
    updateHostDisplay();
    logTracks();
};

let initializeMoodBarometerChart = () => {
    if (moodBarometerChart) {
        console.log('Mood Barometer Chart is already initialized.');
        return;
    }
    
    const ctx = document.getElementById('mood-barometer-chart').getContext('2d');
    moodBarometerChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Happy', 'Sad', 'Angry', 'Surprised', 'Neutral', 'Disgusted', 'Fearful'],
            datasets: [
                {
                    label: 'Emotion Counts',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)', // Light Red
                        'rgba(54, 162, 235, 0.7)', // Light Blue
                        'rgba(255, 206, 86, 0.7)', // Yellow
                        'rgba(75, 192, 192, 0.7)', // Teal
                        'rgba(153, 102, 255, 0.7)', // Lavender
                        'rgba(255, 159, 64, 0.7)', // Orange
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)', 
                        'rgba(54, 162, 235, 1)', 
                        'rgba(255, 206, 86, 1)', 
                        'rgba(75, 192, 192, 1)', 
                        'rgba(153, 102, 255, 1)', 
                        'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
    
    console.log('Mood Barometer Chart initialized:', moodBarometerChart);
};


const spotlightUser = (uid) => {
    console.log(`Spotlight function triggered for user: ${uid}`); // Log when the function is triggered
    const videoWrapper = document.getElementById(`video-wrapper-${uid}`);
    if (videoWrapper) {
        console.log(`Adding spotlight border for user: ${uid}`); // Log when the border is applied
        // Add a thick border to the video wrapper to spotlight the user
        videoWrapper.style.border = "5px solid gold";
        videoWrapper.style.borderRadius = "10px";

        // Optionally, add a timeout to remove the border after a while
        setTimeout(() => {
            console.log(`Removing spotlight border for user: ${uid}`); // Log when the border is removed
            videoWrapper.style.border = "none";
        }, 5000); // Spotlight for 5 seconds
    } else {
        console.warn(`Video wrapper not found for user: ${uid}`); // Log if the video wrapper is missing
    }
};

const angryEmotionDuration = {};

// Function to mute a remote user
async function muteRemoteUser(uid) {
    try {
        // Mute the user's audio using Agora SDK
        const user = remoteTracks[uid];
        if (user && user.audioTrack) {
            await user.audioTrack.setEnabled(false);
            console.log(`Muted user ${uid}`);
        }
    } catch (error) {
        console.error(`Error muting user ${uid}:`, error);
    }
}


// Start tracking remote emotions
let startRemoteEmotionTracking = async () => {
    moodBarometerActive = true;
    document.getElementById('mood-barometer-chart').style.display = 'block';

    // Initialize emotion detection models
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models');

    // Set up periodic detection
    const emotionFeedbackMap = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'disgusted', 'fearful'];
    const negativeEmotions = ['sad', 'fearful', 'disgusted', 'surprised'];

    const updateChart = () => {
        if (!moodBarometerChart) {
            console.error('Mood Barometer Chart is not initialized.');
            return;
        }

        const counts = emotionFeedbackMap.map((emotion) => remoteEmotionData[emotion] || 0);
        moodBarometerChart.data.datasets[0].data = counts;
        moodBarometerChart.update();
    };

    let consecutiveNegativeCounts = 0;

    const intervalId = setInterval(async () => {
        if (!moodBarometerActive) {
            clearInterval(intervalId);
            return;
        }

        // Reset emotion data for aggregation
        remoteEmotionData = emotionFeedbackMap.reduce((acc, emotion) => ({ ...acc, [emotion]: 0 }), {});

        let totalStudents = 0;
        let negativeEmotionCount = 0;

        for (let uid in remoteTracks) {
            const videoElementId = `stream-${uid}`;
            const videoElement = document.getElementById(videoElementId);

            if (videoElement) {
                try {
                    const detections = await faceapi
                        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
                        .withFaceExpressions();

                    if (detections) {
                        const emotions = detections.expressions;
                        const maxEmotion = Object.keys(emotions).reduce((a, b) =>
                            emotions[a] > emotions[b] ? a : b
                        );

                        remoteEmotionData[maxEmotion] = (remoteEmotionData[maxEmotion] || 0) + 1;

                        if (negativeEmotions.includes(maxEmotion)) {
                            negativeEmotionCount++;
                        }

                        totalStudents++;
                    }
                } catch (error) {
                    console.error(`Error detecting emotions for user ${uid}:`, error);
                }
            }
        }

        if (totalStudents > 0 && (negativeEmotionCount / totalStudents) >= 0.8) {
            consecutiveNegativeCounts++;
        } else {
            consecutiveNegativeCounts = 0;
        }

        // Check if the negative emotion condition persists for 4–5 seconds (4–5 intervals)
        if (consecutiveNegativeCounts >= 4) {
            alert('It seems that many students are experiencing negative emotions. Consider taking a short break or reducing the tone.');
            consecutiveNegativeCounts = 0; // Reset the counter after alerting
        }

        updateChart();
    }, 1000);
};





document.getElementById('mood-barometer-btn').addEventListener('click', () => {
    if (!moodBarometerActive) {
        if (!moodBarometerChart) {
            initializeMoodBarometerChart(); // Ensure chart is initialized
        }
        startRemoteEmotionTracking();
    } else {
        moodBarometerActive = false;
        document.getElementById('mood-barometer-chart').style.display = 'none';
    }
});

const monitorRemoteStreams = async () => {
    const emotionFeedbackMap = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'disgusted', 'fearful'];

    const monitorInterval = setInterval(async () => {
        for (let uid in remoteTracks) {
            const videoElementId = `stream-${uid}`;
            const videoElement = document.getElementById(videoElementId);

            if (videoElement) {
                try {
                    const detections = await faceapi
                        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
                        .withFaceExpressions();

                    if (detections) {
                        const emotions = detections.expressions;
                        const maxEmotion = Object.keys(emotions).reduce((a, b) =>
                            emotions[a] > emotions[b] ? a : b
                        );

                        if (maxEmotion === "happy") {
                            console.log(`Happy emotion detected for user: ${uid}`); // Log happy detection
                            spotlightUser(uid);
                        }
                        
                        if (maxEmotion === "angry") {
                            // Increment angry duration
                            if (!angryEmotionDuration[uid]) {
                                angryEmotionDuration[uid] = 1;
                            } else {
                                angryEmotionDuration[uid] += 1;
                            }

                            // Mute the user if angry emotion persists for 5 seconds
                            if (angryEmotionDuration[uid] >= 5) {
                                await muteRemoteUser(uid);
                                angryEmotionDuration[uid] = 0; // Reset counter after muting
                            }
                        } else {
                            // Reset angry duration if another emotion is detected
                            angryEmotionDuration[uid] = 0;
                        }
                        
                        
                        
                    }
                } catch (error) {
                    console.error(`Error detecting emotions for user ${uid}:`, error);
                }
            }
        }
    }, 1000); // Check every second

    // Store interval ID in case we want to stop monitoring later
    return monitorInterval;
};


let handleUserJoined = async (user, mediaType) => {
    remoteTracks[user.uid] = user;

    await client.subscribe(user, mediaType);

    let isHost = user.uid.toLowerCase().includes('host') ? "Host" : "";

    if (mediaType === 'video') {
        let isHost = user.uid === hostUid ? "Host" : "";
        let player = `<div class="video-containers" id="video-wrapper-${user.uid}">
                          <div class="video-overlay">
                              <p class="user-uid" id="emotion-${user.uid}">
                                  ${user.uid} <span class="host-tag">${isHost}</span>
                              </p>
                          </div>
                          <video class="video-player player" id="stream-${user.uid}"></video>
                      </div>`;
        document.getElementById('user-streams').insertAdjacentHTML('beforeend', player);
        user.videoTrack.play(`stream-${user.uid}`);
    }

    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
    
    updateHostDisplay();
    logTracks();
    
    monitorRemoteStreams();
};

let updateHostDisplay = () => {
    Object.keys(remoteTracks).forEach(uid => {
        const userElement = document.getElementById(`emotion-${uid}`);
        if (userElement) {
            // Check if the user's uid contains "host"
            const isHost = uid.toLowerCase().includes('host') ? "Host" : "";
            const hostTag = userElement.querySelector('.host-tag');
            if (hostTag) {
                hostTag.innerText = isHost; // Update the host tag
            }
        }
    });
};



let startEmotionRecognition = async () => {
    await faceapi.nets.tinyFaceDetector.loadFromUri('./models');
    await faceapi.nets.faceExpressionNet.loadFromUri('./models');

    const videoElement = document.getElementById(`stream-${config.uid}`);

    const emotionFeedbackMap = {
        happy: "You are engaged - keep going!",
        sad: "You are looking dull.",
        angry: "Try to stay calm.",
        surprised: "You look surprised!",
        neutral: "You look composed.",
        disgusted: "Is something bothering you?",
        fearful: "Don't worry, stay confident!"
    };

    const emotionAvatarMap = {
        happy: './avatars/happy.png',
        sad: './avatars/sad.png',
        angry: './avatars/angry.png',
        surprised: './avatars/surprised.png',
        neutral: './avatars/neutral.png',
        disgusted: './avatars/disgusted.png',
        fearful: './avatars/fearful.png'
    };

    let angryCount = 0;
    const threshold = 5;
    
    
                
    const concerningEmotions = ["sad", "fearful", "disgusted", "surprised"];
    let emotionTrack = {};
    const displayMotivationWindow = (emotion) => {
        const existingWindow = document.getElementById(`motivation-window-${config.uid}`);
        if (existingWindow) return;

        const windowDiv = document.createElement('div');
        windowDiv.id = `motivation-window-${config.uid}`;
        windowDiv.style.position = 'fixed';
        windowDiv.style.bottom = '20px';
        windowDiv.style.right = '20px';
        windowDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        windowDiv.style.border = '1px solid #ccc';
        windowDiv.style.borderRadius = '8px';
        windowDiv.style.padding = '16px';
        windowDiv.style.zIndex = '1000';
        windowDiv.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';

	
    
        const text = document.createElement('p');
        text.innerText = `It seems you are feeling ${emotion}. Stay strong! Take this 1 minute game to gain back focus. Win against yourself`;

        const gameBoard = document.createElement('div');
	gameBoard.style.display = 'grid';
	gameBoard.style.gridTemplateColumns = 'repeat(3, 1fr)';
	gameBoard.style.gridGap = '5px';
	gameBoard.style.marginTop = '16px';

	const cells = Array(9).fill(null);
	const currentPlayer = { value: 'X' };

	const checkWinner = () => {
	const winningCombos = [
	    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
	    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
	    [0, 4, 8], [2, 4, 6], // Diagonals
	];

	for (const combo of winningCombos) {
	    const [a, b, c] = combo;
	    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
		return cells[a];
	    }
	}
	return cells.every(cell => cell) ? 'Tie' : null;
	};

	const handleCellClick = (index, cellDiv) => {
	if (cells[index] || checkWinner()) return;

	cells[index] = currentPlayer.value;
	cellDiv.innerText = currentPlayer.value;

	const winner = checkWinner();
	if (winner) {
	    setTimeout(() => {
		alert(winner === 'Tie' ? "It's a tie!" : `Player ${winner} wins!`);
		document.body.removeChild(windowDiv);
	    }, 100);
	} else {
	    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
	}
	};

	for (let i = 0; i < 9; i++) {
	const cellDiv = document.createElement('div');
	cellDiv.style.width = '80px';
	cellDiv.style.height = '80px';
	cellDiv.style.border = '1px solid #ccc';
	cellDiv.style.display = 'flex';
	cellDiv.style.alignItems = 'center';
	cellDiv.style.justifyContent = 'center';
	cellDiv.style.fontSize = '24px';
	cellDiv.style.cursor = 'pointer';

	cellDiv.onclick = () => handleCellClick(i, cellDiv);
	gameBoard.appendChild(cellDiv);
	}

	const timer = document.createElement('p');
	timer.style.marginTop = '16px';
	timer.style.color = '#555';
	let timeLeft = 90; // 1.5 minutes

	const countdown = setInterval(() => {
	if (timeLeft <= 0) {
	    clearInterval(countdown);
	    alert("Its time for you to get back.");
	    
	    document.body.removeChild(windowDiv);
	} else {
	    timer.innerText = `Time left: ${timeLeft--} seconds`;
	}
	}, 1000);
	
	const closeButton = document.createElement('button');
        closeButton.innerText = "Close";
        closeButton.style.marginTop = '16px';
        closeButton.style.padding = '8px 12px';
        closeButton.style.backgroundColor = '#f44336';
        closeButton.style.color = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            clearInterval(countdown);
            document.body.removeChild(windowDiv);
        };

	windowDiv.appendChild(text);
	windowDiv.appendChild(gameBoard);
	windowDiv.appendChild(timer);
	document.body.appendChild(windowDiv);
	};
	    
    

    setInterval(async () => {
        try {
            const detections = await faceapi
                .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions();

            if (detections) {
                const emotions = detections.expressions;
                const maxEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);

                document.getElementById(`feedback-${config.uid}`).innerText = emotionFeedbackMap[maxEmotion] || "Detecting...";
                const avatarImage = document.getElementById(`emotion-avatar-${config.uid}`);
                if (avatarImage) avatarImage.src = emotionAvatarMap[maxEmotion];

		if (maxEmotion === "angry") {
                    angryCount++;
                    if (angryCount >= threshold) {
                        // Mute local audio
                        if (!localTrackState.audioTrackMuted) {
			    await localTracks.audioTrack.setMuted(true);
			    localTrackState.audioTrackMuted = true;
			    document.getElementById('mic-btn').style.backgroundColor = 'rgb(255, 80, 80, 0.7)';
			    alert("Calm down, you have been muted due to prolonged angry emotion.");
			} 
                        console.log("Local user muted due to prolonged angry emotion.");
                        angryCount = 0; // Reset counter after muting
                    }
                } else {
                    angryCount = 0; // Reset counter if other emotion detected
                }
		    
                if (concerningEmotions.includes(maxEmotion)) {
                    emotionTrack[maxEmotion] = (emotionTrack[maxEmotion] || 0) + 1;
                } else {
                    emotionTrack = {}; // Reset tracking if a non-concerning emotion is detected
                }

                if (emotionTrack[maxEmotion] >= 5) {
                    displayMotivationWindow(maxEmotion);
                    emotionTrack = {}; // Reset tracking after displaying the window
                }
            }
        } catch (error) {
            console.error("Error detecting emotion:", error);
        }
    }, 2000);
};





let handleUserLeft = (user) => {
    delete remoteTracks[user.uid];
    document.getElementById(`video-wrapper-${user.uid}`).remove();
    
    updateHostDisplay();
    logTracks();

};



