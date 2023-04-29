const express = require('express');
const { Socket } = require('socket.io');
const app = express();
require('dotenv').config()

const port = process.env.PORT || 5000;
app.use(express.static('public'));
const connectDb = require('./db');
const comment = require('./models/comment');
connectDb();

const Comment = require('./models/comment');
app.use(express.json())

app.post('/api/comments', (req,res)=>{
    const comment = new Comment({
        username: req.body.username,
        comment: req.body.comment   
    })
    comment.save().then(response =>{ res.json(response)})
    
});

app.get('/api/comments', (req, res)=>{
    Comment.find().then(comments =>{
        res.send(comments)
    })
})

const server = app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})

let io = require('socket.io')(server)

io.on('connection', (socket)=>{
  //  console.log(`New Connection:${socket.id}`);

    //recieve event
    socket.on('comment', (data)=>{
        data.time = Date()
        socket.broadcast.emit('comment',data)
    })
    socket.on('typing', (data)=>{
        socket.broadcast.emit('typing',data)
    })
})