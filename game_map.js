/**
 * Created by sec on 2017-06-21.
 */

// 피아 구분 상수
var FRIENDLY = 1;
var ENERMY = 2;
var ALL = 3;

// 움직임 제어 변수
motionTemp = 1;

// 게임 스레드
var gameSet;
// 공격 배열
var bulletList = [];

// 맵 정보 저장
var mapTop = 100;
var mapLeft = 100;
var mapRight = 600;
var mapBottom = 600;

// 플래이어 객체 저장
var player;

// 플래이어 공격 딜레이 카운트
var playerAttackDelay = 0;

// 몬스터 객체 저장
var monList = [];

// 소환될 몬스터 객체 저장
var mapSetting = [];

// 점수
var scoreTemp = 0;

// 선행 준비
function setting() {
    var playerSelect = "mari";
    var img = undefined;
    var iCount;
    var jCount;
    // 이미지 업로드
    var gameLoding = document.getElementById("loding");
    for(iCount = 1; iCount < 10; iCount++) {
        if(iCount === 5) {continue;}
        for(jCount = 1; jCount < 5 ; jCount++) {
            subSetting(iCount,jCount, gameLoding, playerSelect);
        }
    }
    for(iCount = 1; iCount < 6 ; iCount++) {
        img = document.createElement("img");
        img.src = "tan/mu" + iCount + ".png";
        img.class = "lodingImg";
        gameLoding.appendChild(img);
    }
    for(iCount = 1; iCount < 5; iCount++) {
        for(jCount = 1; jCount < 5 ; jCount++) {
            img = document.createElement("img");
            img.src = "suraimu/suraimured" + iCount * 2 + jCount + ".png";
            img.class = "lodingImg";
            gameLoding.appendChild(img);
        }
        for(jCount = 1; jCount < 5 ; jCount++) {
            img = document.createElement("img");
            img.src = "suraimu/suraimublue" + iCount * 2 + jCount + ".png";
            img.class = "lodingImg";
            gameLoding.appendChild(img);
        }
        for(jCount = 1; jCount < 5 ; jCount++) {
            img = document.createElement("img");
            img.src = "suraimu/suraimugrean" + iCount * 2 + jCount + ".png";
            img.class = "lodingImg";
            gameLoding.appendChild(img);
        }
        for(jCount = 1; jCount < 5 ; jCount++) {
            img = document.createElement("img");
            img.src = "suraimu/suraimuyell" + iCount * 2 + jCount + ".png";
            img.class = "lodingImg";
            gameLoding.appendChild(img);
        }
    }

    // 플래이어 생성
    player = new Player(5, playerSelect);

    // 게임 실행 프레임
    gameSet = setInterval(gameBoard, 20);
}
function subSetting(iCount, jCount, gameLoding, playerSelect) {
    var img = document.createElement("img");
    img.src = playerSelect + "/" + playerSelect + iCount + "" + jCount + ".png";
    img.class = "lodingImg";
    gameLoding.appendChild(img);
}

