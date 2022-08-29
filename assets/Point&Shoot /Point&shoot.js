const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
let CANVAS_WIDTH = canvas.width = window.innerWidth;
let CANVAS_HEIGHT = canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
let collisionCanvas_WIDTH = collisionCanvas.width = window.innerWidth;
let collisionCanvas_HEIGHT = collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0; // tiempo para el próximo cuervo
let ravenInterval = 500; // Intervalo de cuervo
let lastTime = 0; // ultima vez

let ravens = [];
let score = 0;
ctx.font = 'bold 48px serif'
let gameOver = false;

class Raven {
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeigth = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.3; // tamaño de raven
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeigth * this.sizeModifier;
        this.x = CANVAS_WIDTH;
        this.y = Math.random() * (CANVAS_HEIGHT -this.height);
        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = './raven.png';
        this.frame = 0; 
        this.maxFrame = 4; 
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50; // velocidad de fotograma
        this.randomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = `rgb(${this.randomColor[0]}, ${this.randomColor[1]}, ${this.randomColor[2]})`
        this.hasTrail = Math.random() > 0.5;
    }
    update(deltatime){
        if(this.y < 0 || this.y > CANVAS_HEIGHT - this.height){
            this.directionY = this.directionY * -1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;

        if(this.x < 0 - this.width) this.markedForDeletion = true;
        this.timeSinceFlap += deltatime;

        if(this.timeSinceFlap > this.flapInterval){
            if(this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap = 0;
            if(this.hasTrail){
                for(let i = 0; i < 5; i++){
                    particles.push(new Particle(this.x, this.y, this.width, this.color))
                }
            }
        }
    }
    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image,this.frame*this.spriteWidth, 0, this.spriteWidth , this.spriteHeigth, this.x, this.y, this.width, this.height)
    }
}

let explosion = [];
class Explosion {
    constructor(x,y,size){
        this.image = new Image();
        this.image.src = '../../public/image/boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = '../../public/SoundEffect/boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInteval = 100;
        this.markedForDeletion = false;
    }
    update(deltatime){
        if (this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        if(this.timeSinceLastFrame > this.frameInteval){
            this.frame++;
            this.timeSinceLastFrame = 0;
            if(this.frame > 5) this.markedForDeletion = true;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size)
    }

}
let particles = [];
class Particle {
    constructor(x, y, size, color){
        this.size = size;
        this.x = x + this.size/2 + Math.random() * 50 -25;
        this.y = y + this.size/3 + Math.random() * 50 -25;
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }
    update(){
        this.x += this.speedX;
        this.radius += 0.5;
        if (this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius/this.maxRadius;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

drawScore = () => {
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 53, 77);
}

drawGameOver = () => {
    ctx.textAlign = 'center'
    console.log('game over')
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, your score is ' + score, CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, your score is ' + score, CANVAS_WIDTH/2+2.5, CANVAS_HEIGHT/2+2.5);
}

window.addEventListener('click', (e)=>{
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    if(detectPixelColor.data[0] === 0) gameOver = true;

    console.log(detectPixelColor.data[0])
    const pc = detectPixelColor.data;
    ravens.forEach(object => {
        if(object.randomColor[0] === pc[0] && object.randomColor[1] === pc[1] && object.randomColor[2] === pc[2]){
            // collision detected
            object.markedForDeletion = true;
            score++;
            explosion.push(new Explosion(object.x, object.y, object.width))
           // console.log(explosion)
        }
    })
} )


animate = (timestamp) => {
    ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    collisionCtx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
    let deltatime = timestamp - lastTime; // tiempo delta
    lastTime = timestamp; 
    timeToNextRaven += deltatime;
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;

        ravens.sort( function(a,b){
         return a.width - b.width
        });
    };
    drawScore();
    //array literal 
    // spread operator
    // llamer metodos a la vez¡
    [...particles, ...ravens, ...explosion].forEach(object => object.update(deltatime));
    [...particles, ...ravens, ...explosion].forEach(object => object.draw());
    // ! es falso
    ravens = ravens.filter(object => !object.markedForDeletion); 
    explosion = explosion.filter(object => !object.markedForDeletion); 
    particles = particles.filter(object => !object.markedForDeletion); 

   
   if(!gameOver) requestAnimationFrame(animate)
   else drawGameOver();
}
animate(0)