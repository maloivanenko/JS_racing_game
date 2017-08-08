function ready(){

var ctx = document.getElementById("ctx").getContext("2d");
var menu = document.getElementById("menu");
var gameover = document.getElementById("gameover");
var finishscreen = document.getElementById("finishscreen");
ctx.font = '20px Arial';
var statement = 'paused';

const HEIGHT = 600;
const WIDTH = 500;
var survivedTime = 0;

var ImgPlayer = {};
    ImgPlayer.auto = new Image();
    ImgPlayer.auto.src = 'img/playerAuto.png';

    ImgPlayer.repair = new Image();
    ImgPlayer.repair.src = 'img/repair.png';

var ImgTraffic = {}
ImgTraffic.models = new Image();
ImgTraffic.models.src = 'img/autos.png';


var player = {
    x: 300,
    spdX: 0,
    y: 470,
    spdY: 0,
    image: ImgPlayer.auto,
    width: ImgPlayer.auto.width,
    height: ImgPlayer.auto.height,
    type: 'player',
    model: 'default',
    hp: 5,
    pressingUp: false,
    pressingDown: false,
    pressingLeft: false,
    pressingRight: false,
};

var health = document.getElementById("health");

var trafficList = {};
var repairList = {};
var upgradeList = {};

getDistanceBetweenEntity = function (entity1, entity2) {
    var vx = entity1.x - entity2.x;
    var vy = entity1.y - entity2.y;
    return Math.sqrt(vx * vx + vy * vy);
};

testCollisionEntity = function (entity1, entity2) {
    var rect1 = {
        x: entity1.x / 2,
        y: entity1.y / 2,
        width: 20,
        height: 45,
    };
    var rect2 = {
        x: entity2.x / 2,
        y: entity2.y / 2,
        width: 20,
        height: 45,
    };
    return testCollisionRectRect(rect1, rect2);
};

drawEntity = function (arg) {
    ctx.save();
    //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    if (arg.type === 'player' || arg.type === 'repair') {
        ctx.drawImage(arg.image, arg.x, arg.y);
    } else if (arg.type === 'counter' || arg.type === 'follow') {
        ctx.drawImage(arg.image, arg.sliceX, arg.sliceY, 47.25, 85, arg.x, arg.y, 49, 85);
    }
    ctx.restore();
};

Traffic = function (id, x, y, spdX, spdY, width, height, type, model, color, image, sliceX, sliceY) {
    var traffic = {
        x: x,
        spdX: spdX,
        y: y,
        spdY: spdY,
        name: 'T',
        id: id,
        width: width,
        height: height,
        type: type,
        model: model,
        color: color,
        image: image,
        sliceX: sliceX,
        sliceY: sliceY,
    };
    trafficList[id] = traffic;
};

Repair = function (id, x, y, spdX, spdY, width, height, image) {
    var rep = {
        id: id,
        x: x,
        y: y,
        spdX: spdX,
        spdY: spdY,
        width: width,
        height: height,
        image: image,
        type: 'repair',
    };
    repairList[id] = rep;
};

Upgrade = function (id, x, y, spdX, spdY, width, height) {
    var up = {
        id: id,
        x: x,
        y: y,
        spdX: spdX,
        spdY: spdY,
        width: width,
        height: height,
    };
    upgradeList[id] = up;
};

updateEntity = function (arg) {
    updateEntityPosition(arg);
    drawEntity(arg);
};

updateEntityPosition = function (arg) {
    arg.x += arg.spdX;
    arg.y += arg.spdY;

    if (arg.y < 0 || arg.y > HEIGHT) {
        arg = null;
    }
};

testCollisionRectRect = function (rect1, rect2) {
    return rect1.x <= rect2.x + rect2.width &&
        rect2.x <= rect1.x + rect1.width &&
        rect1.y <= rect2.y + rect2.height &&
        rect2.y <= rect1.y + rect1.height;
};

update = function () {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    survivedTime++;

    for (var key in trafficList) {
        updateEntity(trafficList[key]);
        var currentKey = key;
        trafficList[currentKey].spdX += _.random(-0.002, 0.002);
        if (trafficList[currentKey].x >= 350) {
            trafficList[currentKey].x = 350;
        } else if (trafficList[currentKey].x <= 100) {
            trafficList[currentKey].x = 100;
        }

        var isCollidingPlayerTraffic = testCollisionEntity(player, trafficList[key]);

        if (isCollidingPlayerTraffic) {
            player.hp = player.hp - 1;
            health.value -= 1;
            explode.play();
            var currentKey1 = key;

            player.x = player.x + _.random(-15, 15) * Math.random();
            player.y = player.y + _.random(10, 15);
            trafficList[currentKey].spdX += _.random(-5, 5);
            trafficList[currentKey].spdY += _.random(-10, -5);
            setInterval(function () {
                    delete trafficList[currentKey1];
                },
                120);

            if (player.hp <= 0) {
                console.log('you lost! your score: ' + survivedTime + ' points');
                stop();
                player.hp = 5;
                player.x = 300;
                player.y = 470;
                health.value = 5;
                survivedTime = 0;

            }
        }
    }

    for (var key in repairList) {
        updateEntity(repairList[key]);
        var currentKey = key;
        //could add repair icon bouncing here
        var isCollidingPlayerRepair = testCollisionEntity(player, repairList[key]);
        if (isCollidingPlayerRepair && player.hp != 5) {

            player.hp = player.hp + 1;
            health.value += 1;
            var currentKey1 = key;
            pickupRepair.play();

            delete repairList[currentKey1];
        }
    }

    if (player.x > 350) {
        player.x = 350;
    } else if (player.x < 100) {
        player.x = 100;
    } else if (player.y > HEIGHT - 120) {
        player.y = HEIGHT - 120;
    } else if (player.y <= 0) {
        player.y = 0;
    }
    updatePlayerPosition();
    drawEntity(player);
    document.getElementById('timer').innerText = 'Score: ' + survivedTime;
};

