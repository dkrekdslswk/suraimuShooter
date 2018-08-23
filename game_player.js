/**
 * Created by sec on 2017-06-21.
 */

// 플래이어 몬스터 등의 기본틀
function MoveObject(argName, argHp, argDefens, argScore, argTeam, argSize, argxp, argyp, argMove, argAttack, argDie) {
    this.name = argName;

    // 체력
    this.hpMax = argHp;
    this.hp = argHp;

    // 크기
    this.size = argSize;

    // 방어력
    this.defens = argDefens;

    // 플래이어인지 몬스터인지
    this.team = argTeam;

    // 몬스터일경우 점수
    this.score = argScore;

    // 위치좌표
    this.player_x_point = argxp;
    this.player_y_point = argyp;

    // 기본적인 DOC 정보
    this.map = document.getElementById('map');
    this.playerImg = document.createElement("img");
    this.playerHpBar = document.createElement("div");

    // 이미지를 생성
    this.createChar = function (id) {
        this.playerImg.id = id;
        this.playerImg.style.position = "absolute";
        this.playerImg.style.top = this.player_y_point - this.size / 2 +"px";
        this.playerImg.style.left = this.player_x_point - this.size / 2 + "px";
        this.playerImg.style.height = this.size + "px";
        this.playerImg.style.width = this.size + "px";
        this.playerImg.draggable = false;

        this.playerImg.id = id + "hp";
        this.playerHpBar.style.position = "absolute";
        this.playerHpBar.style.top = this.player_y_point - this.size / 2 - 3 +"px";
        this.playerHpBar.style.left = this.player_x_point - this.size / 2 +"px";
        this.playerHpBar.style.height = 3 + "px";
        this.playerHpBar.style.width = this.size + "px";
        this.playerHpBar.style.backgroundColor = undefined;
        this.playerHpBar.draggable = false;

        this.map.appendChild(this.playerImg);
        this.map.appendChild(this.playerHpBar);
    };

    // 체력 회복 이벤트
    this.hpRe = function (rePoint) {
        this.playerHpBar.style.top = this.player_y_point - this.size / 2 - 3 +"px";
        this.playerHpBar.style.left = this.player_x_point - this.size / 2 +"px";
        this.playerHpBar.style.width = this.size * this.hp / this.hpMax + "px";

        if(this.hp < this.hpMax){
            this.hp += rePoint;
            if(this.hp > this.hpMax){
                this.hp = this.hpMax;
            }

            if(this.hp < this.hpMax / 5){
                this.playerHpBar.style.backgroundColor = "#f00";
            } else if(this.hp < this.hpMax / 2){
                this.playerHpBar.style.backgroundColor = "#ff0";
            } else{
                this.playerHpBar.style.backgroundColor = "#0f0";
            }
        }else{
            this.playerHpBar.style.backgroundColor = null;
        }
    };

    this.mapCheck = function () {
        var returnCheck = OFF;

        if(this.player_x_point - this.size / 2 < mapLeft){
            this.player_x_point = mapLeft + this.size / 2;
            returnCheck = ON;
        }
        if(this.player_x_point + this.size / 2 > mapRight){
            this.player_x_point = mapRight - this.size / 2;
            returnCheck = ON;
        }
        if(this.player_y_point - this.size / 2 < mapTop){
            this.player_y_point = mapLeft + this.size / 2;
            returnCheck = ON;
        }
        if(this.player_y_point + this.size / 2 > mapBottom){
            this.player_y_point = mapRight - this.size / 2;
            returnCheck = ON;
        }

        if(returnCheck === ON){
            return -1;
        }
    };
    this.mapCheck();

    // 움직임, 공격, 피해, 사망 이벤트
    this.move = argMove || function () {};
    this.attack = argAttack || function () {};
    this.damage = function (argDamege, argAttackDirection) {
        this.hp -= (argDamege - Math.random() * argDefens) < 0 ? 0 : (argDamege - Math.random() * argDefens);
        if(this.hp < 0){
            return this.die();
        }
        else{
            this.player_x_point += Math.cos(argAttackDirection) * argDamege * 2;
            this.player_y_point += Math.sin(argAttackDirection) * argDamege * 2;
            this.playerImg.style.top = this.player_y_point - this.size / 2 +"px";
            this.playerImg.style.left = this.player_x_point - this.size / 2 + "px";
            this.playerHpBar.style.top = this.player_y_point - this.size / 2 - 3 +"px";
            this.playerHpBar.style.left = this.player_x_point - this.size / 2 +"px";
            this.mapCheck();
        }
    };
    this.die = argDie || defortDie;
}

