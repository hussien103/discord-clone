import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import User from './models/user.js';
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config()
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;


app.set("view engine", "ejs");
app.set("views",  "./client");


app.use(express.static('public'));
const server = createServer(app);

mongoose.connect(MONGODB_URL, {}).then(()=>{
    server.listen(3000, () => {
        console.log('server running at http://localhost:3000');
    });
})



const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, './client/register.ejs'));
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', {userName: msg.userName, msg: msg.msg});
    });
});
app.post("/register", async (req, res) => {

    const { name, img } = req.body;

    const user = new User({
        name,
        img
    });

    await user.save();

    res.redirect(303,"/login")
});


app.post("/login", async (req, res) => {

    const { name } = req.body;

    const user = await User.findOne({ name });

    if (!user)
        return res.send("User not found");
    res.render("index",{name:name})

});
app.get("/login", async (req, res) => {

    res.render("login");
})