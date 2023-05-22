const pi = Math.PI;

const container = document.getElementById('container')
functions = [
    "sin(x)",
    "sin(x/2) * cos(4*x)",
    "tan(x/2)",
    "3*cos(x/2) mod 2",
    "sin(x) - cos(x/2)/2 - sin(x/4)/4",
    "ceil(rand / 10 + .95) * cos(x/2)",
    "4 / PI * (sin(PI*x/4) + sin(3*PI*x/4)/3 + sin(5*PI*x/4)/5 + sin(7*PI*x/4)/7)",
    "(sin(2*x) * (sign(sin(2*x)) == 1)) + (cos(2*x) * (sign(cos(2*x)) == -1))",
    "((x mod 0.001 <= 0.0005) * sin(x)) + ((x mod 0.001 > 0.0005) * cos(x))"
];
var symbols = ['#', '&', '%', '@']

// was to be able to use other symbols for the graph, but only # looks decent
const symbol = symbols[0] //symbols[Math.floor(Math.random() * symbols.length)]; -- only the hashtag looks good...

var lines = [];
var texts = [];
var numlines, chars;

// random starting offset for bounds
const randoffset = 2 * pi * Math.random();
var bounds = [randoffset, 4 * pi + randoffset];

var speed = Math.random() * 101 + 100;

// returns true if x is within .5 of y
const close = (x, y) => {
    return Math.abs(x - y) <= 0.5;
}

// returns all the y values for each character in the bounds
const plot = (xMin, xMax) => {
    let f = parse(lines[0].innerText);

    var pts = [];
    let inc = (xMax - xMin) / chars;
    for (let x = xMin; x < xMax; x += inc) {
        try {
            pts.push(-8 * eval(f.replace(/x/g, x)));
        } catch (error) {
            pts.push(NaN);
        }
    }

    return pts;
}

// parses the given function to make functions use the math class
const parse = (f) => {
    f = f.replace(/E/g, "Math.E")
        .replace(/PI/g, "Math.PI")
        .replace(/π/g, "Math.PI")

        .replace(/\^/g, "**")
        .replace(/mod/g, "%")
        .replace(/ln/g, "Math.log")

        .replace(/sin/g, "Math.sin")
        .replace(/cos/g, "Math.cos")
        .replace(/tan/g, "Math.tan")

        .replace(/abs/g, "Math.abs")
        .replace(/sign/g, "Math.sign")
        .replace(/ceil/g, "Math.ceil")
        .replace(/floor/g, "Math.floor")
        .replace(/round/g, "Math.round")
        .replace(/rand/g, "Math.random()");

    return f;
}


// updates texts array with proper lines to show graph of function
const graph = () => {
    for (y = 1; y < lines.length - 1; y++) {
        texts[y] = "";
    }

    let pts = plot(bounds[0], bounds[1]);
    
    for (let x = 0; x < chars; x++) {
        if(pts[0] === NaN) break;
        for (let y = 1; y < lines.length - 2; y++) {
            let adjy = y - Math.round(lines.length / 2);
            if (close(pts[x], adjy) || Math.round(pts[x]) == adjy) {
                texts[y] += symbol;
            } else if (adjy == 0) {
                texts[y] += "-";
            } else {
                texts[y] += "&nbsp;";
            }
        }
    }

    updateLines();
}

// fills text tags with the texts in texts array
const updateLines = () => {
    for (let i = 1; i < texts.length - 1; i++) {
        lines[i].innerHTML = texts[i];
    }
}

const makeLines = () => {
    container.innerHTML = "";
    lines = [];
    texts = [];
    numlines = Math.ceil(document.body.clientHeight / 22);
    chars = Math.ceil(document.body.clientWidth / 10);

    lines[0] = document.createElement('span');
    lines[0].role = 'textbox';
    lines[0].id = 'func_box';
    lines[0].contentEditable = 'true';
    container.appendChild(lines[0])
    
    for (let i = 1; i < numlines; i++) {
        let newLine = document.createElement('text');
        newLine.classList.add("ascii-line");
        container.appendChild(newLine);
        lines.push(newLine);
        texts.push("");
    }
    
    lines[lines.length - 1].classList.remove("ascii-line");
    lines[lines.length - 1].classList.add("footer")
    lines[lines.length - 1].innerHTML = '<<a href="https://github.com/ari-goldman/ascii-functions" target="_blank">documentation</a>>';
    
    graph();
}




var interval = setInterval(() => {
    let diff = (bounds[1] - bounds[0]);
    bounds[0] += diff / chars;
    bounds[1] += diff / chars;
    graph();
}, 100 / (speed / 100));


makeLines();
lines[0].innerText = functions[Math.floor(Math.random() * functions.length)];

window.onresize = () => {
    let tempfunc = lines[0].innerText;
    makeLines()
    lines[0].innerText = tempfunc;
};