function defortDie() {
    try {
        this.map.removeChild(this.playerImg);
        this.map.removeChild(this.playerHpBar);
        scoreTemp += this.score;
    }catch (e){

    }
    return(-1);
}

function Player(argSpeed, argSelect) {
    MoveObject.call(this, argSelect, 100, 5, 0, FRIENDLY, 50, (mapTop + mapBottom) / 2, (mapTop + mapBottom) / 2);

    this.characterSelect = argSelect;

    this.direction = 2;
    this.speed = argSpeed;

    this.createChar("player");

    // 플래이어 이동 함수
    this.move = function(argDirection, cont) {
        // 체젠
        this.hpRe(this.hpMax / 1000);

        // 이동 처리
        if(argDirection !== 5){
            this.direction = argDirection;
            var speedTemp = argDirection % 2 === 0 ? this.speed : this.speed / 1.4;

            this.player_x_point += ((argDirection + 2) % 3 - 1) * speedTemp;
            this.player_y_point += (argDirection < 4 ? 1 : (argDirection > 6 ? -1 : 0)) * speedTemp;
            this.mapCheck();
        }

        this.playerImg.src = this.characterSelect + '/' + this.characterSelect + this.direction + "" + cont + ".png";
        this.playerImg.style.top = this.player_y_point - this.size / 2 +"px";
        this.playerImg.style.left = this.player_x_point - this.size / 2 + "px";
    };

    this.attackDelay = 5;

    this.attack = function () {
        var tanDirection = Math.PI / 180;
        switch (this.direction) {
            case 6:
                tanDirection *= 0;
                break;
            case 3:
                tanDirection *= 45;
                break;
            case 2:
                tanDirection *= 90;
                break;
            case 1:
                tanDirection *= 135;
                break;
            case 4:
                tanDirection *= 180;
                break;
            case 7:
                tanDirection *= 225;
                break;
            case 8:
                tanDirection *= 270;
                break;
            case 9:
                tanDirection *= 315;
                break;
        }
        return attackList("multiShot", 7 + round * 0.2, 45 + round * 1, 16 + round * 0.1, tanDirection, this.team, this.player_x_point, this.player_y_point);

    };
}
Player.prototype.__proto__ = MoveObject.prototype;

var monsterCreateCount = 0;
function monsterList (mondterName, argxp, argyp, round){
    var level = parseInt(Math.random() * round);
    switch (mondterName){
        case "SuraimuRed":
            return new SuraimuRed(argxp, argyp, level);
            break;
        case "SuraimuGrean":
            return new SuraimuGrean(argxp, argyp, level);
            break;
        case "SuraimuBlue":
            return new SuraimuBlue(argxp, argyp, level);
            break;
        case "SuraimuYellow":
            return new SuraimuYellow(argxp, argyp, level);
            break;
        default:
            break;
    }
}

