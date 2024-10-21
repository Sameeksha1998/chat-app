import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io'; // Correct import
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js'
import messageRoute from './routes/message.route.js'
import userRoute from './routes/user.route.js'
import connectToMongo from './db/connectToMongoDB.js';
import cookieParser from 'cookie-parser';

dotenv.config(); // Load environment variables
// Initialize express app
const app = express();
const server = http.createServer(app);
const io = new Server(server); // Instantiate with 'new'
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello world !!");
});

app.use('/api/auth', authRoute);
app.use('/api/message', messageRoute);
app.use('/api/user', userRoute);


// Socket.IO setup
io.on('connection', (socket) => {
    console.log('New user connected');

    // Send previous messages to the new user
    Message.find().then(messages => {
        socket.emit('chat history', messages);
    });

    // Listen for incoming messages
    socket.on('send message', (data) => {
        const message = new Message(data);
        message.save().then(() => {
            io.emit('receive message', data); // Broadcast the message to all clients
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    connectToMongo()
    console.log(`Server running on ports ${PORT}`)
});
