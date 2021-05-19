const express=require('express')
const cors=require('cors')
const { socketController } = require('../sockets/controller')
const{openRs232Port}=require('../serialport/controller')
class Server{

    constructor(){
        this.app=express()
        this.port=process.env.PORT 
        this.server=require('http').createServer(this.app)
        this.io=require('socket.io')(this.server)
        this.serialPort=require('serialport')
        
        this.middlewares()  
        this.sockets()
        this.serial()
    }
    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static('public'))          
    }
    
    sockets(){
        this.io.on('connection',socketController)
    }

    serial(){
        this.portRs232=new this.serialPort(
            'COM2',
            {baudRate:9600}
        ); 
        openRs232Port(this.portRs232,this.io)
    }

    listen(){
        this.server.listen(this.port,()=>{
            console.log(`Listening ${this.port}`)
        })
    }
}

module.exports=Server