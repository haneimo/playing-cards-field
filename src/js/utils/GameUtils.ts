import { GameConstants } from "../definsion/GameConstants";

export const calcDistance = function(x, y, x2, y2) {
    return Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));    
}

export const generateAveragePosition = function*(screenWidth, screenHeight, count) {
    // 画面でcount個のポイントを生成する
    // 生成するポイントは画面を中心とした楕円形に配置する
    // 画面の中心を原点とした座標系で考える
    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;
    const radiusX = screenWidth / 2 - GameConstants.GAME_CARD_WIDTH / 2;
    const radiusY = screenHeight / 2 - GameConstants.GAME_CARD_HEIGHT / 2;
    const angle = 360 / count;
    let currentAngle = 0;
    for(let i=0; i<count; i++) {
        const x = centerX + radiusX * Math.cos(currentAngle * Math.PI / 180);
        const y = centerY + radiusY * Math.sin(currentAngle * Math.PI / 180);
        currentAngle += angle;
        yield {x, y};
    }

}