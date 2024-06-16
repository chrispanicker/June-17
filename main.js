var Engine = Matter.Engine,
Render = Matter.Render,
Runner = Matter.Runner,
Composites = Matter.Composites,
Common = Matter.Common,
MouseConstraint = Matter.MouseConstraint,
Mouse = Matter.Mouse,
Composite = Matter.Composite,
Bodies = Matter.Bodies,
Svg=Matter.Svg,
Vertices=Matter.Vertices;

var engine = Engine.create(),
world = engine.world;

// let gyroscope = new Gyroscope({ frequency: 60 });

// gyroscope.addEventListener("reading", (e) => {
//     console.log(`Angular velocity along the X-axis ${gyroscope.x}`);
//     console.log(`Angular velocity along the Y-axis ${gyroscope.y}`);
//     console.log(`Angular velocity along the Z-axis ${gyroscope.z}`);
// });
// gyroscope.start();

engine.gravity.x=0
engine.gravity.y=1


var render = Render.create({
    element: document.querySelector("#canvas"),
    engine: engine,
    options: {
        background:"none",
        width: 800,
        height: 600,
        // showAngleIndicator: true,
        wireframes: false,
    }
});

Render.run(render);

var runner = Runner.create();
Runner.run(runner, engine);

var boxA=Bodies.rectangle(400, 200, 64, 64,{
    render:{
        fillStyle: "red"
    }
})

let svgBody;
const path = document.querySelector("#svg");
let vertices = Svg.pathToVertices(path);
let scaleFactor = (800* .1)/100;

vertices = Vertices.scale(vertices,scaleFactor,scaleFactor);
svgBody = Bodies.fromVertices(
    300,
    200,
    [vertices],
    {
        render:{
            fillStyle: "black"
        }
    }
)

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



Composite.add(world, [
    // walls
    Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
    Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
    Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
    boxA,
    svgBody
]);

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

render.mouse = mouse;


Composite.add(world, mouseConstraint);
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});