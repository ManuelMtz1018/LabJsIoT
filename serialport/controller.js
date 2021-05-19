let auxInput;
let message;
let port
let save
const openRs232Port=(portRs323,socket)=>{
    port=portRs323
    port.on("open",function(){
      console.log("RS232 connected");
      port.on('data', function(data) { 
        let msg=getDecodedInput(data.toString())
        console.log("Listening and Transmitting... "+msg);
        socket.emit('transmissionChannel',msg)
      });
    });     
    return "Connected";
}

const getDecodedInput=(input)=>{
    if(input.includes("["))
        save=true       
    else if(input.includes("]")){
        auxInput+=input
        auxInput=auxInput.replace("[","")
        auxInput=auxInput.replace("]","")
        let [typeInput,b,valueInput]=auxInput.split("&")
        message=typeInput+"\\"+valueInput
        auxInput=""
        save=false
    }
    if(save)
        auxInput+=input   
    return  message;
}

const turnCoil=(value)=>{
    port.write(`${value}\n`, function(err) {
        if (err) {
          return console.log('Error on write: ', err.message)
        }
        console.log(`Value: ${value}`)
    })
}

module.exports={
  openRs232Port,
  turnCoil
}