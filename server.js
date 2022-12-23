require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const http = require('http');


const app = express();
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET"],
    credentials: true
  }
});


app.use(cors({
  origin: process.env.ORIGIN,
  credentials:true
}));
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())


//HTTP Router Controllers
app.use('/authenticate',firebase.verifyuser);


//Socket IO Request Handlers
io.use(authentication);
io.on("connection",Onconnection);


httpServer.listen(process.env.PORT,()=> {
    console.log('Server listening on port ' + process.env.PORT);
    console.log(`Server running on ${process.env.NODE_ENV ? process.env.NODE_ENV : "production"} environment`);
});