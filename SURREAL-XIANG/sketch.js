/*
illustrate:
ML: respectively trained charRnn, styleGan, poseNet.
1.charRnn: Poems by Tristan Tzara
2.style transfer: 
Xiang: self-drawn collage
Xiang1: Sketches from the Classical Period
Xiang2: Impressionism
Xiang3: a more local (rough) sketch
Xiang4: Nude Descending a Staircase by Marcel_Duchamp
Xiang (second file):

pic:
sky:Vladimir Kush RIPPLES ON THE OCEAN
eye:René Magritte_The False Mirror_Paris 1929
fork:Patterned Fork I - Wrapped Canvas Painting By Rosalind Wheeler
hat:
*/

let video,
  poseNet,
  pose,
  skeleton,
  brain,
  poseLabel = " ";

let charRNN,
  textInput,
  tempSlider,
  startBtn,
  resetBtn,
  singleBtn,
  generating = false,
  generated_text = " ";

let style1;
let img, graphics;
let style2;
let img2, graphics2;
let style3;
let img3, graphics3;
let ranges = 100;
let style4;
let img4, graphics4;
let style5;
let img5, graphics5;

let hatImg;
let eyeImg;
let faceImg;
let bodyImg;
let f4Img;
let forkImg;
let skyImg;
let noseImg;
let mouthImg;
let hand1, hand2, hand3, hand4, hand5, hand6, hand7, hand8, hand9, hand10;
let posecbody, posechand;
let posebdoor, posebeye;

let flowervid;

let l = 1600;
let posedx, posedy;
let poseddx, poseddy;

let font;
let voice = new p5.Speech();
let texto = "Σáㄒ DαDá мёáｔོ࿆༅"; //eat dada meat

/* reference of color || flowers 
200512 Flower Blooming
by tanminggang https://openprocessing.org/sketch/990012
*/
let colors = "ffffff-ff8152-f04278-cc27d5-f7d33a"
  .split("-")
  .map((a) => "#" + a);
let flowers = [];

function preload() {
  hatImg = loadImage("picture/hat.png");
  eyeImg = loadImage("picture/eye.png");
  faceImg = loadImage("picture/face.png");
  bodyImg = loadImage("picture/body.png");
  f4Img = loadImage("picture/f4.png");
  forkImg = loadImage("picture/fork.png");
  skyImg = loadImage("picture/sky.png");
  noseImg = loadImage("picture/nose.png");
  mouthImg = loadImage("picture/mouth.png");
  hand1 = loadImage("picture/hand1.png");
  hand2 = loadImage("picture/hand2.png");
  hand3 = loadImage("picture/hand3.png");
  hand4 = loadImage("picture/hand4.png");
  hand5 = loadImage("picture/hand5.png");
  hand6 = loadImage("picture/hand6.png");
  hand7 = loadImage("picture/hand7.png");
  hand8 = loadImage("picture/hand8.png");
  hand9 = loadImage("picture/hand9.png");
  hand10 = loadImage("picture/hand10.png");
  posecbody = loadImage("picture/posecbody.png");
  posechand = loadImage("picture/posechand.png");
  posebdoor = loadImage("picture/posebdoor.png");
  posebeye = loadImage("picture/posebeye.png");

  font = loadFont("words/Chellin_400.ttf");
}
function setup() {
  //	frameRate(80);
  createCanvas(960, 630);
  video = createCapture(VIDEO, cameraLoaded);
  video.size(960, 630);
  video.hide();
  graphics = createGraphics(960, 630);
  graphics2 = createGraphics(480, 210);
  graphics3 = createGraphics(960, 630);
  graphics4 = createGraphics(480, 315);
  graphics5 = createGraphics(250, 450);

  flowervid = createVideo(["videos/flowervid.mov"]);
  flowervid.hide();

  charRNN = ml5.charRNN("charRnnmodel/TristanTzara/", charrnnmodelReady);

  textInput = select("#textInput");
  startBtn = select("#start");
  resetBtn = select("#reset");

  startBtn.mousePressed(generate);
  resetBtn.mousePressed(resetModel);

  for (let i = 0; i < 100; i++) {
    flowers.push({
      x: random(width),
      y: random(height),
      r: random(50, 120),
      bloom: random(0.5, 1),
      targetBloom: 1,
      color: random(colors),
      note: random(["D2","D3","F#3","A3","C#4","D4","F#4","A4","C#5","E5","F#5","A6"]),
    });
  }
}

