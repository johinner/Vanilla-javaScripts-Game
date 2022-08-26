let playerState = 'dizzy';
const dropdown = document.getElementById('animations'); // Desplegable
dropdown.addEventListener('change',(e)=>{
  playerState = e.target.value;
})

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

const playerImage = new Image();
playerImage.src = "./shadow_dog.png"
const spriteWhidth = 575; // ancho de sprite
const spriteHeight = 523; // alto de sprite


let gameFrame = 0; // marco del juego
const staggerFrames = 5; // marcos escalonados
const spriteAnimations = []; // animaciones de sprites
const animationStates = [
  {
    name: 'idle',// inactivo
    frames: 7
  },
  {
    name: 'jump',// salto
    frames: 7
  },
  {
    name: 'fall', // caida
    frames: 7
  },
  {
    name: 'run', // correr
    frames: 9
  },
  {
    name: 'dizzy', // mareado
    frames: 11
  },
  {
    name: 'sit', // sentar
    frames: 5
  },
  {
    name: 'roll', // rodar
    frames: 7
  },
  {
    name: 'bite', // morder
    frames: 7
  },
  {
    name: 'ko',
    frames: 12
  },
  {
    name: 'getHit', // ser golpeado
    frames: 4
  }
] // Estados de animación

animationStates.forEach((state, index) => {
  let frames = {
    loc: [] // ubicacion
  }
  for (let i = 0; i < state.frames; i++){
    let positionX = i * spriteWhidth;
    let positionY = index * spriteHeight;
    frames.loc.push({x: positionX, y: positionY});
  }
  spriteAnimations[state.name] = frames;
});
console.log(animationStates)

const animate = () => {
  // Borra el canvas (desde x y, hasta x y)
   ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
   // ctx.fillRect(100,50,100,100);   

  // math.floor elimina los decimales
  let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[playerState].loc.length;

  let frameX = spriteWhidth * position;
  let frameY = spriteAnimations[playerState].loc[position].y;
   /* ctx.drawImage(image, sx, sy, sw , sh, dx, dy , dw, dh);
      => Desdepues de la img los primeros 4 valores determina el area de recortado
      => Los otros 4 valores determina donde ubicara ese recorte */ 
   ctx.drawImage(playerImage, frameX, frameY, spriteWhidth, spriteHeight, 0, 0, spriteWhidth, spriteHeight);
  // % operador de resto devuelve el resto cuando dividimos el primero numero por el segundo.

  // Este condicional entrara cada 5 llamados a la funcion y cambiara la posicion en x de la img

  //  if(gameFrame % staggerFrames === 0){
  //   if (frameX < 6) frameX++;
  //   else frameX = 0;
  //  }

   gameFrame++;
   // Llama la funcion una y otra vez
   requestAnimationFrame(animate);
};
animate();
