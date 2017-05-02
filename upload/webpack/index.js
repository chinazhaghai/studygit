const UploadFile = require("./src/UploadFile.js");
let uf =  new UploadFile({selector:"#upload"});
uf.on("loadfinish",function(res){
  let img = new Image;
  img.src = res.result;
  document.body.appendChild(img);
})
