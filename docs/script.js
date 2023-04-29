
const downloader = document.getElementById('downloader');

//creates this Peer
var peer = new Peer();
peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
  downloader.innerHTML = id;
  });

const rtcButton = document.getElementById('rtc');
const rtcinput = document.getElementById('peer');

var conn; //dataChannel for init connection
var fileChannel; //datachannel for sending file

rtcButton.addEventListener('click', (event) => {

  //starts connection with peer
  conn = peer.connect(rtcinput.value, {label: "init"});
  // on open will be launch when you successfully connect to PeerServer
  conn.on('open', function() {
    // here you have conn.id
    conn.send('hi!');
  });

  conn.on('data', (data)=> {
    console.log(data);
    document.getElementById("sender_status").innerHTML = 'Connected';
  });

  fileChannel = peer.connect(rtcinput.value,  {label: "file"});
  fileChannel.on('open',function() {
    console.log("Opened File Transfer Channel (Sender)")
  });
});

//when peer request connection
peer.on('connection', function(connection) {

    let label = connection.label

    if (label == 'init') {
      conn = connection;
      conn.on('data', function(data){
        // Will print 'hi!'
        console.log(data);
        conn.send("HEY!");
        document.getElementById("receiver_status").innerHTML = 'Connected';
      });
    } else {
      fileChannel = connection;
      console.log("Opened File Transfer Channel (Receiver)")
      fileChannel.on('data', (data) => {
        const blob = new Blob([data.file]);
        downloadBlob(blob, data.filename)
      });
    }

});

const uploadBtn = document.getElementById('upload_button');
const fileInput = document.getElementById('fileToUpload');

uploadBtn.addEventListener('click', (event) => {
  
  const file = fileInput.files[0]; //file selected
  const reader = new FileReader(); //reader for file
  
  reader.onload = (event) => {
    const data = event.target.result;
    const blob = new Blob([data], { type: file.type });
    const wrapper = {
      filename: file.name,
      file: blob
    }
    // Send the Blob object over the data channel as a binary message
    fileChannel.send(wrapper);
  };
  
  reader.readAsArrayBuffer(file); //reads file which triggers callback
});

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}




//navigation
const uploadli = document.getElementById("uploadli");
const downloadli = document.getElementById("downloadli");

const navDownload = document.getElementById("navDownload");
const navUpload = document.getElementById("navUpload");


navUpload.addEventListener('click', (event) => {
    navDownload.classList.remove('current-nav');
    navUpload.classList.add('current-nav');

    uploadli.classList.remove('hidden');
    downloadli.classList.add('hidden');
});

navDownload.addEventListener('click', (event) => {
    navUpload.classList.remove('current-nav');
    navDownload.classList.add('current-nav');

    downloadli.classList.remove('hidden');
    uploadli.classList.add('hidden');
});