// 게임 프레임
var round = 0;
function gameBoard(){

    // 플래이어 이동
    var move_x = move_x_r - move_x_l;
    var move_y = move_y_b - move_y_t;
    player.move(move_x - move_y * 3 + 5, (motionTemp++ % 4 + 1));

    // 몬스터 소환
    if(mapSetting.length > 0){
        monList.push(monsterList(mapSetting.pop(), Math.random() * (mapRight - mapLeft) + mapLeft, Math.random() * (mapBottom - mapTop) + mapTop, round));
    }
    // 현재 몬스터가 없으면 생성
    else if(monList.length === 0){
        mapSetting = summonMonster();
        scoreTemp += round * 2 + round > 0 ? 10 : 0;
        round++;
        bulletList.push(new roundPrint());
    }

    // 플래이어 공격
    if(keyAttack === ON && playerAttackDelay === 0){
        keyAttack = OFF;
        playerAttackDelay = player.attackDelay;
        for(attack of player.attack()) {
            bulletList.push(attack);
        }
    }else if(playerAttackDelay > 0){
        playerAttackDelay--;
    }

    // 몬스터 공격
    for(var monCount = monList.length - 1 ; monCount >= 0 ; monCount--){
        var monCheck = monList[monCount].move(player, (motionTemp++ % 4 + 1));
        if(monCheck instanceof Array){
            for(attack of monCheck) {
                bulletList.push(attack);
            }
        }
        else if(monCheck > 0){
            var chack = player.damage(monCheck, monList[monCount].attackDirection);
            // 플래이어 사망시 사망이벤트
            if(chack === -1){
                for(attack of attackList("YOUDIE", 0, 0, 0, 0, player.team, player.player_x_point, player.player_y_point)) {
                    bulletList.push(attack);
                }
                player.player_x_point = undefined;
                player.player_y_point = undefined;
                player.hp = undefined;
                player.size = undefined;
                roundPrint();
                player.die();
            }
        }
    }

    // 공격 처리
    for(var bulletCount = bulletList.length - 1 ; bulletCount >= 0 ; bulletCount--){
        var bulletCheck = bulletList[bulletCount].move();
        // 공격이 명중시
        var damageCheck;
        // 플래이어의 공격
        if(bulletCheck >= 0) {
            damageCheck = bulletList[bulletCount].crash(monList[bulletCheck]);
            if (damageCheck === -1) {
                monList.splice(bulletCheck, 1);
            }
            bulletList.splice(bulletCount, 1);
        }
        // 몬스터의 공격
        else if(bulletCheck === -2){
            damageCheck = bulletList[bulletCount].crash(player);
            if (damageCheck === -1){
                for(attack of attackList("YOUDIE", 0, 0, 0, 0, player.team, player.player_x_point, player.player_y_point)) {
                    bulletList.push(attack);
                }
                player.player_x_point = undefined;
                player.player_y_point = undefined;
                player.hp = undefined;
                player.size = undefined;
                roundPrint();
                player.die();
            }
            bulletList.splice(bulletCount, 1);
        }

        // 탄환이 벽에 부딧혔을때 이벤트
        if(bulletCheck === -1){
            bulletList.splice(bulletCount, 1);
        }
    }
}

function summonMonster() {
    var rand = parseInt(Math.random() * 4);

    var suraimuRandom = function () {
        var rand = parseInt(Math.random() * 4);
        switch (rand){
            case 0:
                return "SuraimuRed";
            case 1:
                return "SuraimuGrean";
            case 2:
                return "SuraimuBlue";
            case 3:
                return "SuraimuYellow";
            default:
        }
    };

    switch (rand){
        case 0:
            return [suraimuRandom(),suraimuRandom()];
            break;
        case 1:
            return [suraimuRandom(),suraimuRandom(),suraimuRandom()];
            break;
        case 2:
            return [suraimuRandom(),suraimuRandom(),suraimuRandom(),suraimuRandom()];
            break;
        case 3:
            return [suraimuRandom(),suraimuRandom(),suraimuRandom(),suraimuRandom(),suraimuRandom()];
            break;
       default:
            break;
    }
}

// 라운드 표시
function roundPrint() {
    this.roundSpeed = 3;

    this.round_x_point = mapLeft + 300;
    this.round_y_point = mapTop + 50;

    this.map = document.getElementById('map');

    this.roundImg = document.createElement("div");
    this.roundImg.innerHTML = "<h1>Round" + round + ": Score = " + scoreTemp + "</h1>";
    this.roundImg.style.position = "absolute";
    this.roundImg.style.height = 50 + "px";
    this.roundImg.style.width = 200 + "px";
    this.roundImg.style.color = "#fff";
    this.roundImg.style.top = this.round_y_point - 25 +"px";
    this.roundImg.style.left = this.round_x_point - 100 +"px";
    this.map.appendChild(this.roundImg);

    this.move = function () {
        this.round_x_point -= this.roundSpeed;
        this.roundImg.style.top = this.round_y_point - 25 + "px";
        this.roundImg.style.left = this.round_x_point - 100 + "px";
        if (this.round_x_point - 100 < mapLeft) {
            return this.delete();
        }
    };
    this.delete = function () {
        try {
            this.map.removeChild(this.roundImg);
        }
        catch (e){
        }
        return -1;
    }
}