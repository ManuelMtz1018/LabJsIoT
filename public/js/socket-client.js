// Referencias del HTML
import {addElemets} from './chart-graph.js'
const POSITION_BACKGROUND_COLOR=1
const CHANNEL_NAME='transmissionChannel'
const DELAY_TIME=600  
const alarm=document.querySelector('#alarmHouse')


document.querySelector('#buttonKitchen').addEventListener('click',switchKitchen)
document.querySelector('#buttonLiving').addEventListener('click',switchLiving)
document.querySelector('#buttonBath').addEventListener('click',switchBath)

const socket = io();
let samplingInterval;  
let oneShootAlarmOn=true
let oneShootAlarmOff=true

socket.on('connect',function(){///el servidor permance a la escucha
    console.log('Connected to server');
});

socket.on('disconnect',function(){
    console.log('Connection ended');
}); 

socket.on(CHANNEL_NAME,function(data){
    render(data);/////My function     
 });

function switchKitchen(){
    switchBackgroung(this,'turnOnButton')
    if(this.classList[POSITION_BACKGROUND_COLOR]==='turnOnButton')
        sendMessageToServer('Led','On')
    else
        sendMessageToServer('Led','Off')
}

function switchLiving(){
    switchBackgroung(this,'livingOn')
    if(this.classList[POSITION_BACKGROUND_COLOR]==='livingOn')
        sendMessageToServer('Livingroom','On')
    else
        sendMessageToServer('Livingroom','Off')
}

function switchBath(){
    switchBackgroung(this,'bathroomOn')
    if(this.classList[POSITION_BACKGROUND_COLOR]==='bathroomOn')
        sendMessageToServer('Bathroom','On')
    else
        sendMessageToServer('Bathroom','Off')
}

function switchBackgroung(element,nameClass){
    if(element.classList[POSITION_BACKGROUND_COLOR]===nameClass){
        element.classList.remove(nameClass)     
        element.classList.add('turnOffButton') 
    }
    else{
        element.classList.remove('turnOffButton')
        element.classList.add(nameClass)   
    }
} 

export function sendMessageToServer(addressee,msg){
    socket.emit(CHANNEL_NAME,{
        user:addressee,
        message:msg
    })
}

function render(data){
    let message=data.toString()
    let recived=message.split("\\")
    if(recived[0]==="i")            
        switchAlarm(recived[1])
    else if(recived[0]==="s"){
        addElemets(recived[1])
    }
}
function switchAlarm(opc){
    if(opc==='On'&&oneShootAlarmOn){         
        oneShootAlarmOn=false
        oneShootAlarmOff=true
        startAlarm()
    }
    else if(opc==='Off'&&oneShootAlarmOff){
        oneShootAlarmOn=true
        oneShootAlarmOff=false
        stopAlarm()
        ///in case it is still in active color
        if(alarm.classList[POSITION_BACKGROUND_COLOR]==='alarmOn'){           
            alarm.classList.remove('alarmOn')     
            alarm.classList.add('alarmOff') 
        }
    }

}

function stopAlarm(){    
    clearInterval(samplingInterval)    
}
function startAlarm(){   
    samplingInterval=setInterval(function(){        
            toogleAlarm(alarm); 
        }, DELAY_TIME);
}
function toogleAlarm(element){
    if(element.classList[POSITION_BACKGROUND_COLOR]==='alarmOff'){
        element.classList.remove('alarmOff')     
        element.classList.add('alarmOn') 
    }
    else{
        element.classList.remove('alarmOn')     
        element.classList.add('alarmOff') 
    }
}