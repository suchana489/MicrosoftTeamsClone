const socket = io("/");
const chatInputBox = document.getElementById("chat_message");
const all_messages = document.getElementById("all_messages");
const main__chat__window = document.getElementById("main__chat__window");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: '/MicrosoftTeamsClone',
  host: 'localhost',
  port: 3000,
});

let myVideoStream;

var getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");

      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });

    document.addEventListener("keydown", (e) => {
      if (e.which === 13 && chatInputBox.value != "") {
        socket.emit("message", chatInputBox.value);
        chatInputBox.value = "";
      }
    });

    socket.on("createMessage", (msg) => {
      console.log(msg);
      let li = document.createElement("li");
      li.innerHTML = msg;
      all_messages.append(li);
      main__chat__window.scrollTop = main__chat__window.scrollHeight;
    });
  });

peer.on("call", function (call) {
  getUserMedia(
    { video: true, audio: true },
    function (stream) {
      call.answer(stream); // Answer the call with an A/V stream.
      const video = document.createElement("video");
      call.on("stream", function (remoteStream) {
        addVideoStream(video, remoteStream);
      });
    },
    function (err) {
      console.log("Failed to get local stream", err);
    }
  );
});

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

// CHAT

const connectToNewUser = (userId, streams) => {
  var call = peer.call(userId, streams);
  console.log(call);
  var video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    console.log(userVideoStream);
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (videoEl, stream) => {
  videoEl.srcObject = stream;
  videoEl.addEventListener("loadedmetadata", () => {
    videoEl.play();
  });

  videoGrid.append(videoEl);
  let totalUsers = document.getElementsByTagName("video").length;
  if (totalUsers > 1) {
    for (let index = 0; index < totalUsers; index++) {
      document.getElementsByTagName("video")[index].style.width =
        100 / totalUsers + "%";
    }
  }
};

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setPlayVideo = () => {
  const html = `<i class="unmute fa fa-pause-circle"></i>
  <span class="unmute">Resume Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopVideo = () => {
  const html = `<i class=" fa fa-video-camera"></i>
  <span class="">Pause Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `<i class="unmute fa fa-microphone-slash"></i>
  <span class="unmute">Unmute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};
const setMuteButton = () => {
  const html = `<i class="fa fa-microphone"></i>
  <span class="">Mute</span>`;
  document.getElementById("muteButton").innerHTML = html;
};

/*const leaveMeeting = () => {
  console.log('leave meeting')
  const video = document.querySelector('video');

  // A video's MediaStream object is available through its srcObject attribute
  const mediaStream = video.srcObject;

  // Through the MediaStream, you can get the MediaStreamTracks with getTracks():
  const tracks = mediaStream.getTracks();



  // Or stop all like so:
  tracks.forEach(track => track.stop())
  window.close();
  setStopVideo()
  setMuteButton()
  document.querySelector('video').innerHTML = html;
}

const setLeaveMeeting = () => {
  const html = `<i class=" fa-fa-times"></i>
              <span class="">.main__leave_meeting</span>`;
  document.getElementById(".main__leave_meeting").innerHTML = html;
};*/
/*const shareScreen = () => {
  // @ts-ignore
  navigator.mediaDevices.getDisplayMedia({
    video: {
      cursor: 'always'
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true
    }
  }).then(stream => {
    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.onended = () => {
      this.stopScreenShare();
    };

    const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }).catch(err => {
    console.log('Unable to get display media ' + err);
  });
}
const stopScreenShare = () => {
  const videoTrack = this.lazyStream.getVideoTracks()[0];
  const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
  sender.replaceTrack(videoTrack);
}
const setShareScreen = () => {
  const html = `<i class="u"></i>
  <span class="unmute">Resume Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};

const setStopShareScreen = () => {
  const html = `<i class=" fa fa-video-camera"></i>
  <span class="">Pause Video</span>`;
  document.getElementById("playPauseVideo").innerHTML = html;
};
*/
const shareScreen = async () => {




  const socket = io('/')
  
  const myPeer = new Peer(undefined, {
    path: '/peerjs',
    host: 'peerjs-server.herokuapp.com',
    port: 'process.env.PORT'
  })
const myVideo2 = document.createElement('video')
myVideo2.muted = true;
const peers = {}
navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo2, stream)
  myPeer.on('call', call => {
    call.answer(stream)
    const video2 = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video2, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  

})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
  
  const call = myPeer.call(userId, stream)
  const video2 = document.createElement('video')
  call.on('stream', userVideoStream => {
    
  })
  call.on('close', () => {
    video2.remove()
  })

  peers[userId] = call
}

function addVideoStream(video2, stream) {
  video2.srcObject = stream
  video2.addEventListener('loadedmetadata', () => {
    video2.play()
  })
  videoGrid.append(video2)
}
}


function close_window() {
  window.close();
  console.log("close_window");
  }

  function shareScreene()
  {
  
   
  
  }
