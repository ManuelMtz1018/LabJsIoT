import {sendMessageToServer} from './socket-client.js'
let LIMIT_VALUES=20;
let LIMIT_SAMPLES=21+10;  
let OFFSET=10
let POSITION_CENTER=10
let ZOOM_CENTER=10

var xValues = [0,1];
var yValues = [7,8];
let time=2

let previousMax;
let previousMin;
let isInitialize=false

let xMin=0
let xMax= 1
let graphBtn=document.getElementById('graphButton');
let pauseButton=document.getElementById('pauseButton')
let sliderZoomOnPauseX=document.getElementById('sliderZoomOut')
let sliderZoomY=document.getElementById('sliderZoomOutY')
let sliderPosition=document.getElementById('sliderPosition')

let sliderZoomRealTimeX=document.getElementById('sliderZoomRealTime')

graphBtn.addEventListener('click',startSampling)
pauseButton.addEventListener('click',pauseGraph)
sliderZoomOnPauseX.addEventListener('input',zoomChartOnPauseCenter)
sliderZoomY.addEventListener('input',zoomChartY)
sliderZoomRealTimeX.addEventListener('input',zoomChart)
sliderPosition.addEventListener('input',moveGraphics)

let chart=new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: true,
      lineTension: 0,
      backgroundColor: "rgba(0,0,255,0.35)",
      borderColor: "rgba(0,0,255,0.1)",
      data: yValues
    }
    ]
  },
  
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{ticks: {min: 0, max:30}}],
      xAxes:[{ticks: {min: xMin, max:xMax}}]
    }
  },
});

function startSampling(){
    sendMessageToServer('Chart','On')
}

export function addElemets(input){
    if(isInitialize)
        resetValues()
    graphRealTime(input)
}

function graphRealTime(input){
    
    graphBtn.classList.add("disabled")    
    sliderZoomOnPauseX.disabled =true
    sliderZoomRealTimeX.disabled=false

    pauseButton.classList.remove("disabled")
    let chartX=xValues;
    let chartY=yValues  
    if(LIMIT_SAMPLES===chartX.length){
        chartX.shift()
        chartY.shift()
    }
    if(chartX.length>=LIMIT_VALUES){
        chart.options.scales.xAxes[0].ticks.min+=1;      
        chart.update()       
    }
    chart.options.scales.xAxes[0].ticks.max+=1;  

    chartX.push(time)    
    chartY.push(input)
    previousMax=chart.options.scales.xAxes[0].ticks.max;
    previousMin=chart.options.scales.xAxes[0].ticks.min
    ++time;    
    chart.update()
}

function pauseGraph(){
    graphBtn.classList.remove("disabled")
    pauseButton.classList.add("disabled")
    sliderZoomOnPauseX.disabled =false
    sliderZoomRealTimeX.disabled=true
    sendMessageToServer('Chart','Off')
    isInitialize=true
}

function zoomChart(){
    let val=sliderZoomRealTimeX.value
    let number=parseInt(val)
    modifyChart(number)
    ZOOM_CENTER=number
}
function modifyChart(limit){       
    if(limit>ZOOM_CENTER){
        let incrementsCounts=limit-ZOOM_CENTER   
        for(let i=0;i<incrementsCounts;i++) {
            chart.options.scales.xAxes[0].ticks.min+=1;
            chart.update()
        }
    }
    else {
        let incrementsCounts=ZOOM_CENTER-limit
        for(let i=0;i<incrementsCounts;i++) {
            chart.options.scales.xAxes[0].ticks.min-=1;
            chart.update()
        }
    }
}

function zoomChartY(){
    let val=sliderZoomY.value
    let number=parseInt(val)
    chart.options.scales.yAxes[0].ticks.min=-number
    chart.options.scales.yAxes[0].ticks.max=30+number
    chart.update()
}
function zoomChartOnPauseCenter(){
    let val=sliderZoomOnPauseX.value
    let number=parseInt(val)    
    modifyInPause(number)
    OFFSET=number
}
function modifyInPause(limit){
    if(limit>OFFSET){
        let incrementsCounts=limit-OFFSET           
        for(let i=0;i<incrementsCounts;i++) {
            chart.options.scales.xAxes[0].ticks.min+=1;            
            chart.options.scales.xAxes[0].ticks.max-=1;            
            chart.update() 
        }
    }
    else {
        let incrementsCounts=OFFSET-limit
        for(let i=0;i<incrementsCounts;i++) {
            chart.options.scales.xAxes[0].ticks.min-=1;
            chart.options.scales.xAxes[0].ticks.max+=1;
            chart.update()
        }
    }
}
function resetValues(){
    chart.options.scales.xAxes[0].ticks.max=previousMax
    chart.options.scales.xAxes[0].ticks.min=previousMin
    chart.update()
    sliderZoomOnPauseX.value=POSITION_CENTER
}
function moveGraphics(){
    let val=sliderPosition.value
    let number=parseInt(val)
    if(number>POSITION_CENTER){
        let incrementsCounts=number-POSITION_CENTER
        for(let i=0;i<incrementsCounts;i++) {
            chart.options.scales.xAxes[0].ticks.max+=1;
            chart.options.scales.xAxes[0].ticks.min+=1;           
            chart.update()
        }
    }else{
        let incrementsCounts=POSITION_CENTER-number
        for(let i=0;i<incrementsCounts;i++) {
            chart.options.scales.xAxes[0].ticks.max-=1;
            chart.options.scales.xAxes[0].ticks.min-=1;           
            chart.update() 
        }
    }
    POSITION_CENTER=number
}