function SuraimuRed(xp, yp, level) {
    MoveObject.call(this, "SuraimuRed", 25 + level * 5, 2 + level * 0.1, 5 + level * 2, ENERMY, 25 + level * 5, xp, yp);

    this.direction = 2;
    this.defortSreed = 3 + level * 0.6;
    this.speed = this.defortSreed;

    this.attackDirection = 0;

    this.attackDamege = 15 + level * 1;

    this.move = function(player, cont) {
        // 체력 재생
        this.hpRe(this.hpMax / 1000);

        // 크기에 따라 몸집 조정
        this.size = (this.hpMax + this.hp) / 2;
        this.playerImg.style.height = this.size + "px";
        this.playerImg.style.width = this.size + "px";

        // 플래이어와의 거리
        var distance = Math.pow((Math.pow(-this.player_y_point + player.player_y_point, 2) + Math.pow(this.player_x_point - player.player_x_point, 2)), 0.5);

        // 공격 동작중에는 이동방향 고정
        if (this.attackCount !== 2 && this.attackCount !== 1) {
            // 적을 인식
            if (distance <= 150 + level * 10) {
                this.attackDirection = Math.atan2((-this.player_y_point + player.player_y_point), (-this.player_x_point + player.player_x_point));

                // 유닛의 방향을 결정할 tan값
                var moveTemp;
                if ((this.player_x_point - player.player_x_point) === 0) {
                    moveTemp = (-this.player_y_point + player.player_y_point);
                } else if ((-this.player_y_point + player.player_y_point) === 0) {
                    moveTemp = (this.player_x_point - player.player_x_point);
                } else {
                    moveTemp = (-this.player_y_point + player.player_y_point) / (this.player_x_point - player.player_x_point);
                }

                if (moveTemp > 1 || moveTemp <= -1) {
                    if ((-this.player_y_point + player.player_y_point) >= 0) {
                        this.direction = 2;
                    } else {
                        this.direction = 8;
                    }
                } else {
                    if ((this.player_x_point - player.player_x_point) <= 0) {
                        this.direction = 6;
                    } else {
                        this.direction = 4;
                    }
                }

                // 방향 결정 및 이동
                if(distance > player.size / 3 + this.size / 3){
                    this.player_x_point += Math.cos(this.attackDirection) * this.speed;
                    this.player_y_point += Math.sin(this.attackDirection) * this.speed;
                }
                // 몬스터의 공격 이벤트 조율
                if (this.attackDelay === 0) {
                    this.attack();
                } else {
                    this.attackDelay--;
                }
            }
            // 평시 모션
            else {
                this.direction = (parseInt(Math.random() * 5)) * 2;

                // 방향 결정 및 이동
                if (this.direction === 2) {
                    this.player_y_point += this.speed * Math.random() * 10;
                } else if (this.direction === 4) {
                    this.player_x_point -= this.speed * Math.random() * 10;
                } else if (this.direction === 6) {
                    this.player_x_point += this.speed * Math.random() * 10;
                } else if (this.direction === 8) {
                    this.player_y_point -= this.speed * Math.random() * 10;
                } else {
                    this.direction = 2;
                }

                // 몬스터의 공격 이벤트 조율
                if (this.attackDelay === 0) {
                    this.speed = this.defortSreed;
                    this.attackCount = 0;
                } else {
                    this.attackDelay--;
                }
            }
        }
        // 공격 모션
        else{
            this.player_x_point += Math.cos(this.attackDirection) * this.speed;
            this.player_y_point += Math.sin(this.attackDirection) * this.speed;

            // 데미지 판정
            if(this.attackCount === 2) {
                if(this.mapCheck() === -1){
                    this.attackDelay = 0;
                    this.playerImg.style.top = this.player_y_point - this.size / 2 +"px";
                    this.playerImg.style.left = this.player_x_point - this.size / 2 + "px";
                    this.playerHpBar.style.top = this.player_y_point - this.size / 2 - 3 +"px";
                    this.playerHpBar.style.left = this.player_x_point - this.size / 2 +"px";
                    this.player_x_point += Math.cos(this.attackDirection) * this.speed;
                    this.player_y_point += Math.cos(this.attackDirection) * this.speed;
                }
                else {
                    if (this.attackDelay % 3 === 0) {
                        var shot = new attackList("nomalShot", this.attackDamege / 2, this.size, this.defortSreed, this.attackDirection + Math.PI, this.team, this.player_x_point, this.player_y_point);
                    }
                }

                distance = Math.pow((Math.pow(-this.player_y_point + player.player_y_point, 2) + Math.pow(this.player_x_point - player.player_x_point, 2)), 0.5);
                if (distance < player.size / 2 + this.size / 2) {
                    var crash = ON;
                    this.attackDelay = 0;
                }
            }

            // 몬스터의 공격 이벤트 조율
            if (this.attackDelay === 0) {
                this.attack();
            } else {
                this.attackDelay--;
            }
        }

        this.mapCheck();

        this.playerImg.src = "suraimu/suraimured" + this.direction + "" + cont + ".png";
        this.playerImg.style.top = this.player_y_point - this.size / 2 +"px";
        this.playerImg.style.left = this.player_x_point - this.size / 2 + "px";

        if(shot !== undefined){
            return shot;
        }
        else if(crash === ON){
            return this.attackDamege;
        }
    };

    this.attackDelay = 15;
    this.attackCount = 0;
    this.attack = function () {
        if(this.attackCount === 0){
            this.speed = -this.defortSreed * 0.5;
            this.attackDelay = 30;
            this.attackCount++;
        }
        else if(this.attackCount === 1){
            this.speed = this.defortSreed * 6;
            this.attackDelay = 15;
            this.attackCount++;
        }
        else if(this.attackCount === 2){
            this.speed = 0;
            this.attackDelay = 50;
            this.attackCount++;
        }
        else if(this.attackCount === 3){
            this.speed = this.defortSreed;
            this.attackDelay = 50;
            this.attackCount = 0;
        }
    };

    this.createChar("SuraimuRed" + monsterCreateCount);
    monsterCreateCount++;
}
SuraimuRed.prototype.__proto__ = MoveObject.prototype;

