var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/display.html');
})
 
io.on('connection', (socket)=> {
  
    socket.on("join-message", (roomId) => {
        socket.join(roomId);  
        console.log("User joined in a room : " + roomId);
    }) 
 
    socket.on("screen-data", function(data) {
        data = JSON.parse(data);
        var room = data.room;
        var imgStr = data.image;
        socket.broadcast.to(room).emit('screen-data', imgStr);
    })
})

var server_port = process.env.YOUR_PORT || process.env.PORT || 5000;

http.listen(server_port, '192.168.0.115', () => {
    console.log(`Server is running on http://192.168.0.115:${server_port}`);
}); 
// http.listen(server_port, '192.168.0.103', () => {
//     console.log(`Server is running on http://192.168.0.103:${server_port}`);
// }); 