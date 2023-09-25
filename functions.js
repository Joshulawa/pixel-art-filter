
// const response = await fetch("./pixelAvgs.json");
// const data = await response.json();
// //const values = data.avgs
// const pxlH = data.pixelHeight
// const pxlW = data.pixelWidth
// const pxlPerRow = data.pxlPerRow
let pxlPerRow = 4;
let pxlW = 0
let pxlH = 0


let img = 'null'
const fileSelector = document.getElementById('file-selector');
const numberInput = document.getElementById('noPxl-selector')
const incButton = document.getElementById("increase")
const decButton = document.getElementById("decrease")
const preview = document.getElementById('preview');
const canvas = document.createElement('canvas')
canvas.setAttribute("class", "inputImg")



fileSelector.addEventListener('change', (event) => {
    const files = event.target.files
    img = new Image();
    img.setAttribute("class", "inputImg")
    if (FileReader && files && files.length) {
        var fr = new FileReader();
    
        fr.onload = function () {
            img.src = fr.result;
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            createImg()
        }
        fr.readAsDataURL(files[0]);
        
        //getPixelData()
    }
})  //HAVING TROUBLE READING IN FILES ALL OF A SUDDEN...

function createImg(){
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    var r = document.querySelector(':root');
    r.style.setProperty('--pxlPerRow', pxlPerRow);
    r.style.setProperty('--x', 400 / pxlPerRow + "px")

    let vals = getPixelData()
    let rows = intoRows(vals, img.naturalWidth, img.naturalHeight)
    let pxlValues = pixelsFromRows(rows, img.naturalWidth, img.naturalHeight, pxlPerRow)
    createPxlElements(pxlValues)
}

numberInput.addEventListener('change', (event) => {
    if (img == "null") {return}
    pxlPerRow = parseInt(numberInput.value)
    let squares = document.getElementsByClassName("square")
    while(squares.length > 0){
        squares[0].remove()
    }
    createImg()
})

// incButton.addEventListener('click', (event) => {
//     if (img == "null") {return}
//     pxlPerRow = pxlPerRow * 2 
//     let squares = document.getElementsByClassName("square")
//     while(squares.length > 0){
//         squares[0].remove()
//     }
//     createImg()
// })

// decButton.addEventListener('click', (event) => {
//     if (img == "null") {return}
//     pxlPerRow = Math.floor(pxlPerRow / 2)
//     let squares = document.getElementsByClassName("square")
//     while(squares.length > 0){
//         squares[0].remove()
//     }
//     createImg()
// })

function multiplyPxls(weight){
    pxlPerRow = pxlPerRow * weight
    document.getElementById("noPxl-selector").setAttribute("value", pxlPerRow.toString())
}


let pixelVals = 'null'
//RGBS is an array of arrays of pixel rgb values. Alpha values have been excluded.
let rgbs = []
function getPixelData() {
    const ctx = canvas.getContext("2d")
    ctx.drawImage(img, 0, 0)
    pixelVals = ctx.getImageData(0,0, img.width, img.height)
    const data = pixelVals.data;
    let rgb = []
    for (let i = 0; i < img.width * img.height * 4; i ++ ){
        if ((i + 1) % 4 == 0){
            rgbs.push(rgb)
            rgb = []
        }
        else{
            rgb.push(data[i])
        }         
    }
    return rgbs
}

function intoRows(values, imgW, imgH){
    let matrix = []
    for (let i = 0; i < imgH; i ++){
        matrix.push([])
        for (let j = 0; j < imgW; j ++){
            matrix[i].push(values[i * imgW + j])
            
        }
    }
    return matrix
}

function pixelsFromRows(rows, imgW, imgH, pxlPerRow){
    let matrix = []
    for (let i = 0; i < pxlPerRow * pxlPerRow; i++){
        matrix.push([])
    }

    let pxlH = Math.floor(imgH / pxlPerRow)
    let pxlW = Math.floor(imgW/pxlPerRow)
    let rW = imgW - pxlW * pxlPerRow
    let rH = imgH - pxlH * pxlPerRow
    let a = 0 //Track pixel index.
    //let offset = 0

    for (let i = 0; i < imgH - rH; i ++){
        let offset = 0
        if (i % pxlH == 0 && i != 0){ //If on a new row of pxls, a increase.
            a += pxlPerRow
        }
        for (let j = 0; j < imgW - rW; j ++){
            if (j % pxlW == 0 && j != 0){
                offset ++
            } 

            try{matrix[a + offset].push(rows[i][j])}
            catch(err){
                console.log("pxls", pxlPerRow, "a ", a, " offset", offset, " i j ", i,j)
            }
            
        }
    }

    let values = []
    for (let i = 0; i < matrix.length; i ++){
        let sum = [0,0,0]
        for (let j = 0; j < matrix[i].length; j ++){
            sum[0] += matrix[i][j][0]
            sum[1] += matrix[i][j][1]
            sum[2] += matrix[i][j][2]
        }
        for (let j = 0; j < 3; j ++){ //Cant u use a lambda function and map it over sum....
            sum[j] = sum[j] / (pxlH * pxlW)
        }
        values.push(sum)
    }

    return values
}

//Create variable number of grid elements and give them the pixel colour values.
function createPxlElements(values){
    let parent = document.getElementById("parent");
    for (let i = 0; i < pxlPerRow * pxlPerRow; i++) {
        let square = document.createElement("div")
        square.setAttribute("id", i)
        square.setAttribute("class", "square")

        square.style.backgroundColor = "rgb(" + values[i][0] + "," + values[i][1] + "," + values[i][2] + ")";
        parent.appendChild(square);
    }
}