function SuraimuGrean(xp, yp, level) {
    MoveObject.call(this, "SuraimuGrean", 25 + level * 3, 4 + level * 0.1, 3 + level * 2, ENERMY, 25 + level * 3, xp, yp);

    this.direction = 2;
    this.attackDirection = 0;
    this.defortSreed = 1 + level * 0.2;
    this.speed = this.defortSreed;

    this.attackDamege = 6 + level * 0.5;

    this.move = function(player, cont) {
        // 체력 재생
        this.hpRe(this.hpMax / 1000);

        // 크기에 따라 몸집 조정
        this.size = (this.hpMax + this.hp) / 2;
        this.playerImg.style.height = this.size + "px";
        this.playerImg.style.width = this.size + "px";

        // 플래이어와의 거리
        var distance = Math.pow((Math.pow(-this.player_y_point + player.player_y_point, 2) + Math.pow(this.player_x_point - player.player_x_point, 2)), 0.5);

        // 공격 동작중에는 이동방향 고정
        if (this.attackCount !== 2) {
            // 적을 인식
            if (distance <= 200 + level * 15) {
                // 공격 방향설정
                this.attackDirection = Math.atan2((-this.player_y_point + player.player_y_point), (-this.player_x_point + player.player_x_point));

                // 유닛의 방향을 결정할 tan값
                var moveTemp;
                if ((this.player_x_point - player.player_x_point) === 0) {
                    moveTemp = (-this.player_y_point + player.player_y_point);
                } else if ((-this.player_y_point + player.player_y_point) === 0) {
                    moveTemp = (this.player_x_point - player.player_x_point);
                } else {
                    moveTemp = (-this.player_y_point + player.player_y_point) / (this.player_x_point - player.player_x_point);
                }

                if (moveTemp > 1 || moveTemp <= -1) {
                    if ((-this.player_y_point + player.player_y_point) >= 0) {
                        this.direction = 2;
                    } else {
                        this.direction = 8;
                    }
                } else {
                    if ((this.player_x_point - player.player_x_point) <= 0) {
                        this.direction = 6;
                    } else {
                        this.direction = 4;
                    }
                }

                // 방향 결정 및 이동
                if(distance > player.size / 3 + this.size / 3) {
                    this.player_x_point += Math.cos(this.attackDirection) * this.speed;
                    this.player_y_point += Math.sin(this.attackDirection) * this.speed;
                }

                // 몬스터의 공격 이벤트 조율
                if (this.attackDelay === 0) {
                    this.attack();
                } else {
                    this.attackDelay--;
                }
            }
            // 평시 모션
            else {
                this.direction = (parseInt(Math.random() * 5)) * 2;

                // 방향 결정 및 이동
                if (this.direction === 2) {
                    this.player_y_point += this.speed * Math.random() * 10;
                } else if (this.direction === 4) {
                    this.player_x_point -= this.speed * Math.random() * 10;
                } else if (this.direction === 6) {
                    this.player_x_point += this.speed * Math.random() * 10;
                } else if (this.direction === 8) {
                    this.player_y_point -= this.speed * Math.random() * 10;
                } else {
                    this.direction = 2;
                }

                // 몬스터의 공격 이벤트 조율
                if (this.attackDelay === 0) {
                    this.speed = this.defortSreed;
                    this.attackCount = 0;
                } else {
                    this.attackDelay--;
                }
            }
        }
        // 공격 모션
        else{
            this.player_x_point += Math.cos(this.attackDirection) * this.speed;
            this.player_y_point += Math.sin(this.attackDirection) * this.speed;
            // 데미지 판정
            if(this.attackDelay % 4 === 0){
                var shot = new attackList("nomalShot", this.attackDamege, this.size, this.defortSreed * 10, this.attackDirection + (Math.random() * 30 - 15) * Math.PI / 180, this.team, this.player_x_point, this.player_y_point);
            }

            // 몬스터의 공격 이벤트 조율
            if (this.attackDelay === 0) {
                this.attack();
            } else {
                this.attackDelay--;
            }
        }

        this.mapCheck();

        this.playerImg.src = "suraimu/SuraimuGrean" + this.direction + "" + cont + ".png";
        this.playerImg.style.top = this.player_y_point - this.size / 2 +"px";
        this.playerImg.style.left = this.player_x_point - this.size / 2 + "px";

        if(shot !== undefined){
            return shot;
        }
    };

    this.attackDelay = 15;
    this.attackCount = 0;
    this.attack = function () {
        if(this.attackCount === 0){
            this.speed = -this.defortSreed * 0.25;
            this.attackDelay = 25;
            this.attackCount++;
        }
        else if(this.attackCount === 1){
            this.speed = -this.defortSreed * 3;
            this.attackDelay = 10;
            this.attackCount++;
        }
        else if(this.attackCount === 2){
            this.speed = this.defortSreed;
            this.attackDelay = 50;
            this.attackCount = 0;
        }
    };

    this.createChar("SuraimuGrean" + monsterCreateCount);
    monsterCreateCount++;
}

