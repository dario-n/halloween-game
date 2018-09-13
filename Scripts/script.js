var tablero = document.getElementById('tablero');
var enemigoR = document.getElementById('enemigoR');
var enemigoL = document.getElementById('enemigoL');
var ctx = tablero.getContext("2d");
var x = tablero.width - 32;
var y = tablero.height - 32;
var lastPosX = 0;
var lastPosY = 0;
var nextPosX = 0;
var nextPosY = 0;
var mousedontmove = true;
var enemigoActual = enemigoR;


tablero.addEventListener("mousemove", function () {
    nextPosX = event.offsetX;
    nextPosY = event.offsetY;
    mousedontmove = false;
    actualizarPosY(nextPosY);
    actualizarPosX(nextPosX);
});

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