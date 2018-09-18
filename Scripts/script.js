//Interfaz
var btnStart = document.getElementById('start');
var lblCountdown = document.getElementById('countdown');

//Mouse
var mousePosX = 0;
var mousePosY = 0;
var mousedontmove = true;

//Canvas 1
var tablero = document.getElementById('tablero');
var ctx = tablero.getContext('2d');

//Cuenta Regresiva
var lvlTime = 15;
var timer;


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
        if (mousePosX >= this.lastPosX - 3 && mousePosX < this.lastPosX + 48 && mousePosY >= this.lastPosY - 3 && mousePosY < this.lastPosY + 48) {
            perder();
        }
    }
};
var actualizarScarecrow_Interval;

//Canvas 2
var escenario = document.getElementById('escenario');
var ctx2 = escenario.getContext('2d');

//Fantasmas
var fantasmas = [];
var actualizarFantasmas_Interval;


function init() {
    tablero.removeEventListener("mousemove", drawScarecrow);
    clearInterval(actualizarScarecrow_Interval);
    clearInterval(actualizarFantasmas_Interval);
    clearInterval(timer);
    mousePosX = 0;
    mousePosY = 0;
    Scarecrow.lastPosX = getRandomX();
    Scarecrow.lastPosY = getRandomY();
    lvlTime = 15;
    btnStart.style.visibility = 'visible';
}

function getRandomX() {
    var rndX = Math.floor(Math.random() * escenario.width);

    if (rndX >= escenario.width) {
        rndX -= 48;
    }
    else if (rndX <= 0) {
        rndX += 48;
    }
    return rndX;
}

function getRandomY() {
    var rndY = Math.floor(Math.random() * escenario.height);

    if (rndY >= escenario.height) {
        rndY -= 48;
    }
    else if (rndY <= 0) {
        rndY += 48;
    }
    return rndY;
}
    
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


//Canvas 2
function crearFantasma() {

    Fantasma = {
        ladoR: document.getElementById('fantasmaR'),
        ladoL: document.getElementById('fantasmaL'),
        enemigoActual: document.getElementById('fantasmaR'),
        lastPosX: getRandomX(),
        lastPosY: getRandomY(),
        dx: 2,
        dy: 2,

        cambiarLado: function () {
            if (this.enemigoActual == this.ladoR) {
                this.enemigoActual = this.ladoL;
            }
            else {
                this.enemigoActual = this.ladoR;
            }
        },
        actualizarPos: function () {
            if (this.lastPosX + this.dx > escenario.width - 48 || this.lastPosX + this.dx < 0) {
                this.dx = -this.dx;
                this.cambiarLado();
            }
            if (this.lastPosY + this.dy > escenario.height - 48 || this.lastPosY + this.dy < 0) {
                this.dy = -this.dy;
            }
            ctx2.drawImage(this.enemigoActual, this.lastPosX, this.lastPosY, 48, 48);
            this.lastPosX += this.dx;
            this.lastPosY += this.dy;
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

function countDown() {
    lvlTime--;
    if (lvlTime >= 10) {
        lblCountdown.innerText = "00:" + lvlTime;
    }
    else {
        lblCountdown.innerText = "00:0" + lvlTime;
    }

    if (lvlTime == 0) {
        init();
    }
}

function perder() {
    ctx2.clearRect(0, 0, escenario.width, escenario.height);
    ctx.clearRect(0, 0, tablero.width, tablero.height);
    fantasmas = [];
    init();
}


function startGame() {
    btnStart.style.visibility = 'hidden';
    lblCountdown.innerText = "00:" + lvlTime;
    tablero.addEventListener('mousemove', drawScarecrow);
    actualizarScarecrow_Interval = setInterval(actualizarScarecrow, 30);
    crearFantasma();
    actualizarFantasmas_Interval = setInterval(actualizarFantasmas, 30);
    timer = setInterval(countDown, 1000);
}

btnStart.onclick = startGame;
