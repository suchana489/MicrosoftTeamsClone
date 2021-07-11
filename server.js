/*const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
 
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
     console.log(roomId,userId)
     socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)*/

/*const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')



app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT||3000)
/*const express = require('express');
const app = express();
const server = require('http').Server(app);
app.get('/',(req,res)=>{
  res.status(200).send("Hello world");
})

server.listen(3030);*/
// Importing express module
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
const {v4:uuidv4} = require('uuid');
const {ExpressPeerServer} = require('peer')
const peer = ExpressPeerServer(server , {
  debug:true
});
app.use('/peerjs', peer);
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/' , (req,res)=>{
  res.send(uuidv4());
});
app.get('/:room' , (req,res)=>{
    res.render('index' , {RoomId:req.params.room});
});
io.on("connection" , (socket)=>{
  socket.on('newUser' , (id , room)=>{
    socket.join(room);
    socket.to(room).broadcast.emit('userJoined' , id);
    socket.on('disconnect' , ()=>{
        socket.to(room).broadcast.emit('userDisconnect' , id);
    })
  })
})
server.listen(port , ()=>{
  console.log("Server running on port : " + port);
})
