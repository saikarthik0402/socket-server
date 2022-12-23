const auth =  require('../helpers/firebase.service');

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

    const sessionCookie = socket.handshake.headers.cookie.split("=")[1].split(";")[0];
    await auth
    .verifySessionCookie(sessionCookie, true)
    .then((user) => {

       socket.userid = user.uid;
       socket.email = user.email;
       socket.isAuthenticated = true;
       console.log(`${socket.email} is successfully connected to socket with id ${socket.id}`);
    })
    .catch((error) => {
        console.log("[Auth Error] Firebase Authentication Failed");
        socket.isAuthenticated = false;
    });
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