movingBackground = function () {
    document.getElementById('ctx').style.backgroundPositionY = 8 * survivedTime + 'px';
};
setInterval(movingBackground, 5);

document.onkeydown = function (event) {
    if (event.keyCode === 39) //d
        player.pressingRight = true;
    else if (event.keyCode === 40) //s
        player.pressingDown = true;
    else if (event.keyCode === 37) //a
        player.pressingLeft = true;
    else if (event.keyCode === 38) // w
        player.pressingUp = true;
    else if (event.keyCode === 13) {
        switch (statement) {
            case 'paused':
                start();
                break;
            case 'running':
                stop();
                break;
            default:
                break;
        }
    } else if (event.keyCode === 72 && statement === 'running') {
        horn1.play();
    }
};

document.onkeyup = function (event) {
    if (event.keyCode === 39) //d
        player.pressingRight = false;
    else if (event.keyCode === 40) //s
        player.pressingDown = false;
    else if (event.keyCode === 37) //a
        player.pressingLeft = false;
    else if (event.keyCode === 38) // w
        player.pressingUp = false;
    else if(event.keyCode === 72 && statement === 'running') {
        horn1.stop();
    }
};

updatePlayerPosition = function () {
    if (player.pressingUp)
        player.y -= 5;
    if (player.pressingRight)
        player.x += 5;
    if (player.pressingLeft)
        player.x -= 5;
    if (player.pressingDown)
        player.y += 5;
};

startCounterTimer = function () {
    counterTimer = setTimeout(function timerForCounterTraffic() {
        randomTrafficGeneration(100,181,'counter',15,0);
        var timer = 200 + Math.random() * 1000;
        return counterTimer = setTimeout(timerForCounterTraffic, timer);
    }, 1000);
};

startFollowTimer = function () {
    followTimer = setTimeout(function timerForFollowTraffic() {
        randomTrafficGeneration(267,345,'follow',2,85);
        var timer = 1500 + Math.random() * 2000;
        return followTimer = setTimeout(timerForFollowTraffic, timer);
    }, 1000);
};

startRepairTimer = function () {
    repairTimer = setTimeout(function timerForRepair() {
        randomRepairGeneration();
        var timer = 5000 + Math.random() * 5000;
        return repairTimer = setTimeout(timerForRepair, timer);
    }, 5000);
};

start = function () {
    var recordScore = +localStorage.getItem('record');
    if (recordScore !== null) {
        document.getElementById('recordScore').innerHTML = "Record score: " + recordScore;
    } else return;
    menu.classList.add('hidden');
    gameover.classList.add('hidden');
    for (var key in trafficList) {
        delete trafficList[key];
    }
    for(var key in repairList){
        delete repairList[key];
    }
    soundtrack.volume = 0.5;
    engine.play();
    survivedTime = 0;
    startCounterTimer();
    startFollowTimer();
    startRepairTimer();
    statement = 'running';
    player.xp = 5;
    health.value = 5;
    player.x = 300;
    player.y = 470;
    return startGame = setInterval(update, 18);

};

stop = function () {
    gameover.classList.remove('hidden');
    finishscreen.innerHTML = "GAME OVER! YOUR SCORE:<br>" + survivedTime + '<br><br><br>PRESS <img src="img/enter.png"> TO RESTART';
    for (var key in trafficList) {
        delete trafficList[key];
    }
    player.hp = 5;
    player.x = 300;
    player.y = 470;
    statement = 'paused';
    engine.stop();
    soundtrack.volume = 0.1;
    clearInterval(startGame);
    clearTimeout(counterTimer);
    clearTimeout(followTimer);
    clearTimeout(repairTimer);
    var record = +localStorage.getItem('record');
    if (survivedTime > record || record === undefined) {
        localStorage.removeItem('record');
        localStorage.setItem('record', survivedTime);
    } else return;
};

//UNOPTIMIZED YET!!
randomTrafficGeneration = function(xMin,xMax,type,spdY,sliceY){
    var id = Math.random();
    var x0 = _.random(0, 1);
    if (x0 > 0.5) {
        x = xMin;
    } else {
        x = xMax;
    }
    var y = -90;
    var width = 60;
    var height = 90;
    var type = type;
    var model = _.random(1, 3);
    var color = _.random(1, 4);
    var image = ImgTraffic.models;
    var spdY = spdY;
    var spdX = _.random(-0.1, 0.1); //dont turn to sides 
    var sliceX = _.random(0, 11) * 47.25;
    var sliceY = sliceY;
    Traffic(id, x, y, spdX, spdY, width, height, type, model, color, image, sliceX, sliceY);
};

randomRepairGeneration = function () {
    var id = Math.random();
    var x = _.random(100, 350);
    var y = -90;
    var spdX = _.random(-0.02, 0.02);
    var spdY = _.random(5, 10);
    var width = 30;
    var height = 30;
    var image = ImgPlayer.repair;
    Repair(id, x, y, spdX, spdY, width, height, image);
};
}
document.addEventListener("DOMContentLoaded", ready);