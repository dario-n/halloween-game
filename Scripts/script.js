//Botones
var btnStart = document.getElementById('start');

//Mouse
var mousePosX = 0;
var mousePosY = 0;
var mousedontmove = true;

//Canvas 1
var tablero = document.getElementById('tablero');
var ctx = tablero.getContext('2d');

var actualizarScarecrow_Interval;

//Objeto Scarecrow
var Scarecrow = { 
    ladoR: document.getElementById('enemigoR'),
    ladoL: document.getElementById('enemigoL'),
    enemigoActual: document.getElementById('enemigoR'),
    lastPosX: 0,
    lastPosY: 0,

    actualizarPosX: function (posX) {

        if (this.lastPosX > posX) {
            this.enemigoActual = this.ladoL;
            ctx.clearRect(0, 0, tablero.width, tablero.height);
            this.lastPosX -= 3
            ctx.drawImage(this.enemigoActual, this.lastPosX, this.lastPosY, 48, 48);
        }
        else if (this.lastPosX < posX) {
            this.enemigoActual = this.ladoR;  
            ctx.clearRect(0, 0, tablero.width, tablero.height);
            this.lastPosX += 3
            ctx.drawImage(this.enemigoActual, this.lastPosX, this.lastPosY, 48, 48);
        }
        mousedontmove = true;
    },

    actualizarPosY: function (posY) {

        if (this.lastPosY > posY) {
            ctx.clearRect(0, 0, tablero.width, tablero.height);
            this.lastPosY -= 3
            ctx.drawImage(this.enemigoActual, this.lastPosX, this.lastPosY, 48, 48);
        }
        else if (this.lastPosY < posY) {
            ctx.clearRect(0, 0, tablero.width, tablero.height);
            this.lastPosY += 3
            ctx.drawImage(this.enemigoActual, this.lastPosX, this.lastPosY, 48, 48);
        }
        mousedontmove = true;
    },

    detectar: function () {
        if (mousePosX > this.lastPosX && mousePosX < this.lastPosX + 48 && mousePosY > this.lastPosY && mousePosY < this.lastPosY + 48) {
            perder();
        }
    }
};


//Canvas 2
var escenario = document.getElementById('escenario');
var ctx2 = escenario.getContext('2d');


var fantasmas = [];





//tablero.addEventListener('mousemove', drawScarecrow);
    
function drawScarecrow() {
        mousePosX = event.offsetX;
        mousePosY = event.offsetY;
        mousedontmove = false;
        Scarecrow.actualizarPosY(mousePosY);
        Scarecrow.actualizarPosX(mousePosX);
        Scarecrow.detectar();
}

function actualizarScarecrow() {

    if (mousedontmove) {
        Scarecrow.actualizarPosY(mousePosY);
        Scarecrow.actualizarPosX(mousePosX);
        Scarecrow.detectar();
    }
}

//actualizarScarecrow_Interval = setInterval(actualizarScarecrow, 30);



//Canvas 2
function crearFantasma() {

    Fantasma = {
        ladoR: document.getElementById('fantasmaR'),
        ladoL: document.getElementById('fantasmaL'),
        enemigoActual: document.getElementById('fantasmaR'),
        lastPosX: Math.floor(Math.random() * escenario.width - 48),
        lastPosY: Math.floor(Math.random() * escenario.height - 48),

        actualizarPos: function () {
            ctx2.drawImage(this.enemigoActual, this.lastPosX, this.lastPosY, 48, 48);
            this.lastPosX += 2;
            this.lastPosY += 2;
        },

        detectar: function () {
            if (mousePosX > this.lastPosX && mousePosX < this.lastPosX + 48 && mousePosY > this.lastPosY && mousePosY < this.lastPosY + 48) {
                perder();
            }
        }
    };
    ctx2.drawImage(Fantasma.enemigoActual, Fantasma.lastPosX, Fantasma.lastPosY, 48, 48);
    fantasmas.push(Fantasma);
}

function actualizarFantasmas() {
    ctx2.clearRect(0, 0, escenario.width, escenario.height);
    fantasmas.forEach(function (fantasma) {
        fantasma.actualizarPos();
        fantasma.detectar();
    });
}


function perder() {
    ctx2.clearRect(0, 0, escenario.width, escenario.height);
    ctx.clearRect(0, 0, tablero.width, tablero.height);
    console.log('h');
    tablero.removeEventListener("mousemove", drawScarecrow);
    clearInterval(actualizarScarecrow_Interval);
}


function startGame() {
    tablero.addEventListener('mousemove', drawScarecrow);
    actualizarScarecrow_Interval = setInterval(actualizarScarecrow, 30);
}

btnStart.onclick = startGame;
