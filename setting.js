const canvas = document.getElementById("tubes");
const ctx = canvas.getContext("2d");
const colors = {
    BLANK: 0,
    BROWN: 1,
    D_BLUE: 2,
    D_GREEN: 3,
    GRAY: 4,
    L_BLUE: 5,
    L_GREEN: 6,
    LILA: 7,
    ORANGE: 8,
    PINK: 9,
    RED: 10,
    YELLOW: 11,
};
var t_pos = 0, s_pos = 0;
const colorMap = [
    "#FFFFFF",
    "#86592d",
    "#000099",
    "#336600",
    "#555555",
    "#00ccff",
    "#00ff00",
    "#9900cc",
    "#ff9900",
    "#ff00ff",
    "#FF0000",
    "#FFFF00",
];
var solution = [];
var sol_pos = 0;
var sol_steps = [];

let state = [
    [colors.BLANK, colors.BLANK, colors.BLANK, colors.BLANK],
]

function clearAll() {
    state = [];
    s_pos = 0;
    t_pos = 0;
    solution = [];
    sol_pos = 0;
    sol_steps = [];
}

function addTube() {
    state.push([colors.BLANK, colors.BLANK, colors.BLANK, colors.BLANK]);
}

function removeTube() {
    if (state.length > 0) {
        state.pop()
    }
    if (s_pos >= state.length) {
        s_pos = state.length;
        t_pos = 0;
    }
}

function addSpot(color) {
    if (s_pos >= state.length) {
        return
    }
    state[s_pos][t_pos] = color;

    if (++t_pos === 4) {
        t_pos = 0;
        s_pos++;
    }
}

function removeSpot() {
    if (t_pos === 0 && s_pos === 0) {
        return;
    }
    if (--t_pos < 0) {
        t_pos = 3;
        s_pos--;
    }
    state[s_pos][t_pos] = colors.BLANK;
}

function solve() {
    const actions = bfs(state);
    let position = state;
    solution = [];
    sol_steps = [clone(position)]
    sol_pos = 0;
    for (let a = 0 ; a < actions.length ; ++a) {
        solution.push("[" + actions[a][0] + " &rarr; " + actions[a][1] + "] ");
        position = move(position, actions[a])
        sol_steps.push(clone(position))
    }
    solution.push("[Done]")
    showSolution();
}

function showSolution() {
    const textfield = document.getElementById("solution");
    var display = "";
    for (let a = 0 ; a < solution.length ; ++a) {
        if (a === sol_pos) {
            display += "<b>" + solution[a] + "</b>";
        } else {
            display += solution[a];
        }
        if (a !== solution.length - 1) {
            display += "|";
        }
    }
    textfield.innerHTML = "<p>" + display + "</p>";
}

function solForward() {
    if (sol_pos === sol_steps.length - 1) {
        return;
    }
    sol_pos++;
    state = sol_steps[sol_pos];
    showSolution();
}

function solBackward() {
    if (sol_pos === 0) {
        return;
    }
    sol_pos--;
    state = sol_steps[sol_pos];
    showSolution();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#dddddd";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let t = 0; t < state.length; ++t) {
        for (let s = 0; s < 4; ++s) {
            ctx.fillStyle = colorMap[state[t][s]];
            ctx.fillRect((0.15 + 0.25 * t) * canvas.height, canvas.height - (0.25 + 0.2 * s) * canvas.height, 0.2 * canvas.height, 0.2 * canvas.height);
        }
    }
    requestAnimationFrame(draw);
}

draw();