/**
 * Created by sec on 2017-06-21.
 */

// 공격미사일 오브젝트
var tanCount = 0;
function bullet(argDamege, Size, tanImg, direction, speed, team, point_x, point_y, argCreate, argMove, argCrash, argDelete) {
    this.bulletSize = Size;
    this.bulletDeleteSize = Size / 4;
    this.bulletDamege = argDamege;

    this.bulletDirection = direction;
    this.bulletSpeed = speed;

    this.bulletTeam = team;
    this.bullet_x_point = point_x;
    this.bullet_y_point = point_y;

    this.map = document.getElementById('map');
    this.bulletImg = document.createElement("img");

    this.create = argCreate || defortBulletCreate;
    // 이미지 생성
    this.create(tanImg);

    this.move = argMove || defortBulletMove;
    this.crash = argCrash || defortBulletCrash;
    this.crashEvent = function () {
        var distance;
        if(this.bulletTeam === FRIENDLY){
            for(var monCount = monList.length - 1 ; monCount >= 0 ; monCount--){
                distance = Math.pow((Math.pow(-this.bullet_y_point + monList[monCount].player_y_point , 2) + Math.pow(this.bullet_x_point - monList[monCount].player_x_point, 2)), 0.5);
                if(distance < monList[monCount].size / 2 + this.bulletSize / 2){
                    return monCount;
                }
            }
        }
        // 몬스터 탄환
        else if(this.bulletTeam === ENERMY){
            distance = Math.pow((Math.pow(-this.bullet_y_point + player.player_y_point , 2) + Math.pow(this.bullet_x_point - player.player_x_point, 2)), 0.5);
            if(distance < player.size / 2 + this.bulletSize / 2){
                return -2;
            }
        }
    };
    this.delete = argDelete || defortBulletDelete;
}

function defortBulletCreate(tanImg) {
    this.bulletImg.src = "tan/" + tanImg + ".png";
    this.bulletImg.style.position = "absolute";
    this.bulletImg.style.height = this.bulletSize + "px";
    this.bulletImg.style.width = this.bulletSize + "px";
    this.bulletImg.style.top = this.bullet_y_point - this.bulletSize/2 +"px";
    this.bulletImg.style.left = this.bullet_x_point - this.bulletSize/2 +"px";
    this.bulletImg.id = "bullet" + tanCount;
    tanCount++;
    if(tanCount > Math.MAX_VALUE - 20){
        tanCount = 0;
    }
    this.map.appendChild(this.bulletImg);
}

function defortBulletMove() {

    this.bullet_x_point +=  Math.cos(this.bulletDirection) * this.bulletSpeed;
    this.bullet_y_point +=  Math.sin(this.bulletDirection) * this.bulletSpeed;
    this.bulletImg.style.top = this.bullet_y_point - this.bulletSize/2 +"px";
    this.bulletImg.style.left = this.bullet_x_point - this.bulletSize/2 +"px";

    this.bulletSize = this.bulletSize - this.bulletDeleteSize / 8;
    this.bulletDamege = this.bulletDamege * 99 / 100;
    this.bulletImg.style.height = this.bulletSize+"px";
    this.bulletImg.style.width = this.bulletSize+"px";

    var crashCheck = this.crashEvent();

    if(crashCheck !== undefined){
        return crashCheck;
    }
    if(this.bulletSize <= this.bulletDeleteSize || this.bullet_x_point - this.bulletSize / 4 < mapLeft || this.bullet_x_point + this.bulletSize / 4 > mapRight || this.bullet_y_point - this.bulletSize / 4 < mapTop || this.bullet_y_point + this.bulletSize / 4 > mapBottom){
        return this.delete();
    }
}

function defortBulletCrash(moveObject) {
    this.delete();
    return moveObject.damage(this.bulletDamege, this.bulletDirection);
}

function defortBulletDelete() {
    try {
        this.map.removeChild(this.bulletImg);
    }
    catch (e){
    }
    return -1;
}

function attackList(bulletName, argDamege, argSize, argSpeed, argDirection, argTeam, argXp, argYp) {
    var bulletColor;
    switch (argTeam){
        case FRIENDLY:
            bulletColor = 1;
            break;
        case ENERMY:
            bulletColor = 4;
            break;
        case ALL:
            bulletColor = 5;
            break;
    }

    switch(bulletName){
        case "nomalShot":
            return [new bullet(argDamege, argSize, "mu" + bulletColor, argDirection, argSpeed, argTeam, argXp, argYp)];
            break;
        case "multiShot":
            return ([new bullet(argDamege, argSize, "mu" + bulletColor, argDirection, argSpeed, argTeam, argXp, argYp),
                new bullet(argDamege, argSize, "mu" + bulletColor, argDirection - 10 * Math.PI / 180, argSpeed, argTeam, argXp, argYp),
                new bullet(argDamege, argSize, "mu" + bulletColor, argDirection + 10 * Math.PI / 180, argSpeed, argTeam, argXp, argYp),
                new bullet(argDamege, argSize, "mu" + bulletColor, argDirection - 20 * Math.PI / 180, argSpeed, argTeam, argXp, argYp),
                new bullet(argDamege, argSize, "mu" + bulletColor, argDirection + 20 * Math.PI / 180, argSpeed, argTeam, argXp, argYp)]);
            break;
        case "tripleShot":
            return ([new bullet(argDamege, argSize, "mu" + bulletColor, argDirection, argSpeed, argTeam, argXp, argYp),
                new bullet(argDamege, argSize, "mu" + bulletColor, argDirection - 15 * Math.PI / 180, argSpeed, argTeam, argXp, argYp),
                new bullet(argDamege, argSize, "mu" + bulletColor, argDirection + 15 * Math.PI / 180, argSpeed, argTeam, argXp, argYp)]);
            break;
        case "YOUDIE":
            function YOUDIE(arg2Direction) {
                return new bullet(0, 40, "mu" + bulletColor, arg2Direction, 10, argTeam, argXp, argYp, undefined, function () {
                    this.bullet_x_point +=  Math.cos(this.bulletDirection) * this.bulletSpeed;
                    this.bullet_y_point +=  Math.sin(this.bulletDirection) * this.bulletSpeed;
                    this.bulletImg.style.top = this.bullet_y_point - this.bulletSize/2 +"px";
                    this.bulletImg.style.left = this.bullet_x_point - this.bulletSize/2 +"px";

                    this.bulletSize = this.bulletSize - this.bulletDeleteSize / 8;
                    this.bulletDamege = this.bulletDamege * 99 / 100;
                    this.bulletImg.style.height = this.bulletSize+"px";
                    this.bulletImg.style.width = this.bulletSize+"px";

                    if(this.bulletSize <= this.bulletDeleteSize || this.bullet_x_point - this.bulletSize / 4 < mapLeft || this.bullet_x_point + this.bulletSize / 4 > mapRight || this.bullet_y_point - this.bulletSize / 4 < mapTop || this.bullet_y_point + this.bulletSize / 4 > mapBottom){
                        return this.delete();
                    }
                });
            }
            return [YOUDIE(argDirection),
                YOUDIE(argDirection + 0.25 * Math.PI),
                YOUDIE(argDirection + 0.50 * Math.PI),
                YOUDIE(argDirection + 0.75 * Math.PI),
                YOUDIE(argDirection + 1.00 * Math.PI),
                YOUDIE(argDirection + 1.25 * Math.PI),
                YOUDIE(argDirection + 1.50 * Math.PI),
                YOUDIE(argDirection + 1.75 * Math.PI)];
            break;
        default:
            break;
    }
}