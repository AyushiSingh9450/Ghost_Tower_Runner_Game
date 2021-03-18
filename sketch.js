var PLAY = 1;
var END = 0;
var gameSate = PLAY;

var tower, tower_image;
var ghost, ghost_standing, ghost_jumping;
var wall1, wall2;
var door, door_image;
var climber, climber_image;

var spookySound;
var invi;

function preload() {

  //Images
  tower_image = loadImage("tower.png");

  ghost_jumping = loadImage("ghost-jumping.png");
  ghost_standing = loadImage("ghost-standing.png");

  door_image = loadImage("door.png");

  climber_image = loadImage("climber.png");

  //loading sound
  spookySound = loadSound("spooky.wav")
}

function setup() {
  createCanvas(600, 600);

  //creating tower
  tower = createSprite(300, 300);
  tower.addImage(tower_image);
  tower.velocityY = 4;

  //creating ghost
  ghost = createSprite(300, 300);
  ghost.addImage(ghost_standing);
  ghost.velocityY = 4;
  ghost.scale = 0.5;
  ghost.debug = true;
  ghost.setCollider("aabb", 0, 0, 100, 150);

  //invisible walls
  wall1 = createSprite(75, 300, 10, 600);
  wall1.visible = false;

  wall2 = createSprite(525, 300, 10, 600);
  wall2.visible = false;

  //creating groups
  doorsgroup = createGroup();
  climbersgroup = createGroup();
  invisiblegroup = createGroup();
}

function draw() {
  background("White");

  //colliding the ghost
  ghost.collide(wall1);
  ghost.collide(wall2);

  //gamestate conditions
  if (gameState === PLAY) {
    
    //adding the function here
    spawndoors();
    
    //colliding the ghost here
    ghost.collide(climbersgroup);

    //key conditional statements added here
    if (keyDown("left")) {
      ghost.x -= 10;
    }
    if (keyDown("right")) {
      ghost.x += 10;
    }
    if (keyDown("Space")) {
      ghost.y -= 10;
    }

    //playing the sound here
    if (frameCount % 105 === 0) {
      playSound(spookySound);
    }
    
    //moving background
    if (tower.y > 600) {
      tower.y = 300;
    }
    //changing to END state
    if (ghost.isTouching(invisiblegroup) || ghost.y > 600) {
      gameSate = END;
    }


  } else(gameState === END){
    
    //destroying the background
    tower.destroy();
    
    //destroying sprites
    ghost.destroy();
    doorsgroup.destroyEach();
    climbersgroup.destroyEach();
    
    //destroying walls
    wall1.destroy();
    wall2.destroy();

    //adding text
    background("Black");
    textSize(50);
    fill("White");
    text("GameOver!", 150, 300);
    
  }
    
    
  
  drawSprites();
}

function spawndoors() {

  if (frameCount % 107 === 0) {

    //creating doors
    door = createSprite(Math.round(random(80, 520)), 0);
    door.addImage(door_image);
    door.velocityY = 3;
    doorsgroup.add(door);

    //creating climbers with doors
    climber = createSprite(door.x, door.y + 50);
    climber.addImage(climber_image);
    climber.velocityY = 3;
    climber.lifetime = 200;
    climbersgroup.add(climber);

    //creating invisible ground
    invi = createSprite(door.x, climber.y + 10, climber.width, 10);
    invi.velocityY = climber.velocityY;
    invi.visible = false;
    invisiblegroup.add(invi);
  }
}