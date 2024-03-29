import express from "express";
import { Server } from "socket.io";

const app = express();
const port = 5002;
const server = app.listen(port, () =>{console.log("listening on port: " + port); });
const io = new  Server(server);

const sockets  = [];
const users = [];
const messages = [];

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/',(req, res) =>{
    res.redirect('login');
})
app.get('/login', (req, res) =>{
    res.render('login');
})

// app.get("./../output.css", (req, res) => {
//     res.sendFile(path.join(__dirname, './views/output.css'))
// })

app.post('/login', (req, res) => {
    res.redirect(`/chat/${req.body.username}`);
})

app.get('/chat/:username',(req, res) => {
    res.render('chat', {username:req.params.username});
});

const colours = [
    "#FF5733",
    "#33FF57",
    "#5733FF",
    "#FF3357",
    "#57FF33",
    "#3357FF",
    "#FF5733",
    "#33FF57",
    "#5733FF",
    "#FF3357",
  ];
io.on('connection', (socket) => {
    sockets[socket.id] = socket;
    socket.on('join', (username) =>{
        users[socket.id] = username;
        let random_factor = Math.floor(Math.random() * colours.length);
        io.emit('join', {username:username, user:Object.values(users), colour: colours[random_factor]});
        
    });
    socket.on('disconnect', (reson) =>{
        const username = users[socket.id];
        delete sockets[socket.id];
        delete users[socket.id];
        io.emit('leave', { username:username, user:Object.values(users)});
    })
    socket.on('message', (data) =>{
        const {messenger, message} = data;
        io.emit('message',data); 
    })
})