function SuraimuBlue(xp, yp, level) {
    MoveObject.call(this, "SuraimuBlue", 20 + level * 3, 1 + level * 0.1, 4 + level * 2, ENERMY, 20 + level * 3, xp, yp);

    this.direction = 2;
    this.defortSreed = 2 + level * 0.2;
    this.speed = this.defortSreed;

    this.attackDirection = 0;

    this.attackDamege = 5 + level * 0.4;

    this.move = function(player, cont) {
        // 체력 재생
        this.hpRe(this.hpMax / 1000);

        // 크기에 따라 몸집 조정
        this.size = (this.hpMax + this.hp) / 2;
        this.playerImg.style.height = this.size + "px";
        this.playerImg.style.width = this.size + "px";

        // 플래이어와의 거리
        var distance = Math.pow((Math.pow(-this.player_y_point + player.player_y_point, 2) + Math.pow(this.player_x_point - player.player_x_point, 2)), 0.5);

        // 공격 동작중에는 이동방향 고정
        if (this.attackCount !== 2) {
            // 적을 인식
            if (distance <= 250 + level * 20) {
                // 공격 방향설정
                this.attackDirection = Math.atan2((-this.player_y_point + player.player_y_point), (-this.player_x_point + player.player_x_point));

                // 유닛의 방향을 결정할 tan값
                var moveTemp;
                if ((this.player_x_point - player.player_x_point) === 0) {
                    moveTemp = (-this.player_y_point + player.player_y_point);
                } else if ((-this.player_y_point + player.player_y_point) === 0) {
                    moveTemp = (this.player_x_point - player.player_x_point);
                } else {
                    moveTemp = (-this.player_y_point + player.player_y_point) / (this.player_x_point - player.player_x_point);
                }

                if (moveTemp > 1 || moveTemp <= -1) {
                    if ((-this.player_y_point + player.player_y_point) >= 0) {
                        this.direction = 2;
                    } else {
                        this.direction = 8;
                    }
                } else {
                    if ((this.player_x_point - player.player_x_point) <= 0) {
                        this.direction = 6;
                    } else {
                        this.direction = 4;
                    }
                }

                // 방향 결정 및 이동
                if(distance > player.size / 3 + this.size / 3) {
                    this.player_x_point += Math.cos(this.attackDirection) * this.speed;
                    this.player_y_point += Math.sin(this.attackDirection) * this.speed;
                }

                // 몬스터의 공격 이벤트 조율
                if (this.attackDelay === 0) {
                    this.attack();
                } else {
                    this.attackDelay--;
                }
            }
            // 평시 모션
            else {
                this.direction = (parseInt(Math.random() * 5)) * 2;

                // 방향 결정 및 이동
                if (this.direction === 2) {
                    this.player_y_point += this.speed * Math.random() * 10;
                } else if (this.direction === 4) {
                    this.player_x_point -= this.speed * Math.random() * 10;
                } else if (this.direction === 6) {
                    this.player_x_point += this.speed * Math.random() * 10;
                } else if (this.direction === 8) {
                    this.player_y_point -= this.speed * Math.random() * 10;
                } else {
                    this.direction = 2;
                }

                // 몬스터의 공격 이벤트 조율
                if (this.attackDelay === 0) {
                    this.speed = this.defortSreed;
                    this.attackCount = 0;
                } else {
                    this.attackDelay--;
                }
            }
        }
        // 공격 모션
        else{
            this.player_x_point += Math.cos(this.attackDirection) * this.speed;
            this.player_y_point += Math.sin(this.attackDirection) * this.speed;
            // 데미지 판정
            if(this.attackDelay % 5 === 0){
                var shot = new attackList("tripleShot", this.attackDamege, this.size, this.defortSreed * 3.5, this.attackDirection + (Math.random() * 30 - 15) * Math.PI / 180, this.team, this.player_x_point, this.player_y_point);
            }

            // 몬스터의 공격 이벤트 조율
            if (this.attackDelay === 0) {
                this.attack();
            } else {
                this.attackDelay--;
            }
        }

        this.mapCheck();

        this.playerImg.src = "suraimu/SuraimuBlue" + this.direction + "" + cont + ".png";
        this.playerImg.style.top = this.player_y_point - this.size / 2 +"px";
        this.playerImg.style.left = this.player_x_point - this.size / 2 + "px";

        if(shot !== undefined){
            return shot;
        }
    };

    this.attackDelay = 15;
    this.attackCount = 0;
    this.attack = function () {
        if(this.attackCount === 0){
            this.speed = -this.defortSreed * 0.25;
            this.attackDelay = 25;
            this.attackCount++;
        }
        else if(this.attackCount === 1){
            this.speed = -this.defortSreed;
            this.attackDelay = 10;
            this.attackCount++;
        }
        else if(this.attackCount === 2){
            this.speed = this.defortSreed;
            this.attackDelay = 50;
            this.attackCount = 0;
        }
    };

    this.createChar("SuraimuBlue" + monsterCreateCount);
    monsterCreateCount++;
}
SuraimuBlue.prototype.__proto__ = MoveObject.prototype;


