const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);

  socket.on('mouse', (data) => {
    // console.log(`Mouse position from ${socket.id}:`, data);
    // 他のクライアントにマウスの位置座標をブロードキャスト
    socket.broadcast.emit('mouse', {id: socket.id, x: data.x, y: data.y});
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});