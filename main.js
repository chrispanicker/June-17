var px = 50; // Position x and y
var py = 50;
var vx = 0.0; // Velocity x and y
var vy = 0.0;
var updateRate = 1/60; 
var index = 0;
let rotation, leftToRight = 0;
let frontToBack = 1;
let xGravity = 0;
let yGravity = 1;

let color2 = "rgb(37, 63, 36)";
let color = "rgb(195, 255, 0)"

function map (n, start1, stop1, start2, stop2, withinBounds) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return this.constrain(newval, start2, stop2);
  } else {
    return this.constrain(newval, stop2, start2);
  }
};

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
  }

async function requestDeviceOrientation(){
    document.querySelector("#permissions").remove()
    if(typeof DeviceOrientationEvent != 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function'){
        //ios 13+
        try{
            const permissionState = await DeviceOrientationEvent.requestPermission()
            if(permissionState ==="granted"){
                window.addEventListener('deviceorientation', handleOrientation)
            }
        }catch(error){
            console.error(error)
        }
    }else if('DeviceOrientationEvent'){
        window.addEventListener('deviceorientation', handleOrientation)
    }else{
        alert('not supported')
    }
}


var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Composites = Matter.Composites,
Constraint = Matter.Constraint,
Common = Matter.Common,
MouseConstraint = Matter.MouseConstraint,
Mouse = Matter.Mouse,
Composite = Matter.Composite,
Bodies = Matter.Bodies,
Svg=Matter.Svg,
Vertices=Matter.Vertices;

var engine = Engine.create(),
world = engine.world;

engine.gravity.x=0
engine.gravity.y= frontToBack

function handleOrientation(event){
    frontToBack = map(event.beta, -40, 40, -1, 1);
    leftToRight = map(event.gamma, -40, 40, -1, 1);
    engine.gravity.y= frontToBack
    engine.gravity.x= leftToRight
}

let canvas = document.querySelector("#canvas")

var render = Render.create({
    element: canvas,
    engine: engine,
    options: {
        background:"transparent",
        width: canvas.clientWidth,
        height: canvas.clientHeight,
        // showAngleIndicator: true,
        wireframes: false,
    }
});

Render.run(render);



var runner = Runner.create();
Runner.run(runner, engine);


let boxA, boxB, letterOffset;

if(canvas.clientWidth<720){
    boxA=Bodies.rectangle(canvas.clientWidth/2, canvas.clientHeight-60, 240, 50,{
        render:{
            fillStyle: color2
        },
        isStatic: true
    })

    boxB=Bodies.rectangle(canvas.clientWidth/2, 0+20, 240, 50,{
        render:{
            fillStyle:color2
        },
        isStatic: true
    })

    letterOffset = 0;
 }else{
    boxA=Bodies.rectangle(canvas.clientWidth/2, canvas.clientHeight-80, 365, 90,{
        render:{
            fillStyle: color2
        },
        isStatic: true
    })

    boxB=Bodies.rectangle(canvas.clientWidth/2, 0+50, 260, 50,{
        render:{
            fillStyle: color2
        },
        isStatic: true
    })
    letterOffset = -100;
 }

let letters = [document.querySelector("#S1"), document.querySelector("#E1"), document.querySelector("#L"), document.querySelector("#E2"), document.querySelector("#C"), document.querySelector("#T"), document.querySelector("#S2")];
letters.forEach((e, i)=>{
    let scaleFactor
     let vertices = Svg.pathToVertices(e);
     if(canvas.clientWidth<1080){
        scaleFactor = (800* .1)/100;
     }else{
        scaleFactor = (800* .3)/100;
     }

     vertices = Vertices.scale(vertices,scaleFactor,scaleFactor);
     let svgBody;
     if(canvas.clientWidth<1080){
        svgBody = Bodies.fromVertices(
            canvas.clientWidth/letters.length + canvas.clientWidth/letters.length*i +letterOffset, canvas.clientHeight/3,
            [vertices],
            {
                render:{
                    fillStyle: `rgb(${(i+1)* 255/letters.length}, 255, 0)`
                }
            }
         )
     }else{
        svgBody = Bodies.fromVertices(
            canvas.clientWidth/letters.length + canvas.clientWidth/letters.length*i +letterOffset, canvas.clientHeight/5*2,
            [vertices],
            {
                render:{
                    fillStyle: `rgb(${(i+1)* 255/letters.length}, 255, 0)`
                }
            }
         )
     }


     letters[i] = svgBody
})

var constraints = [];
letters.forEach((e, i)=>{
    if(i<letters.length-1){
        constraints[i] = Constraint.create({
            bodyA: letters[i],
            pointA: { x: -10, y: -10 },
            bodyB: letters[i+1],
            pointB: { x: -10, y: -10 },
            render:{
                anchors:false,
            }
        });
    }  
})

let thickness = 50;
let boundTop = Bodies.rectangle(canvas.clientWidth/2, 0-thickness/2, canvas.clientWidth, thickness, { isStatic: true, render:{
    fillStyle: color2
}, })
let boundBot = Bodies.rectangle(canvas.clientWidth/2, canvas.clientHeight+thickness/2, canvas.clientWidth, thickness, { isStatic: true, render:{
    fillStyle: color2
}, })
let boundRight = Bodies.rectangle(canvas.clientWidth+thickness/2, canvas.clientHeight/2, thickness, canvas.clientHeight, { isStatic: true, render:{
    fillStyle: color2
}, })
let boundLeft = Bodies.rectangle(0-thickness/2, canvas.clientHeight/2, thickness, canvas.clientHeight, { isStatic: true, render:{
    fillStyle: color2
}, })

var startPin, endPin;

if(canvas.clientWidth<1080){
    startPin = Constraint.create({
        pointA: { x: 50, y: canvas.clientHeight/4},
        bodyB: letters[0],
        pointB: { x: -10, y: -10 },
        damping: 1,
    });
    
   endPin = Constraint.create({
        pointA: { x: canvas.clientWidth-50, y: canvas.clientHeight/4},
        bodyB: letters[6],
        pointB: { x: -10, y: -10 },
        damping: 1,
    });
 }else{
    startPin = Constraint.create({
        pointA: { x: 50, y: canvas.clientHeight/4},
        bodyB: letters[0],
        pointB: { x: -10, y: -10 },
        damping: 1,
    });
    
    endPin = Constraint.create({
        pointA: { x: canvas.clientWidth-50, y: canvas.clientHeight/4},
        bodyB: letters[6],
        pointB: { x: -10, y: -10 },
        damping: 1,
    });
 } 



// Composite.add(world, [bodyA, bodyB, constraint]);

Composite.add(world, [
    // walls
    boundTop,
    boundBot,
    boundLeft,
    boundRight,    
    startPin,
    constraints[0],
    constraints[1],
    constraints[2],
    constraints[3],
    constraints[4],
    constraints[5],
    endPin,
    letters[0],
    letters[1],
    letters[2],
    letters[3],
    letters[4],
    letters[5],
    letters[6],

    // constraints[6],
]);


    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: canvas.clientWidth, y: canvas.clientHeight }
    });
