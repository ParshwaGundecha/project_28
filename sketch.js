const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas,baseimage,playerimage;
var palyer, playerBase, playerArcher;
var playerArrows = [];
var numberOfArrows = 10;
var board1, board2;
var score = 0;

function preload() {
  backgroundImg = loadImage("./assets/background.png");
  baseimage = loadImage("./assets/base.png");
  playerimage = loadImage("./assets/player.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);

  var options = {
    isStatic: true
  };

  playerBase = Bodies.rectangle(200, 350, 180, 150, options);
  World.add(world, playerBase);

  player = Bodies.rectangle(250, playerBase.position.y - 160, 50, 180, options);
  World.add(world,player)

  playerArcher = new PlayerArcher(
    340,
    playerBase.position.y - 112,
    120,
    120
  );

  board1 = new Board(width - 300, 330, 50, 200);
  board2 = new Board(width - 550, height - 300, 50, 200);
  
}

function draw() {
  background(backgroundImg );
  image(baseimage,playerBase.position.x,playerBase.position.y,180,150)
  image(playerimage,player.position.x,player.position.y,50,180)

  Engine.update(engine);

  playerArcher.display();

  board1.display();
  board2.display();

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

  // Arrow Count
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Remaining Arrows : " + numberOfArrows, 200, 100);
  
  //Score Count
  textAlign("center");
  textSize(30);
  text("Score:" + score,width-150,100);
  
  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();
      
      var board1collision = Matter.SAT.collides(playerArrows[i].body,board1.body);
      var board2collision = Matter.SAT.collides(playerArrows[i].body,board2.body);

      if(board1collision.collided||board2collision.collided){
        score+=5;
      }

      //[optional code to add trajectory of arrow]
      
      // var posX = playerArrows[i].body.position.x;
      // var posY = playerArrows[i].body.position.y;

      // if (posX > width || posY > height) {
      //   if (!playerArrows[i].isRemoved) {
      //     playerArrows[i].remove(i);
      //   } else {
      //     playerArrows[i].trajectory = [];
      //   }
      // }
    }
  }

  if (numberOfArrows == 0) {
    console.log("arrow bucket is empty");
    gameOver();
  }
}


function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;

      var arrow = new PlayerArrow(posX, posY, 100, 20, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}

function gameOver(){
  swal(
   {
    title:"Game Over!!!",
    text:"Thanks For Playing",
    imageUrl:
        "C:\Users\khandvikar\Downloads\project-C28-template-main\project-C28-template-main\assets\playerArcher.png",
    imageSize:"150x150",
    confirmButtonText:"Play Again",
   },
    
    function(isConfirm){
      if(isConfirm){
        location.reload();
      }
    }
  );
}