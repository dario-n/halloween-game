//Canvas 1
var tablero = document.getElementById('tablero');
var ctx = tablero.getContext('2d');

var enemigoR = document.getElementById('enemigoR');
var enemigoL = document.getElementById('enemigoL');
var enemigoActual = enemigoR;

var lastPosX = 0;
var lastPosY = 0;
var nextPosX = 0;
var nextPosY = 0;

var mousedontmove = true;

//Canvas 2
var escenario = document.getElementById('escenario');
var ctx2 = escenario.getContext('2d');

var fantasmaR = document.getElementById('fantasmaR');
var fantasmaL = document.getElementById('fantasmaL');
var fantasmaActual = fantasmaR;
var lastPosXFantasma = Math.floor(Math.random() * escenario.width - 48);
var lastPosYFantasma = Math.floor(Math.random() * escenario.height - 48);


//Canvas 1
tablero.addEventListener('mousemove', drawScarecrow);

function drawScarecrow() {
        nextPosX = event.offsetX;
        nextPosY = event.offsetY;
        mousedontmove = false;
        actualizarPosY(nextPosY);
        actualizarPosX(nextPosX);
}

/*setInterval(function () {

    if (mousedontmove) {
        actualizarPosY(nextPosY);
        actualizarPosX(nextPosX);
    }

}, 10);*/

function actualizarPosY(posY) {

    if (lastPosY > posY) {
        ctx.clearRect(0, 0, tablero.width, tablero.height);
        lastPosY -= 3
        ctx.drawImage(enemigoActual, lastPosX, lastPosY, 48, 48);
    }

    else if (lastPosY < posY) {
        ctx.clearRect(0, 0, tablero.width, tablero.height);
        lastPosY += 3
        ctx.drawImage(enemigoActual, lastPosX, lastPosY, 48, 48);

    }
    mousedontmove = true;
}

function actualizarPosX(posX) {

    if (lastPosX > posX) {
        enemigoActual = enemigoL;
        ctx.clearRect(0, 0, tablero.width, tablero.height);
        lastPosX -= 3
        ctx.drawImage(enemigoActual, lastPosX, lastPosY, 48, 48);

    }
    else if (lastPosX < posX) {
        enemigoActual = enemigoR;
        ctx.clearRect(0, 0, tablero.width, tablero.height);
        lastPosX += 3
        ctx.drawImage(enemigoActual, lastPosX, lastPosY, 48, 48);

    }
    mousedontmove = true;
}

//Canvas 2
function drawFantasma () {
    ctx2.clearRect(0, 0, escenario.width, escenario.height);
    ctx2.drawImage(fantasmaActual, lastPosXFantasma, lastPosYFantasma, 48, 48);
    lastPosXFantasma += 2;
    lastPosYFantasma += 2;
}


function detectar() {
    if (nextPosX > lastPosXFantasma && nextPosX < lastPosXFantasma + 48 && nextPosY > lastPosYFantasma && nextPosY < lastPosYFantasma + 48) {
        perder();
    }
}
var fin = setInterval(detectar, 10);
var fantasmas = setInterval(drawFantasma, 30);

function perder() {
    ctx2.clearRect(0, 0, escenario.width, escenario.height);
    ctx.clearRect(0, 0, tablero.width, tablero.height);
    console.log('h');
    clearInterval(fin);
    clearInterval(fantasmas);
    tablero.removeEventListener("mousemove", drawScarecrow);
}

