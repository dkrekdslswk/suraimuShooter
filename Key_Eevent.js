/**
 * Created by sec on 2017-06-21.
 */

// 키 눌린 상태 저장 그리고 땐 상태를 저장
document.onkeydown=onkeyDown;
document.onkeyup=onkeyClear;

// 상수
var KEY_LEFT = 37;
var KEY_RIGHT = 39;
var KEY_UP = 38;
var KEY_DOWN = 40;

// 켜지고 꺼진 상태
var OFF = 0;
var ON = 1;

// 이동용 변수
var move_x_l = OFF;
var move_x_r = OFF;
var move_y_t = OFF;
var move_y_b = OFF;

// 공격용 변수
var keyAttack = OFF;

// 키를 누르는 이벤트
function onkeyDown(evant) {
    var key = evant.keyCode;
    // 방향키 설정
    if(key === KEY_LEFT){
        move_x_l = ON;
    }
    else if(key === KEY_RIGHT){
        move_x_r = ON;
    }
    else if(key === KEY_UP) {
        move_y_t = ON;
    }
    else if(key === KEY_DOWN) {
        move_y_b = ON;
    }
    else if(key === 90){
        if(keyAttack === OFF) {
            keyAttack = ON;
        }
    }
}

// 키에서 손을 때는 이벤트
function onkeyClear(evant) {
    var key = evant.keyCode;
    // 방향키 설정
    if(key === KEY_LEFT){
        move_x_l = OFF;
    }
    else if(key === KEY_RIGHT){
        move_x_r = OFF;
    }
    else if(key === KEY_UP) {
        move_y_t = OFF;
    }
    else if(key === KEY_DOWN) {
        move_y_b = OFF;
    }
}