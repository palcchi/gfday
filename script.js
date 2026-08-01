const loading = document.getElementById("loading");
const editor = document.getElementById("editor");


/* =====================
LOADING
===================== */

setTimeout(()=>{

if(loading) loading.classList.add("hide");
if(editor) editor.classList.add("show");

},3500);






/* =====================
CURSOR COMMENT
===================== */

const cursor =
document.getElementById("cursorComment");


const comments={

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

cursor.style.left=e.clientX+"px";
cursor.style.top=e.clientY+"px";
cursor.style.display="block";

}

});



document
.querySelectorAll(".flower-item")
.forEach(item=>{


item.addEventListener(
"mouseenter",
()=>{

if(cursor){

cursor.innerText =
comments[item.dataset.flower]
||
comments.default;

}

});


});







/* =====================
BOUQUET
===================== */


const bouquetBox =
document.getElementById("bouquetBox");


const flowerLayer =
document.getElementById("flowerLayer");


let selectedFlower=null;

let moveable=null;





/* DESKTOP DRAG */

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








/* MOBILE TAP */


const touchDevice =
window.matchMedia(
"(pointer: coarse)"
).matches;



if(touchDevice){


document
.querySelectorAll(".flower-item")
.forEach(item=>{


item.addEventListener(
"touchend",
()=>{


const rect =
bouquetBox.getBoundingClientRect();



createFlower(

item.dataset.flower,

rect.width/2,

rect.height/2

);


});

});


}








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







/* MOVEABLE */


function activateMoveable(target){


if(moveable){

moveable.destroy();

}



moveable =
new Moveable(
bouquetBox,
{

target,

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









/* =====================
BUSH
===================== */


const bushButtons =
document.querySelectorAll(".bush-btn");


const bushBack =
document.getElementById("bushBack");


const bushFront =
document.getElementById("bushFront");



bushButtons.forEach(btn=>{


btn.onclick=()=>{


let id =
btn.dataset.id;



bushBack.src =
`assets/flowers/bush/bush-${id}.png`;



bushFront.src =
`assets/flowers/bush/bush-${id}-top.png`;



bushButtons.forEach(x=>
x.classList.remove("active")
);


btn.classList.add("active");


};


});








/* =====================
EXPORT PNG
===================== */


const finishButton =
document.getElementById("finishButton");


const resultScreen =
document.getElementById("resultScreen");


const resultImage =
document.getElementById("resultImage");



finishButton.onclick =
async()=>{


if(moveable)
moveable.destroy();



const canvas =
await html2canvas(
bouquetBox,
{
backgroundColor:null,
scale:3
}
);



resultImage.src =
canvas.toDataURL(
"image/png"
);



resultScreen.style.display="flex";


};





document
.getElementById("downloadButton")
.onclick=()=>{


let a=document.createElement("a");

a.download="bouquet.png";

a.href=resultImage.src;

a.click();


};









/* =====================
CAMERA
===================== */


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


cameraScreen.style.display="block";


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
await navigator.mediaDevices.getUserMedia({

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


cameraScreen.style.display="none";


if(cameraStream){

cameraStream
.getTracks()
.forEach(track=>track.stop());

}


};








/* =====================
CAMERA CAPTURE
===================== */


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



ctx.drawImage(

cameraVideo,

0,

0,

canvas.width,

canvas.height

);





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





let img =
canvas.toDataURL(
"image/png"
);



let a =
document.createElement("a");

a.download="bouquet-camera.png";

a.href=img;

a.click();


};
