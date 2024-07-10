const express = require('express')
const cors = require('cors')
const http = require('http')
const socketIO = require('socket.io')

const { addUser, removeUser, getUserById } = require('./users')

const port = 8000
const app = express()

app.use(cors())



const server = http.createServer(app)
const io = new socketIO.Server(server, {cors: 
    {
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) =>{
    console.log('a user connected', socket.id)
    
    socket.on('join', ({ name, room }, cb) => {
        if(!!name && !!room) {
            console.log('join request', name)
            const { error, user } = addUser({ id: socket.id, name, room})
            if(error) {
                cb(error)
            }
            socket.join(room)
            socket.emit('message', {
                user: 'System', 
                text: `Welcome ${name} to ${room}`
            })

            socket.broadcast.to(room).emit('message', { 
                user: 'System', 
                text: `${name} just join ${room}`
            })

            cb()
        }
    })

    socket.on('message', (message) => {
        const user = getUserById(socket.id)
        if(!!user) {
            io.to(user.room).emit("message", {
                user: user.name,
                text: message,
            })
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id)
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', {
                user: 'System',
                text: `${user.name} just left ${user.room}`
            })
        }
    })
    
})

server.listen(port)