function SuraimuYellow(xp, yp, level) {
    MoveObject.call(this, "SuraimuYellow", 20 + level * 3, 3 + level * 0.15, 4 + level * 2, ENERMY, 20 + level * 3, xp, yp);

    this.direction = 2;
    this.defortSreed = 2 + level * 0.4;
    this.speed = this.defortSreed;

    this.attackDirection = 0;

    this.attackDamege = 16 + level * 1.5;

    this.move = function(player, cont) {
        // 체력 재생
        this.hpRe(this.hpMax / 1000);

        // 크기에 따라 몸집 조정
        this.size = (this.hpMax + this.hp) / 2;
        this.playerImg.style.height = this.size + "px";
        this.playerImg.style.width = this.size + "px";

        // 플래이어와의 거리
        var distance = Math.pow((Math.pow(-this.player_y_point + player.player_y_point, 2) + Math.pow(this.player_x_point - player.player_x_point, 2)), 0.5);

        // 공격 동작중에는 이동방향 고정
        if (this.attackCount !== 2 && this.attackCount !== 1) {
            // 적을 인식
            if (distance <= 250 + level * 20) {
                this.attackDirection = Math.atan2((-this.player_y_point + player.player_y_point), (-this.player_x_point + player.player_x_point));

                // 유닛의 방향을 결정할 tan값
                var moveTemp;
                if ((this.player_x_point - player.player_x_point) === 0) {
                    moveTemp = (-this.player_y_point + player.player_y_point);
                } else if ((-this.player_y_point + player.player_y_point) === 0) {
                    moveTemp = (this.player_x_point - player.player_x_point);
                } else {
                    moveTemp = (-this.player_y_point + player.player_y_point) / (this.player_x_point - player.player_x_point);
                }

                if (moveTemp > 1 || moveTemp <= -1) {
                    if ((-this.player_y_point + player.player_y_point) >= 0) {
                        this.direction = 2;
                    } else {
                        this.direction = 8;
                    }
                } else {
                    if ((this.player_x_point - player.player_x_point) <= 0) {
                        this.direction = 6;
                    } else {
                        this.direction = 4;
                    }
                }

                // 방향 결정 및 이동
                if(distance > player.size / 3 + this.size / 3) {
                    this.player_x_point += Math.cos(this.attackDirection) * this.speed;
                    this.player_y_point += Math.sin(this.attackDirection) * this.speed;
                }
                // 몬스터의 공격 이벤트 조율
                if (this.attackDelay === 0) {
                    this.attack();
                } else {
                    this.attackDelay--;
                }
            }
            // 평시 모션
            else {
                this.direction = (parseInt(Math.random() * 5)) * 2;

                // 방향 결정 및 이동
                if (this.direction === 2) {
                    this.player_y_point += this.speed * Math.random() * 10;
                } else if (this.direction === 4) {
                    this.player_x_point -= this.speed * Math.random() * 10;
                } else if (this.direction === 6) {
                    this.player_x_point += this.speed * Math.random() * 10;
                } else if (this.direction === 8) {
                    this.player_y_point -= this.speed * Math.random() * 10;
                } else {
                    this.direction = 2;
                }

                // 몬스터의 공격 이벤트 조율
                if (this.attackDelay === 0) {
                    this.speed = this.defortSreed;
                    this.attackCount = 0;
                } else {
                    this.attackDelay--;
                }
            }
        }
        // 공격 모션
        else{
            var randomMove = Math.random() * this.hpMax - this.hpMax/2;
            randomMove = randomMove >= 0 ? randomMove + this.hpMax : randomMove - this.hpMax;
            this.attackDirection += randomMove * Math.PI / 180;
            this.player_x_point += Math.cos(this.attackDirection) * this.speed;
            this.player_y_point += Math.sin(this.attackDirection) * this.speed;

            // 데미지 판정
            if(this.attackCount === 2) {
                distance = Math.pow((Math.pow(-this.player_y_point + player.player_y_point, 2) + Math.pow(this.player_x_point - player.player_x_point, 2)), 0.5);
                if (distance < player.size / 2 + this.size / 2) {
                    var crash = ON;
                    this.attackDelay = 0;
                }
                else {
                    if (this.attackDelay % 3 === 0) {
                        var shot = new attackList("multiShot", this.attackDamege / 2, this.size, this.defortSreed, this.attackDirection + Math.PI, this.team, this.player_x_point, this.player_y_point);
                    }
                }
            }

            // 몬스터의 공격 이벤트 조율
            if (this.attackDelay === 0) {
                this.attack();
            } else {
                this.attackDelay--;
            }
        }

        this.mapCheck();

        this.playerImg.src = "suraimu/SuraimuYell" + this.direction + "" + cont + ".png";
        this.playerImg.style.top = this.player_y_point - this.size / 2 +"px";
        this.playerImg.style.left = this.player_x_point - this.size / 2 + "px";

        if(shot !== undefined){
            return shot;
        }
        else if(crash === ON){
            return this.attackDamege;
        }
    };

    this.attackDelay = 15;
    this.attackCount = 0;
    this.attack = function () {
        if(this.attackCount === 0){
            this.speed = -this.defortSreed * 0.25;
            this.attackDelay = 25;
            this.attackCount++;
        }
        else if(this.attackCount === 1){
            this.speed = this.defortSreed * 10;
            this.attackDelay = 30;
            this.attackCount++;
        }
        else if(this.attackCount === 2){
            this.speed = 0;
            this.attackDelay = 50;
            this.attackCount++;
        }
        else if(this.attackCount === 3){
            this.speed = this.defortSreed;
            this.attackDelay = 50;
            this.attackCount = 0;
        }
    };

    this.createChar("SuraimuYellow" + monsterCreateCount);
    monsterCreateCount++;
}
SuraimuYellow.prototype.__proto__ = MoveObject.prototype;