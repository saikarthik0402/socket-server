const axios = require('axios');

let iosocket;

const authentication = async (socket,next) => {
   
    iosocket = socket;

    if(socket.handshake.headers.cookie === undefined)
    {
        console.log(`Unverified ${socket.id}`);
        socket.disconnect();
        socket.isAuthenticated = false;
        return;
    }
    axios.default.post('http://localhost:8080/authenticate/socket',{},{
        headers:{
            'content-type': 'application/json',
            'cookie' : socket.handshake.headers.cookie
        }
        })
        .then((response)=>{
            console.log(response.data);
        })
       .catch((err)=>{
        console.log("[Auth Error] Firebase Authentication Failed");
        socket.isAuthenticated = false;
       })

    next();
}

const Onconnection = (socket) => {

    console.log(socket.id+" Connected");
    OnAuthenticationFail(socket);
    OnDisconnect(socket);
}

function OnSuccess()
{
    console.log("Payment Updated");
    console.log(iosocket.email);
    let interval = 0;
    var emitinterval = setInterval(()=>{
        interval+=1000;
        iosocket.emit(iosocket.email,{id:iosocket.id,time:new Date().toString(),successcode:200,message:"Payment Successfull"});
        if(interval > process.env.SOCKET_TIMEOUT) {
            clearInterval(emitinterval);
        }
},1000);
}

function OnAuthenticationFail(socket){

    console.log(socket.isAuthenticated);
    if(socket.isAuthenticated === false)
    {
        socket.emit('authentication_error',{sid:socket.id,message:"[Auth Failed] User Authentication Failed"});
    }
}

function OnDisconnect(socket)
{
    socket.on('disconnect',()=>{
        console.log("[Socket Closed] client has disconnected");
;   });
}


module.exports = {
    authentication,
    Onconnection,
    OnSuccess
}