const pi = Math.PI;

const container = document.getElementById('container')
functions = [
    ["sin(x)", (x) => { return Math.sin(x)}],
    ["sin(.25x)cos(4x)", (x) => { return Math.sin(.25 * x) * Math.cos(4 * x) }],
    ["tan(.5x)", (x) => { return Math.tan(.5 * x)}],
    ["3cos(.5x) mod 2", (x) => { return 3 * Math.cos(.5 * x) % 2}],
    ["sin(x) - .5cos(.5x) - .25sin(.25x)", (x) => { return Math.sin(x) - .5 * Math.cos(.5 * x) + .25 * Math.sin(.25 * x)}],
    ["5th degree fourier of a square wave", (x) => { x /= 4; return 4 / pi * (Math.sin(pi * x) + Math.sin(pi * x * 3) / 3 + Math.sin(pi * x * 5) / 5 + Math.sin(pi * x * 7) / 7)}],
];
var symbols = ['#', '&', '%', '@']

const symbol = symbols[0] //symbols[Math.floor(Math.random() * symbols.length)]; -- only the hashtag looks good...
const funcs = functions[Math.floor(Math.random() * functions.length)]; //Math.floor(Math.random() * functions.length);

var lines = [];
var texts = [];
var numlines, chars;

let randoffset =2 * Math.PI * Math.random(); 
var bounds = [randoffset, 4 * Math.PI + randoffset];

var speed = Math.random() * 101 + 100;

const close = (x, y) => {
    return Math.abs((x - y) / y) <= 0.1;
}

const plot = (xMin, xMax) => {
    var pts = [];
    let inc = (xMax - xMin) / chars;
    for(let x = xMin; x < xMax; x += inc){
        pts.push(func(x));
    }

    return pts;
}

const func = (x) => {
    // return 10 * (Math.sin(2 * x) + Math.cos(x));
    return 8 * funcs[1](x);
}

const graph = () => {
    for(y = 1; y < lines.length - 1; y++){
        texts[y] = "";
    }
    
    let pts = plot(bounds[0], bounds[1]);
    
    for(let x = 0; x < chars; x++){
        for(let y = 1; y < lines.length - 2; y++){
            let adjy = y - Math.round(lines.length/2);
            if(close(pts[x],adjy) || Math.round(pts[x]) == adjy){
                texts[y] += symbol;
            }else if(adjy == 0){
                texts[y] += "-";
            }else{
                texts[y] += "&nbsp;";
            }
        }
    }

    updateLines();
}

const updateLines = () => {
    for(let i = 1; i < texts.length - 1; i++){
        lines[i].innerHTML = texts[i];
    }
}

const makeLines = () => {
    container.innerHTML = "";
    lines = [];
    texts = [];
    numlines = Math.ceil(document.body.clientHeight / 22);
    chars = Math.ceil(document.body.clientWidth / 10);
    
    for(let i = 0; i < numlines; i++){
        let newLine = document.createElement('text');
        newLine.classList.add("ascii-line");
        container.appendChild(newLine);
        lines.push(newLine);
        texts.push("");
    }
    
    texts[0] = funcs[0];
    texts[lines.length - 1] = 'ari-goldman | <a href="https://github.com/ari-goldman/" target="_blank">github</a>';

    lines[0].innerHTML = texts[0];
    lines[texts.length - 1].innerHTML = texts[texts.length - 1];
    graph();
}



makeLines();

window.onresize = () => makeLines();

var interval = setInterval(() => {
    let diff = (bounds[1] - bounds[0]);
    bounds[0] += diff / chars;
    bounds[1] += diff / chars;
    graph();
}, 100 / (speed / 100));