function cameraLoaded(stream) {
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
  style1 = ml5.styleTransfer("stylemodel/Xiang1", modelLoaded); //sketch
  style2 = ml5.styleTransfer("stylemodel/Xiang", modelLoaded); //collage
  style3 = ml5.styleTransfer("stylemodel/Xiang2", modelLoaded); //impression
  style4 = ml5.styleTransfer("stylemodel/Xiang3", modelLoaded); //sketch_low
  style5 = ml5.styleTransfer("stylemodel/Xiang4", modelLoaded); //Marcel_Duchamp
  let options = {
    inputs: 40,
    outputs: 5,
    task: "classification",
    debug: true,
  };
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: "posemodel/model.json",
    metadata: "posemodel/model_meta (1).json",
    weights: "posemodel/model.weights.bin",
  };
  brain.load(modelInfo, brainLoaded);
}

function brainLoaded() {
  console.log("pose classification ready!");
  classifyPose();
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let keypoint of pose.keypoints) {
      let x = keypoint.position.x;
      let y = keypoint.position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log("poseNet and model ready");
  transferStyle();
  transferStyleSecond();
  transferStyleThird();
  transferStyleForth();
  transferStyleFifth();
}

function transferStyle() {
  style1.transfer(graphics, function (err, result) {
    let tempDOMImage = createImg(result.src).hide();
    img = tempDOMImage;
    tempDOMImage.remove();
    transferStyle();
  });
}

function transferStyleSecond() {
  style2.transfer(graphics2, function (err, result) {
    let tempDOMImage2 = createImg(result.src).hide();
    img2 = tempDOMImage2;
    tempDOMImage2.remove();
    transferStyleSecond();
  });
}

function transferStyleThird() {
  style3.transfer(graphics3, function (err, result) {
    let tempDOMImage3 = createImg(result.src).hide();
    img3 = tempDOMImage3;
    tempDOMImage3.remove();
    transferStyleThird();
  });
}

function transferStyleForth() {
  style4.transfer(graphics4, function (err, result) {
    let tempDOMImage4 = createImg(result.src).hide();
    img4 = tempDOMImage4;
    tempDOMImage4.remove();
    transferStyleForth();
  });
}

function transferStyleFifth() {
  style5.transfer(graphics5, function (err, result) {
    let tempDOMImage5 = createImg(result.src).hide();
    img5 = tempDOMImage5;
    tempDOMImage5.remove();
    transferStyleFifth();
  });
}

function draw(results) {
  background(0);
  push();
  translate(video.width, 0);
  scale(-1, 1);

  //........................................................1
  //...............................................................90
  if (frameCount < 90) {
    video.loadPixels();
    push();
    for (let ny = 0; ny < video.height; ny += 5) {
      for (let nx = 0; nx < video.width; nx += 5) {
        let pixel = video.pixels[(ny * video.width + nx) * 4];
        noFill();
        stroke(80);
        strokeWeight(0.8);
        rectMode(CENTER);
        if (pixel < 60) fill(230);
        else if (pixel >= 60 && pixel < 130) fill(40);
        else if (pixel >= 130 && pixel < 180) fill(255);
        else if (pixel >= 180 && pixel < 230) fill(20);
        else if (pixel >= 230 && pixel < 260) fill(0);
        else if (pixel >= 260 && pixel < 330) fill(200);
        else if (pixel >= 330) fill(50);
        rect(nx, ny, 5, 5);
      }
    }
    pop();
    //....................................................sketch
    push();
    if (img) {
      image(img, 480, 210, 480, 210);
    }
    graphics.image(video, 0, 0, 960, 630, 490, 200, 480, 210);
    pop();

    //....................................................collage
    push();
    if (img2) {
      image(img2, 0, 0, 480, 210);
    }
    graphics2.image(video, 0, 0, 960, 630);
    pop();

    //....................................................impression
    push();
    if (img3) {
      image(img3, 0, 420, 480, 210);
    }
    graphics3.image(video, 0, 0, 960, 630, -5, 420, 480, 210);
    pop();
    //....................................................wave
    push();
    translate(0, 100);
    noFill();
    strokeWeight(2);
    for (let i = 0; i < ranges; i++) {
      let paint = map(i, 0, ranges, 0, 255);
      let alph = map(i, 0, ranges, 0, 255);
      stroke(paint, alph);
      beginShape();
      for (let x = -10; x < width + 11; x += 20) {
        let n = noise(x * 0.001, i * 0.01, frameCount * 0.02);
        let y = map(n, 0, 1, 0, height);
        vertex(x, y);
      }
      endShape();
    }
    pop();

    voice.speak(
      "Take a newspaper.Take some scissors.Choose from this paper an article the length you want to make your poem.Cut out the article.Next carefully cut out each of the words that make up this article and put them all in a bag.Shake gently.Next take out each cutting one after the other.Copy conscientiously in the order in which they left the bag.The poem will resemble you.And there you are an infinitely original author of charming sensibility, even though unappreciated by the vulgar herd."
    );//from 'To Make A Dadist Poem' by Tristan Tzara
  }

  //........................................................2
  if (frameCount > 90) {
    graphics = createGraphics(0, 0);
    graphics2 = createGraphics(0, 0);
    graphics3 = createGraphics(0, 0);
    
	  if (pose) {
    
		if (poseLabel == "A") {//........................................................♠...A
        image(skyImg, 10, 0, skyImg.width * 1.2, skyImg.height * 1.2);//.............sky
		  //.............flowers_background
        for (let i = 0; i < flowers.length; i++) {
          let f = flowers[i];
          flower(f);
        }
        push();//.......................................hat
        translate(0, 200);
        push();
        let hatx = pose.keypoints[0].position.x;
        let haty = pose.keypoints[0].position.y;
        push();
        translate(hatx - 70, haty - 200);//.....................flower_face
        for (let i = 50; i > 0; i -= 10) {
          for (let q = 0; q < 360; q += 18) {
            let x = sin(radians(q + i));
            let y = cos(radians(q + i));
            let s = i * 3;
            fill(125 + sin(radians(i + frameCount)) * 125, 100);
            stroke(255);
            strokeWeight(0.5);
            push();
            translate(x * i, y * i);
            rotate(radians(-q - i + 90));
            beginShape();
            vertex(0, 0);
            bezierVertex(s, -s / (4 + 2 * sin(frameCount * 0.03)),s,s / (4 + 2 * sin(frameCount * 0.03)),0,0);
            endShape();
            fill(125 + sin(radians(i + frameCount)) * 125,0,125 + sin(radians(i + frameCount + 180)) * 125,
              map(i, 50, 0, 0, 50)
            );
            beginShape();
            vertex(0, 0);
            bezierVertex(s,-s / (5 + 2 * sin(frameCount * 0.03)),s,s / (5 + 2 * sin(frameCount * 0.03)),0,0);
            endShape();
            pop();
          }
        }
        pop();
        image(faceImg, hatx - 210,haty - 350,faceImg.width * 1.7,faceImg.height * 1.7);
        image(hatImg,hatx - 290,haty - 460,hatImg.width * 0.6,hatImg.height * 0.6);
        pop();

        push();
        let bodyx = pose.keypoints[5].position.x;
        let bodyy = pose.keypoints[5].position.y;
        translate(bodyx - 480, bodyy - 170);
        image(bodyImg, 0, 0, bodyImg.width, bodyImg.height);
        pop();

        push();
        let f4x = pose.keypoints[0].position.x;
        let f4y = pose.keypoints[0].position.y;
        translate(f4x - 120, f4y - 170);
        image(f4Img, 0, 0, f4Img.width * 0.17, f4Img.height * 0.17);
        pop();

        push();
        let eyex = pose.keypoints[1].position.x;
        let eyey = pose.keypoints[1].position.y;
        translate(eyex - 120, eyey - 180);
        scale(sin(frameCount * 0.05) * 0.3);
        image(eyeImg, 0, 0, eyeImg.width * 0.4, eyeImg.height * 0.4);
        pop();

        push();
        let rightforkx = pose.keypoints[8].position.x;
        let rightforky = pose.keypoints[8].position.y;
        image(forkImg,rightforkx - 200,rightforky - 300,forkImg.width * 0.6,forkImg.height * 0.6);
        pop();

        pop();
      } else if (poseLabel == "D") {//........................................................♣...D
        push();
        fill(187, 45, 34);
        rect(0, 0, 960, 630);

        for (let x = 0; x <= width; x += 70) {
          for (let y = 0; y <= height; y += 70) {
            image(
              noseImg,
              x + random(-20, 20),
              y + random(-20, 20),
              noseImg.width * 0.03 * map(y, 0, height, 1, 5),
              noseImg.height * 0.03 * map(y, 0, height, 1, 5)
            );
          }
        }
        stroke(187, 45, 34);
        strokeWeight(5);
        noFill();
        posedx = pose.keypoints[9].position.x - 100;
        posedy = pose.keypoints[9].position.y;
        poseddx = pose.keypoints[10].position.x + 100;
        poseddy = pose.keypoints[10].position.y;
        beginShape();
        for (let i = 0; i < l; i++) {
          posedx += noise(posedx * 0.02, posedy * 0.02, i * 0.02) * 10 - 5;
          posedy += noise(posedx * 0.02, posedy * 0.02, frameCount * 0.1) * 10 - 5;
          vertex(posedx, posedy);
        }
        endShape();
        beginShape();
        for (let i = 0; i < l; i++) {
          poseddx += noise(poseddx * 0.02, poseddy * 0.02, i * 0.02) * 10 - 5;
          poseddy += noise(poseddx * 0.02, poseddy * 0.02, frameCount * 0.1) * 10 - 5;
          vertex(poseddx, poseddy);
        }
        endShape();
        pop();
        //.............................................................sketch_low
        push();
        if (img4) {
          image(img4, 240, 158, 480, 315);
        }
        graphics4.image(video, 0, 0, 480, 315);
        pop();

        push();
        for (let x = 220; x <= 700; x += 50) {
          for (let y = 140; y <= 455; y += 315) {
            image(mouthImg, x, y, mouthImg.width * 0.1, mouthImg.height * 0.1);
          }
        }
        for (let x = 220; x <= 700; x += 480) {
          for (let y = 140; y <= 455; y += 40) {
            image(mouthImg, x, y, mouthImg.width * 0.1, mouthImg.height * 0.1);
          }
        }
        pop();

        push();
        smooth();
        let t = 600;
        noStroke();
        fill(255);
        ellipse(t / 2 - 150, t / 2, 100, 50);
        ellipse(t / 2 + 150, t / 2 - 100, 100, 50);
        ellipse(t / 2, t / 2 - 200, 100, 50);
        ellipse(t / 2 + 300, t / 2 + 250, 100, 50);
        ellipse(t / 2 + 500, t / 2 + 220, 100, 50);
        noStroke();
        fill(187, 45, 34);
        ellipse(t / 2 - 150, t / 2, 50, 50);
        ellipse(t / 2 + 150, t / 2 - 100, 50, 50);
        ellipse(t / 2, t / 2 - 200, 50, 50);
        ellipse(t / 2 + 300, t / 2 + 250, 50, 50);
        ellipse(t / 2 + 500, t / 2 + 220, 50, 50);
        let er = 20;
        fill(0);
        noStroke();
        let x5x = t / 2 + 500;
        let y5y = t / 2 + 220;
        let mlx5 = map(posedx, 0, width, x5x - 15, x5x + 15);
        let mly5 = map(posedy, 0, width, y5y - 15, y5y + 30);
        ellipse(mlx5, mly5, er, er);

        let x4x = t / 2 + 300; //
        let y4y = t / 2 + 250;
        let mlx4 = map(poseddx, 0, width, x4x - 15, x4x + 15);
        let mly4 = map(poseddy, 0, width, y4y - 15, y4y + 30);
        ellipse(mlx4, mly4, er, er);

        let x3x = t / 2;
        let y3y = t / 2 - 200;
        let mlx3 = map(posedx, 0, width, x3x - 15, x3x + 15);
        let mly3 = map(posedy, 0, width, y3y - 15, y3y + 30);
        ellipse(mlx3, mly3, er, er);

        let Leftx = t / 2 + 150;
        let Lefty = t / 2 - 100;
        let mlx = map(posedx, 0, width, Leftx - 15, Leftx + 15);
        let mly = map(posedy, 0, width, Lefty - 15, Lefty + 30);
        ellipse(mlx, mly, er, er);

        let Rightx = t / 2 - 150; //
        let Righty = t / 2;
        let mrx = map(poseddx, 0, width, Rightx - 15, Rightx + 15);
        let mry = map(poseddy, 0, width, Righty - 15, Righty + 30);
        ellipse(mrx, mry, er, er);
        pop();
		  
      } else if (poseLabel == "C") {//........................................................♥...C
        video.loadPixels();
        push();
        for (let ny = 0; ny < video.height; ny += 5) {
          for (let nx = 0; nx < video.width; nx += 5) {
            let pixel = video.pixels[(ny * video.width + nx) * 4];
            noFill();
            stroke(255);
            noStroke();
            rectMode(CENTER);
            if (pixel < 60) fill(247, 244, 143);
            else if (pixel >= 60 && pixel < 130) fill(53, 55, 42);
            else if (pixel >= 130 && pixel < 180) fill(187, 220, 86);
            else if (pixel >= 180 && pixel < 230) fill(237, 218, 35);
            else if (pixel >= 230 && pixel < 260) fill(57, 54, 35);
            else if (pixel >= 260 && pixel < 330) fill(191, 183, 65);
            else if (pixel >= 330) fill(190, 235, 27);
            rect(nx, ny, 5, 5);
          }
        }
        pop();
        push();
        let posecbodyx = pose.keypoints[0].position.x;
        let posecbodyy = pose.keypoints[0].position.y;
        image(posecbody,posecbodyx - 200,posecbodyy + 20,posecbody.width * 1.2,posecbody.height * 1.2);
        pop();
        push();
        let poseceyex = pose.keypoints[1].position.x;
        let poseceyey = pose.keypoints[1].position.y;
        image(eyeImg,poseceyex,poseceyey,eyeImg.width * 0.12,eyeImg.height * 0.12);
        pop();
        push();
        let poseceyerx = pose.keypoints[2].position.x;
        let poseceyery = pose.keypoints[2].position.y;
        image(eyeImg,poseceyerx,poseceyery,eyeImg.width * 0.08,eyeImg.height * 0.08);
        pop();
        push();
        image(hand1, 700, -5, hand1.width * 0.7, hand1.height * 0.7);
        image(hand2, 600, 80, hand2.width * 0.7, hand2.height * 0.7);
        image(hand3, 700, -150, hand3.width * 0.6, hand3.height * 0.6);
        image(hand4, 500, 60, hand4.width * 0.7, hand4.height * 0.7);
        image(hand5, 700, -10, hand5.width * 0.5, hand5.height * 0.5);
        image(hand6, 600, 0, hand6.width * 0.7, hand6.height * 0.7);
        image(hand7, 700, -60, hand7.width * 0.7, hand7.height * 0.7);
        image(hand8, 600, 0, hand8.width * 0.7, hand8.height * 0.7);
        image(hand9, 700, -50, hand9.width * 0.6, hand9.height * 0.6);
        image(hand10, 450, 0, hand10.width * 0.6, hand10.height * 0.6);
        pop();

        push();
        let vidx = pose.keypoints[9].position.x;
        let vidy = pose.keypoints[9].position.y;
        flowervid.size(200, 200);
        image(flowervid, vidx - 170, vidy - 90);
        flowervid.loop();
        pop();

        push();
        let posechandx = pose.keypoints[9].position.x;
        let posechandy = pose.keypoints[9].position.y;
        image(posechand,posechandx - 200,posechandy - 800,posechand.width * 0.8,posechand.height * 0.8);
        pop();
		  
      } else if (poseLabel == "B") {//........................................................♦...B
        push();
        if (img5) {
          image(img5, 330, 90, 250, 450);
        }
        graphics5.image(video, 0, 0, 250, 450);
        pop();

        push();
        translate(0, 170);
        noFill();
        strokeWeight(3);
        for (let i = 0; i < ranges; i++) {
          let paint = map(i, 0, ranges, 255, 0);
          let alph = map(i, 0, ranges, 0, 255);
          stroke(paint, 66, 24, alph);
          beginShape();
          for (let x = 250; x < width - 250; x += 30) {
            let n = noise(x * 0.001, i * 0.01, frameCount * 0.02);
            let y = map(n, 0, 1, 0, height);
            vertex(x, y);
          }
          endShape();
        }
        pop();
        push();
        image(posebdoor,10,10,posebdoor.width * 1.95,posebdoor.height * 1.95);
        pop();
        push();
        let posebeyex = pose.keypoints[0].position.x;
        let posebeyey = pose.keypoints[0].position.y;
        image(posebeye,posebeyex - 100,posebeyey - 90,posebeye.width * 0.8,posebeye.height * 0.8);
        pop();
      }
    } //...............if (pose)
  }
  pop();

  //...background
  noFill();
  strokeWeight(50);
  stroke(187, 45, 34);
  rect(0, 0, 960, 630);
  if (pose) {
   if (poseLabel == "C") {
      stroke(187, 220, 86);
      rect(0, 0, 960, 630);
  }
  }

  //.................................................90
  if (frameCount < 90) {
    push();
    noStroke();
    translate(-190, 0);
    textSize(35);
    fill(0);
    Array.from(texto).forEach(function (caracter, i) {
      let posX = 300 + 50 * i;
      let oscilacion = cos(i + frameCount / 20) * 150;
      let posY = height / 2 + oscilacion;
      text(caracter, posX, posY);
    });
    pop();
  }
  //.................................................90
  if (frameCount < 90) {
    fill(187, 45, 34);
    rect(width / 2 - 120, 85, 238, 11);
    rect(width / 2 - 100, 292, 190, 11);
    rect(width / 2 - 185, 475, 360, 11);
    textSize(40);
    textStyle(BOLDITALIC);
    textAlign(CENTER);
    fill(255);
    noStroke();
    textLeading(150);
    text("The system is", 0, 70, width, height);
    text("in principle", 0, 280, width, height);
    text("without any system", 0, 460, width, height);
  }
  push();
  //................................................100
  if (frameCount < 100) {
    generated_text = " ";
  }
  if (frameCount > 100 || frameCount < 900) {
    let bbox = font.textBounds(generated_text, 35, 198, 22);
    fill(100, 200);
    noStroke();
    rect(bbox.x, bbox.y, bbox.w, bbox.h);

    textFont(font);
    textSize(30);
    fill(250);
    noStroke();
    textAlign(LEFT);
    text(generated_text, 30, 160, 900, 400);
  }
  pop();
  if (frameCount >= 900) {
    generating = false;
    generated_text = " ";
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label.toUpperCase();
    console.log(poseLabel);
  }

  classifyPose();
}

function windowResized() {
  resizeCanvas(windowWidth, canvasHeight);
}

function updateSliders() {
  //select('#temperature').html(tempSlider.value());
}

async function charrnnmodelReady() {
  // select('#status').html('Model Loaded');
  resetModel();
}

function resetModel() {
  charRNN.reset();
  const seed = select("#textInput").value();
  charRNN.feed(seed);
  generated_text = seed;
}

function generate() {
  if (generating) {
    generating = false;
    startBtn.html("Start");
  } else {
    generating = true;
    startBtn.html("Pause");
    loopRNN();
  }
}

async function loopRNN() {
  while (generating) {
    await predict();
  }
}

async function predict() {
  let temperature = 0.55;
  let next = await charRNN.predict(temperature);
  await charRNN.feed(next.sample);
  generated_text += next.sample;
}

function flower(flower) {
  push();
  noStroke();
  translate(flower.x, flower.y);
  fill(119, 27, 27);

  ellipse(0, 0, 20 * flower.bloom);
  let cc = color(flower.color);
  fill(cc);
  ellipseMode(CORNER);
  rotate(flower.bloom);
  for (let i = 0; i <= 15; i++) {
    rotate(((2 * PI) / 15) * sin(frameCount * 0.01));
    cc.setAlpha(random(150, 255));
    fill(cc);
    push();
    translate(10 * flower.bloom, -flower.r / 12);
    ellipse(0, 0, flower.r * flower.bloom, flower.r / 6);
    stroke(0, 30);
    line(0, 0, flower.r * flower.bloom, flower.r / 6);
    pop();
  }

  pop();
}