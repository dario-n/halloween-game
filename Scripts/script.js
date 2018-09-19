//Interfaz
var btnStart = document.getElementById('start');
var lblCountdown = document.getElementById('countdown');
var lblLvlActual = document.getElementById('lvlActual');

//Mouse
var mousePosX = 0;
var mousePosY = 0;
var mousedontmove = true;

//Canvas 1
var tablero = document.getElementById('tablero');
var ctx = tablero.getContext('2d');

//Cuenta Regresiva
var lvlTime = 10;
var timer;


//Objeto Scarecrow
var Scarecrow = { 
    ladoR: document.getElementById('enemigoR'),
    ladoL: document.getElementById('enemigoL'),
    enemigoActual: document.getElementById('enemigoR'),
    lastPosX: 0,
    lastPosY: 0,
    velocidad: 2,

    actualizarPosX: function (posX) {

        if (this.lastPosX > posX) {
            this.enemigoActual = this.ladoL;
            ctx.clearRect(0, 0, tablero.width, tablero.height);
            this.lastPosX -= this.velocidad;
            ctx.drawImage(this.enemigoActual, this.lastPosX, this.lastPosY, 48, 48);
        }
        else if (this.lastPosX < posX) {
            this.enemigoActual = this.ladoR;  
            ctx.clearRect(0, 0, tablero.width, tablero.height);
            this.lastPosX += this.velocidad;
            ctx.drawImage(this.enemigoActual, this.lastPosX, this.lastPosY, 48, 48);
        }
        mousedontmove = true;
    },

    actualizarPosY: function (posY) {

        if (this.lastPosY > posY) {
            ctx.clearRect(0, 0, tablero.width, tablero.height);
            this.lastPosY -= this.velocidad;
            ctx.drawImage(this.enemigoActual, this.lastPosX, this.lastPosY, 48, 48);
        }
        else if (this.lastPosY < posY) {
            ctx.clearRect(0, 0, tablero.width, tablero.height);
            this.lastPosY += this.velocidad;
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

//Otros
var godmode = true
var lvlActual = 1;

document.oncontextmenu = function () {
    return false;
}

function init() {
    tablero.removeEventListener("mousemove", drawScarecrow);
    tablero.removeEventListener('mouseleave', perder);
    clearInterval(actualizarScarecrow_Interval);
    clearInterval(actualizarFantasmas_Interval);
    clearInterval(timer);
    mousePosX = 800;
    mousePosY = 500;
    Scarecrow.lastPosX = 0;
    Scarecrow.lastPosY = 0;
    checkLevel();
    btnStart.style.visibility = 'visible';
    lblLvlActual.innerText = "Nivel: " + lvlActual;
    godmode = true;
}

function checkLevel() {
    if (lvlActual <= 5) {
        lvlTime = 10;
    }
    else if (lvlActual <= 10) {
        lvlTime = 15;
        Scarecrow.velocidad += 1;
    }
    else if (lvlActual <= 15) {
        lvlTime = 20;
        Scarecrow.velocidad += 1;
    }
    else if (lvlActual <= 20) {
        lvlTime = 25;
        Scarecrow.velocidad += 1;
    }
    else if (lvlActual > 20) {
        lvlTime = 30;
        Scarecrow.velocidad += 1;
    }
}

function getRandomX() {
    var rndX = Math.floor(Math.random() * escenario.width);

    if (rndX >= escenario.width - 48) {
        rndX -= 48;
    }
    else if (rndX <= 0) {
        rndX += 48;
    }
    return rndX;
}

function getRandomY() {
    var rndY = Math.floor(Math.random() * escenario.height);

    if (rndY >= escenario.height - 48) {
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
        if (!godmode) {
            Scarecrow.detectar();
        }
}

function actualizarScarecrow() {

    if (mousedontmove) {
        Scarecrow.actualizarPosY(mousePosY);
        Scarecrow.actualizarPosX(mousePosX);
        if (!godmode) {
            Scarecrow.detectar();
        }
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
        dx: Math.floor((Math.random() * 3) + 3),
        dy: Math.floor((Math.random() * 3) + 3),

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
        if (!godmode) {
            fantasma.detectar();
        }
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
        lvlActual++;
    }
}

function perder() {
    ctx2.clearRect(0, 0, escenario.width, escenario.height);
    ctx.clearRect(0, 0, tablero.width, tablero.height);
    fantasmas = [];
    lvlActual = 1;
    init();
}


function startGame() {
    init();
    tablero.addEventListener('mousemove', drawScarecrow);
    tablero.addEventListener('mouseleave', perder);
    btnStart.style.visibility = 'hidden';
    lblCountdown.innerText = "00:" + lvlTime;
    actualizarScarecrow_Interval = setInterval(actualizarScarecrow, 30);
    crearFantasma();
    actualizarFantasmas_Interval = setInterval(actualizarFantasmas, 30);
    timer = setInterval(countDown, 1000);
    setTimeout(function () { godmode = false; }, 1500);
}

btnStart.onclick = startGame;
