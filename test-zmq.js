var zmq = require('zmq')
  , sock = zmq.socket('push');
 
sock.bindSync('tcp://127.0.0.1:28332');
console.log('Producer bound to port 28332');
 
setInterval(function(){
  console.log('sending work');
  sock.send('some work');
}, 500);