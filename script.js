const loading = document.getElementById("loading");
const editor = document.getElementById("editor");


setTimeout(()=>{

loading.classList.add("hide");
editor.classList.add("show");

},3500);





/* CURSOR */

const cursor =
document.getElementById("cursorComment");


const comments = {

lily:"ur favorite lily",

sunflower:"ihh bunga matahari aku",

rose:"yaelah pasaran",

orchid:"keren orchid",

default:"pilih bunga nya sayang"

};



document.addEventListener(
"mousemove",
(e)=>{

if(cursor){

cursor.style.left =
e.clientX+"px";

cursor.style.top =
e.clientY+"px";

cursor.style.display="block";

}

});



document
.querySelectorAll(".flower-item")
.forEach(item=>{


item.addEventListener(
"mouseenter",
()=>{

cursor.innerText =
comments[item.dataset.flower]
||
comments.default;

});


item.addEventListener(
"mouseleave",
()=>{

cursor.innerText =
comments.default;

});


});






/* FLOWER */


const bouquetBox =
document.getElementById("bouquetBox");


const flowerLayer =
document.getElementById("flowerLayer");


let selectedFlower = null;

let moveable = null;



document
.querySelectorAll(".flower-item")
.forEach(item=>{


item.addEventListener(
"dragstart",
()=>{

selectedFlower =
item.dataset.flower;

});


});





function createFlower(name,x,y){


const flower =
document.createElement("div");


flower.className =
"flower-object";


flower.innerHTML =
`
<img src="assets/flowers/${name}.png">
`;



flower.style.left =
`${x-60}px`;

flower.style.top =
`${y-60}px`;



flowerLayer.appendChild(
flower
);



activateMoveable(
flower
);


}





/* DESKTOP DROP */


bouquetBox.addEventListener(
"dragover",
e=>{

e.preventDefault();

});




bouquetBox.addEventListener(
"drop",
e=>{


e.preventDefault();


if(!selectedFlower)
return;



const rect =
bouquetBox.getBoundingClientRect();



createFlower(
selectedFlower,

e.clientX-rect.left,

e.clientY-rect.top

);


});







/* MOBILE TOUCH */


let touchFlower=null;



document
.querySelectorAll(".flower-item")
.forEach(item=>{


item.addEventListener(
"touchstart",
e=>{


touchFlower =
item.dataset.flower;


},
{
passive:true
});

item.addEventListener(
"touchend",
e=>{


if(!touchFlower)
return;



const touch =
e.changedTouches[0];


const rect =
bouquetBox.getBoundingClientRect();



const x =
touch.clientX-rect.left;


const y =
touch.clientY-rect.top;



if(
x>0 &&
y>0 &&
x<rect.width &&
y<rect.height
){


createFlower(
touchFlower,
x,
y
);


}



touchFlower=null;


});


});








/* MOVEABLE */


function activateMoveable(target){



if(moveable){

moveable.destroy();

}



moveable =
new Moveable(
bouquetBox,
{

target:target,

draggable:true,

resizable:true,

rotatable:true,

keepRatio:true,

origin:false,

renderDirections:[
"nw",
"ne",
"sw",
"se"
]

});





moveable.on(
"drag",
e=>{

e.target.style.transform =
e.transform;

});




moveable.on(
"resize",
e=>{

e.target.style.width =
`${e.width}px`;

e.target.style.height =
`${e.height}px`;

e.target.style.transform =
e.drag.transform;

});




moveable.on(
"rotate",
e=>{

e.target.style.transform =
e.drag.transform;

});


}









/* BUSH */


const bushButtons =
document.querySelectorAll(".bush-btn");


const bushBack =
document.getElementById("bushBack");


const bushFront =
document.getElementById("bushFront");



bushButtons.forEach(btn=>{


btn.onclick=()=>{


const id =
btn.dataset.id;



bushBack.src =
`assets/flowers/bush/bush-${id}.png`;



bushFront.src =
`assets/flowers/bush/bush-${id}-top.png`;



bushButtons.forEach(b=>
b.classList.remove("active")
);



btn.classList.add("active");


};


});








/* EXPORT */


const finishButton =
document.getElementById("finishButton");


const resultScreen =
document.getElementById("resultScreen");


const resultImage =
document.getElementById("resultImage");




finishButton.onclick =
async()=>{


if(moveable){

moveable.destroy();

}



const canvas =
await html2canvas(
bouquetBox,
{
backgroundColor:null,
scale:3
}
);



resultImage.src =
canvas.toDataURL("image/png");



resultScreen.style.display =
"flex";


};






document
.getElementById("downloadButton")
.onclick=()=>{


const link =
document.createElement("a");


link.download =
"bouquet.png";


link.href =
resultImage.src;


link.click();


};









/* CAMERA */


const cameraButton =
document.getElementById("cameraButton");


const cameraScreen =
document.getElementById("cameraScreen");


const cameraVideo =
document.getElementById("cameraVideo");


const cameraBouquet =
document.getElementById("cameraBouquet");


const captureButton =
document.getElementById("captureButton");


const closeCamera =
document.getElementById("closeCamera");



let cameraStream=null;

let cameraMoveable=null;






cameraButton.onclick =
async()=>{


cameraScreen.style.display =
"block";


cameraBouquet.src =
resultImage.src;



cameraMoveable =
new Moveable(
cameraScreen,
{

target:cameraBouquet,

draggable:true,

resizable:true,

rotatable:true,

keepRatio:true,

origin:false

});





cameraMoveable.on(
"drag",
e=>{

e.target.style.transform =
e.transform;

});



cameraMoveable.on(
"resize",
e=>{

e.target.style.width =
`${e.width}px`;

e.target.style.transform =
e.drag.transform;

});



cameraMoveable.on(
"rotate",
e=>{

e.target.style.transform =
e.drag.transform;

});





cameraStream =
await navigator.mediaDevices.getUserMedia(
{

video:{
facingMode:"user"
},

audio:false

});


cameraVideo.srcObject =
cameraStream;


};







closeCamera.onclick =
()=>{


cameraScreen.style.display =
"none";


if(cameraStream){

cameraStream
.getTracks()
.forEach(track=>track.stop());

}


};








/* CAPTURE */


captureButton.onclick =
()=>{


const canvas =
document.getElementById("captureCanvas");


const ctx =
canvas.getContext("2d");



canvas.width =
cameraVideo.videoWidth;


canvas.height =
cameraVideo.videoHeight;



ctx.save();

ctx.translate(canvas.width,0);

ctx.scale(-1,1);

ctx.drawImage(
cameraVideo,
0,
0,
canvas.width,
canvas.height
);

ctx.restore();



const rect =
cameraBouquet.getBoundingClientRect();



const scaleX =
canvas.width/window.innerWidth;


const scaleY =
canvas.height/window.innerHeight;



ctx.drawImage(

cameraBouquet,

rect.left*scaleX,

rect.top*scaleY,

rect.width*scaleX,

rect.height*scaleY

);

/* DRAW TITLE */

ctx.save();

ctx.fillStyle = "#ffffff";

ctx.textAlign = "center";

ctx.font = `bold ${canvas.width * 0.09}px Inter`;

ctx.fillText(
"HAPPY",
canvas.width / 2,
canvas.height * 0.09
);

ctx.fillText(
"GIRLFRIEND DAY",
canvas.width / 2,
canvas.height * 0.16
);

ctx.restore();




const image =
canvas.toDataURL(
"image/png"
);



const link =
document.createElement("a");


link.download =
"bouquet-camera.png";


link.href =
image;


link.click();


};
