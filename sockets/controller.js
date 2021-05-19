const { turnCoil } = require("../serialport/controller");

const socketController=(socket)=>{
    console.log("Controller socket");
    console.log("connected ",socket.id);
    
    socket.on('disconnect',()=>{
        console.log(`Client ${socket.id} disconnected`);
    })
    
    socket.on('transmissionChannel', ( msg ,callback) => {        
      
        console.log(`Message recived ${msg}`);
        if(msg.user==="Led"){
            sendMessageToRs232Port(msg.message,"l1")
        } 
        if(msg.user==="Livingroom"){
            sendMessageToRs232Port(msg.message,"l2")
        }
        if(msg.user==="Bathroom"){
            sendMessageToRs232Port(msg.message,"l3")
        }
        if(msg.user==="Chart"){
            sendMessageToRs232Port(msg.message,"l4")
        }
    })    
}

const sendMessageToRs232Port=(message,coil)=>{
    if(message=="On"){
        turnCoil(`i&${coil}&On`);
    }
    else if(message=="Off"){
        turnCoil(`i&${coil}&Off`);
    }
}

module.exports={
    socketController
}