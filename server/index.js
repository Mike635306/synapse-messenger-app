const express = require('express');
const path = require('path');
const app = express();
const port = 3000 || process.env.PORT;
const { Server } = require("socket.io");
const { createServer } = require("http");



app.use('/', express.static(path.join(__dirname, '../client')));


// Создаем websocket сервер
const server = createServer(app);
const io  = new Server(server);


io.on('connection', (socket) => {

  console.log(`🔵 ${socket.id} a user connected`);

  socket.on('disconnect',()=>{
    console.log(
      `🔴 ${socket.id} disconnected`
    )
  })

  socket.on('chat message',(data)=>{
    
     console.log(data)
   
     io.emit(
       'chat message', data
     )

  
  })

 socket.on('voice message',(data)=>{
io.emit('voice message',data)
});

});






    server.listen(port, () => {
        console.log(`
        Server is running on port ${port}!
        🌐 http://localhost:${port}
        `);
    });

