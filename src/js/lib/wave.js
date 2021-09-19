export {
    init
}

let unit = 100,
    canvasList, // キャンバスの配列
    info = {}, // 全キャンバス共通の描画情報
    colorList; // 各キャンバスの色情報

let startTime = 0,
    currentTime = 0,
    spendTime = 0

const animationTime = 10000
const animationCanvas = document.getElementById("purin_wave")
const parentCanvas = document.querySelector(".purin_black");
const text_wrapper = document.querySelector(".text_wrapper");
const percentTxt = document.querySelector(".percent_txt_2");

/**
 * Init function.
 * 
 * Initialize variables and begin the animation.
 */
function init() {
    info.seconds = 0;
    info.t = 0;
    canvasList = [];
    colorList = [];
    // const style = window.getComputedStyle(parentCanvas);
    // canvas1個めの色指定
    canvasList.push(animationCanvas);
    colorList.push(['#FFF1A0', '#7D4E53', '#FFF1A0']); //重ねる波の色設定
    // 各キャンバスの初期化
    for (var canvasIndex in canvasList) {
        var canvas = canvasList[canvasIndex];
        canvas.width = parentCanvas.offsetWidth;
        canvas.height = parentCanvas.offsetHeight; //波の高さ
        canvas.contextCache = canvas.getContext("2d");
    }
    startTime = performance.now()
    currentTime = performance.now()
    // 共通の更新処理呼び出し
    update();
}

// function update() {
//     for (var canvasIndex in canvasList) {
//         var canvas = canvasList[canvasIndex];
//         // 各キャンバスの描画
//         draw(canvas, colorList[canvasIndex]);
//     }
//     // 共通の描画情報の更新
//     info.seconds = info.seconds + .014;
//     info.t = info.seconds * Math.PI;
//     // 自身の再起呼び出し
//     setTimeout(update, 35);
// }

let ticking = false

function update() {
    if (!ticking && startTime + animationTime > performance.now()) {
        requestAnimationFrame(function () {
            ticking = false;
            for (var canvasIndex in canvasList) {
                var canvas = canvasList[canvasIndex];
                // 各キャンバスの描画
                draw(canvas, colorList[canvasIndex]);
            }
            const difference = (performance.now() - currentTime) / 5000
            spendTime = performance.now() - startTime
            // 共通の描画情報の更新
            info.seconds = info.seconds + difference;
            // info.seconds = info.seconds + difference;
            info.t = info.seconds * Math.PI;
            // 自身の再起呼び出し
            currentTime = performance.now()
            update()
        });
        ticking = true;
    }
}
/**
 * Draw animation function.
 * 
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
function draw(canvas, color) {
    // 対象のcanvasのコンテキストを取得
    var context = canvas.contextCache;
    // キャンバスの描画をクリア
    context.clearRect(0, 0, canvas.width, canvas.height);

    const offsetH = Math.floor(canvas.height - ((performance.now() - startTime) / animationTime * canvas.height))
    const percent = (performance.now() - startTime) / animationTime * 100

    //波の重なりを描画 drawWave(canvas, color[数字（波の数を0から数えて指定）], 透過, 波の幅のzoom,波の開始位置の遅れ )
    // drawWave(canvas, color[0], 1, 2.2, 0); //0.5⇒透過具合50%、3⇒数字が大きいほど波がなだらか

    // drawWave(canvas, color[1], 0.7, 2.2, 100, 0);
    // drawWave(canvas, color[0], 1, 2.2, 100, 30);
    drawWave(canvas, color[1], 0.7, 1.5, 100, offsetH);
    drawWave(canvas, color[0], 1, 1.5, 100, offsetH + 30);
    // console.log(percent)
    percentTxt.textContent = `${Math.floor(percent)}%`;
    // const renderedText = htmlElement.innerText;


    if(offsetH <= 0){
        document.querySelector('.text_wrapper').classList.add('hide')
        document.querySelector('.purin_tachie').classList.add('show')
        document.querySelector('.purin_black').classList.add('hide')
        animationCanvas.classList.add('hide')
    }
}

/**
 * 波を描画
 * drawWave(色, 不透明度, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawWave(canvas, color, alpha, zoom, delay, offset = 0) {
    var context = canvas.contextCache;
    context.fillStyle = color; //塗りの色
    context.globalAlpha = alpha;
    context.beginPath(); //パスの開始
    drawSine(canvas, info.t / 0.5, zoom, delay, offset);
    context.lineTo(canvas.width + 10, canvas.height); //パスをCanvasの右下へ
    context.lineTo(0, canvas.height); //パスをCanvasの左下へ
    context.closePath() //パスを閉じる
    context.fill(); //波を塗りつぶす
}

/**
 * Function to draw sine
 * 
 * The sine curve is drawn in 10px segments starting at the origin. 
 * drawSine(時間, 波の幅のzoom, 波の開始位置の遅れ)
 */
function drawSine(canvas, t, zoom, delay, offset) {
    var xAxis = offset - Math.floor(canvas.height / 10);
    // var xAxis = offset;
    var yAxis = 0;
    var context = canvas.contextCache;
    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t; //時間を横の位置とする
    var y = Math.sin(x) / zoom;
    context.moveTo(yAxis, unit * y + xAxis); //スタート位置にパスを置く

    // Loop to draw segments (横幅の分、波を描画)
    for (let i = yAxis; i <= canvas.width + 10; i += 10) {
        x = t + (-yAxis + i) / unit / zoom;
        y = Math.sin(x - delay) / 3;
        context.lineTo(i, unit * y + xAxis);
    }
}

// init();