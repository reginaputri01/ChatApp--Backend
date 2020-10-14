require('dotenv').config()
const express = require('express')
const http = require('http')
const socket = require('socket.io')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const router = require('./src/routers/index')
const messageModel = require('./src/models/messages')
const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(cors())
app.use(morgan('dev'))

// menggunakan socket
const io = socket(server)

io.on('connection', socket => {
    console.log('user connect');
    socket.on('setupUserLogin', id =>{
        console.log('user baru join adalah ' + id)
        socket.join('user:'+id)
    })
    socket.on('sendMessage', (data, callback) =>{
        const dataMessage = data
        dataMessage.createdAt = new Date()
     
        // send to sender
        callback(data)

        // save to database
        messageModel.insertMessage(dataMessage)
        .then((result)=>{
        
        // send to receiver
        io.to('user:'+data.receiverId).emit('receiveMessage', data)

        })
        .catch(err=>{
            console.log(err)
        })
    })
    socket.on('disconnect', () =>{
        console.log('disconnect with id '+ socket.id )
    })
})


app.use('/api/v1', router)
server.listen(PORT, ()=>{
    console.log(` Server in running port ${PORT}`);

})
