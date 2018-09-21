//Interfaz
var btnStart = document.getElementById('start');
var btnEnviar = document.getElementById('enviar');
var btnCancelar = document.getElementById('cancelar');

var lblCountdown = document.getElementById('countdown');
var lblLvlActual = document.getElementById('lvlActual');

var txtNombre = document.getElementById('nombre');
var divSubmit = document.getElementById('divSubmit');

var tblPosiciones = document.getElementById('posiciones');

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
var posiciones = [];

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
    lblLvlActual.innerText = "Nivel: " + lvlActual;
    godmode = true;
}

function checkLevel() {
    if (lvlActual <= 5) {
        lvlTime = 10;
        Scarecrow.velocidad = 2;
    }
    else if (lvlActual <= 10) {
        lvlTime = 15;
        Scarecrow.velocidad = 3;
    }
    else if (lvlActual <= 15) {
        lvlTime = 20;
        Scarecrow.velocidad = 4;
    }
    else if (lvlActual <= 20) {
        lvlTime = 25;
        Scarecrow.velocidad = 5;
    }
    else if (lvlActual > 20) {
        lvlTime = 30;
        Scarecrow.velocidad = 6;
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

    var Fantasma = {
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
        btnStart.style.visibility = 'visible';
    }
}

function perder() {
    ctx2.clearRect(0, 0, escenario.width, escenario.height);
    ctx.clearRect(0, 0, tablero.width, tablero.height);
    divSubmit.style.visibility = "visible";
    fantasmas = [];
    btnStart.style.visibility = 'hidden';
    init();
}


function startGame() {
    init();
    tablero.addEventListener('mousemove', drawScarecrow);
    tablero.addEventListener('mouseleave', perder);
    btnStart.style.visibility = 'hidden';
    divSubmit.style.visibility = 'hidden';
    lblCountdown.innerText = "00:" + lvlTime;
    actualizarScarecrow_Interval = setInterval(actualizarScarecrow, 15);
    crearFantasma();
    actualizarFantasmas_Interval = setInterval(actualizarFantasmas, 30);
    timer = setInterval(countDown, 1000);
    setTimeout(function () { godmode = false; }, 1500);
}

function ordenarPosiciones() {
    posiciones = posiciones.sort(function (a, b) {
        var nivelA = a.Nivel;
        var nivelB = b.Nivel;

        if (nivelA < nivelB) {
            return 1;
        }
        if (nivelA > nivelB) {
            return -1;
        }
    });
}

function actulizarTablaPosiciones() {
    var tbody = document.createElement('tbody');

    ordenarPosiciones();

    posiciones.forEach(function (jugador) {
        var tr = document.createElement('tr');
        var tdName = document.createElement('td');
        var tdLvl = document.createElement('td');
        var tdName_text = document.createTextNode(jugador.Nombre);
        var tdLvl_text = document.createTextNode(jugador.Nivel);
        tdName.appendChild(tdName_text);
        tdLvl.appendChild(tdLvl_text);
        tr.appendChild(tdName);
        tr.appendChild(tdLvl);
        tbody.appendChild(tr)
    });
    tblPosiciones.appendChild(tbody);
}

function validar() {
    var valids = /^[A-Za-z0-9]+$/;
    if (txtNombre.value.trim().length > 0 && txtNombre.value.trim().length <= 10 && txtNombre.value.trim().match(valids)) {
        agregarPuntaje();
    }
    else {
        txtNombre.value = "";
        alert('puto');
    }
}

function agregarPuntaje() {
    var r = new XMLHttpRequest();
    var registro = {
        Nombre: txtNombre.value,
        Nivel: lvlActual
    };

    lvlActual = 1;
    btnStart.style.visibility = 'visible';
    posiciones.push(registro);

    ordenarPosiciones();

    r.open("POST", "http://10.11.12.122:5000/api/values", false);
    r.setRequestHeader('Content-Type', 'application/json');
    r.send(JSON.stringify(posiciones));
    tblPosiciones.querySelector('tbody').remove();
    leerPuntajes();
    txtNombre.value = "";
    divSubmit.style.visibility = 'hidden';

}

function leerPuntajes() {
    var r = new XMLHttpRequest();
    r.open("GET", "http://10.11.12.122:5000/api/values" , true);
    r.onreadystatechange = function () {
        if (r.readyState === 4 && r.status === 200) {
            var allText = r.responseText;
            var jugadores = JSON.parse(allText);
            
            if (jugadores.length > 0) {
                posiciones = jugadores;
                actulizarTablaPosiciones();
            }
        }
    }
    r.send();
}



btnCancelar.onclick = function () {
    lvlActual = 1;
    divSubmit.style.visibility = 'hidden';
    btnStart.style.visibility = 'visible';
}

leerPuntajes();
btnEnviar.onclick = validar;
btnStart.onclick = startGame;

setInterval(function () { tblPosiciones.querySelector('tbody').remove(); }, 3001);
var actualizar = setInterval(leerPuntajes, 3000);

