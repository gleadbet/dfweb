const util = require('../../util');
const { performance } = require('perf_hooks');   // https://medium.com/@kirankandel007/measuring-execution-time-in-nodejs-1d4179eeb860

module.exports = webSocket

// Define socket messages
function webSocket(socket) {
  var hbId = null;
  var tdId = null;

  console.log(`www: socket.io server is connected:' ${socket.id}`);

  socket.on('message', data => {
    console.log('Here a test Message from web-socket', data)
  })

  // The request comes from the FE componet - just a list of tags, then the componet send the request
  //  updateSocket() in the componet file has the list of tags.
  socket.on('status start', () => {

    console.log('www: START socket.io heartbeats');
    hbId = heartbeats(socket);
    //console.log(`www: socket.io heartbeats' ${hbId}`);

    socket.on('tagdata', tags => {

      const start = performance.now();
      tdId = recentDataFromTags(socket,tags);
      const end = performance.now();
      console.log(`TAGS: ${tags} `);
      console.log(`*** Time taken to execute tag function is ${end - start}ms. ***`);
  })
  

  socket.on('status stop', () => {
      if(hbId)  {
        console.log("Clearing interval for looking at heartbeats...");
        clearInterval(hbId);          // built in function to stop execution interval of subscription
      }
  })

  socket.on('alarm', () => {
      console.log("Got Alarm");
  })



  socket.on('tagdata stop', () => {
      if (tdId != null) {
          console.log("Clearing interval for recent tag data...");
          clearInterval(tdId);
      }
  })

});
  
  // This will be sent to the angular component as a test viewable in the browser
  socket.emit('data', { name: 'Gib', age: 60, dob: 1234 })
}


function heartbeats(socket) {
  var hbId = setInterval(async function () {
    const start = performance.now();
      var beats = await util.getHeartBeats();
    const end = performance.now();
    console.log(`*** Time taken to execute HEARTBEAT function is ${end - start}ms. ***`);

      console.log(`(web-Socket): HeartBeat Value: ${JSON.stringify(beats, null,2)}`);
      socket.emit('heartbeats', beats);
  }, 5000);

  return hbId;
}

// We have seen the signal for tag data,  and have been passed the "tags" we want to monitor
// Call the monggo "pipeline" query
// Then send back the data we recieive with the message "recentdata"
function recentDataFromTags(socket, tags) {
  var tdId = setInterval(async function () {
      var data = await util.getRecentTagData(tags);
      console.log(data);
      socket.emit('recentdata', data);
  }, 2000);

  return tdId;
}

function timing(callback) {
  setInterval(callback, 1000)
}
