import express from "express"
import dotenv from "dotenv"
import cors from 'cors';
import {Server} from "socket.io"
import mongoose from "mongoose"
import { createServer } from 'http';
import authRouter from "./routes/auth.routes"
import pollRouter from "./routes/poll.routes"

dotenv.config()

const app = express()
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/poll', pollRouter)

const server = createServer(app)
// const io = new Server(server, {
//   cors:{
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   },
// })


const URI = process.env.DB!
mongoose
  .connect(URI, { dbName: 'voting-app' })
  .then(() => {
    console.log('Connected to MongoDB database');

    // Start Socket.IO
    // chatSocket(io);

    // Start the server
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });