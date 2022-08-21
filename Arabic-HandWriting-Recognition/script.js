const Model_Url = 'https://shubbair.github.io/Arabic-HandWriting-Recognition/model/model.json';

let model;

var pred_btn , clr_btn , text_state , text_data;

var state = 'Loading...';
var data = '';

var pixel_values = [];

async function run(){
    model = await tf.loadLayersModel(Model_Url);
    if (model) state = 'Model Loaded';
}

function preload(){
  run();   
  pred_btn = select('#pred-btn'); 
  clr_btn = select('#clr-btn');
  text_state = select('#text-state');
  text_data = select('#text-data');
}

function setup(){
    createCanvas(500,500);
    background(0);

    clr_btn.mousePressed(function(){
        background(0);
            
        pixel_values = [];
    });

    pred_btn.mousePressed(function(){
        pixel_values = [];

        loadPixels();
        const d = pixelDensity();

            for (let y = 0 ; y < height; y++) {
            for (let x = 0 ; x < width; x++) {
                 const i = 4 * d*(y * d*width + x); // 4
                 const [r, g, b] = [pixels[i], pixels[i + 1], pixels[i + 2]]; // get colors
                 pixel_values.push((( r + g + b) / 3.0) /255.0);
            }
        }

        async function prediction(){
            var arabic_chars = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي';

            arabic_labels = [];
            arabic_chars.split('').forEach(function(char){
                arabic_labels.push(char);
            });
            const img = tf.reshape(pixel_values,shape=[1,500,500,1]);
            const smallImg = tf.image.resizeBilinear(img,[32,32]);
            const output = model.predict(smallImg);
            const result = await output.data();
            data = arabic_labels[result.indexOf(Math.max(...result))];
        }
        prediction();
    });
}

function draw(){
    text_state.html(state);
    text_data.html(data);
    if(mouseIsPressed){
        noFill();
        stroke(255);
        strokeWeight(28.0);
        line(mouseX,mouseY,pmouseX,pmouseY);
    }
}
