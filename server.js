require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const http = require('http');
const socket  = require('./helpers/socket');


const app = express();
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: process.env.SOCKET_CLIENT,
    methods: ["GET"],
    credentials: true
  }
});


app.use(cors({
  origin:process.env.ORIGIN
}));

app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())


app.post('/update/status', (req, res, next) => {
  console.log(req.body);
  res.sendStatus(200);
  socket.OnSuccess(req.body.email);

})

//Socket IO Request Handlers
io.use(socket.authentication);
io.on("connection",socket.Onconnection);


httpServer.listen(process.env.PORT,()=> {
    console.log('Server listening on port ' + process.env.PORT);
});