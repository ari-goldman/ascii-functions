const container = document.getElementById('container')
var lines = [];
var texts = [];
var numlines, chars;
var bounds = [-2 * Math.PI, 2 * Math.PI];

var speed = 100;

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
    return 8 * (Math.sin(x) - .5 * Math.cos(.5 * x) + .25 * Math.sin(.25 * x))
}

const graph = () => {
    for(y = 0; y < lines.length; y++){
        texts[y] = "";
    }

    let pts = plot(bounds[0], bounds[1]);

    // console.log(pts);
    for(let x = 0; x < chars; x++){
        for(let y = 0; y < lines.length - 1; y++){
            // console.log(x/10, func(x/10), y/10, close(x/10, y/10));
            let adjy = y - Math.round(lines.length/2);
            // console.log(x, pts[x], Math.round(pts[x]), adjy)
            if(close(pts[x],adjy) || Math.round(pts[x]) == adjy){
                texts[y] += "#";
            }else if(adjy == 0){
                texts[y] += "-";
            }else{
                texts[y] += "&nbsp;";
            }
        }
    }

    texts[lines.length - 1] = 'ari-goldman | <a href="google.com">github</a>';
    updateLines();
}

const updateLines = () => {
    for(let i = 0; i < texts.length; i++){
        lines[i].innerHTML = texts[i] + "\u200B";
    }
}

const makeLines = () => {
    container.innerHTML = "";
    lines = [];
    texts = [];
    numlines = Math.ceil(document.body.clientHeight / 23);
    chars = Math.ceil(document.body.clientWidth / 10);

    for(let i = 0; i < numlines; i++){
        let newLine = document.createElement('text');
        newLine.classList.add("ascii-line");
        container.appendChild(newLine);
        lines.push(newLine);
        texts.push("-".repeat(chars));
    }

    graph();
}



makeLines();

window.onresize = () => makeLines();

var interval = setInterval(() => {
    let diff = (bounds[1] - bounds[0]);
    bounds[0] += diff / chars * (speed / 100);
    bounds[1] += diff / chars * (speed/ 100);
    console.log(bounds)
    graph();
}, 100);

