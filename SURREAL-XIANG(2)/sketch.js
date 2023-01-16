/* 
👁‍The code of this file should follow the main file, but the computer can't drive so many codes, so I divided it into two pieces of code to complete, and edited the video result of this code to the latter part of the complete video.

📼📼
fff.mp4 :
comes from the project of my term1-programming course. The original video is also surreal, and the styleGan effect is added on this basis.

*/

let style6;
let ffvid;
let voicefinal = new p5.Speech();

function setup() {
    createCanvas(960, 630);
	ffvid = createVideo(['videos/fff.mp4'],videoLoaded);
	ffvid.hide();
}

function videoLoaded(stream){
	style6= ml5.styleTransfer("stylemodel/Xiang5", modelLoaded); //Grosz
}

function modelLoaded() {

	transferStyleSixth();
}

function transferStyleSixth() {
	const canvasElement = select ("canvas").elt;
    style6.transfer(canvasElement, function (err, result) {
    let tempDOMImage6 = createImg(result.src).hide();
    image(tempDOMImage6,0,0,width,height);
    tempDOMImage6.remove();

    transferStyleSixth();
  });
}

function draw() {
	ffvid.size(960,630);
	ffvid.loop();
	voicefinal.speak("eat your chocolate wash your brain dada dada gulp some rain drink some bird’s milk wash your sweets dada dada eat your meat from Chanson Dada by Tristan Tzara");
	
}